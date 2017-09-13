import React from 'react';
import {List, Icon, Button} from 'semantic-ui-react';
//import moment from 'moment';
import revertRevision from '../../../../actions/history/revertRevision';
import addTreeNode from '../../../../actions/decktree/addTreeNode';

import {formatDate} from '../../ActivityFeedPanel/util/ActivityFeedUtil'; //TODO move to common
import {NavLink} from 'fluxible-router';

class ContentChangeItem extends React.Component {

    handleRevertClick() {
        swal({
            text: 'This action will restore the slide to an earlier version. Do you want to continue?',
            type: 'question',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes, restore slide',
            confirmButtonClass: 'ui olive button',
            cancelButtonText: 'No',
            cancelButtonClass: 'ui red button',
            buttonsStyling: false
        }).then((accepted) => {
            this.context.executeAction(revertRevision, {
                selector: this.props.selector, revisionId: this.props.change.oldValue.ref.revision
            });
        }, (reason) => {
            //done(reason);
        });
    }

    handleViewSlideClick() {
        //open the slide revision in a new tab
        window.open('/slideview/' + this.props.change.value.ref.id + '-' + this.props.change.value.ref.revision, '_blank');
    }

    handleUndoDelete() {
        swal({
            text: `This action will restore  ${this.props.change.value.kind} "${this.props.change.value.ref.title}". Do you want to continue?`,
            type: 'question',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonClass: 'ui olive button',
            cancelButtonText: 'No',
            cancelButtonClass: 'ui red button',
            buttonsStyling: false
        }).then((accepted) => {
            // we want to re-attach a removed slide/deck
            let removedId = formatRef(this.props.change.value.ref);

            // we need to set the parent correctly according to the change.path
            // change.path should always be >= 2, so we take the second to last for the parent
            let [parentNode] = this.props.change.path.slice(-2);
            let [indexNode] = this.props.change.path.slice(-1);
            let parentId = formatRef(parentNode);

            let reinsertPayload = {
                selector: {
                    // root deck is always the same as in the selector
                    id: this.props.selector.id,
                    // parent deck is always a deck
                    stype: 'deck',
                    sid: parentId,
                    // we decrement the (zero-based) indexNode.index by one and then add on to make it 1-based, so no-op in the end :)
                    spath: `${parentId}:${indexNode.index}`,
                },
                nodeSpec: {
                    id: removedId,
                    type: this.props.change.value.kind,
                },
                // TODO experiment
                isMove: true,
            };

            console.log(reinsertPayload);
            this.context.executeAction(addTreeNode, reinsertPayload);
        }, (reason) => {
            //done(reason);
        });
    }

