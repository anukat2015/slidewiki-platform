import UserProfileStore from '../../stores/UserProfileStore';
import ContentStore from '../../stores/ContentStore';
import striptags from 'striptags';
import TreeUtil from '../../components/Deck/TreePanel/util/TreeUtil';
import {navigateAction} from 'fluxible-router';
import serviceUnavailable from '../error/serviceUnavailable';
import addActivity from '../activityfeed/addActivity';
import updateTranslationProgressBar from './updateTranslationProgressBar';
const log = require('../log/clog');
const common = require('../../common.js');

export default function translateDeckRevision(context, payload, done) {
    context.dispatch('START_TRANSLATION', 'success');
    log.info(context);
    //enrich with user id
    let user = context.getStore(UserProfileStore).userid;
    //if (!user) user = '3'; //NEED TO REMOVE THE LINE

    payload.user = user.toString();
    payload.deckId = context.getStore(ContentStore).selector.sid;

    payload.jwt = context.getStore(UserProfileStore).jwt;
        //enrich with root deck id if deck to be revised is not uppermost deck
    //    let parent = TreeUtil.getParentId(payload.selector);
    //    payload.root_deck = parent;
    context.service.create('deck.translate', payload, null, {timeout: 30 * 1000}, (err, res) => {
        if (err) {
            //context.dispatch('UPDATE_DECKEDIT_VIEW_STATE', 'error');
            //context.dispatch('SAVE_DECK_REVISION_FAILURE', err);
            log.error(context, {filepath: __filename, err: err});
            // context.executeAction(serviceUnavailable, payload, done);
            done();
        } else {
            //console.log('res:' + res.id);

            // let activity = {
            //     activity_type: 'edit',
            //     user_id: String(context.getStore(UserProfileStore).userid),
            //     content_id: String(newSid),
            //     content_kind: 'deck'
            // };
            // context.executeAction(addActivity, {activity: activity});

            context.dispatch('END_TRANSLATION', 'success');
            //res.totalSlides = 2;//TODO
            //res.newId = '11356';
            if (res.cronjob) {
                context.dispatch('TOGGLE_CRONJOB_MODAL');
                context.dispatch('SET_NEW_ID', {'newId': res.newId});
                context.executeAction(updateTranslationProgressBar, {'totalSlides': res.totalSlides, 'id' : res.newId});
                done();
            }else{
                context.executeAction(navigateAction, {
                    url: '/deck/' + res.root_deck //ADD HERE NEW DECK ID
                });

                done();
            }



        }
    });
}