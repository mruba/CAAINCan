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
      this.loading = true;
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
          defaultView: 'agendaWeek',
          slotEventOverlap: false,
          locale: 'es',
          dayNames : ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          monthNames : ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio', 'Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
          dayNamesShort : ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
          buttonText: {
            today:'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
          },
          editable: true,
          eventDurationEditable: false,
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
          eventDrop: function(event, delta) {
            console.log(event);
            //we are ready to patch the new event
            this.editAppointment(event);
          }.bind(this),
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
      this.loading = true;
      var config = {
        method: 'GET',
        url: '/api/appointments',
        params: this.viewDates
      };

      this.$http(config).then(function(response){
          // this.awesomeThings = response.data;
          console.log(response);
          this.events.length = 0;
          _.each(response.data, function(appointment) {
            var start = new Date(appointment.start);
            var end = new Date(appointment.end);
            // let color;
            let color = appointment.type == 'primera-vez' ? '#ff0000' : '#00BCD4';

            // switch (appointment.poblacion) {
            //   // case 'primera-vez':
            //   //   color = '#ff0000';
            //   //   break;
            //   case 'paciente':
            //     color = 'blue';
            //     break;
            //   case 'familiar':
            //     color = 'green';
            //     break;
            //   case 'personal-incan':
            //     color = 'red';
            //     break;
            //   default:
            //     color = '#00BCD4';
            // }
            //primera-vez = morado
            //paciente = azul paciente
            //familiar = verde familiar
            //incan = rojo personal-incan
            this.events.push({title: appointment.title, start:start , end: end, _id: appointment._id, timezone: 'UTC', color : color});
          }.bind(this));
          this.loading = false;
        }.bind(this));
    }



    $onInit() {
      //this.indexAppointments();
      this.socket.syncUpdates('appointment', this.events);
      this.eventSources = [this.events];
      console.log(this.eventSources);
    }

    addAppointment(data){
      // var date = new Date();
      // var d = date.getDate();
      // var m = date.getMonth();
      // var y = date.getFullYear();
      console.log('apoitment added');
      this.events.push(data);

    }

    editAppointment(event){
      var eventData = {
          // id: event.id,
          start: event.start._d,
          end: event.end._d,
        };
      this.$http.patch(`/api/appointments/${event._id}`, eventData)
        .then(function(response){
          console.log(response);
        });
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
        console.log(data);
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
