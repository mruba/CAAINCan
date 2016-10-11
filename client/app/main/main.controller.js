'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket) {
      this.$http = $http;
      this.socket = socket;
      this.awesomeThings = [];
      this.uiConfig = {calendar:{}};
      $scope.$on('$destroy', function() {
        socket.unsyncUpdates('thing');
      });
    }

    $onInit() {
      this.$http.get('/api/things')
        .then(response => {
          this.awesomeThings = response.data;
          this.socket.syncUpdates('thing', this.awesomeThings);
        });

        //lets initalize the main configuration
        this.uiConfig = {
          calendar:{
            locale: 'es',
            dayNames : ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            monthNames : ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio', 'Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
            dayNamesShort : ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            buttonText: {
              today:'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Dia'
            },
            editable: true,
            header:{
              left: 'month agendaWeek agendaDay',
              center: 'title',
              right: 'today prev,next'
            }
          }
        };

    }

    addThing() {
      if (this.newThing) {
        this.$http.post('/api/things', {
          name: this.newThing
        });
        this.newThing = '';
      }
    }

    deleteThing(thing) {
      this.$http.delete('/api/things/' + thing._id);
    }
  }

  angular.module('caaincanApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
