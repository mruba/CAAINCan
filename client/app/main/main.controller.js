'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket, $mdDialog) {
      this.$http = $http;
      this.socket = socket;
      this.awesomeThings = [];
      this.eventSources = [];
      this.events = [];
      this.uiConfig = {calendar:{}};
      this.mdDialog = $mdDialog;
      this.test = 'hello mundo';
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
            },
            eventClick: function() {
              console.log('wooo');

            }
          }
        };

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
         this.events = [
          {title: 'All Day Event',start: new Date(y, m, 1)},
          {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
          {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
          {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
          {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
          {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ];

         this.eventSources = [this.events];

    }

    addAppointment(data){
      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();
      this.events.push({
         title: 'Open Sesame',
         start: new Date(y, m, d),
         end: new Date(y, m, d),
         className: ['openSesame']
       });

    }

    createAppointment(){

      var data = {};
      console.log('creating appointment');
      this.mdDialog.show({
      onRemoving : function(){
        console.log('ejecutando on removing');
        //$scope.orderUpdate(data);
      },
      onComplete : function(){
//				$('#modalOrder').addClass('animated shake');
      },
      escapeToClose : true,
      //scope: $scope,
      //preserveScope: false,
      clickOutsideToClose: true,
      bindToController: true,
      disableParentScroll: true,

      focusOnOpen: false,
      fullscreen: true,
      //targetEvent: event,
      controller: 'appointmentCtrl',
      //controllerAs: 'ctrl',
      templateUrl: 'app/main/appointment/appointment.html',
      locals : {
        data : data
      }
      //disableParentScroll: true
    }).then(function(data) {
        //we  save the order only if the promise was succesfully
        console.log(data);
        this.addAppointment(data);
      }.bind(this));



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
