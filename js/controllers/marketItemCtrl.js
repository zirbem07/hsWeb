angular.module('pt.controllers.marketItem', [])
  .controller('MarketItemCtrl', ['$scope','$state','Session','Market',
    function($scope, $state, Session, Market){
     
      $scope.itemInfo = Market.selectedItem;

      $scope.playVideo = function() {
        //   alert("alright, alright, i play video")
      }

      $scope.authors = [
          {
              Name: 'Health Connection', Img: './img/snapsCover.png', Description: 'Health Connection has long been a mover in the physical therapy industry and has been creating HD video content since 2014.',
              Twitter: 'https://twitter.com/HealthSnaps', Facebook: 'https://www.facebook.com/healthsnaps/', Instagram: 'https://www.instagram.com/myhealthsnaps/'
          },
          {
              Name: 'The Prehab Guys', Img: './img/prehab.png', Description: 'Optimizing human movement and performance, promoting longevity, and keeping your movement system in tune.',
              Twitter: 'https://twitter.com/ThePrehabGuys/', Facebook: 'https://www.facebook.com/ThePrehabGuys/', Instagram: 'https://www.instagram.com/ThePrehabGuys/'
          }
      ]

      $scope.author = $scope.authors[$scope.itemInfo.AuthorID -1 ];
      $scope.imgURL = $scope.author.Img;
    }]);