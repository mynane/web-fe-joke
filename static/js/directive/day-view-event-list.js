define(function () {
    calendarApp.directive('dayViewTodayItem', function ($utils) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                var date = $attr['dayViewTodayItem'];
                var now = new Date($scope.currentChooseDate);
                $scope.$watch("isChooseDay(eventList.date)", function (value) {
                    if (value) {
                        $element.addClass("today");
                        $element[0].scrollIntoView();
                    } else {
                        $element.removeClass("today");
                    }
                }, true);
            }
        }
    });
    calendarApp.directive('comDayViewEventList', function ($utils, $http, $timeout) {
        return {
            restrict: 'A',
            templateUrl: "day-view-event-list",
            scope: true,
            link: function ($scope, $element, $attr) {
                /*
                这个页面有三种状态
                初始化，从前添加，从后添加
                初始化分两种：
                一种是刚进来初始化，一种是从前面添加了很多又初始化（这种初始化是直接改第一个scope元素）
                */
                //当前空白事件的天
                $scope.nullDay = null;
                /*
                保证只有一个新建事件的空白选项
                */
                $scope.$on("removeNullDay", function (event, dayid) {
                    if ($scope.nullDay && dayid != $scope.nullDay) {
                        //检测如果是第一个，就把firstScope 设置为他的下一个标签
                        if ($parentScope.firstScope.$id == $scope.$id) {
                            $parentScope.firstScope = $scope.$$nextSibling;
                        }
                        var nullDayElem = document.getElementById($scope.nullDay);
                        if (nullDayElem) {
                            var nullDayParentElem = nullDayElem.parentNode;
                            if (transtionSupport) {
                                $(nullDayParentElem).css("height", 86);
                                setTimeout(function () {
                                    $(nullDayParentElem).addClass("removeNullDay");
                                    $(eventListElem).bind("transitionend", function () {
                                        nullDayParentElem.parentNode.removeChild(nullDayParentElem);
                                    });
                                }, 50);
                            } else {
                                nullDayParentElem.parentNode.removeChild(nullDayParentElem);
                            }
                        }
                    }
                });
                var transtionSupport = $utils.cssSupport("transition"),
                    eventListElem = $element[0],
                    container = eventListElem.parentNode,
                    $parentScope = $scope.$parent;
                $scope.$on("deleteDayEventItem", function (event, eventId) {
                    var dayeventlists = $scope.dayeventlists;
                    for (var i = 0; i < dayeventlists.length; i++) {
                        for (var j = 0; j < dayeventlists[i].showEvents.length; j++) {
                            if (dayeventlists[i].showEvents[j].id === eventId) {
                                $scope.dayeventlists[i].showEvents.splice(j, 1);
                                break;
                            }
                        }
                        if (dayeventlists[i].showEvents.length == 0) {
                            dayeventlists[i].type = 'nodata';
                        }
                    }
                });
                $scope.$on("updateDayView", function (event, date) {
                    if ($parentScope.firstScope && $scope.$id == $parentScope.firstScope.$id) {
                        $http({
                            method: "post",
                            url: "/module/calendar/v1/event/eventymdList.do",
                            data: JSON.stringify({
                                "currDay": date,
                                "calendarId": $scope.currentCalendarId
                            })
                        }).success(function (jsonData) {
                            if (jsonData.data.hasPre) {
                                var hasData = false;
                                for (var i in jsonData.data) {
                                    if (!/^hasPre|hasNext|newDate$/.test(i)) {
                                        $parentScope.prevDate = i;
                                        hasData = true;
                                        break;
                                    }
                                }
                                if (!hasData) {
                                    $parentScope.prevDate = jsonData.data.newDate;
                                }
                            }
                            if (jsonData.data.hasNext) {
                                $parentScope.nextDate = jsonData.data.newDate;
                            }
                            delete jsonData.data.hasNext;
                            delete jsonData.data.hasPre;
                            delete jsonData.data.newDate;
                            $scope.dayeventlists = fillNullData(jsonData.data, date, "must");
                            setTimeout(function () {
                                document.getElementById("day-view-wrap").scrollTop = 0;
                            }, 200);
                        });
                    } else {
                        $element.remove();
                    }
                });
                var listType = $attr.comDayViewEventList.split("=");
                var type = listType[0];
                if (type == "init") {
                    $parentScope.firstScope = $scope;
                    var date = listType[1];
                    $http({
                        method: "post",
                        url: "/module/calendar/v1/event/eventymdList.do",
                        data: JSON.stringify({
                            "currDay": date,
                            "calendarId": $scope.currentCalendarId
                        })
                    }).success(function (jsonData) {
                        if (jsonData.data.hasPre) {
                            var hasData = false;
                            for (var i in jsonData.data) {
                                if (!/^hasPre|hasNext|newDate$/.test(i)) {
                                    $parentScope.prevDate = i;
                                    hasData = true;
                                    break;
                                }
                            }
                            if (!hasData) {
                                $parentScope.prevDate = jsonData.data.newDate;
                            }
                        }
                        if (jsonData.data.hasNext) {
                            $parentScope.nextDate = jsonData.data.newDate;
                        }
                        delete jsonData.data.hasNext;
                        delete jsonData.data.hasPre;
                        delete jsonData.data.newDate;
                        $scope.dayeventlists = fillNullData(jsonData.data, date, "must");
                        setTimeout(function () {
                            document.getElementById("day-view-wrap").scrollTop = 0;
                        });
                    });
                } else if (type == "prev") {
                    $parentScope.firstScope = $scope;
                    if (transtionSupport) {
                        eventListElem.style.height = "0px";
                        eventListElem.style.overflow = "hidden";
                        eventListElem.style.visibility = "hidden";
                    }
                    var date = listType[1];
                    $http({
                        method: "post",
                        url: "/module/calendar/v1/event/eventymdList.do",
                        data: JSON.stringify({
                            "currDay": date,
                            "calendarId": $scope.currentCalendarId,
                            noFirst: true,
                            type: -1
                        })
                    }).success(function (jsonData) {
                        if (jsonData.data.hasPre) {
                            $parentScope.prevDate = jsonData.data.newDate;
                        }
                        delete jsonData.data.hasNext;
                        delete jsonData.data.hasPre;
                        delete jsonData.data.newDate;
                        $scope.dayeventlists = fillNullData(jsonData.data, $parentScope.prevDate);
                        if (transtionSupport) {
                            setTimeout(function () {
                                var offsetHeight = eventListElem.scrollHeight - 20;
                                eventListElem.style.cssText = "visibility:hidden;margin-top:-" + (offsetHeight) + "px;height:" + offsetHeight + "px";
                                setTimeout(function () {
                                    eventListElem.className = "day-view-event-list";
                                    eventListElem.style.cssText = "visibility:visible;margin-top:0;";
                                    //删除多余的空白选项
                                    $(eventListElem).bind("transitionend", function (event) {
                                        if ($scope.nullDay && event.originalEvent.propertyName == "margin-top") {
                                            $scope.$parent.$broadcast("removeNullDay", $scope.nullDay);
                                        }
                                    });
                                }, 100);
                            }, 0);
                        } else {
                            //删除多余的空白选项
                            if ($scope.nullDay) {
                                $scope.$parent.$broadcast("removeNullDay", $scope.nullDay);
                            }
                        }
                    });
                } else if (type == "next") {
                    var date = listType[1];
                    $http({
                        method: "post",
                        url: "/module/calendar/v1/event/eventymdList.do",
                        data: JSON.stringify({
                            "currDay": date,
                            "calendarId": $scope.currentCalendarId,
                            noFirst: true,
                            type: 1
                        })
                    }).success(function (jsonData) {
                        if (jsonData.data.hasNext) {
                            $parentScope.nextDate = jsonData.data.newDate;
                        }
                        delete jsonData.data.hasNext;
                        delete jsonData.data.hasPre;
                        delete jsonData.data.newDate;
                        $scope.dayeventlists = fillNullData(jsonData.data, $parentScope.nextDate);
                        setTimeout(function () {
                            $(container.parentNode.parentNode).animate({
                                scrollTop: eventListElem.offsetTop
                            }, 500, function () {
                                //删除多余的空白选项
                                if ($scope.nullDay) {
                                    $scope.$parent.$broadcast("removeNullDay", $scope.nullDay);
                                }
                            });
                        }, 0);
                    });
                }
                //填充空数据
                function fillNullData(data, newDate, isMust) {
                    var newData = [];
                    var index = 0;
                    for (var i in data) {
                        var events = data[i];
                        newData.push({
                            date: i,
                            events: events,
                            showMoreBtn: true,
                            showEvents: events.slice(0, 20)
                        });
                    }
                    if (newData.length == 0) {
                        newData.push({
                            date: newDate,
                            type: "nodata"
                        });
                        $scope.nullDay = newDate;
                    } else if (isMust) { //如果这一天也必须存在
                        if (data[newDate] === undefined) {
                            var isMiddle = false;
                            for (var i = 0, len = newData.length; i < len; i++) {
                                if ($utils.diffDate(newData[i].date, newDate)) {
                                    if (i == 0) {
                                        newData.unshift({
                                            date: newDate,
                                            type: "nodata"
                                        });
                                    } else {
                                        newData.splice(i - 1, {
                                            date: newDate,
                                            type: "nodata"
                                        });
                                    }
                                    isMiddle = true;
                                    break;
                                }
                            }
                            if (!isMiddle) {
                                newData.push({
                                    date: newDate,
                                    type: "nodata"
                                });
                            }
                        }
                    }
                    if (isMust) $scope.nullDay = null;
                    return newData;
                }
            }
        }
    });
});
