'use strict';

angular.module('caaincanApp', ['ngMaterial', 'caaincanApp.auth', 'caaincanApp.admin', 'caaincanApp.constants',
    'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'validation.match', 'ui.calendar'
  ])
  .config(function($urlRouterProvider, $locationProvider, $mdThemingProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('default')
  .primaryPalette('yellow')
  .accentPalette('amber');
  //.warnPalette('');
  //backgroundPalette
  });
