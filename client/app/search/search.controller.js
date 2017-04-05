'use strict';

(function() {

  class SearchController {
    constructor($http) {
      this.$http = $http;
      this.pacients = [];
      // Use the User $resource to fetch all users
      // this.users = User.query();
      // console.log(User.query());
    }

    search(query){
      var config = {
        method: 'GET',
        url: '/api/appointments/search',
        params: {q: query}
      };

      this.$http(config).then((response) => {
        console.log(response);
        this.pacients = response.data;
      });

    }
    // delete(user) {
    //   user.$remove();
    //   this.users.splice(this.users.indexOf(user), 1);
    // }
  }

  angular.module('caaincanApp')
    .controller('SearchController', SearchController);
})();
