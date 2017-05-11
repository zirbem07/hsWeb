angular.module('pt.services.patients', [])
  .factory('PatientList', function($q, Session, $http, $httpParamSerializerJQLike, ID) {
    
return {
    patientLog: {},
    patients: [],
    all: function(){
      this.patients = [];
      var self = this;
      var queryParams = JSON.stringify({
        "filter": {
          "TherapistID": {
            "type": "eq",
            "value": Session.user.user_id
          },
          "Deleted": {
            "type": "eq",
            "value": false
          }
        },
        "filter_type": 'and',
        "full_document": true,
        "schema_id": ID[Session.user.attributes.AccountType].PatientSchema
      });

      var defer = $q.defer();
      $http({
        method: 'POST',
        url: 'https://api.truevault.com/v1/vaults/' + ID[Session.user.attributes.AccountType].PatientVault + '/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(Session.user.access_token + ':'),
        },
        data: $httpParamSerializerJQLike({
          search_option: btoa(queryParams)
        })
      }).then(function successCallback(response) {
        var s = [];
        angular.forEach(response.data.data.documents, function(val){
          self.patients.push({document: JSON.parse(atob(val.document)), documentID: val.document_id});
        });
        defer.resolve(s);
      }, function errorCallback(error) {
        defer.reject(error);
      });
      return defer.promise;
    },

    discharge: function (patient) {
      patient.document.Discharged = true;
      var newData = JSON.stringify(patient.document);
      $http({
        method: 'PUT',
        url: 'https://api.truevault.com/v1/vaults/' + ID[Session.user.attributes.AccountType].PatientVault + '/documents/' + patient.documentID,
        headers: {
          'Authorization': 'Basic ' + btoa(Session.user.access_token + ':'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: $httpParamSerializerJQLike({
          document: btoa(newData)
        })
      }).then(function successCallback(response) {
        console.log(response)
      }, function errorCallback(response) {
        console.log(response)
      });
      return null;
    },
    
    getPatientLog: function(patientLogID) {

        var defer = $q.defer();
        var self = this;

        $http({
          method: 'GET',
          url: 'https://api.truevault.com/v1/vaults/'+ ID[Session.user.attributes.AccountType].PatientLogVault +'/documents/' + patientLogID,
          headers: {
            'Authorization': 'Basic ' + btoa(Session.user.access_token + ':'),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        })
        .then(function successCallback(response) {
          self.patientLog = JSON.parse(atob(response.data));
          defer.resolve(response.data);
        }, function errorCallback(response) {
          defer.reject();
        });
        return defer.promise;

    }
}
});