angular.module('pt.controllers.billing', [])
  .controller('BillingCtrl', ['$scope', '$mdDialog', '$http', 'Session',
    function($scope, $mdDialog, $http, Session){
		 
     $scope.cancelAccount = function() {
       console.log(Session.user)
       var request = {
              method: 'POST',
              url:    './php/cancelAccount.php',
              data:   {email: Session.user.attributes.Email}
          }

          $http(request).then(function(data){
              alert("We're sad to see you go. Your account will be canceled within 24 hours.");
          })
     }
	}
]);