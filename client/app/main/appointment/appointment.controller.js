'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('caaincanApp').controller('appointmentCtrl', function ($scope, date, $mdDialog, $http) {


  $scope.date = date;
  $scope.timeMinutes = date.minutes() || 0;
  $scope.time = date.hours() || 9;

  $scope.poblation = [
    {code: '01', name: 'paciente'},
    {code: '02', name: 'familiar'},
    {code: '03', name: 'ican'}
  ];

  $scope.cancelDialog = function() {
    $mdDialog.cancel();
  };

  $scope.saveInfo = function() {
    // var date = new Date();
    // var d = date.getDate();
    // var m = date.getMonth();
    // var y = date.getFullYear();
    date.hour($scope.time);
    var endTime  = date.clone().add(30, 'minutes');
    var color = $scope.data.tipo === 'primera-vez' ? '#00BCD4' : '#ff0000';
    var appointmentData = {
        title: $scope.data.name || 'visita',
        procedencia: $scope.data.procede,
        expediente: $scope.data.expediente,
        email: $scope.data.email,
        telefono: $scope.data.phone,
        start: date._d,
        end: endTime._d,
        type: $scope.data.tipo,
        poblacion: $scope.data.poblacion,
        className: ['openSesame'],
        timezone: 'UTC'
        };

    $http.post('/api/appointments/', appointmentData)
      .then(function(response){
        console.log(response);
      });
     console.log(appointmentData);
    $mdDialog.hide(appointmentData);
  };

});
