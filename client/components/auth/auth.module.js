'use strict';

angular.module('caaincanApp.auth', ['caaincanApp.constants', 'caaincanApp.util', 'ngCookies',
    'ui.router'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
