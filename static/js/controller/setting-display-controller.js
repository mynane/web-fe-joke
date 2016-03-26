define(function() {
    calendarApp.controller("SettingDisplayController", function($scope, $http) {
        getDisplayMethod($scope, $http); // 进入界面时便加载当前状态

        $scope.show = function(displayMethod) {
            if (displayMethod !== "all" && displayMethod !== "last") {
                return false;
            }
            // 如果点击的与上次相同，则可不继续请求数据
            if ($scope.currentState === displayMethod) {
                return false;
            }

            setDisplayMethod(displayMethod);
        }

        /*
         * ajax设置当前显示方式
         */
        function setDisplayMethod(displayMethod) {
            // （大于0为平铺——全部显示，反之仅显示最近一次）
            var type = displayMethod === "all" ? 1 : -1;

            $http({
                method: "post",
                url: "/module//calendar/v1/setEventsSpread.do?type=" + type 
            }).success(function(jsonData) {
                if (jsonData.meta.code === 200) {
                    // 修改成功后再赋值当前状态
                    setState(displayMethod);
                    alertTip.show({
                        title: "操作成功"
                    });
                } else {
                    alertTip.show({
                        title: jsonData.meta.message,
                        type: 'warn-red'
                    });
                }
            }).error(function(jsonData) {
                alertTip.show({
                    title: jsonData.meta.message,
                    type: 'warn-red'
                });
            });
        }
        /*
         * ajax获取当前显示方式
         */
        function getDisplayMethod($scope, $http) {
            $http({
                method: "get",
                url: "/module/calendar/v1/tag/repeatShow.do"
            }).success(function(jsonData) {
                if (jsonData.meta.code === 200) {
                    var temp = jsonData.data === 1 ? 'all' : 'last'; //0  仅显示最近一次  1 全部显示
                    setState(temp);
                } else {
                    alertTip.show({
                        title: jsonData.meta.message,
                        type: 'warn-red'
                    });
                }
            }).error(function(jsonData) {
                alertTip.show({
                    title: jsonData.meta.message,
                    type: 'warn-red'
                });
            });
        }

        /*
         * 设置当前状态
         */
        function setState(displayMethod) {
            $scope.currentState = displayMethod;

            // 之所以没有直接设置一个值，以后好扩展。
            $scope.showAll = displayMethod === 'all';
            $scope.showLast = !$scope.showAll;
        }
    });
});
