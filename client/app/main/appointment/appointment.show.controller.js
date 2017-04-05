
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('caaincanApp').controller('appointmentShowCtrl', function ($scope, data, $mdDialog, $http) {

  console.log(data);
  $scope.showAppointment = true;
  $scope.date = data.start;
  $scope.time = data.start.hours() || 9;
  var appointmentId = data._id;

  $http.get(`/api/appointments/${data._id}`)
    .then(function(response){
      console.log(response);
      $scope.data = {
        name: response.data.title,
        procede: response.data.procedencia,
        expediente: response.data.expediente,
        email: response.data.email,
        phone: response.data.telefono,
        tipo: response.data.type,
        poblacion: response.data.poblacion
      };
    });


  $scope.cancelDialog = function() {
    $mdDialog.cancel();
  };

  $scope.deleteAppointment = function() {
    $http.delete(`/api/appointments/${data._id}`)
      .then(function(response){
        console.log(response);
        $mdDialog.hide();
      });
  };

  $scope.saveInfo = function() {

    // var date = new Date();
    // var d = date.getDate();
    // var m = date.getMonth();
    // var y = date.getFullYear();
    // data.hour($scope.time);

    var endTime  = data.start.clone().add(30, 'minutes');

    var appointmentData = {
        title: $scope.data.name || 'visita',
        procedencia: $scope.data.procede,
        expediente: $scope.data.expediente,
        email: $scope.data.email,
        telefono: $scope.data.phone,
        start: data._d,
        end: endTime._d,
        className: ['openSesame'],
        timezone: 'UTC',
        poblacion: $scope.data.poblacion
      };

    $http.patch(`/api/appointments/${data._id}`, appointmentData)
      .then(function(response){
        // console.log(response);
      });
    $mdDialog.hide(appointmentData);
  };

});
