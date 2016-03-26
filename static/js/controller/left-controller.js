define(function () {
    calendarApp.controller("LeftController", function ($scope, $http ,$utils) {
        var bodyScope = $scope.bodyScope;
        bodyScope.leftScope = $scope;
        var calendar = new jingoal_calendar(document.getElementById("left-small-calendar"), {
            callback: function (date) {
                bodyScope.currentChooseDate = date;
                bodyScope.$emit("updateCalendarView");
                bodyScope.$digest();
            }
        });
        bodyScope.$watch("currentChooseDate", function (value) {
            calendar.show(value);
        });
        getLeftCalendarList($scope, $http,$utils);
        //台历管理中发生操作，改变后执行
        $scope.$on("leftCalendarList", function (event, string) {
            (string === 'change') && getLeftCalendarList($scope, $http ,$utils);
        });
        //菜单聚焦的代码
        var currentSelectItem = $("#calendar-left-menu").find(".selected");
        $("#calendar-left-menu").click(function (event) {
            var currentMenu = $(event.target).findParents(".menu1-item-h3") || $(event.target).findParents(".menu2-item");
            if(currentMenu.length > 0){
                $("#calendar-left-menu").find(".selected").removeClass("selected");
                currentMenu.addClass("selected");
            }
        });
        //台历设置
        $scope.calendarSetting = function (event, index) {
            bodyScope.rightView = 'calendar-setting';
        }

        $scope.showCalendar = function (calendarId) {
            bodyScope.currentCalendarId = calendarId;
            bodyScope.$emit("updateCalendarView", {
                type: "changeCalendarId"
            });
        };
        $scope.showSetting = function (settingId) {
            var tempValue = settingId || 0; // 默认为0，扩展可设定一个默认的值为变量
            if (isNaN(tempValue) || tempValue > 2 || tempValue < 0) {
                return false;
            }
            $scope.currentSettingId = tempValue;

            $scope.$emit("changeRightView", {
                'view': 'setting'
            });
        };
    });
    //获取左侧台历列表
    function getLeftCalendarList($scope, $http,$utils) {
        $http({
            url: "/module/calendar//v1/getNavCalendarList.do"
        }).success(function (jsonData) {
            var allUser=$utils.getAllUser();
            var user=allUser[CookieUtil.getItem('uid')];
            for(var i=0;i<jsonData.data.length;i++){
                if(jsonData.data[i].userId<=0){
                    jsonData.data[i].fullName=user;
                    jsonData.data[i].name=user+'的'+jsonData.data[i].name;
                }else{
                    jsonData.data[i].fullName=allUser[jsonData.data[i].userId];
                }
            }
            $scope.calendarList = jsonData.data;
        });
    }
});
