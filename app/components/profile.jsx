import React, {Component} from 'react';
import {IntlMixin} from 'react-intl';
import {capitalize, assign} from 'lodash';
import AltIso from 'alt/utils/AltIso';

import PageTitleActions from 'flux/actions/page-title';
import UsersActions from 'flux/actions/users';
import UsersStore from 'flux/stores/users';

if (process.env.BROWSER) {
  require('styles/profile.scss');
}

@AltIso.define((props) => UsersStore.fetchBySeed(props.params.seed))
class Profile extends Component {
  displayName = 'Profile'

  _getIntlMessage = IntlMixin.getIntlMessage
  _formatMessage = IntlMixin.formatMessage.bind(assign({}, this, IntlMixin))

  state = UsersStore.getBySeed(this.props.params.seed)

  componentWillMount() {
    this._setPageTitle();
  }

  componentDidMount() {
    UsersStore.listen(this._handleStoreChange);
  }

  componentWillUnmount() {
    UsersStore.unlisten(this._handleStoreChange);
  }

  _handleStoreChange = this._handleStoreChange.bind(this)
  _handleStoreChange() {
    const user: ?Object = UsersStore
      .getBySeed(this.props.params.seed);

    return this.setState(user);
  }

  _setPageTitle = this._setPageTitle.bind(this)
  _setPageTitle() {
    let title: string;

    if (this.state.user && this.state.user.user) {
      const user: Object = this.state.user.user;
      const fullName: string = this._getFullName(user.name);

      title = this._getIntlMessage('profile.page-title');
      title = this._formatMessage(title, {fullName});

    }
    else {
      title = this._getIntlMessage('profile.not-found-page-title');
    }

    // Set page title
    return PageTitleActions.set(title);
  }

  _getFullName({first, last}) {
    return `${capitalize(first)} ${capitalize(last)}`;
  }

  render() {
    if (this.state.user && this.state.user.user) {
      const user: Object = this.state.user.user;
      return (
        <div className='app--profile'>
          <h2>{this._getFullName(user.name)}</h2>
          <img
            src={user.picture.medium}
            alt='profile picture' />
        </div>
      );
    }
    else {
      return (
        <h2>User not found</h2>
      );
    }
  }
}

export default Profile;
