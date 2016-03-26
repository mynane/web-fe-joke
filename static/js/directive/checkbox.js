define(['public/drag/drag'], function (createDrag) {
    calendarApp.directive('comCheckbox', function () {
        return {
            restrict: "A",
            transclude: true,
            scope:true,
            link: function(scope, element, attrs) {
                scope.label = attrs.label;
                var checkboxElem = element[0].getElementsByTagName("input")[0];
                scope.checked = element[0].getAttribute("checked")!=null?true:false;
                if(scope.$parent[attrs["checkid"]]){
                    scope.checked = scope.$parent[attrs["checkid"]];
                }
                angular.element(checkboxElem).bind("change",function(){
                    scope.checked= !scope.checked;
                    scope.$parent[attrs["checkid"]] = scope.checked;
                    scope.$parent.$digest();
                });
                scope.$parent[attrs["checkid"]] = scope.checked;
                if(browser.ieVersion < 9){
                    element.bind("click",function(){
                        checkboxElem.click();
                    });
                }
            },
            templateUrl: "com-checkbox"
        }
    });
});
