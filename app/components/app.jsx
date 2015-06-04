import React, {Component} from 'react';
import {RouteHandler} from 'react-router';
import AltIso from 'alt/utils/AltIso';

import LocaleStore from 'flux/stores/locale';
import PageTitleStore from 'flux/stores/page-title';

import Header from 'components/header';
import Footer from 'components/footer';

if (process.env.BROWSER) {
  require('styles/main.scss');
}

@AltIso.define(({locale}) => LocaleStore.initialize(locale))
class App extends Component {

  displayName = 'App'

  state = LocaleStore.getState()

  componentDidMount() {
    LocaleStore.listen(this._handleLocaleChange);
    PageTitleStore.listen(this._handlePageTitleChange);
  }

  componentWillUnmount() {
    LocaleStore.unlisten(this._handleLocaleChange);
    PageTitleStore.unlisten(this._handlePageTitleChange);
  }

  _handleLocaleChange = this._handleLocaleChange.bind(this)
  _handleLocaleChange(state: Object) {
    return this.setState(state);
  }

  _handlePageTitleChange({title}) {
    document.title = title;
  }

  render() {
    return (
      <div>
        <Header {...this.state} />
        <RouteHandler {...this.state} />
        <Footer />
      </div>
    );
  }
}

export default App;
