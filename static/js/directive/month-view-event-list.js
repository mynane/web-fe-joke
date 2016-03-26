define(function () {
    calendarApp.directive('comMonthViewEventList', function ($utils) {
        return {
            restrict: 'A',
            templateUrl: "month-view-event-list",
            link: function ($scope, $element, $attr) {
                var tdDate = $scope.date.date,
                    eventList = [],
                    listStatus = "collapse",
                    etBox,
                    td,
                    containerElem,
                    oldLength = null,
                    bodyClick;

                //监听事件
                $scope.showAllEvent = function (event) {
                    listStatus = "open";
                    var target = event.target;
                    etBox = $(target).parents(".et-box")[0];
                    td = $(target).parents("td")[0];
                    containerElem = $(etBox).parents(".mv-container")[0];
                    //计算完全显示列表最少需要多少高度
                    var allTotal = eventList.length * 22 + 28 + 2;
                    containerElem.style.overflow = "hidden";
                    var cssText = "";
                    //计算td下方的高度是否可用
                    var tdOffset = td.getBoundingClientRect();
                    //先计算左边
                    var windowWidth = $(window).width();
                    if(windowWidth - tdOffset.left<255){
                        cssText += "right:0px;";
                    }
                    var tdTop = tdOffset.top;
                    availableHeight = $scope.windowHeight - tdTop - 1;
                    if (availableHeight >= allTotal) { //如果高度可用
                        cssText += "top:"+(tdTop - $scope.calendarHeaderHeight)+"px;height:"+allTotal+"px";
                    } else { //如果高度不可用
                        cssText += "top:"
                                +Math.max(tdTop - $scope.calendarHeaderHeight - (allTotal - availableHeight) - 2, 0)
                                +"px;height:"
                                +Math.min($scope.windowHeight - $scope.calendarHeaderHeight - 2, allTotal)
                                +"px;";
                    }
                    etBox.style.cssText = cssText;
                    //让弹出框相对于container布局
                    $(td).removeClass("collapse");
                    $(td).addClass("showall");
                    $scope.eventList = eventList;
                    setTimeout(function(){
                        //监听body体关闭事件
                        $(document).bind("click", bodyClick = function (event) {
                            var target = event.target;
                            if (!($element[0].contains(target) || $(target).parents("#calendar-event-detail").length > 0)) {
                                closeList();
                            }
                        });
                    },0);
                };
                $scope.$on('resize', function (event, tdHeight) {
                    if (listStatus == "collapse") {
                        repaint(tdHeight, function () {
                            $scope.$digest();
                        });
                    } else {
                        closeList();
                    }
                });
               
                /*列表初始化*/
                $scope.$on('eventlistinit', function (event, eventData) {
                    eventList = eventData[tdDate] ? eventData[tdDate] : [];
                    eventList.push({
                        type: "new"
                    });
                    repaint($scope.defaultTdHeight, function () {});
                });

                //监听自定义事件，来源预览弹出框
                $scope.$on("deleteMonthEventItem", function (event, eventId) {
                    for(var i=0; i<eventList.length; i++){
                        if(eventList[i].id===eventId){
                            eventList.splice(i,1);
                            oldLength=null;
                            closeList(true);
                            break;
                        }
                    }

                });
                //获取当前每个单元格能显示几条数据
                function repaint(tdHeight, callback) {
                    var maxItemLength = (tdHeight - 28) / 22;
                    var floorLength = Math.floor(maxItemLength)
                    if (maxItemLength - floorLength > 0.72) {
                        maxItemLength = Math.ceil(maxItemLength);
                    } else {
                        maxItemLength = floorLength;
                    }
                    if (oldLength != maxItemLength) {
                        if (eventList.length > maxItemLength) {
                            var tempArr = eventList.slice(0, maxItemLength - 1);
                            tempArr.push({
                                type: "btn",
                                hiddens: eventList.length - maxItemLength
                            });
                            $scope.eventList = tempArr;
                        } else {
                            $scope.eventList = eventList;
                        }
                        oldLength = maxItemLength;
                        callback && callback();
                    }
                }
                /*
                关闭大框
                isDigest 是否需要重新检查检查，如果是ng-click出发的事件，就不需要重新检查
                */
                function closeList(isDigest) {
                    listStatus = "collapse";
                    oldLength = null;
                    repaint($scope.defaultTdHeight, function () {
                        if(!isDigest) $scope.$digest();
                    });
                    containerElem.style.overflow = "auto";
                    etBox.style.top = "auto";
                    etBox.style.height = "auto";
                    etBox.style.right = "auto";
                    $(td).removeClass("showall");
                    $(td).addClass("collapse");
                    $(document).unbind("click", bodyClick);
                }
            }
        }
    });
});
