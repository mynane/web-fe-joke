define(function() {
    calendarApp.directive('comEventDetailPopup', function($http, $utils) {
        var prevClickCache = null;
        var oBody = document.body;
        var calendarEventDetail = document.getElementById('calendar-event-detail');
        var oParent=null;
        return {
            restrict: 'A',
            replace: true,
            templateUrl: "event-detail-popup",
            scope: true,
            link: function($scope, $element, $attr) {
                var bodyScope = $scope.$parent.bodyScope;
                var returnValue = {
                    show: function(target, data) {
                        var _parent = $(target).parents('.transformation_dialog');
                        var calendarEventDetail = $('#calendar-event-detail');
                        $scope.parent = _parent[0];
                        $scope.calendarEventDetail = calendarEventDetail;
                        var id = _parent.data('id');
                        var prevId = 0;
                        var obj = {
                            _parent: _parent,
                            _distanceLeft: 120, //日视图弹出框left偏移值
                            arrowDefaultTop: 60, //默认小三角所在位置
                            view: $attr.comEventDetailPopup
                        };
                        if (obj.view) {
                            obj.arrowDefaultTop = 36;
                            obj.td = $(target).parents('td');
                            _parent = $(target).parents('li');
                            $scope.parent = $(target).parents('li')[0];
                        }
                        oParent=_parent;
                        //阻止事件冒泡
                        angular.element(calendarEventDetail).unbind('click').bind('click', function(event) {
                            event.stopPropagation();
                        });

                        angular.element(oBody).unbind('click').bind('click', eventDetailHidden);

                        function eventDetailHidden() {
                            angular.element(prevClickCache).removeClass('selected');
                            if ($scope.id == id) {
                                if (calendarEventDetail.css('visibility') == 'visible') {
                                    calendarEventDetail.css('visibility', 'hidden');
                                    prevClickCache = null;
                                }
                            }
                        }

                        if (_parent[0] == prevClickCache) {
                            calendarEventDetail.css('visibility', 'hidden');
                            angular.element(prevClickCache).removeClass('selected');
                            prevClickCache = null;
                        } else {
                            $http({
                                method: "get",
                                url: "/module/calendar/v1/event/eventPreview.do?id=" + id
                            }).success(function(jsonData) {
                                if (jsonData.meta.code == 200) {
                                    $scope.data = jsonData.data;
                                    $scope.id = jsonData.data.event.id;
                                    prevClickCache = _parent[0];
                                    setTimeout(function() {
                                        createP(obj);
                                        calendarEventDetail.css('visibility', 'visible');
                                    })

                                    angular.element(_parent).removeClass('selected').addClass('selected');
                                }
                            });
                        }
                    }
                };
                //事件预览弹出框删除事件
                $scope.deleteEvent = function($event) {
                    var nodeName = $scope.parent.nodeName.toLowerCase();
                    $utils.createPrompt({
                        title:"你确定要删除吗"
                    },function(){
                    $http({
                        method: "post",
                        url: "/module/calendar/v1/event/del.do?id=" + $scope.id
                    }).success(function(jsonData) {
                        if (jsonData.meta.code === 200) {
                            angular.element($scope.calendarEventDetail).css('visibility', 'hidden');
                            //新建事件监听，
                            if (nodeName == 'tr') {
                                bodyScope.$broadcast("deleteDayEventItem", $scope.id);
                            } else if (nodeName == 'li') {
                                bodyScope.$broadcast("deleteMonthEventItem", $scope.id);
                            }
                        }
                    });
                    },function(){});
                }
                $scope.showDetail = function($event, scrollTo) {
                    var isScrollTo = scrollTo ? true : false;
                    $scope.$emit("changeRightView", {
                        'view': 'event-detail-page',
                        'date': $scope.id,
                        'isScrollTo': isScrollTo
                    });
                    angular.element(oBody).unbind('click');
                }
                $scope.editEvent = function() {
                    $http({
                        method:"get",
                        url:"/module/calendar/v1/event/editEventPre.do?id="+$scope.data.event.id
                    }).success(function(jsonData){
                        $('#calendar-event-detail').css('visibility','hidden');
                        angular.element(oParent[0]).removeClass('selected');
                        prevClickCache=null;
                        $scope.newEvent(jsonData.data);
                    });
                }
                //事件详情预览查看引用
                $scope.getQuoteDetail = function(event, data) {
                    //触发事件
                    $scope.quoteListClick = true;
                    $scope.eventId=$scope.id;
                    //传参
                    $scope.quoteFileDate = data;
                    if (data.type === 1) {
                        $scope.temp = "detail-memo-dialog";
                    } else if (data.type === 2) {
                        $scope.temp = "detail-plan-dialog";
                    }
                    $utils.createModal($scope.temp, $scope, function(newEventModal) {
                        newEventModal.cmd("show");
                    });
                }
                globalModule.popupEventDetail = returnValue;
            }
        }
    });
    /**
     * 确定弹出框位置
     * @param  {[boject]} object 
     * @return {[type]}        [description]
     */
    function createP(object) {
        var el = $('#calendar-event-detail');
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var $parent = object._parent,
            $child = $parent.children('.transformation_point'),
            $arrow = el.children('.arrow'),
            DetailOffsetWidth = el[0].offsetWidth,
            DetailOffsetHeight = el[0].offsetHeight,
            _parentBodyPosition = gGetRect(object._parent[0]);
        var targetBottomHeight = windowHeight - _parentBodyPosition.bottom;
        var EventBottomHeight = DetailOffsetHeight - object.arrowDefaultTop;
        $arrow.css('top', object.arrowDefaultTop);
        if (object.view) { //与视图弹框显示
            var tdOffsetWidth = object.td[0].offsetWidth;
            var tdRight = windowWidth - _parentBodyPosition.right;
            var left, top;
            if (tdRight < DetailOffsetWidth) {
                left = _parentBodyPosition.left - DetailOffsetWidth;
                angular.element(el).removeClass('left').addClass('right');
            } else {
                left = _parentBodyPosition.left + tdOffsetWidth;
                angular.element(el).removeClass('right').addClass('left');
            }
            if (targetBottomHeight < EventBottomHeight) {
                top = windowHeight - DetailOffsetHeight;

                $arrow.css('top', DetailOffsetHeight - targetBottomHeight - 12);
            } else {
                top = _parentBodyPosition.top - $parent[0].offsetHeight - 6;
            }
            angular.element(el).css({
                left: left,
                top: top
            });
        } else { //日视弹框图显示
            var _top = getOffsetOfDayview($child[0]).top;
            var _left = getOffsetOfDayview($child[0]).left;
            var _parentOuterHeight = $parent.outerHeight();
            var _targetBottomHeight = DetailOffsetHeight - (windowHeight - _parentBodyPosition.top);
            //设置弹出框的位置
            el.css({
                left: _left + object._distanceLeft,
                top: _top - _parentOuterHeight
            })
            if (targetBottomHeight < DetailOffsetHeight - object.arrowDefaultTop) {

                angular.element(el).css({
                    top: _top - _targetBottomHeight
                });
                $arrow.css('top', _targetBottomHeight + object._parent[0].offsetHeight / 2);
            }
        }
    }
    /**
     * 获取元素相对指定父元素的top值和left值
     * @param  {[element]} trELem 目标元素
     * @return {[object]}        目标元素相对于父元素的left，top值
     */
    function getOffsetOfDayview(trELem) {
        var parent = trELem,
            result = {
                top: 0,
                left: 0
            },
            dayView = document.getElementById('day-view-wrap');
        while (parent && parent != dayView) {
            result.top += parent.offsetTop;
            result.left += parent.offsetLeft;
            parent = parent.offsetParent;
        }
        return result;
    }

    function gGetRect(element) {
        var rect = element.getBoundingClientRect();
        var top = document.documentElement.clientTop; // 非IE为0，IE为2
        var left = document.documentElement.clientLeft; // 非IE为0，IE为2
        //对getBoundingClientRect做兼容
        rect.top = rect.top - top,
            rect.bottom = rect.bottom - top,
            rect.left = rect.left - left,
            rect.right = rect.right - left
        return rect;
    }

});
