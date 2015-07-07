import React from 'react';
import Router from 'react-router';

var routes = Router.createRoute({ name: "app", path: "/", handler: require('./components/app')}, function(){
  Router.createDefaultRoute({ name: "users", handler: require('./components/users') });
  Router.createRoute({ name: "guides", handler: require('./components/guides') });
  Router.createRoute({ name: "protected", handler: require('./components/protected') });
  Router.createRoute({ name: "profile", path:'profile/:seed', handler: require('./components/profile') });
  Router.createRoute({ name: "login-info", handler: require('./pages/login-info') });
  Router.createNotFoundRoute({ handler: require('./pages/not-found') });
  //Router.createRoute({ handler: PageComponent, name: "app-subpage", path: "/p/:name/:id" });
});

export default [routes];
