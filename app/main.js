import React from 'react';
import Router from 'react-router';
import debug from 'debug';
import AltIso from 'alt/utils/AltIso';

// Paths are relative to `app` directory
import alt from 'utils/alt';
import routes from 'routes';

if (process.env.NODE_ENV === 'development') {
  // Warns about potential accessibility issues with your React elements
  require('react-a11y')(React);
  require('debug').enable('dev,koa');
}

// Render the app at correct URL
Router.run(
  routes,
  Router.HistoryLocation,
  (Handler) => AltIso.render(alt, Handler)
);
