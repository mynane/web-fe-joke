define(function() {
    /*台历管理控制器*/
    calendarApp.controller("SettingController", function($scope, $http, $utils) {
        var bodyScope = $scope.bodyScope;
        $scope.active = 1; //当前显示的tab
        $scope.checked = 1; //当前显示的跨天事件显示规则1、为全部显示。2、为仅显示最近一次
        $scope.popShow = false; //新事件提示小弹框是否显示，默认不显示
        $scope.managePage = 'manage-detail';
        $scope.isWram=false; //输入框背景色是否改变
        var positionArr = []; //存放位置数组
        var calendarListNum=15;//每页显示几条台历
        var calendarlistPaging=document.getElementById('calendarlistPaging');
        /*
         * 翻页后需滚到页面的顶部
         * 台历管理列表、标签管理列表需要使用
         */
        $scope.scrollToTop = function() {
            var currentElem = document.getElementById("setting_panel");
            if (currentElem) {
                $(currentElem).stop().animate({
                    scrollTop:0
                }, 500);
            }
        }


        //初始页面加载数据
        getCalendarList($scope, $http,$utils, positionArr,paging,calendarListNum);
        //台历列表分页
        $scope.currentPage=1;
        function paging(){
            angular.element(calendarlistPaging).html('');
            $("#calendarlistPaging").jingoalPaging({
                allpages:$scope.pageCalendarListJson.length,
                pageshow:calendarListNum,
                current:$scope.currentPage,
                maxShowPage:5
            },function(page){
                $scope.currentPage=page;
                var index=(page-1)*calendarListNum;
                var commentList=$scope.pageCalendarListJson;
                $scope.pageCalendarList=commentList.slice(index,index+calendarListNum);
                $scope.$digest();

            });
        }
        $scope.tabSwitch = function(event, settingId) {
            var tempValue = settingId || 0; // 默认为0，扩展可设定一个默认的值为变量
            if (isNaN(tempValue) || tempValue > 2 || tempValue < 0) {
                return false;
            }
            $scope.currentSettingId = tempValue;
        };
        $scope.isActive = function(settingId) {
            return $scope.currentSettingId == settingId;
        }
        //当发生变化是时请求函数
        $scope.getCalendarList = function(change,editor) {
            positionArr=[];
            getCalendarList($scope, $http,$utils, positionArr, paging, calendarListNum, change,editor)
        }
        //返回按钮
        $scope.getBack=function($event){
            bodyScope.$emit("updateCalendarView");
        }

        //台历新事件通知
        $scope.switchRemind = function(event, item) {
                if (item.visible) {
                    $http({
                        url: "/module/calendar/v1/" + item.calendar.id + "/remindNewEvent.do",
                        method: "post"
                    }).success(function(jsonData) {
                        if (jsonData.meta.code == 200) {
                            item.awoke = jsonData.data;
                        }
                    });
                }
            }
            //台历显示设置
        $scope.calendarIsShow = function(event, item) {
                $http({
                    url: "/module/calendar/v1/" + item.calendar.id + "/setVisible.do",
                    method: "post"
                }).success(function(jsonData) {
                    if (jsonData.meta.code == 200) {
                        if($scope.pageCalendarList[0].calendar.userId<=0){
                            $scope.getCalendarList();
                        }else{
                            item.visible = !item.visible;
                        }
                        $scope.$emit("calendarListChange", 'change'); //动态边左侧代理列表
                    }
                });
             }
            //台历列表位置改变
        $scope.positionChange = function(event, direction, index) {
                var index=($scope.currentPage-1)*calendarListNum+index;
                var mean = positionArr[index];
                if (direction === -1 && index != positionArr.length - 1) {
                    positionArr[index] = positionArr[index + 1];
                    positionArr[index + 1] = mean;
                    calendarListSort($scope, $http, $utils,direction, index,calendarListNum,paging, positionArr);
                } else if (direction === 1 && index != 0) {
                    positionArr[index] = positionArr[index - 1];
                    positionArr[index - 1] = mean;
                    calendarListSort($scope, $http, $utils, direction, index,calendarListNum, paging, positionArr);
                }
            }
            //新建台历
        $scope.createCalendar = function(event) {
                $scope.remainWord=0;
                $utils.createModal('create-calendar', $scope, function(newEventModal) {
                    newEventModal.cmd("show");
                });
            }
            //查看台历
        $scope.showCalendarDetail = function(event, item) {
            $scope.chooseCalendar = item;
            $scope.clickShowDetail = true;
            $utils.createModal('calendar-detail', $scope, function(newEventModal) {
                newEventModal.cmd("show");
            });
        }
    });

    //台历排序
    function calendarListSort($scope, $http,$utils, direction, index,calendarListNum,callback,positionArr) {
        $http({
            url: "/module/calendar/v1/sort.do",
            data: positionArr,
            method: "post"
        }).success(function(jsonData) {
            if (jsonData.meta.code == 200) {
                var pageCalendarListJson = $scope.pageCalendarListJson;
                var mean = pageCalendarListJson[index];
                if (direction === -1 && index != $scope.pageCalendarListJson.length - 1) {
                        pageCalendarListJson[index] = pageCalendarListJson[index + 1];
                        pageCalendarListJson[index + 1] = mean;
                        if(index%calendarListNum==calendarListNum-1){
                            $scope.currentPage += 1;
                            angular.element(calendarlistPaging).html('');
                            $("#calendarlistPaging").jingoalPaging({
                                allpages:$scope.pageCalendarListJson.length,
                                pageshow:calendarListNum,
                                current:$scope.currentPage,
                                maxShowPage:5
                            },function(page){
                                $scope.currentPage=page;
                                var current=($scope.currentPage-1)*calendarListNum;
                                $scope.pageCalendarList=pageCalendarListJson.slice(current,current+calendarListNum);
                                $scope.$digest();
                            });
                        }
                        var current=($scope.currentPage-1)*calendarListNum;
                        $scope.pageCalendarList=pageCalendarListJson.slice(current,current+calendarListNum);
                } else if (direction === 1 && index != 0) {
                        pageCalendarListJson[index] = pageCalendarListJson[index - 1];
                        pageCalendarListJson[index - 1] = mean;
                        if(index%calendarListNum==0){
                            $scope.currentPage -= 1;
                            angular.element(calendarlistPaging).html('');
                            $("#calendarlistPaging").jingoalPaging({
                                allpages:$scope.pageCalendarListJson.length,
                                pageshow:calendarListNum,
                                current:$scope.currentPage,
                                maxShowPage:5
                            },function(page){
                                $scope.currentPage=page;
                                var current=($scope.currentPage-1)*calendarListNum;
                                $scope.pageCalendarList=pageCalendarListJson.slice(current,current+calendarListNum);
                                $scope.$digest();
                            });
                        }
                        var current=($scope.currentPage-1)*calendarListNum;
                        $scope.pageCalendarList=pageCalendarListJson.slice(current,current+calendarListNum);
                }
                if($scope.pageCalendarList[0].calendar.userId<=0){
                   $scope.getCalendarList();
                }
                $scope.$emit("calendarListChange", 'change'); //动态边左侧代理列表
            }
        });
    }
    //获取台历列表
    function getCalendarList($scope, $http,$utils, positionArr, callback,calendarListNum,change,editor) {
        change==='refresh'&& ($scope.currentPage=1);
        var start=0;
        if(editor==='editor'){
            start=$scope.currentPage-1;
        }
        $http({
            url: "/module/calendar/v1/getCalendarList.do",
            method: "get"
        }).success(function(jsonData) {
            if (jsonData.meta.code == 200) {
                var allUser=$utils.getAllUser();
                var pageCalendarList=jsonData.data.pageCalendarList;
                for(var i=0;i<pageCalendarList.length;i++){
                    var userId=pageCalendarList[i].calendar.userId;
                    positionArr.push(pageCalendarList[i].calendar.id);
                    if(userId<=0){
                        var user=allUser[CookieUtil.getItem('uid')];
                        var calendarName=pageCalendarList[i].calendar.name;
                        pageCalendarList[i].calendar.fullName=user;
                        pageCalendarList[i].calendar.name=user+'的'+calendarName;
                    }else{
                        var userName=allUser[userId];
                        pageCalendarList[i].calendar.fullName=userName;
                    }
                }
                $scope.pageCalendarList = jsonData.data.pageCalendarList.slice(start*calendarListNum,(start+1)*calendarListNum);
                $scope.pageCalendarListJson = jsonData.data.pageCalendarList;
                callback();
            }
        });
        (change === 'change') && $scope.$emit("calendarListChange", 'change'); //动态边左侧代理列表
    }
    //台历管理弹出框控制器
    calendarApp.controller("popCreateCalendar", function($scope, $http, $utils) {
        var parentController = $scope.modalScope;
        var pShareList=parentController.defaultInitSharePersonList;
        var pCreateList=parentController.defaultInitCreatePersonList;
        var chooseCalendar = parentController.chooseCalendar; //选中的台历
        $scope.defaultInitSharePersonList = pShareList ? pShareList : []; //默认参与人
        $scope.defaultIsvisibleMyself=false;//默认是否仅自己可见
        $scope.hidden=false;//选择标签提示是否显示
        $scope.defaultInitCreatePersonList= pCreateList ? pCreateList : [];//事件创建人
        $scope.checkTheWord = function(event) {
                $scope.remainWord = $scope.calendarDescribe.length;
            }
        //人员选择树
        $scope.chooseCreatePerson=function(event){
            $scope.createPersonObj.openSelect();
        }

        //选择事件创建人
        $scope.chooseEventCreate=function(event,isPerm){
            if(isPerm){
                $scope.chooseItem=!$scope.chooseItem;
            }
        }
        $scope.showAdminPanel=function(){
            var adminList = null;
            $scope.adminListStr = "";
            $scope.curAuthorityHead = "有系统管理权限的用户";
            $http({
                method: 'get',
                url: '/module/calendar/v1/systemManagers.do'
            }).success(function(jsonData) {
                if (jsonData.meta.code === 200) {
                    adminList = jsonData.data;
                    $scope.adminListStr = adminList != null && adminList.length != null ? adminList.join(',') : '';
                } else {
                    alert(jsonData.meta.message);
                }
            });
            // 2.打开弹出面板
            $utils.createModal("setting-label-authority", $scope, function(newEventModal) {
                    newEventModal.cmd("show");
                });
        }
        //标签组件引入
        var instanceMarkList;
        $http({
        url: "/module/calendar/v1/tag/tagList.do?currPage=1"
        }).success(function(jsonData) {
            $scope.isPerm=jsonData.data.isPerm;
            if($scope.isPerm){
                $scope.chooseItem=true;
                var subscribeUserIdsStr=$scope.subscribeUserIdsStr;
                if(typeof subscribeUserIdsStr !='undefined' && subscribeUserIdsStr!=''){ 
                 var userId=CookieUtil.getItem('uid');
                    var arr = subscribeUserIdsStr.split(',');
                    for(var i=0;i<arr.length;i++){
                        if(arr[i]==userId){
                            $scope.chooseItem=false;
                        }
                    }
                }
            }else{
                $scope.chooseItem=false;
            }

            instanceMarksList = $("#marks-list-select").jingoal_mark_choose({
                default_mark_title: '选择标签',
                searchAble: true,
                defaultValue:$scope.defaultMarkId,
                mark_list: jsonData.data.tagList.objList
            });
            instanceMarksList.setOption({
                callback: function(obj) {
                    $scope.defaultMarkId = obj.value;
                }
            });
        });
        //创建台历提交
        $scope.confirmCalendar = function(event, type) { 
                var sharePersonStr=getPersonList($scope.sharePersonObj);
                var createPersonStr=getPersonList($scope.createPersonObj);
                var userId=CookieUtil.getItem('uid');
                changeShow();
                if(!$scope.chooseItem){
                    var arr=createPersonStr.split(',');
                    for(var i=0;i<arr.length;i++){
                        if(arr[i]==userId){
                            arr.splice(i,1);
                        }
                    }
                    createPersonStr=arr.join(',');
                    createPersonStr= userId+','+createPersonStr;
                }else{
                    var arr=createPersonStr.split(',');
                    for(var i=0;i<arr.length;i++){
                        if(arr[i]==userId){
                            arr.splice(i,1);
                        }
                    }
                    createPersonStr=arr.join(',');
                }
                if(typeof $scope.defaultMarkId === 'undefined' || $scope.defaultMarkId<1){
                    $scope.hidden=true;
                }else {
                    $scope.hidden=false;
                }
                if(!$scope.thisCanShow){
                    $scope.defaultMarkId=-1;
                    createPersonStr='';
                }
                if ((($scope.thisCanShow && !$scope.hidden) || !$scope.thisCanShow)&& typeof $scope.calendarName != 'undefined' && $scope.calendarName != '' && $scope.remainWord <= 60) {
                    (typeof $scope.calendarDescribe === 'undefined') && ($scope.calendarDescribe = "");
                    var config={};
                    if(type === 'create'){
                        config={
                            url:"/module/calendar/v1/addCalendar.do",
                            data: {
                                "calendar": {
                                    "name": $scope.calendarName,
                                    "descrip": $scope.calendarDescribe,
                                    "tagId": $scope.defaultMarkId
                                },
                                "subscribeUserIdsStr": createPersonStr,
                                "shareUserIdsStr": sharePersonStr
                            },
                            method: "post",
                            callback:function(jsonData){
                                if (jsonData.meta.code == 200) {
                                    if(!parentController.eventNewCalendar){
                                        parentController.getCalendarList('change');
                                    }else{
                                         $scope.$emit("calendarListChange", 'change');
                                         $scope.$emit("newChooseCalendar", {
                                            id:jsonData.data.id,
                                            name:$scope.calendarName
                                         });
                                    }
                                    $scope.closeModal();
                                }
                            }
                        }
                    }else if(type === 'editor'){
                        config={
                            url:"/module/calendar/v1/editCalendar.do",
                            data:{
                                "calendar": {
                                    "id": chooseCalendar.calendar.id,
                                    "name": $scope.calendarName,
                                    "descrip": $scope.calendarDescribe,
                                    "tagId": $scope.defaultMarkId
                                },
                                "subscribeUserIdsStr": createPersonStr,
                                "shareUserIdsStr": sharePersonStr
                            },
                            method: "post",
                            callback:function(jsonData){
                                if (jsonData.meta.code == 200) {
                                    parentController.getCalendarList('change','editor');
                                    $scope.closeModal();
                                    parentController.closeModal();
                                }
                            }
                        }
                    }
                    $http({
                        url: config.url,
                        data: config.data,
                        method: config.method
                    }).success(function(jsonData) {
                        config.callback(jsonData);
                    })
                }else if($scope.remainWord>60){
                    $scope.isWram=true;
                    // setTimeout(function(){
                    //     changeColorFlag();
                    //     clearTimeout(changeColorFlag());
                    // },1000);
                }
            }
            function changeColorFlag(){
                $scope.isWram=false;
                $scope.$digest();
            }
            function changeShow (event) {
                ($scope.calendarName) && ($scope.calendarName = $.trim($scope.calendarName));
                (typeof $scope.calendarName == 'undefined' || $scope.calendarName == '') && ($scope.wramCanShow = true);
            }
            //将人员数组转化成字符串
            function getPersonList(personArr) {
                var personList = personArr.getValue();
                var personListStr = [];
                for (var i = 0; i < personList.length; i++) {
                    personListStr.push(personList[i].id);
                }
                personListStr = personListStr.join(',');
                return personListStr;
            }
          
    })
    calendarApp.controller("showCalendarDetail", function($scope, $http, $utils, $rootScope) {
        var parentController = $scope.modalScope;
        var chooseCalendar = parentController.chooseCalendar; //选中的台历
        if (parentController.clickShowDetail) {
            getCalendarDetail();
        }

        function getCalendarDetail() {
            $http({
                url: "/module/calendar/v1/" + chooseCalendar.calendar.id + "/viewCalendar.do",
                method: "get"
            }).success(function(jsonData) {
                if (jsonData.meta.code == 200) {
                    $scope.pageCalendar = jsonData.data.pageCalendar;
                    $scope.hasPerm = jsonData.data.hasPerm;
                }
            });
        }
       //删除台历
        $scope.deleteCalendar = function($event) {
             $utils.createPrompt({
                    title:"你确定要删除吗"
                },function(){
                $http({
                    url: "/module/calendar/v1/" + chooseCalendar.calendar.id + "/del.do",
                    method: "post"
                    }).success(function(jsonData) {
                    if (jsonData.meta.code == 200) {
                        parentController.getCalendarList('change'); //获取台历列表更新左侧台历列表
                        $scope.closeModal();
                    }
                });
                },function(){});
            }
        //编辑台历
        $scope.editorCalendar = function($event) {
            $scope.isEditor = true;
            $http({
                url: "/module/calendar/v1/" + chooseCalendar.calendar.id + "/editCalendarPre.do",
                method: "get"
            }).success(function(jsonData) {
                if (jsonData.meta.code == 200) {
                   if(jsonData.data.page.calendar.userId<=0){
                        var allUser=$utils.getAllUser();
                        var user=allUser[CookieUtil.getItem('uid')];
                        jsonData.data.page.calendar.name=user+jsonData.data.page.calendar.name;
                    }
                $scope.subscribeUserIdsStr=jsonData.data.page.subscribeUserIdsStr;
                $scope.defaultInitSharePersonList=jsonData.data.checkedShareNodes;
                $scope.defaultInitCreatePersonList=jsonData.data.checkedSubscribeNodes;
                $scope.calendarName = jsonData.data.page.calendar.name;
                $scope.calendarDescribe = jsonData.data.page.calendar.descrip;
                $scope.remainWord=$scope.calendarDescribe.length;
                if (jsonData.data.page.tag) {
                    $scope.tagName = jsonData.data.page.tag.name;
                    $scope.defaultMarkId = jsonData.data.page.tag.id;
                }
                $utils.createModal('create-calendar', $scope, function(newEventModal) {
                    newEventModal.cmd("show");
                    });
                }
            });
        }
    })
});
