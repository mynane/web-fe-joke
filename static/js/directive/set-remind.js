// define(["public/jingoal-time/jingoal-time", "public/jingoal-date/jingoal-choose-date"], function () {
//     calendarApp.directive('setRemind', function ($utils, $http) {
//         return {
//             restrict: 'A',
//             scope: {
//                 "eventData": "=setRemind"
//             },
//             templateUrl: "event-detail-set-remind",
//             link: function ($scope, $element, $attr) {
//                 $scope.editRemind = function () {
//                     $scope.edit = !$scope.edit;
//                 };
//                 //初始化组件
//                 var instanceMarkChoose = $("#set-remind-type-list-select").jingoal_mark_choose({
//                     defaultValue: $scope.type,
//                     mark_list: [{
//                         id: 1,
//                         name: "不提醒"
//                     }, {
//                         id: 2,
//                         name: "前一天"
//                     }, {
//                         id: 3,
//                         name: "同一天"
//                     }, {
//                         id: 4,
//                         name: "指定日期"
//                     }]
//                 });
//                 instanceMarkChoose.setOption({
//                     callback: function (value) {
//                         $scope.type = value.value;
//                         try{
//                             $scope.$digest();
//                         }catch(e){}
//                     }
//                 });
//                 var instanceRemindDate = $("#set-remind-date").jingoal_date_input({
//                     date_format: "yyyy-mm-dd week",
//                     defaultValue: $scope.date,
//                     todayBtn: true,
//                     callback: function (date) {
//                         $scope.date = date;
//                         var tempDate = $utils.parseDate(date);
//                         $scope.year = tempDate.year;
//                         $scope.month = tempDate.month;
//                         $scope.day = tempDate.day;
//                     }
//                 });
//                 var instanceRemindTime = $("#set-remind-time").jingoal_time({
//                     defaultValue: $scope.time,
//                     callback: function (value) {
//                         $scope.time = value;
//                         var tempTime = value.split(":");
//                         $scope.hour = tempTime[0];
//                         $scope.minute = tempTime[1];
//                     }
//                 });
//                 $scope.$watch("eventData", function(value){
//                     $scope.edit = false;
//                     $scope.own = $scope.eventData.pageEvent.own;
//                     console.log($scope.eventData.pageEvent.event.awoke);
//                     if (!$scope.eventData.pageEvent.event.awoke) {
//                         $scope.type = 1;
//                         if ($scope.own) {
//                             $scope.noremind = "未设置提醒";
//                         } else {
//                             $scope.noremind = "目前只有事件创建人可用，仅提醒事件参与人";
//                         }
//                     } else {
//                         var eventAwoke = $scope.eventData.pageEvent.eventAwoke;
//                         $scope.type = eventAwoke.type;
//                         if ($scope.type == 3) {
//                             $scope.date = eventAwoke.fullAwokeTime;
//                             var date = $utils.parseDate($scope.date);
//                             $scope.year = date.year;
//                             $scope.month = date.month;
//                             $scope.day = date.day;
//                         }
//                         $scope.time = eventAwoke.fullTime;
//                         var time = $scope.time.split(":");
//                         $scope.hour = time[0];
//                         $scope.minute = time[1];
//                     }
//                     instanceMarkChoose.setValue($scope.type);
//                     instanceRemindDate.setValue($scope.date);
//                     instanceRemindTime.setValue($scope.time);
//                 });
//                 $scope.submitRemind = function () {
//                     //获取时间戳
//                     var remindDate = 0,
//                         eventData = $scope.eventData.pageEvent.event;
//                     if ($scope.type == 3) {
//                         remindDate = new Date($scope.date + " " + $scope.time)*1;
//                     } else {
//                         if ($scope.type == 1) {
//                             remindDate = eventData.beginDate - 24 * 60 * 60 * 1000;
//                         }else{
//                             remindDate = eventData.beginDate;
//                         }
//                         remindDate = new Date($utils.getDateStr(new Date(remindDate)) + " " + $scope.time)*1;
//                     }
//                     $http({
//                         url: "/module/calendar/v1/event/setRemind.do",
//                         method:"post",
//                         data: {
//                             type: $scope.type,
//                             hour: $scope.hour,
//                             minute: $scope.minute,
//                             infoLevel: 1,
//                             eventId: $scope.eventData.pageEvent.event.id,
//                             awokeTime: remindDate
//                         }
//                     }).success(function(jsonData){
//                         if(jsonData.meta.code == 200)
//                             $scope.edit = false;
//                     });
//                 }
//                 $scope.cancelRemind = function () {
//                     $scope.edit = false;
//                 }
//             }
//         }
//     });
// });
