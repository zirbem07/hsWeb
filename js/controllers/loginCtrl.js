  angular.module('pt.controllers.login', [])
  .controller('LoginCtrl', ['$scope','$state', 'Session', '$mdDialog', '$rootScope', '$mdToast', '$http', '$httpParamSerializerJQLike', '$stateParams', 'ID',
    function($scope, $state, Session,  $mdDialog, $rootScope, $mdToast, $http, $httpParamSerializerJQLike, $stateParams, ID){

      $scope.loginData = {
        // username: 'hcTherapist1',
        // password: 'test123'
      };

      $scope.login = function(){
        $http({
          method: 'POST',
          url: 'https://api.truevault.com/v1/auth/login',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $httpParamSerializerJQLike({'username': $scope.loginData.username, 'password': $scope.loginData.password, 'account_id': '686fb6aa-f671-4532-94ac-29d69d0d1e5a'})
        }).then(function successCallback(response) {
          
          Session.user = response.data.user;
          console.log(Session.user)
          $http({
            method: 'GET',
            url: 'https://api.truevault.com/v1/users/' + response.data.user.id + '?full=true',
            headers: {
              'Authorization': 'Basic ' + btoa(Session.user.access_token + ':'),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {full: true}
          }).then(function successCallback(response2) {
            if(response2.data.user.attributes) {
              Session.user.attributes = JSON.parse(atob(response2.data.user.attributes))
            }
            $state.go('analytics');
          }, function errorCallback(response) {
            $scope.showLoginError();
            console.log(response)
          });
        }, function errorCallback(response) {
          $scope.showLoginError();
          console.log(response)
        });
      };

      $scope.showLoginError = function(error) {
        $mdToast.show(
          $mdToast.simple()
            .content('Your username or password is incorrect.')
            .position( 'bottom right')
            .hideDelay(3000)
        );
      };

      $scope.forgotPassword = function(email){
         var confirm = $mdDialog.prompt()
          .title('What is the email associated with your account?')
          .textContent('We will send a password reset link to your email.')
          .placeholder('Email')
          .ariaLabel('Email')
          .initialValue(email)
          .ok('Send')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function(result) {
          var req = {
              method: 'POST',
              url: ID['production'].ResetEmailLink,
              data: {'email': result, 'email64': btoa(result)}
            }

            $http(req).then(function (data) {

              $mdToast.show(
                $mdToast.simple()
                  .content('Email sent')
                  .position('bottom right')
                  .hideDelay(3000)
              );
            }, function (error) {
              console.log(error)
            });
        }, function() {
        });
      };

    AddEditBillingController.$inject = ['$filter', '$rootScope'];

		function AddEditBillingController($filter, $rootScope) {
			var addEditBillingCtrl = this;

			/* Get our billing form months and years data from the service */
			addEditBillingCtrl.modalLabel = 'add';
			addEditBillingCtrl.billingMonths = [
        {id: '01', name: 'January'}, 
        {id: '02', name: 'February'}, 
        {id: '03', name: 'March'}, 
        {id: '04', name: 'April'}, 
        {id: '05', name: 'May'}, 
        {id: '06', name: 'June'}, 
        {id: '07', name: 'July'}, 
        {id: '08', name: 'August'}, 
        {id: '09', name: 'September'}, 
        {id: '10', name: 'October'}, 
        {id: '11', name: 'November'}, 
        {id: '12', name: 'December'}]
			addEditBillingCtrl.billingYears = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
      addEditBillingCtrl.countries = [{name: "United States"}];
      

			/* Billing form */
			addEditBillingCtrl.billingForm = {};
			addEditBillingCtrl.closeModal = closeModal;
			addEditBillingCtrl.submitBilling = submitBilling;

			addEditBillingCtrl.placeholders = {
				firstName: "First Name",
				lastName: "Last Name",
				lastFour: "Credit Card Number",
				cvv: "CVV",
				month: "Exp. Month",
				year: "Exp. year",
        email: "Email"
			};

			function closeModal() {
				$mdDialog.cancel();
			}

			function submitBilling() {

				var BillingData = {
					first_name: addEditBillingCtrl.billingForm.firstName,
					last_name: addEditBillingCtrl.billingForm.lastName,
					number: addEditBillingCtrl.billingForm.ccNumber,
					month: addEditBillingCtrl.billingForm.ccMonth,
					year: addEditBillingCtrl.billingForm.ccYear,
					cvv: addEditBillingCtrl.billingForm.cvv,
          zip: addEditBillingCtrl.billingForm.zip,
          city: addEditBillingCtrl.billingForm.city,
          state: addEditBillingCtrl.billingForm.state,
          email: addEditBillingCtrl.billingForm.email,
          country: addEditBillingCtrl.billingForm.country,
          address: addEditBillingCtrl.billingForm.address1	
				};

				addEditBillingCtrl.submittingForm = true;

        var req = {
                method: 'POST',
                url: './php/checkout.php',
                data: BillingData
            }

            $http(req).then(function(data){
                //Toast
                $mdDialog.hide();
            }, 
            function(error){
                console.log(error)
            });
			
			}

			function resetForm() {
				$scope.billingData.$setPristine();
				$scope.billingData.$setUntouched();
			}
		}

 }]);