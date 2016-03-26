define(['public/drag/drag'], function (createDrag) {
    /*实现拖动功能*/
    var modalWidth,
        modalHeight,
        windowWidth,
        windowHeight,
        bodyView,
        startMargin = {},
        startPointer = {},
        pointerDiff = {},
        modal;
    var drag = createDrag(function (target) {
        if (($(target).hasClass("modal-wrap") || $(target.parentNode).hasClass("modal-title"))&&!$(target).hasClass("close")&&!$(target).findParents(".disable-drag")) {
            return true;
        }
    });
    drag.addEvent("dragstart", function (event) {
        modal = $(event.target).findParents(".modal-wrap")[0];
        modalHeight = modal.offsetHeight;
        modalWidth = modal.offsetWidth;
        var modalPosition = modal.getBoundingClientRect();
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        startMargin.left = parseInt($(modal).css("marginLeft"));
        startMargin.top = parseInt($(modal).css("marginTop"))||0;
        startPointer.x = event.x;
        startPointer.y = event.y;
        pointerDiff.left = event.x - modalPosition.left;
        pointerDiff.right = windowWidth - (modalPosition.right-event.x);
        pointerDiff.top = event.y - modalPosition.top;
        pointerDiff.bottom = windowHeight - Math.min(windowHeight-event.y,modalPosition.bottom-event.y);
    });
    drag.addEvent("drag", function (event) {
        modal.style.marginLeft = startMargin.left + (Math.min(Math.max(event.x, pointerDiff.left), pointerDiff.right)-startPointer.x) + "px";
        modal.style.marginTop = startMargin.top + (Math.min(Math.max(event.y, pointerDiff.top), pointerDiff.bottom)-startPointer.y) + "px";
    });
    calendarApp.directive('comModal', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                $element.css("zIndex",$scope.modalMaskIndex);
                var modalElem = $element[0],
                    modalWidth,
                    modalHeight;
                $(modalElem).addClass("modal-hide");
                $scope.$on("show", function () {
                    modalWidth = modalElem.offsetWidth;
                    modalHeight = modalElem.offsetHeight;
                    modalElem.style.top = "100px";
                    modalElem.style.left = "50%";
                    modalElem.style.marginLeft = -modalWidth / 2 + "px";
                    $(modalElem).removeClass("modal-hide");
                    $(modalElem).addClass("modal-show");
                });
            }
        }
    });
});
