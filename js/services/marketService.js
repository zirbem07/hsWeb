angular.module('pt.services.market', []) 
  .factory('Market', function() {
    
    return {
        selectedItem: {
            'ID': 0,
            'Title': '',
            'Description': '',
            'Stars': 0,
            'Ratings': 0
        }
    }

  });