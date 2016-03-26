define(function(){
    calendarApp.directive('ngTemplate',function(){
        return {
          restrict: 'A',
          templateUrl: function(element, attr) {
            return attr.ngTemplate;
          }
        }
    });
});