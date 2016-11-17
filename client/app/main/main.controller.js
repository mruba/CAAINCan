'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket, $mdDialog ){

      this.$http = $http;
      this.socket = socket;
      this.awesomeThings = [];
      this.eventSources = [];
      this.events = [];
      this.viewDates = {};
      //this.uiConfig = {calendar:{}};
      this.mdDialog = $mdDialog;

      $scope.$on('$destroy', function() {
        socket.unsyncUpdates('thing');
      });
      //lets initalize the main configuration
      console.log('configuration');
      this.uiConfig = {
        calendar:{
          timezone: 'UTC',
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
          businessHours:{
            // days of week. an array of zero-based day of week integers (0=Sunday)
            dow: [ 1, 2, 3, 4, 5], // Monday - Thursday
            start: '9:00', // a start time (10am in this example)
            end: '13:30'// an end time (6pm in this example)
          },
          viewRender: function(view) {
            console.log(view.intervalStart.toJSON());
            console.log(view.intervalEnd.toJSON());
            this.viewDates.start = view.intervalStart.toJSON();
            this.viewDates.end = view.intervalEnd.toJSON();
            this.indexAppointments();
            // console.log(view.intervalStart.toDate());
            // console.log(view.intervalStart.toISOString());
            // console.log(view.intervalStart.toJSON());
            // console.log(view.intervalStart.toString());
            // console.log(view.intervalStart.unix());
            // console.log(view.intervalStart.utc());
            // console.log(view.intervalStart.utc());
            // console.log(view.intervalEnd);
          }.bind(this),
          eventClick: function(event) {
            console.log(event);
            // this.createAppointment(event);
            this.showAppointment(event);
          }.bind(this),
          dayClick: function(date){
            this.createAppointment(date);
          }.bind(this)
        }
      };
    }

    indexAppointments(){
      var config = {
        method: 'GET',
        url: '/api/appointments',
        params: this.viewDates
      };

      this.$http(config).then(function(response){
          // this.awesomeThings = response.data;
          _.each(response.data, function(appointment) {
            var start = new Date(appointment.start);
            var end = new Date(appointment.end);
            this.events.push({title: appointment.title, start:start , end: end, id: appointment._id, timezone: 'UTC'});
          }.bind(this));
        }.bind(this));
    }



    $onInit() {
      //this.indexAppointments();
      this.socket.syncUpdates('appointment', this.events);
      this.eventSources = [this.events];
    }

    addAppointment(data){
      // var date = new Date();
      // var d = date.getDate();
      // var m = date.getMonth();
      // var y = date.getFullYear();
      this.events.push(data);
      console.log(this.events);

    }

    showAppointment(data){
      this.mdDialog.show({
      onRemoving : function(){
        //$scope.orderUpdate(data);
      },
      onComplete : function(){
//				$('#modalOrder').addClass('animated shake');
      },
      escapeToClose : true,
      //scope: $scope,
      preserveScope: false,
      clickOutsideToClose: true,
      bindToController: true,
      disableParentScroll: true,

      focusOnOpen: false,
      fullscreen: true,
      //targetEvent: event,
      controller: 'appointmentShowCtrl',
      //controllerAs: 'ctrl',
      templateUrl: 'app/main/appointment/appointment.html',
      locals : {
        data : data
      }
      //disableParentScroll: true
    }).then(function(data) {
        //we  save the order only if the promise was succesfully
        // this.addAppointment(data);
        // this.events.push(data);
        console.log(this.eventSources);
      }.bind(this));
    }

    createAppointment(date){
      this.mdDialog.show({
      onRemoving : function(){
        //$scope.orderUpdate(data);
      },
      onComplete : function(){
//				$('#modalOrder').addClass('animated shake');
      },
      escapeToClose : true,
      //scope: $scope,
      preserveScope: false,
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
        date : date
      }
      //disableParentScroll: true
    }).then(function(data) {
        //we  save the order only if the promise was succesfully
        // this.addAppointment(data);
        // this.events.push(data);
        console.log(this.eventSources);
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
