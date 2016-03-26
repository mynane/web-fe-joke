define(["public/storage/storage"], function (storage) {
    /*这个controller就是用来存储一些全局变量，也就是只会背初始化一次，然后每次更改都会永久保存状态*/
    calendarApp.controller("BodyController", function ($scope) {
        // $scope.currentCalendarId = "0";
        // $scope.currentChooseDate = $utils.getDateStr(new Date()); //当前选择是哪天的数据
        $scope.headerView = "main-header";
        $scope.bodyView = "main-body";
        // var calendarView = storage.getItem("calendar-view");
        // if(calendarView){
        //     $scope.calendarView = calendarView;
        // }else{
        //     $scope.calendarView = "month-view";
        // }
        // $scope.$watch("calendarView", function(value){
        //     storage.setItem("calendar-view", value);
        // });
        // $scope.bodyScope = $scope;
        // $scope.currentSettingId = 0; //当前设置项0:台历管理,1:标签管理,2:显示设置；默认为0
        // // $scope.settingView = null; // 用于标签管理时，弹出详情框再打开编辑框使用，其他地方都不用

        // //自定义事件
        // $scope.$on("changeRightView", function (event, obj) {
        //     $scope.rightView = obj.view;
        //     $scope.eventDetailId = obj.date;
        //     $scope.isScrollTo = obj.isScrollTo;
        // });
        // //自定义事件
        // $scope.$on("updateCalendarView", function (event, type) { //更新台历视图,不管怎么着,都会重新刷新数据
        //     //菜单聚焦
        //     $("#calendar-left-menu").find(".selected").removeClass("selected");
        //     $("#calendarId" + $scope.currentCalendarId).addClass("selected");
        //     if ($scope.rightView != "calendar-view") {
        //         $scope.rightView = "calendar-view";
        //     } else {
        //         if ($scope.calendarView == "month-view") {
        //             $scope.$broadcast("mouthViewUpdate", type);
        //         } else {
        //             $scope.$broadcast("dayViewUpdate", type);
        //         }
        //     }
        // });
        // //自定义事件（台历列表）
        // $scope.$on("calendarListChange", function (event, string) {
        //     (string === 'change') && $scope.$broadcast("leftCalendarList", string);
        // });
        // //月视图,日视图自适应
        // $scope.newEvent = function (editData) {
        //     require(['public/jingoal-time/jingoal-time'], function () {
        //         if (editData) {
        //             $scope.editEventData = editData;
        //         } else {
        //             $scope.editEventData = null;
        //         }
        //         $utils.createModal("new-event", $scope, function (newEventModal) {
        //             newEventModal.cmd("show");
        //         });
        //         $scope.$digest();
        //     });
        // }
    });
});
