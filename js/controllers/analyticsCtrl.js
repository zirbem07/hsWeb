angular.module('pt.controllers.analytics', ['chart.js'])
  .controller('AnalyticsCtrl', ['$scope', '$mdDialog', '$sce', '$http', 'Session', 'PatientList', 'ID',
    function($scope, $mdDialog, $sce, $http, Session, PatientList, ID){

        $scope.colors = ['#BDBDBD', '#0288D1', '#ff6384', '#ff8e72'];    
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.onHover = function (points, evt) {
            console.log(points, evt);
        };
        
        $scope.daysAgo = function(day) {
            if(!day) { return -1 }
            day = Date.parse(day.substring(0, day.length -14)) || Date.parse(day);
            return Math.round(Math.abs((Date.today().getTime() - day.getTime())/(24*60*60*1000)))
        };

        //Discharge
        $scope.showDischarge = function(patient, ev) {
            var patient = patient;
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Are you sure you would like to discharge this patient?')
                .textContent('Discharged paitents will no longer recieve reminders and notifications and will not show up in reports.')
                .ariaLabel('Discharge')
                .targetEvent(ev)
                .ok('Discharge Patient')
                .cancel('Not Yet');

            $mdDialog.show(confirm).then(function() {
                //DO Dischage
            }, function() {
        
            });
        };

        //Message
        $scope.selectedPatientName = "";
        console.log(Session.user);
        $scope.providerName =  Session.user.attributes.FirstName;
        $scope.selectedMessage = {};
        $scope.messageOptions = [
            {name: 'CONGRATULATING', message: 'Just writing to let you know that you are doing a great job in your exercise program! Keep up the good work!'},
            {name: 'SUPPORTIVE', message: '<span>I noticed that it has been difficult for you to complete your home exercises as recommended. There are many things that can discourage a person during the treatment process.<span> <br /> <br /> \n I would be happy to see you in the clinic to discuss a plan that works better for you. I will see you soon.'},
            {name: 'MOTIVATIONAL', message: 'Research shows that physical therapy patients see the greatest relief of symptoms with greater than 3 months of regular exercise completion. Do not let the bad days deter you.'}
        ]
        $scope.selectMessage = function(index) {
            $scope.selectedMessage = $scope.messageOptions[index];
        }
        $scope.selectMessage(0);
        $scope.trustHTML = function(html) {
            return $sce.trustAsHtml(html)
        }

    
        $scope.cancel = function() {
            $mdDialog.hide();
        }

        $scope.send = function() {
            //build email
            var message = 'Hi ' + $scope.selectedPatientName +", <br /><br />" + $scope.selectedMessage.message + "\n <br />" + Session.user.attributes.FirstName;
            //Email Patient
            var req = {
                method: 'POST',
                url: ID[Session.user.attributes.AccountType].AnalyticsMessageLink,
                data: {'email': Session.user.attributes.Email,  'message': message, 'toEmail': $scope.selectedPatientEmail}
            }

            $http(req).then(function(data){
                //Toast
                console.log(data);
                $mdDialog.hide();
            }, 
            function(error){
                console.log(error)
            });
        }

        $scope.message = function(patient) {
            $scope.selectedPatientName = patient.firstName;
            $scope.selectedPatientEmail = patient.email;
            $mdDialog.show({
                scope: $scope.$new(),
                templateUrl: './templates/emailPatientModal.html',
                resolve: {
                patient: function () {
                    return patient;
                }
                },
                parent: angular.element(document.body),
                clickOutsideToClose: true
            })
        }

        $scope.openDischargelModal = function(patient){
            var patient = {document: patient};
            $mdDialog.show({
                controller: 'PatientDischargeModalCtrl',
                templateUrl: './templates/patientDischargeModal.html',
                resolve: {
                patient: function () {
                    return patient;
                }
                },
                parent: angular.element(document.body),
                clickOutsideToClose: true
            })
        };

        $scope.compiledData = [];   

        var findStartDate = function(patient) {
            var count = 0;
            var day = Date.today().toString('M-dd-yyyy');
            while(!patient.document.log[day] && count < 100) {
                day = Date.parse(day).addDays(-1).toString('M-d-yyyy');
                count++;
            }

            return day
        } 

        $scope.graphSurvey = function(patient) {
            patient.surveySeries = [];
            patient.surveyDataPoints = [];
            patient.surveyLabels = [];

            var surveyCurrentScore = [];
            var surveyTargetScore = [];

            //if only one survey
            if(patient.surveyNames.length === 1) {
                patient.surveySeries.push(patient.surveyNames[0]);
                patient.surveySeries.push("Target Score");
                angular.forEach($scope.surveyTracker[patient.surveyNames[0]], function(val){
                    surveyCurrentScore.push(val.dataPoint);
                    surveyTargetScore.push(val.targetScore);
                    console.log(val.targetScore);
                    // patient.surveyDataPoints[0].push(val.dataPoint);
                    // patient.surveyDataPoints[1].push(10);
                    patient.surveyLabels.push(val.day)
                })
            } else {
                //show modal
            }

            patient.surveyDataPoints.push(surveyCurrentScore.reverse());
            patient.surveyDataPoints.push(surveyTargetScore.reverse());
            patient.surveyLabels.reverse();
            patient.surveyDataPoints.reverse();
            patient.surveySeries.reverse();

            patient.selectedChart = 'surveys';
        }

        $scope.surveyTracker = [];
        //$scope.surveyNames = [];
        var analyzedPatient = {};

        var calculateScore = function(patient) {

            analyzedPatient = {
                PatientID: patient.document.PatientID,
                selectedChart: 'compliance',
                firstName: patient.document.FirstName,
                lastName: patient.document.LastName,
                therapyScore: 0,
                lastActive: patient.document.LastActive,
                hepDataPoints: [],
                surveyDataPoints: [],
                hepLabels: [Date.today().toString('M/d')],
                surveyLabels: [],
                hepSeries: ['Assigned', 'Completed'],
                surveySeries: [],
                hasSurveys: false,
                surveyNames: []
            }

            var day = findStartDate(patient);
            var totalAssigned = 0;
            var totalCompleted = 0;
            var weekNumber = Date.parse(day).getWeek();
            var index = 0;
            var completedDataPoints = [0];
            var assignedDataPoints = [0];

            while(patient.document.log[day]) {
                //total for therapy score
                totalAssigned += patient.document.log[day].assigned;
                totalCompleted += patient.document.log[day].completed;

                //check for survey 
                if(patient.document.log[day].surveys) {
                    analyzedPatient.hasSurveys = true;
                for(var i = 0; i < patient.document.log[day].surveys.length; i++) {
                        var survey = patient.document.log[day].surveys[i];
                        //if its a new survey
                        if(!$scope.surveyTracker[survey.name]){
                            analyzedPatient.surveyNames.push(survey.name);
                            $scope.surveyTracker[survey.name] = [{day: day, dataPoint: survey.currentScore, targetScore: survey.targetScore}];
                        } else {
                            $scope.surveyTracker[survey.name].push({day: day, dataPoint: survey.currentScore, targetScore: survey.targetScore});
                        }
                    }
                }

                //New Week, Create new label and new data point
                if(Date.parse(day).getWeek() != weekNumber) {
                    analyzedPatient.hepLabels[index] += " - " + Date.parse(day).addDays(1).toString('M/d')
                    weekNumber = Date.parse(day).getWeek();
                    index++;
                    completedDataPoints[index] = 0;
                    assignedDataPoints[index] = 0;
                    analyzedPatient.hepLabels[index] = Date.parse(day).toString('M/d')
                }
                //calculate data point
                completedDataPoints[index] += patient.document.log[day].completed;
                assignedDataPoints[index] += patient.document.log[day].assigned;
                
                //decrement day
                day = Date.parse(day).addDays(-1).toString('M-d-yyyy');
                
            }

            //reverse hepLabels
            angular.forEach(analyzedPatient.hepLabels, function(val, i) {
                analyzedPatient.hepLabels[i] = val.split(" - ").reverse().join("-");
            })
            //set data points & hepLabels
            analyzedPatient.hepLabels.reverse();
            analyzedPatient.surveyLabels.reverse();
            analyzedPatient.surveyDataPoints.reverse();
            analyzedPatient.surveySeries.reverse();
            analyzedPatient.hepDataPoints.push(assignedDataPoints.reverse());
            analyzedPatient.hepDataPoints.push(completedDataPoints.reverse());
        
            if(totalCompleted >= totalAssigned){
                analyzedPatient.therapyScore = 100;
            } else {
                analyzedPatient.therapyScore = Math.floor(totalCompleted/totalAssigned * 100)
            }

            $scope.compiledData.push(analyzedPatient);
            
        }    

        $scope.patients = PatientList.patients;
        $scope.patients.forEach(function(val, index){
            PatientList.getPatientLog(val.document.PatientLogID).then(
                function(patientLogObject){  
                    val.document.log = JSON.parse(atob(patientLogObject));
                    calculateScore(val);
            })
        })
    }]);