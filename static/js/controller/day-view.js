define(function () {
    calendarApp.controller("DayView", function ($scope, $http, $compile, $utils) {
        var bodyScope = $scope.bodyScope;
        var calendarHeaderHeight = 49;
        $scope.nullNewEvent = null;
        $scope.showEventDetail = function (event) {
            var target = event.target;
            globalModule.popupEventDetail.show(target, {});
        }
        $scope.isChooseDay = function (datestr) {
            var now = new Date($scope.currentChooseDate);
            if (jingoal_calendar_engine.get_date_str(now) == datestr) {
                var today = true;
            }
            return today;
        }
        $scope.$on("dayViewUpdate", function (event, data) {
            //查看当前列表中有没有这一天，有的话就滚动到这里
            var value = bodyScope.currentChooseDate;
            if (data && data.type == "changeCalendarId") {
                $scope.$broadcast('updateDayView', value);
            } else {
                var currentElem = document.getElementById(value),
                    dayWrap = document.getElementById("day-view-wrap");
                if (currentElem) {
                    var offsetTop = currentElem.offsetTop;
                    $(currentElem).stop().animate({
                        scrollTop: offsetTop - 100
                    }, 500);
                } else {
                    $scope.$broadcast('updateDayView', value);
                }
            }

        });
        $scope.firstScope = null;
        $scope.listType = "init=" + bodyScope.currentChooseDate;
        $scope.prevDate = null; //是否有向前查看的按钮
        $scope.nextDate = null; //是否有向后查看的按钮
        $scope.loadPrev = function (prevDate) {
            var list = document.createElement("div"),
                container = document.getElementById("eventListContainer");
            list.setAttribute("com-day-view-event-list", "prev=" + prevDate);
            container.insertBefore(list, container.firstChild);
            $compile(list)($scope);
        }
        $scope.loadNext = function (nextDate) {
                var list = document.createElement("div"),
                    container = document.getElementById("eventListContainer");
                list.setAttribute("com-day-view-event-list", "next=" + nextDate);
                container.appendChild(list);
                $compile(list)($scope);
            }
        //监听onresize事件
        if (!$utils.cssSupport("calc")) {
            var resizeTimer,
                windowHeight = $(window).height();
            angular.element(window).bind("resize", resizeFn = function () {
                //动态改变,计算出的单元格的高度
                windowHeight = $(window).height();
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    changeHeight();
                }, 100);
            });
            //ie下动态改变高度
            function changeHeight(isInit) {
                var tableWrap = document.getElementById("calendar-view-wrap");
                tableWrap.style.height = (windowHeight - calendarHeaderHeight) + "px"; //月视图可变区域的高度
            }
            changeHeight();
            //移除resize事件
            $scope.$on("$destroy", function () {
                //清除配置,不然scroll会重复请求
                angular.element(window).unbind("resize", resizeFn);
            });
        }
    });
});
