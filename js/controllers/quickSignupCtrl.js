angular.module('pt.controllers.quicksignup', [])
  .controller('QuickSignupCtrl', ['$scope','$state', 'Session', '$mdDialog', '$rootScope', '$mdToast', '$http', '$httpParamSerializerJQLike', '$stateParams',
    function($scope, $state, Session,  $mdDialog, $rootScope, $mdToast, $http, $httpParamSerializerJQLike, $stateParams){
            fbq('track', 'Lead');
            $scope.pageType = $stateParams.pageType || "none"
			$scope.addEditBillingCtrl = {};
			/* Get our billing form months and years data from the service */
			// $scope.addEditBillingCtrl.modalLabel = 'add';
			// $scope.addEditBillingCtrl.billingMonths = [
            //     {id: '01', name: 'January'}, 
            //     {id: '02', name: 'February'}, 
            //     {id: '03', name: 'March'}, 
            //     {id: '04', name: 'April'}, 
            //     {id: '05', name: 'May'}, 
            //     {id: '06', name: 'June'}, 
            //     {id: '07', name: 'July'}, 
            //     {id: '08', name: 'August'}, 
            //     {id: '09', name: 'September'}, 
            //     {id: '10', name: 'October'}, 
            //     {id: '11', name: 'November'}, 
            //     {id: '12', name: 'December'}]
            // $scope.addEditBillingCtrl.billingYears = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
            // $scope.addEditBillingCtrl.countries = [{name: "United States"}];
      
            $scope.termsAndPrivacyBox = false;
            $scope.agreeToBAABox = false;

			/* Billing form */
			$scope.addEditBillingCtrl.billingForm = {};
			$scope.addEditBillingCtrl.closeModal = closeModal;
			$scope.addEditBillingCtrl.submitBilling = submitBilling;
            $scope.addEditBillingCtrl.billingForm.code = 'CSM';

			$scope.addEditBillingCtrl.placeholders = {
				firstName: "First Name",
				lastName: "Last Name",
				lastFour: "Credit Card Number",
				cvv: "CVV",
				month: "Exp. Month",
				year: "Exp. year",
                email: "Email",
                organization: "Organization"
			};

            $scope.getClinicID = function(){
                var req = {
                    method: 'POST',
                    url   : 'https://healthconnection.io/testAPI/web/index.php/api/v1/clinic',
                    data  : {Name: $scope.addEditBillingCtrl.billingForm.email}
                }

                $http(req).then(function(data){
                    if(data.status == 200){
                        createUser(data.data.id);
                    }
                })
            }
            
             $scope.sendEmail = function(){
               if($scope.addEditBillingCtrl.billingForm.email.length){
                   var request = {
                       method: 'POST',
                       url:    './php/sendEmail.php',
                       data:   {email: $scope.addEditBillingCtrl.billingForm.email}
                   }

                   $http(request).then(function(data){
                       console.log(data);
                   })
               }
           }   

			function closeModal() {
				$mdDialog.cancel();
			}

			function submitBilling() {



                if($scope.termsAndPrivacyBox === "yup" && $scope.agreeToBAABox === "yup"){
                    if($scope.addEditBillingCtrl.billingForm.occupation == 'Student'){
                        var splitEmail = $scope.addEditBillingCtrl.billingForm.email.split('.')
                        if(splitEmail[splitEmail.length - 1] == 'edu'){
                            $scope.getClinicID();
                            // alert('pass')
                        }
                        else{
                            $scope.alertEDU = true;
                        }
                    }
                    else{
                        // alert('pass non student')
                        $scope.getClinicID();
                    }
                    
                }

                // 

                // if($scope.addEditBillingCtrl.billingForm.code){
                //     var code = $scope.addEditBillingCtrl.billingForm.code.toUpperCase();
                // } else {
                //     var code = "null";
                // }

				// var BillingData = {
				// 	first_name: $scope.addEditBillingCtrl.billingForm.firstName,
				// 	last_name: $scope.addEditBillingCtrl.billingForm.lastName,
				// 	number: $scope.addEditBillingCtrl.billingForm.ccNumber,
				// 	month: $scope.addEditBillingCtrl.billingForm.ccMonth,
				// 	year: $scope.addEditBillingCtrl.billingForm.ccYear,
				// 	cvv: $scope.addEditBillingCtrl.billingForm.cvv,
                //     zip: $scope.addEditBillingCtrl.billingForm.zip,
                //     city: $scope.addEditBillingCtrl.billingForm.city,
                //     code: code,
                //     state: $scope.addEditBillingCtrl.billingForm.state,
                //     email: $scope.addEditBillingCtrl.billingForm.email,
                //     country: $scope.addEditBillingCtrl.billingForm.country,
                //     address: $scope.addEditBillingCtrl.billingForm.address1	
				// };
				// $scope.addEditBillingCtrl.submittingForm = true;

             
                
                // var req = {
                //     method: 'POST',
                //     url: './php/checkout.php',
                //     data: BillingData
                // }

                // $http(req).then(function(data){
                //     //Toast
                //     console.log("Billing Data");
                //     console.log(data);
                //     if(data.status === 200){
                //         $scope.customerID = data.data;
                //         $scope.getClinicID();
                //     } else {
                //         alert(data.data);
                //     }
                // }, 
                // function(error){
                //     console.log(error)
                // });
			
			}

            function createUser(clinicID) {

                if($scope.addEditBillingCtrl.billingForm.occupation == 'Other'){
                    var occupation = $scope.addEditBillingCtrl.billingForm.other
                }
                else{
                    if($scope.addEditBillingCtrl.billingForm.occupation == 'Student'){
                        var occupation = 'student ' + $scope.addEditBillingCtrl.billingForm.gradYear
                    }
                    else{
                        var occupation = $scope.addEditBillingCtrl.billingForm.occupation
                    }
                }

                var accountData = JSON.stringify(
                {
                    "ClinicID": clinicID,
                    "FirstName": $scope.addEditBillingCtrl.billingForm.firstName,
                    "LastName": $scope.addEditBillingCtrl.billingForm.lastName,
                    "Email": $scope.addEditBillingCtrl.billingForm.email,
                    "Organization": $scope.addEditBillingCtrl.billingForm.organization,
                    "Occupation": occupation,
                    "HideAdd": false,
                    "AccountType": "production",
                    "Admin": true,
                    "HealthSnaps": true,
                    "CustomerID": "CSM"
                });
                $http({
                    method: 'POST',
                    url: 'https://api.truevault.com/v1/users',
                    headers: {
                        'Authorization': 'Basic ' + btoa('eaa1d6fc-14b0-4005-8bcb-991fa16fab22' + ':'),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $httpParamSerializerJQLike({
                        username:   $scope.addEditBillingCtrl.billingForm.email,
                        password:   $scope.addEditBillingCtrl.billingForm.password,
                        attributes: btoa(accountData)
                    })
                }).then(function(data){

                      $http({
                            method: 'POST',
                            url: 'https://healthconnection.io/hcPassword/php/addToTherapistGroup.php',
                            headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: $httpParamSerializerJQLike({'userID': data.data.user.user_id})
                        }).then(function successCallback(response) {
                            var email = $scope.addEditBillingCtrl.billingForm.email
                            var template_slug = 'therapist-welcome-email'
                            // if(email.split('.')[email.split('.').length -1] === 'edu'){
                            //     template_slug = 'student-onboarding-email'
                            // }
                            _dcq.push(["identify", {
                                email: $scope.addEditBillingCtrl.billingForm.email,
                                first_name: $scope.addEditBillingCtrl.billingForm.firstName,
                                last_name: $scope.addEditBillingCtrl.billingForm.lastName,
                                occupation: $scope.addEditBillingCtrl.billingForm.occupation,
                                organization: $scope.addEditBillingCtrl.billingForm.organization,
                                tags: ["Free Trial"]
                            }]);
                            _dcq.push(["track", "free_trial",]);
                            fbq('track', 'CompleteRegistration')
                            $http({
                                method: 'POST',
                                url: './php/sendActivationEmail.php',
                                headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                    email: $scope.addEditBillingCtrl.billingForm.email,
                                    fname: $scope.addEditBillingCtrl.billingForm.firstName,
                                    template: template_slug
                                }
                            }).then(function successCallback(response) {
                                window.location.href = 'https://healthconnection.io/thankyou.html';
                            }, function errorCallback(response) {

                            });
                        }, function errorCallback(response) {

                        });
                })

                
            }

			function resetForm() {
				$scope.billingData.$setPristine();
				$scope.billingData.$setUntouched();
			}


 }]);