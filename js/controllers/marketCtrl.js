angular.module('pt.controllers.market', [])
  .controller('MarketCtrl', ['$scope','$state','Session','Market',
    function($scope, $state, Session, Market){
      
      $scope.marketItems = [
        {
            ID: '3', Title: 'Ankle Sprain', Author: 'The Prehab Guys', AuthorIcon: './img/p.png', AuthorID: '2', 
            Description: 'Ankle sprains are very common injuries. There is a good chance that while playing as a child or stepping on an uneven surface.',
            CoverImg: './img/prehab2.png', Price: 19.99, Sale: true, SalePrice: 0, Stars: 5, Ratings: 18
        },
        {
            ID: '2', Title: 'ARMageddon', Author: 'Health Connection', AuthorIcon: './img/snaps.png', AuthorID: '1', 
            Description: 'ARMageddon... Need I say more?',
            CoverImg: './img/arm.jpg', Price: 19.99, Sale: false, SalePrice: 0, Stars: 4, Ratings: 8
        },
        {
            ID: '1', Title: 'Total Knee', Author: 'Health Connection', AuthorIcon: './img/snaps.png', AuthorID: '1', 
            Description: 'This library covers everything knee. Form inner knee to outter knee, you will find it here!',
            CoverImg: './img/knee.jpg', Price: 19.99, Sale: false, SalePrice: 0, Stars: 4, Ratings: 11
        }
      ]

      $scope.viewItem = function(item){
        Market.selectedItem = item;
        $state.go('marketItem');
      }

    }]);