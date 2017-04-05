'use strict';

angular.module('caaincanApp')
  .config(function($stateProvider) {
    $stateProvider.state('search', {
      url: '/search',
      templateUrl: 'app/search/search.html',
      controller: 'SearchController',
      controllerAs: 'searchCtrl'
      // authenticate: 'admin'
    });
  });
