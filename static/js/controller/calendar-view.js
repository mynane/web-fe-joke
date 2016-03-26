define(function () {
    calendarApp.controller("CalendarView", function ($scope, $http, $utils) {
        var bodyScope = $scope.bodyScope;
        $scope.calendarView = bodyScope.calendarView; //当前是日视图还是月视图
        bodyScope.calendarScope = $scope;
        var monthViewShowDate = null;
        $scope.monthView = function () {
            $scope.calendarView = bodyScope.calendarView = "month-view";
        }
        $scope.dayView = function () {
            $scope.calendarView = bodyScope.calendarView = "day-view";
        }
        $scope.goToday = function(){
            bodyScope.currentChooseDate = $utils.getDateStr(new Date());
            bodyScope.$emit("updateCalendarView");
        }
        $scope.loadPrev = function () {
            if ($scope.calendarView === "day-view") { //如果是日视图
                bodyScope.currentChooseDate = jingoal_calendar_engine.get_prev_day(bodyScope.currentChooseDate);
                $scope.currentShowDate = parseDayViewDateTitle(bodyScope.currentChooseDate);
                $scope.$broadcast("dayViewUpdate");
            } else if ($scope.calendarView === "month-view") { //如果是月视图
                var prevMonth = jingoal_calendar_engine.get_prev_month(monthViewShowDate);
                $scope.currentShowDate = parseMonthViewDateTitle(prevMonth);
                $scope.$broadcast("redrawMonthView",prevMonth);
            }
        }
        $scope.loadNext = function () {
            if ($scope.calendarView === "day-view") {
                bodyScope.currentChooseDate = jingoal_calendar_engine.get_next_day(bodyScope.currentChooseDate);
                $scope.currentShowDate = parseDayViewDateTitle(bodyScope.currentChooseDate);
                $scope.$broadcast("dayViewUpdate");
            } else if ($scope.calendarView === "month-view") {
                var nextMonth = jingoal_calendar_engine.get_next_month(monthViewShowDate);
                $scope.currentShowDate = parseMonthViewDateTitle(nextMonth);
                $scope.$broadcast("redrawMonthView",nextMonth);
            }
        }
        $scope.$watch("calendarView", function (value) {
            if (value == "day-view") {
                $scope.currentShowDate = parseDayViewDateTitle(bodyScope.currentChooseDate);
            } else {
                $scope.currentShowDate = parseMonthViewDateTitle(bodyScope.currentChooseDate);
            }
        });
        bodyScope.$watch("currentChooseDate", function (value) {
            if ($scope.calendarView == "month-view") {
                $scope.currentShowDate = parseMonthViewDateTitle(value);
            }else{
                $scope.currentShowDate = parseDayViewDateTitle(value);
            }
        });
        function parseDayViewDateTitle(value) {
            var nowObj = $utils.parseDate(value);
            return nowObj.year + "年" + nowObj.month + "月" + nowObj.day + "日" + " (" + jingoal_calendar_engine.get_day_week(nowObj.day, nowObj.year + "/" + nowObj.month) + ")";
        }
        function parseMonthViewDateTitle(value) {
            var nowObj = $utils.parseDate(value);
            monthViewShowDate = nowObj.year+"/"+nowObj.month;
            return nowObj.year + "年" + nowObj.month + "月";
        }
    });
});
