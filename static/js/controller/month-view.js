define(function () {
    calendarApp.controller("MonthViewController", function ($scope, $http, $utils) {
        var bodyScope = $scope.bodyScope;
        var isDynamicChangeHeight = browser.firefox||browser.ie;
        //这是显示事件详情
        $scope.showEventDetail = function (event) {
            var target = event.target;
            globalModule.popupEventDetail.show(target, {});
        }
        $scope.focusThisDay = function (event) {
            var currentTarget = event.currentTarget;
            bodyScope.currentChooseDate = currentTarget.getAttribute("data-date");
            changeFocusDay(bodyScope.currentChooseDate);
        }
        var currentDateObj,
            currentChooseTd,
            currentShowMonth,
            dates,
            monthViewDates,
            monthViewTableRows, //表格的行数
            monthViewTheadHeight = 30, //表格头部的高度
            calendarHeaderHeight = 49, //月视图,日视图,header导航的高度
            windowHeight = $(window).height(),
            minTdHeight = 72; //窗口高度
        $scope.calendarHeaderHeight = calendarHeaderHeight; //全部列表框的可用高度
        $scope.windowHeight = windowHeight;
        viewInit();
        $scope.$on("redrawMonthView", function (event, monthdate) {
            viewInit(monthdate);
        });
        $scope.$on("mouthViewUpdate", function (event,data) {
            var value = bodyScope.currentChooseDate;
            if((data&&data.type=="changeCalendarId")||(!data&&document.getElementById(value)==null)){
                var obj = $utils.parseDate(value);
                viewInit(obj.year+"/"+obj.month);
            }else{
                //如果月份相同,就仅仅改变class,否则就刷新整个月视图
                changeFocusDay(value);
            }
        });
        function changeFocusDay(date) {
            var calendarWrap = document.getElementById("calendar-view-wrap");
            var tds = calendarWrap.getElementsByTagName("td");
            for (var i = 0, len = tds.length; i < len; i++) {
                if (tds[i].getAttribute("data-date") == date) {
                    $(currentChooseTd).removeClass("focus");
                    $(tds[i]).addClass("focus");
                    currentChooseTd = tds[i];
                    break;
                }
            }
        }
        //获取当前聚焦的天
        function getFocusDay() {
            var calendarWrap = document.getElementById("calendar-view-wrap");
            var tds = calendarWrap.getElementsByTagName("td");
            for (var i = 0, len = tds.length; i < len; i++) {
                if ($(tds[i]).hasClass("focus")) {
                    currentChooseTd = tds[i];
                    break;
                }
            }
        }
        //视图初始化函数
        function viewInit(monthdate) {
            currentDateObj = $utils.parseDate(bodyScope.currentChooseDate);
            if (!monthdate) {
                monthdate = currentDateObj.year + "/" + currentDateObj.month;
            }
            currentShowMonth = monthdate;
            //判断是否是当前月,如果是当前月,则有聚焦的天,否则没有聚焦的天
            if (monthdate == currentDateObj.year + "/" + currentDateObj.month) {
                var chooseDay = currentDateObj.day;
            }
            dates = jingoal_calendar_engine.get_current_month_day_array(monthdate, chooseDay,{firstWeekDay:1});
            monthViewDates = getMonthViewData(dates);
            monthViewTableRows = monthViewDates.length; //表格的行数
            //计算单元格的高度
            $scope.defaultTdHeight = (windowHeight - calendarHeaderHeight - monthViewTheadHeight - monthViewTableRows) / monthViewDates.length;
            //月视图的结构数据
            $scope.monthViewDates = monthViewDates;
            if (isDynamicChangeHeight) {
                changeHeight(true);
            }
            //先显示视图,然后ajax请求数据,就通知所有的列表指令,初始化列表
            $http({
                method: "post",
                url: "/module/calendar/v1/event/eventList.do",
                data: JSON.stringify({
                    "days": (function () {
                        var newArr = [];
                        for (var i = 0, len = dates.length; i < len; i++) {
                            newArr.push(dates[i].date);
                        }
                        return newArr;
                    }()),
                    "currDay": monthdate,
                    "calendarId": $scope.currentCalendarId
                })
            }).success(function (jsonData) {
                var data = jsonData.data;
                $scope.$broadcast('eventlistinit', data);
            });
            setTimeout(function () {
                getFocusDay();
            }, 0);
        }
        //监听onresize事件
        var resizeTimer;
        angular.element(window).bind("resize", resizeFn = function () {
            //动态改变,计算出的单元格的高度
            windowHeight = $(window).height();
            $scope.windowHeight = windowHeight;
            var tempHeight = (windowHeight - calendarHeaderHeight - monthViewTheadHeight - monthViewTableRows) / monthViewDates.length;
            $scope.defaultTdHeight = tempHeight < minTdHeight ? minTdHeight : tempHeight;
            if (isDynamicChangeHeight) {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    changeHeight();
                }, 100);
            } else {
                $scope.$broadcast('resize', $scope.defaultTdHeight);
            }
        });
        //ie下动态改变高度
        function changeHeight(isInit) {
            var tableWrap = document.getElementById("calendar-view-wrap");
            tableWrap.style.height = (windowHeight - calendarHeaderHeight) + "px"; //月视图可变区域的高度
            setTimeout(function () {
                if (isDynamicChangeHeight) {
                    //根据视窗高度计算td的高度,进行赋值
                    var tdHeight = $scope.defaultTdHeight;
                    var tds = tableWrap.getElementsByTagName("table")[0].tBodies[0].getElementsByTagName("td");
                    for (var i = 0, len = tds.length; i < len; i++) {
                        tds[i].style.height = tdHeight + "px";
                    }
                    if (!isInit) { //如果不是初始化,就是resize事件
                        $scope.$broadcast('resize', tdHeight);
                    }
                }
            }, 0);
        }
        //移除resize事件
        $scope.$on("$destroy", function () {
            //清除配置,不然scroll会重复请求
            angular.element(window).unbind("resize", resizeFn);
        });


    });

    function getMonthViewData(dates) {
        var monthViewDates = [];
        for (var i = 0, len = dates.length; i < len; i += 7) {
            var newArr = [];
            for (var j = 0; j < 7; j++) {
                newArr.push(dates[i + j]);
            }
            monthViewDates.push(newArr);
        }
        return monthViewDates;
    }
    calendarApp.filter('monthViewDateTitle', function ($utils) {
        return function (datestr) {
            var dateObj = $utils.parseDate(datestr);
            if (dateObj.day == 1) {
                return dateObj.month + "月" + dateObj.day + "日";
            } else {
                return dateObj.day;
            }
        }
    });
});
