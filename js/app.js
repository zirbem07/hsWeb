angular
    .module('admin',
    ['ngMaterial', 'ngMessages', 'ui.router', 'pt.controllers', 'pt.services', 'infinite-scroll', 'pt.filters', 'jkAngularRatingStars'])
    .run(function($rootScope, $window, $location, $state, Session){

      $rootScope.$on('$stateChangeStart', function(e, toState) {

        if(toState.name === 'signup' || toState.name == 'login' || toState.name === 'quickSignup'|| toState.name === 'quickSignup2'){
          $rootScope.showMenu = false;
        } else if(Session.user == undefined && toState.name !== 'signup') {
          e.preventDefault();
          $state.go('login');
        } else {
          $rootScope.showMenu = true;
        }
      });
    })
    .config(function($sceDelegateProvider, $mdThemingProvider, $mdIconProvider, $stateProvider, $urlRouterProvider, $httpProvider){
      //$httpProvider.interceptors.push('APIInterceptor');

      $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',

      ]);


      $mdIconProvider
          .icon("menu"          , "./img/svg/menu.svg"           , 24)
          .icon("share"         , "./img/svg/share.svg"          , 24)
          .icon("info"          , "./img/svg/info.svg"           , 24)
          .icon("close"         , "./img/svg/close.svg"          , 24)
          .icon("warning"       , "./img/svg/warning.svg"        , 48)
          .icon("circle_check"  , "./img/svg/circle_check.svg"   , 48)
          .icon("clear"         , "./img/svg/clear.svg"          , 48)
          .icon("check"         , "./img/svg/check.svg"          , 48)
          .icon("search"        , "./img/svg/search.svg"         , 48)
          .icon("remove"        , "./img/svg/account-remove.svg" , 48)
          .icon("trash"         , "./img/svg/delete.svg"         , 48)
          .icon("circle_close"  , "./img/svg/close-circle.svg"   , 48)
          .icon("refresh"       , "./img/svg/refresh.svg"        , 48)
          .icon("save"          , "./img/svg/content-save.svg"   , 48)
          .icon("print"         , "./img/svg/printer.svg"        , 48)
          .icon("reply"         , "./img/svg/reply.svg"          , 48)
          .icon("group"         , "./img/svg/group.svg"          , 48)
          .icon("plus"          , "./img/svg/plus.svg"           , 48)
          .icon("play"          , "./img/svg/play.svg"           , 48)
          .icon("home"          , "./img/svg/home.svg"           , 48)
          .icon("logout"        , "./img/svg/logout.svg"         , 48)
          .icon("dots-vertical" , "./img/svg/dots-vertical.svg"  , 48)
          .icon("graph"         , "./img/svg/ic_trending.svg"    , 48)
          .icon("bar-chart"     , "./img/svg/chart-bar.svg"      , 48)
          .icon("message"       , "./img/svg/message-alert.svg"  , 48)
          .icon("film"          , "./img/svg/filmstrip.svg"      , 48)
          .icon("credit-card"   , "./img/svg/credit-card.svg"    , 48)
          .icon("instagram"     , "./img/svg/instagram.svg"      , 48)
          .icon("facebook"      , "./img/svg/facebook.svg"       , 48)
          .icon("twitter"       , "./img/svg/twitters.svg"       , 48)
          .icon("shop"          , "./img/svg/shop.svg"           , 48)
          .icon("pencil"        , "./img/svg/pencil.svg"         , 48);

      $mdThemingProvider.theme('default')
          .primaryPalette('light-blue')
          .accentPalette('amber');

      $stateProvider
          .state('login', {
            url         : '/login',
            templateUrl : './templates/login.html',
            controller  : 'LoginCtrl'
          })
          .state('signup', {
            url         : '/signup',
            templateUrl : './templates/signup.html',
            controller  : 'SignupCtrl'
          })
          .state('quickSignup', {
            url         : '/quicksignup?pageType',
            templateUrl : './templates/quickSignup.html',
            controller  : 'QuickSignupCtrl'
          })
          .state('quickSignup2', {
            url         : '/quicksignup2?pageType',
            templateUrl : './templates/quickSignup2.html',
            controller  : 'QuickSignupCtrl'
          })
          .state('dashboard', {
            url         : '/dashboard',
            templateUrl : './templates/dashboard.html',
            controller  : 'DashboardCtrl'
          })
          .state('billing', {
            url         : '/billing',
            templateUrl : './templates/billing.html',
            controller  : 'BillingCtrl'
          })
          .state('market', {
            url         : '/market',
            templateUrl : './templates/market.html',
            controller  : 'MarketCtrl'
          })
          .state('marketItem', {
            url         : '/marketItem',
            templateUrl : './templates/marketplaceItem.html',
            controller  : 'MarketItemCtrl'
          })
          .state('analytics', {
            url         : '/analytics',
            templateUrl : './templates/analytics.html',
            controller  : 'AnalyticsCtrl',
            resolve     : {
              allPatients: ['PatientList', function(PatientList){
                return PatientList.all();
              }],
            }
          }); 
      $urlRouterProvider.otherwise('/login');
    })
    .controller('rootCtrl', ['$scope', '$state', '$mdDialog', 'Session', '$mdSidenav', 'ID', '$http', 
    function($scope, $state, $mdDialog, Session, $mdSidenav, ID, $http){
      $scope.goHome = function(){
        $state.go('dashboard');
      };

      $scope.signOut = function(){
        $http({
          method: 'POST',
          url: 'https://api.truevault.com/v1/auth/logout',
          headers: {
            'Authorization': 'Basic ' + btoa(Session.user.access_token + ':') //this needs to be access_token
          }
        }).then(function successCallback(response) {
          Session.user = {};
          $state.go('login')
        }, function errorCallback(error) {

        });
      };

      $scope.supportDialog = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
          .title('How can we help you?        (920) 430-0252')
          .textContent('Let us know if you have a question or discovered an issue with the program and we will get back to you as soon as we can.')
          .placeholder('Error or Question...')
          .ariaLabel('report')
          .initialValue('')
          .targetEvent(ev)
          .ok('Send Message')
          .cancel('Cancel')
          .openFrom('#left')
          .closeTo(angular.element(document.querySelector('#right')))

        $mdDialog.show(confirm).then(function(result) {
          //SEND EMAIL HERE
          var req = {
            method: 'POST',
            url: ID[Session.user.attributes.AccountType].SupportLink,
            data: {'email': Session.user.attributes.Email,  'message': result}
          }

          $http(req).then(function(data){
          }, function(error){
            console.log(error)
          });
        }, function() {
        });
      };

      $scope.analytics = function(){
        $state.go('analytics');
      }

      $scope.market = function(){
        $state.go('market');
      }


      $scope.billing = function(){
        $state.go('billing')
      }
   
      $scope.toggleSideNav = function(){
        $mdSidenav('left').toggle();
      };

    }]);