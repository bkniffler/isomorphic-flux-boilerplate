import fs from 'fs';
import path from 'path';
import debug from 'debug';

import Router from 'react-router';
import AltIso from 'alt/utils/AltIso';

// Paths are relative to `app` directory
import routes from 'routes';
import promisify from 'utils/promisify';
import alt from 'utils/alt';

import LocaleActions from 'flux/actions/locale';
import LocaleStore from 'flux/stores/locale';
import PageTitleStore from 'flux/stores/page-title';

export default function *() {
  const isCashed = this.cashed ? yield *this.cashed() : false;
  if (!isCashed) {
    const router = Router.create({
      routes: routes,
      location: this.request.url,
      onAbort: (redirect) => {
        // Allow transition with `willTransitionTo`
        // to redirect request with `302` status code
        debug('dev')('Redirect request to `%s`', redirect.to);
        this.redirect(redirect.to);
        return this.res.end();
      },
      onError: (error) => {
        // Allow server to respond with 500
        // when something went wrong with router
        //
        // TODO: Render `pages/server-error` in production?
        debug('koa')('Routing Error');
        debug('koa')(error);
        this.throw(error);
        return this.res.end();
      }
    });

    // Get request locale for rendering
    const locale = this.cookies.get('_lang') || this.acceptsLanguages(require('./config/init').locales) || 'en';
    debug('dev')(`locale of request: ${locale}`);

    const handler = yield promisify(router.run);
    const body = yield AltIso.render(alt, handler, {locale});
    const {title} = PageTitleStore.getState();

    // Reload './webpack-stats.json' on dev
    // cache it on production
    let assets;
    if (process.env.NODE_ENV === 'development') {
      assets = fs.readFileSync(path.resolve(__dirname, './webpack-stats.json'));
      assets = JSON.parse(assets);
    }
    else {
      assets = require('./webpack-stats.json');
    }

    debug('dev')('return html content');
    yield this.render('main', {body, assets, locale, title});
  }
}