    render() {
        const change = this.props.change;

        let description;
        let iconName = 'write';

        switch (change.action) {
            case 'add':
                iconName = change.value.kind === 'slide'? 'file text' :'folder';
                description = <span>added {change.value.kind} <em>{change.value.ref.title}</em></span>;
                break;
            case 'copy':
                description = <span>created a duplicate of {change.value.kind} <em>{change.value.origin.title}</em> {change.value.origin.id}-{change.value.origin.revision}</span>;
                break;
            case 'attach':
                description = <span>attached {change.value.kind} <em>{change.value.origin.title}</em> {change.value.origin.id}-{change.value.origin.revision}</span>;
                break;
            case 'fork':
                iconName = 'fork';
                description = <span>created a fork of deck <NavLink href={'/deck/' + change.value.origin.id + '-' + change.value.origin.revision}>{change.value.origin.title}</NavLink></span>;
                break;
            case 'revise':
                iconName = 'save';
                description = <span>created a new version of {change.oldValue.kind} <em>{change.oldValue.ref.title}</em></span>;
                break;
            case 'rename':
                description = <span>renamed {change.renamed.kind} <em>{change.renamed.from}</em> to <em>{change.renamed.to}</em></span>;
                break;
            case 'revert':
                iconName='history';
                description = <span>restored {change.oldValue.kind} <em>{change.oldValue.ref.title}</em> to an earlier version</span>;
                break;
            case 'remove':
                iconName = 'trash outline';
                description = <span>removed {change.value.kind} <em>{change.value.ref.title}</em></span>;
                break;
            case 'edit':
                description = <span>edited slide <em>{change.value.ref.title}</em></span>;
                break;
            case 'move':
                iconName = 'move';
                if (this.props.selector.stype === 'slide') {
                    description = 'moved the slide';
                } else if (parseInt(this.props.selector.sid) === change.value.ref.id) {
                    description = 'moved the deck';
                } else {
                    description = <span>moved {change.value.kind} <em>{change.value.ref.title}</em></span>;
                }
                break;
            case 'update':
                description = <span>updated deck <em>{change.path[change.path.length - 1].title}</em></span>;
                break;
            default:
                description = <span>updated the deck</span>;
        }

        let buttons, canEdit = this.props.permissions.edit && !this.props.permissions.readOnly;
        console.log(canEdit, this.props.key, this.props.selector.stype === 'deck', change.action === 'remove', this.props.allowUndoDelete);

        if (this.props.selector.stype === 'slide' && ['add', 'attach', 'copy', 'edit', 'rename', 'revert'].includes(change.action)) {
            // buttons are shown only for changes that result in new slide revisions

            const currentRev = parseInt(this.props.selector.sid.split('-')[1]);
            const shouldView = currentRev !== change.value.ref.revision;

            const canRestore = canEdit && change.oldValue && currentRev !== change.oldValue.ref.revision;

            buttons = <Button.Group basic size='tiny' floated='right'>
                        <Button aria-label='Compare to current slide version' icon='exchange' disabled/>
                        <Button aria-label='Restore slide' icon='history' disabled={!canRestore}
                                onClick={this.handleRevertClick.bind(this)} tabIndex='0'/>
                        <Button aria-label='View slide' icon tabIndex='0' disabled={!shouldView} onClick={this.handleViewSlideClick.bind(this)}>
                            <Icon.Group>
                                <Icon name='unhide'/>
                                <Icon name='external' corner/>
                            </Icon.Group>
                        </Button>
            </Button.Group>;
        } else if (canEdit && this.props.selector.stype === 'deck' && change.action === 'remove' && this.props.allowUndoDelete) {
            buttons = <Button.Group basic size='tiny' floated='right'>
                <Button aria-label='Undo delete' icon='undo' onClick={this.handleUndoDelete.bind(this)} tabIndex='0'/>
            </Button.Group>;
        }

        const datechange = new Date(change.timestamp);
        return (
            <List.Item>
                <Icon name={iconName} />
                <List.Content style={{width:'100%'}} tabIndex='0'>
                    <List.Header>
                        <NavLink className="user"
                                          href={'/user/' + change.username}> {change.username}</NavLink> {description} {buttons}
                    </List.Header>
                    {/*<List.Description>{moment(change.timestamp).calendar(null, {sameElse: 'lll'})}</List.Description>*/}
                    <List.Description>{formatDate(change.timestamp)}, on { datechange.toLocaleDateString('en-GB')} at {datechange.toLocaleTimeString('en-GB')}</List.Description>
                </List.Content>
            </List.Item>
        );
    };
}

ContentChangeItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

// private methods for spath generation from changes
function formatPath(path) {
    return path ? path.map(formatPathPart).join(';') : '';
}

function formatPathPart(pathPart) {
    let suffix = _.isNumber(pathPart.index) ? `${pathPart.index + 1}` : undefined;
    // possibly undefined stuff will render as empty string
    return [formatRef(pathPart), suffix].join(':');
}

function formatRef(ref) {
    if (!ref.id || !ref.revision) return undefined;
    return `${ref.id}-${ref.revision}`;
}


export default ContentChangeItem;
