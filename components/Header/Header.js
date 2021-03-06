import React from 'react';
import { NavLink } from 'fluxible-router';
import SearchBox  from '../Search/AutocompleteComponents/HeaderSearchBox';
import LoginModal from '../Login/LoginModal.js';
import HeaderDropdown from '../Login/HeaderDropdown.js';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../stores/UserProfileStore';
import userSignOut from '../../actions/user/userSignOut';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';
import CookieBanner from 'react-cookie-banner';
import BannerContent from 'react-cookie-banner';
import cookie from 'react-cookie';
import {FormattedMessage, defineMessages} from 'react-intl';

let MediaQuery = require ('react-responsive');
class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state =  {user_cookies: cookie.load('user-has-accepted-cookies')};
    }
    componentDidMount() {
        $(this.refs.menubar)
            .sidebar({ 'silent': true, 'transition': 'overlay', 'mobileTransition': 'overlay' });
        $(this.refs.languagebar)
            .sidebar({ 'silent': true, 'transition': 'overlay', 'mobileTransition': 'overlay' });;
    }

    toggleSidebar() {
        $(this.refs.menubar)
            .sidebar('toggle');
    }

    toggleLanguageBar() {
        $(this.refs.languagebar)
            .sidebar('toggle');
    }

    closeSidebar(event) {
        if(($(event.target).parentsUntil( $('div.menubar'), '.item' ).length >= 0 && $(event.target).parentsUntil( $('div.menubar'), '.search' ).length === 0))
            $(this.refs.menubar).sidebar('hide');
    }

    handleLoginButton() {
        $('.ui.login.modal')
            .modal('toggle');
        this.closeSidebar({target: '<a className="item"></a>'});
    }

    logout() {
        this.context.executeAction(userSignOut, { username: this.props.UserProfileStore.username });
    }

    render() {
        let loginButton = <button ref="loginButton" className="ui inverted button" onClick={this.handleLoginButton.bind(this)}>
        <FormattedMessage id='header.signin' defaultMessage='Sign In'/>
        </button>;
        let mobileLoginButton = <a className="item" onClick={this.handleLoginButton.bind(this)}><i className="sign in icon"/>
        <FormattedMessage id='header.signin.mobile' defaultMessage='Sign in'/>
        </a>;
        let notification_locale = '';
        let cookieBanner = '';

        if (this.props.UserProfileStore.username !== '') {
            loginButton = <HeaderDropdown/>;
            mobileLoginButton = (<div>
              <NavLink className="item" href={'/user/' + this.props.UserProfileStore.username}><i className="user icon"/>
              <FormattedMessage id='header.mydecks.mobile' defaultMessage='My Decks'/>
              </NavLink>
              <NavLink className="item" href={'/user/' + this.props.UserProfileStore.username + '/groups/overview'}><i className="icon users"/>
              <FormattedMessage id='header.mygroups.mobile' defaultMessage='My Groups'/>
              </NavLink>
              <NavLink className="item" href={'/user/' + this.props.UserProfileStore.username + '/settings/profile'}><i className="setting icon"/>
              <FormattedMessage id='header.mysettings.mobile' defaultMessage='My Settings'/>
              </NavLink>
              <NavLink className="item" href={'/notifications'}><i className="alarm red icon"/>
              <FormattedMessage id='header.mynotifications.mobile' defaultMessage='My Notifications'/>
              </NavLink>
              <a className="item" onClick={this.logout.bind(this)}><i className="sign out icon"/>
              <FormattedMessage id='header.logout.mobile' defaultMessage='Logout'/>
              </a>
            </div>);
            notification_locale = '';

        } else{
            notification_locale = <div className="item"><LocaleSwitcher className = 'ui item'/></div>;
        }

        if (!this.state.user_cookies) {

            cookieBanner = <FormattedMessage id="header.cookieBanner" defaultMessage='This website uses cookies to ensure you get the best experience on our website.'>
                {
                    (message) => <CookieBanner
                        message={message}
                        cookie='user-has-accepted-cookies'
                        dismissOnScroll={false}
                        onAccept={() => {}}
                    />
                }
                </FormattedMessage>;
        }


        return (
            <div>
            {cookieBanner}
              <MediaQuery minDeviceWidth={768} values={{deviceWidth: 1600}}>
                <div className="ui inverted blue menu" ref="header" style={{borderRadius: '0px'}}>
                    <div className="ui fluid container">
                        <a className="item" href='/'>
                            <img  src="/assets/images/slideWiki-logo-linear.png" alt="SlideWiki" style={{width: '200px'}}/>
                        </a>
                        <div className="item">
                            <SearchBox className="item"/>
                        </div>
                        <div className="ui right inverted blue menu">
                            <div className="item">
                              <NavLink routeName="addDeck" activeClass="active" className="ui right labeled icon button" role="button">
                                  <i className="right plus icon"></i>
                                  <FormattedMessage id='header.addDeck' defaultMessage='Add deck'/>
                              </NavLink>
                            </div>
                            {notification_locale}
                            <div className="item">{loginButton}<LoginModal errorMessage={this.props.UserProfileStore.errorMessage} socialLoginError={this.props.UserProfileStore.socialLoginError} userid={this.props.UserProfileStore.userid} username={this.props.UserProfileStore.username}/></div>
                        </div>
                    </div>
                </div>
              </MediaQuery>
              <MediaQuery maxDeviceWidth={767}>
                <div className="ui inverted blue menu" style={{borderRadius: '0px'}} ref="header">
                  <button className="ui icon button item" onClick={this.toggleSidebar.bind(this)}><i className="content icon"/></button>
                  <div className="ui right inverted blue menu">
                    <NavLink className="item" href='/'>
                        <i className="home icon"/><FormattedMessage id='header.slidewiki' defaultMessage='SlideWiki'/>
                    </NavLink>
                  </div>
                </div>
                <div className="ui inverted left dimmed sidebar vertical menu menubar" ref="menubar" onClick={this.closeSidebar.bind(this)}>
                    <NavLink className="item" href='/'>
                        <i className="home icon"/><FormattedMessage id='header.menu.homepage' defaultMessage='Homepage'/>
                    </NavLink>
                    <NavLink className="item" routeName="addDeck">
                        <i className="add icon"/><FormattedMessage id='header.menu.addDeck' defaultMessage='Add Deck'/>
                    </NavLink>
                    <div className="item" onClick={this.toggleLanguageBar.bind(this)}>
                        <i className="caret right icon"/>
                        <LocaleSwitcher mode="headeronly"/>
                    </div>
                    {mobileLoginButton}
                    <LoginModal errorMessage={this.props.UserProfileStore.errorMessage} socialLoginError={this.props.UserProfileStore.socialLoginError} userid={this.props.UserProfileStore.userid} username={this.props.UserProfileStore.username}/>
                    <div className="item search">
                        <SearchBox className="item"/>
                    </div>
                </div>
                <div className="ui inverted left dimmed sidebar vertical menu" ref="languagebar">
                    <LocaleSwitcher mode="sidebar"/>
                </div>
              </MediaQuery>
            </div>
        );
    }
}


Header.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getUser: React.PropTypes.func
};

Header = connectToStores(Header, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default Header;
