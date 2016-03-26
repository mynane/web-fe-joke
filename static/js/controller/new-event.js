define(function() {
    calendarApp.controller("NewEvent", function($scope, $http, $utils, $element) {
        var bodyScope = $scope.bodyScope;
        //默认值
        $scope.defaultEventTitle="";//事件名称
        $scope.defaultCalendarId=bodyScope.currentCalendarId;//默认台历
        $scope.defaultEventId="";//默认事件
        $scope.defaultMarkId=-1;//默认标签
        $scope.defaultStartDate=bodyScope.currentChooseDate;//默认开始日期
        $scope.defaultEndDate=undefined;//默认结束日期
        $scope.defaultStartTime=undefined;//默认开始时间
        $scope.defaultEndTime=undefined;//默认结束时间
        $scope.defaultIsFullDay=false;//默认是否全天
        $scope.defaultInitPersonList=[];//默认参与人
        $scope.defaultIsvisibleMyself=false;//默认是否仅自己可见
        $scope.defaultRepeatType=0;//默认重复方式
        $scope.defaultEndRepeatType=1;//默认结束重复方式
        $scope.defaultRepeatEndDate=undefined;//默认结束日期
        $scope.defaultEndTimes=1;//默认结束次数
        $scope.defaultEndRemindType=1;//默认到期提醒方式
        $scope.defaultEndRemindDate=undefined;//默认到期提醒日期
        $scope.defaultEndRemindTime=undefined;//默认到期提醒时间
        $scope.boxIsCanShow=false; //引入计划和备忘弹框是否显示
        $scope.quotesList=[]; //引用列表
        $scope.eventBoxTitle='新建'; //弹出框名称
        //根据编辑数据,重新设置默认值
        if($scope.editEventData){
            $scope.eventBoxTitle='编辑';
            var editEventData = $scope.editEventData.pageEvent;
            $scope.defaultEventId = editEventData.event.id;
            $scope.defaultEventTitle = editEventData.event.content;
            $scope.defaultCalendarId = editEventData.calendarId;
            $scope.defaultMarkId = editEventData.event.tagId;
            $scope.defaultStartDate = editEventData.event.longBeginTime;
            $scope.defaultEndDate = editEventData.event.longEndTime;
            $scope.defaultIsFullDay = editEventData.event.allday;
            if(!$scope.defaultIsFullDay){
                $scope.defaultStartTime = editEventData.event.shortBeginTime;
                $scope.defaultEndTime = editEventData.event.shortEndTime;
            }
            if(editEventData.participatorIdsStr != ""){
                var allUserss = $utils.getAllUser();
                var users = editEventData.participatorIdsStr.split(",");
                for(var i=0,len=users.length;i<len;i++){
                    $scope.defaultInitPersonList.push({
                        id:users[i],
                        name:allUserss[users[i]]
                    });
                }
            }
            $scope.defaultIsvisibleMyself = !editEventData.event.open;
            if(editEventData.event.repeat){
                $scope.defaultRepeatType = editEventData.repeat.repeatType;
                $scope.defaultEndRepeatType = editEventData.repeat.repeatEndType;
                $scope.defaultRepeatEndDate = $utils.getDateStr(new Date(editEventData.repeat.endDate));
                $scope.defaultEndTimes = editEventData.repeat.endNumber;
            }
            if(editEventData.event.awoke){
                $scope.defaultEndRemindType = editEventData.awoke.type;
                $scope.defaultEndRemindDate = editEventData.awoke.fullAwokeTime;
                $scope.defaultEndRemindTime = editEventData.awoke.fullTime;
            }
            if(editEventData.quotes){
                var quotes=editEventData.quotes;
                for(var i=0;i<quotes.length;i++){
                    delete quotes[i].planTitle;
                }
                $scope.quotesList=editEventData.quotes;
            }
        }
        $scope.$watch("defaultIsvisibleMyself",function(value){
            if(value){
                $scope.joinPersonObj.disable(true);
            }else{
                $scope.joinPersonObj.disable(false);
            }
        });
        //标题长度限制
        $utils.limit_input(document.getElementById("new-event-title"),{length:60});
        //核对选择次数限制
        $scope.checkTimes=function($event,str){
            var defaultTimes=$scope.defaultEndTimes;
            if(str=='change'){
                if((defaultTimes!='' && Number(defaultTimes) <= 0) || isNaN(Number(defaultTimes))){
                    $scope.defaultEndTimes=1;
                }
            }else if(str=='blur'){
                if(defaultTimes=='' || parseInt(parseFloat(defaultTimes))!=Number(defaultTimes)){
                    $scope.defaultEndTimes=1;
                }else if(Number(defaultTimes) >10){
                    $scope.defaultEndTimes=10;
                }
            }
            // console.log(typeof Number($scope.defaultEndTimes));
            // if((defaultTimes!='' && Number(defaultTimes) <= 0) || isNaN(Number(defaultTimes))){
            //     $scope.defaultEndTimes=1;
            // }else if(defaultTimes!=''){
            //     $scope.defaultEndTimes=1;
            // }
        }
        $scope.showPersonChoose = function(type){
            if($scope.defaultIsvisibleMyself) return;
            $scope.joinPersonObj.openSelect();
        }
        var instanceCalendarList,
            instanceMarkList;
        $http({
            url: "/module/calendar/v1/tag/tagList.do?currPage=1"
        }).success(function(jsonData) {
            instanceMarkList = $("#mark-list-select").jingoal_mark_choose({
                default_mark_title: '请选择标签',
                searchAble: true,
                defaultValue:$scope.defaultMarkId,
                mark_list: jsonData.data.tagList.objList
            });
            instanceMarkList.setOption({
                callback: function(obj) {
                    $scope.defaultMarkId = obj.value;
                }
            });
        });
        $http({
            url: "/module/calendar/v1/getCalendarList.do"
        }).success(function(jsonData) {
            var result = [];
            var calendarList = jsonData.data.pageCalendarList;
            for (var i = 0, len = calendarList.length; i < len; i++) {
                result.push({
                    id: calendarList[i].calendar.id,
                    name: calendarList[i].calendar.name
                });
            }
            instanceCalendarList = $("#calendar-list-select").jingoal_mark_choose({
                default_mark_title: '选择台历',
                mark_list: result,
                searchAble: true,
                defaultValue:$scope.defaultCalendarId,
                bottom_btn: {
                    name: "<div class='vertical-middle hcenter' style='color:#999;'><i class='mid-cion icon-cross' style='margin-right:5px;'></i><span class='mid-text'>新建台历</span></div>",
                    callback:function(){
                        $scope.remainWord=0;
                        $scope.eventNewCalendar=true;//新建事件页新建台历
                        $utils.createModal('create-calendar', $scope, function(newEventModal,scope) {
                            newEventModal.cmd("show");
                            scope.$on('newChooseCalendar', function(event,obj){
                              instanceCalendarList.insertItem(obj);
                              instanceCalendarList.setValue(obj);
                            });
                        });
                    }
                },
                callback:function(event){
                }
            });
            instanceCalendarList.setOption({
                callback: function(obj) {
                    $scope.defaultCalendarId = obj.value;
                }
            });
        });
        var instanceStartDate = $("#start-date").jingoal_date_input({
            date_format: "yyyy-mm-dd week",
            defaultValue:$scope.defaultStartDate,
            todayBtn: true,
            callback: function(date) {
                if (instanceEndDate) {
                    instanceEndDate.setStart(date);
                    if ($utils.diffDate(date, instanceEndDate.getDate())) {
                        instanceEndDate.setValue(date);
                    }
                }
                $scope.defaultStartDate = date;
                //开始日期和提醒日期的联动
                instanceEndRemindDate&&instanceEndRemindDate.setValue(date);
                changeRepeatType();
            }
        });
        var instanceEndDate = $("#end-date").jingoal_date_input({
            date_format: "yyyy-mm-dd week",
            defaultValue:$scope.defaultEndDate,
            todayBtn: true,
            callback: function(date) {
                if (instanceEndRemindDate) {
                    instanceEndRemindDate.setEnd(date);
                }
                $scope.defaultEndDate = date;
                changeRepeatType();
            }
        });
        var instanceStartTime = $("#start-time").jingoal_time({
            defaultValue:$scope.defaultStartTime,
            callback: function(value) {
                $scope.defaultStartTime = value;
                //开始时间和提醒时间的联动
                instanceEndRemindTime && instanceEndRemindTime.setValue(prev10Minute(value));
            }
        });
        var instanceEndTime = $("#end-time").jingoal_time({
            defaultValue:$scope.defaultEndTime,
            callback: function(value) {
                $scope.defaultEndTime = value;
            }
        });
        var instanceRepeatType = $("#repeat-type-list-select").jingoal_mark_choose({
            defaultValue: $scope.defaultRepeatType,
            mark_list: [{
                id: 0,
                name: "不重复"
            }, {
                id: 1,
                name: "每天"
            }, {
                id: 2,
                name: "每周"
            }, {
                id: 3,
                name: "每月"
            }, {
                id: 4,
                name: "每年"
            }]
        });
        var instanceRepeatEndType = $("#repeat-end-type-list-select").jingoal_mark_choose({
            defaultValue: $scope.defaultEndRepeatType,
            mark_list: [{
                id: 1,
                name: "从不"
            }, {
                id: 2,
                name: "选择重复次数"
            }, {
                id: 3,
                name: "选择结束日期"
            }]
        });
        var instanceRemindType = $("#end-remind-type-list-select").jingoal_mark_choose({
            defaultValue:$scope.defaultEndRemindType,
            mark_list:[{
                id:1,
                name:"不提醒"
            },{
                id:2,
                name:"前一天"
            },{
                id:3,
                name:"同一天"
            },{
                id:4,
                name:"指定日期"
            }]
        });
        var instanceRepeatEndDate = $("#repeat-end-date").jingoal_date_input({
            date_format: "yyyy-mm-dd week",
            todayBtn: true,
            callback: function(date) {
                $scope.defaultRepeatEndDate = date;
            }
        });
        var instanceEndRemindDate = $("#end-remind-date").jingoal_date_input({
            defaultValue:$scope.defaultEndRemindDate,
            date_format:"yyyy-mm-dd week",
            todayBtn:true,
            callback:function(date){
                $scope.defaultEndRemindDate = date;
            }
        });
        var instanceEndRemindTime = $("#end-remind-time").jingoal_time({
            defaultValue:$scope.defaultEndRemindTime,
            callback: function(value) {
                $scope.defaultEndRemindTime = value;
            }
        });
        //设置结束日期的最小值
        instanceEndDate.setStart(instanceStartDate.getValue());
        if(!$scope.editEventData){//如果是编辑
            //设置提醒时间,提前10分钟
            instanceEndRemindTime.setValue(prev10Minute(instanceStartTime.getValue()));
        }
        //监听联动效果
        //是否全天
        $scope.$watch("defaultIsFullDay", function(value) {
            if (value) {
                instanceStartTime.disable(true);
                instanceEndTime.disable(true);
            } else {
                instanceStartTime.disable(false);
                instanceEndTime.disable(false);
            }
        });
        //重复方式
        instanceRepeatType.setOption({
            callback: function(obj) {
                $scope.defaultRepeatType = obj.value;
                $scope.$digest();
            }
        });
        //重复结束方式
        instanceRepeatEndType.setOption({
            callback: function(obj) {
                $scope.defaultEndRepeatType = obj.value;
                $scope.$digest();
            }
        });
        //到期提醒
        instanceRemindType.setOption({
            callback: function(obj) {
                $scope.defaultEndRemindType = obj.value;
                $scope.$digest();
            }
        });
        $scope.submitNewEvent = function(){
            //console.log($("#eventCommentAttach").mgtfileupload({result: true}));
            //检查事件名是否为空
            if(utils.trim($scope.defaultEventTitle)==''){
                $scope.defaultEventTitleNull = true;
                return;
            }
            var submitData = {
                quotes: [],
                event: {},
                awoke: {},
                repeat: {}
            };
            //事件的属性
            submitData.calendarId = $scope.defaultCalendarId;
            submitData.event.content = $scope.defaultEventTitle;
            submitData.event.allday = $scope.defaultIsFullDay;
            submitData.event.beginTime = new Date($scope.defaultStartDate + " " + $scope.defaultStartTime) * 1;
            submitData.event.endTime = new Date($scope.defaultEndDate + " " + $scope.defaultEndTime) * 1;
            submitData.event.endTime = submitData.event.beginTime>submitData.event.endTime?submitData.event.beginTime:submitData.event.endTime;
            submitData.event.open = !$scope.defaultIsvisibleMyself;
            submitData.event.id = $scope.defaultEventId;
            submitData.event.tagId = $scope.defaultMarkId;
            submitData.event.repeat = $scope.defaultRepeatType != 0;
            submitData.event.awoke = $scope.defaultEndRemindType != 0;
            //重复的属性
            if (submitData.event.repeat) {
                submitData.repeat.repeatType = $scope.defaultRepeatType;
                submitData.repeat.repeatEndType = $scope.defaultEndRepeatType;
                submitData.repeat.endNumber = $scope.defaultEndTimes;
                submitData.repeat.endTime = new Date($scope.defaultEndDate) * 1;
            }
            //提醒的属性
            if (submitData.event.awoke) {
                var awokeTime = $scope.defaultEndRemindTime;
                submitData.awoke.type = $scope.defaultEndRemindType;
                submitData.awoke.awokeTime = new Date($scope.defaultEndRemindDate+" "+$scope.defaultEndRemindTime)*1;
                submitData.awoke.hour = awokeTime.split(":")[0];
                submitData.awoke.minute = awokeTime.split(":")[1];
                submitData.awoke.infoLevel = 1;
            }
            var participatorIds = [];
            for (var i = 0, len = $scope.defaultInitPersonList.length; i < len; i++) {
                participatorIds.push($scope.defaultInitPersonList[i].id);
            }
            //参与人
            submitData.participatorIdsStr = participatorIds.join(",");
            //引用列表
            submitData.quotes = $scope.quotesList;
            $http({
                url: submitData.event.id =="" ? "/module/calendar/v1/event/add.do" : "/module/calendar/v1/event/edit.do",
                data: submitData,
                method: "post"
            }).success(function(data) {
                if (data.meta.code == 200) {
                    $scope.closeModal();
                    if(bodyScope.rightView!="event-detail-page"){
                        bodyScope.$emit("updateCalendarView", {
                            type: "changeCalendarId",
                            quotes:submitData.quotes
                        });
                    }else if(bodyScope.rightView=="event-detail-page"){
                        bodyScope.$broadcast('eventDetailReflash','reflash');
                    }
                }
            });
        }
        //提前10分钟
        function prev10Minute(time){
            var tempDate = "2015/1/2 ";
            var prevTime = new Date(Math.max(new Date(tempDate+time)*1-(60*1000*10),new Date(tempDate+"00:00")*1));
            return prevTime.getHours()+":"+prevTime.getMinutes();
        }
        //根据开始时间改变重复方式
        function changeRepeatType(){
            var repeatTypeName = ["不重复","每天","每周","每月","每年"];
                one_day = 3600 * 24 * 1000,
                one_week = one_day * 7,
                one_month = one_day * 30,
                one_year = one_day * 365;
                startDate = $scope.defaultStartDate,
                endDate = $scope.defaultEndDate;
                diff = (new Date(endDate).getTime()) - (new Date(startDate).getTime());
            if (diff < 0 || diff >= one_year) {//间隔小于0,或者大于一年
                remove_31([0]);
            } else if (diff == 0 || diff <one_day) {//间隔等于0或者小于一天
                remove_31([0, 1, 2, 3, 4]);
            } else if (diff >= one_day && diff < one_week) {//间隔大于一天并且小于一周
                remove_31([0, 2, 3, 4]);
            } else if (diff >= one_week && diff < one_month) {//间隔大于一周并且小于一月
                remove_31([0, 3, 4]);
            } else if (diff >= one_month && diff < one_year) {//间隔大于一月并且小于一年
                remove_31([0, 4]);
            }
            function remove_31(arr){
                var result = [];
                for(var i =0,len = arr.length;i<len;i++){
                    result.push({
                        name:repeatTypeName[arr[i]],
                        id:arr[i]
                    });
                }
                if($utils.parseDate(startDate).day==31){
                    for(var i =0,len = result.length;i<len;i++){
                        if(result[i]==3){
                           result.splice(i,1); 
                        }
                    }  
                }
                instanceRepeatType&&instanceRepeatType.reload(result);
                try{
                    $scope.$digest();
                }catch(e){
                    //console.log(e);
                }
            }
        }
        //引入计划和备忘功能入口
        $scope.isQuoteFile=true;
        $scope.introducePlanMemo = function($event,type) {
            $scope.boxIsCanShow=false;
            $scope.quoteFileType=type;
            $scope.temp = "introduction-plan-memo";
            $scope.modalScope();
        }
        //处理引用小弹框显示问题
        $scope.showPlanMemoBox=function(event){
            $scope.boxIsCanShow = !$scope.boxIsCanShow;
            event.stopPropagation();
            var documentClick;
            $element.unbind("click", documentClick).bind("click", documentClick = function(event){
                if($(event.target).findParents(".memo-plan-box")==null && $(event.target).findParents(".memo-plan-click")==null){
                    $scope.boxIsCanShow = false;
                    $scope.$digest();
                }
            });
        }
        //删除引用
        $scope.delQuoteItem=function(event,index){
            $scope.quotesList.splice(index,1);
        }
        $scope.modalScope = function() {
            $utils.createModal($scope.temp, $scope, function(newEventModal) {
                newEventModal.cmd("show");
            });
        }
    });
    calendarApp.controller("modelPlanMemo", function($scope, $http, $utils, $rootScope) {
        var parentController = $scope.modalScope;
        var quoteFileType = parentController.quoteFileType;
        var pQuotesList=parentController.quotesList?parentController.quotesList:[];
        var quoteLength=pQuotesList.length?pQuotesList.length:0;
        var quotesListTS=[]; //暂存选择数据
        $scope.isWram=false;//是否显示备忘编辑警告
        $scope.isChoose = false;
        if (quoteFileType == 'memo') {
            $scope.quoteType = 1;
            $scope.title = "备忘";
            $scope.memoOwer = 1; //1,是自己的备忘，2是别人的备忘
            getMemoList($scope, $http, 1, 1);
        } else if (quoteFileType == 'plan') {
            $scope.quoteType = 2;
            $scope.title = "计划";
            getPlanList($scope, $http, 1, 1);
        }
        //获取别人分享的备忘
        $scope.getOtherPersonMemo = function($event) {
                $scope.memoOwer = 2;
                getMemoList($scope, $http, 1, $scope.memoOwer);
            }
            //获取自己的别忘
        $scope.getOwerMemo = function($event) {
                $scope.memoOwer = 1;
                getMemoList($scope, $http, 1, $scope.memoOwer);
            }
            //获取下一页
        $scope.getNextPage = function(event, currentPage) {
                if (currentPage < $scope.totalPage) {
                    ($scope.quoteType == 2) && getPlanList($scope, $http, currentPage + 1, 1, $scope.searchText,getChoosedItem);
                    ($scope.quoteType == 1) && getMemoList($scope, $http, currentPage + 1, $scope.memoOwer, $scope.searchText,getChoosedItem);
                }
            }
            //获取上一页
        $scope.getPrevPage = function(event, currentPage) {
                if (currentPage > 1) {
                    ($scope.quoteType == 2) && getPlanList($scope, $http, currentPage - 1, 1, $scope.searchText,getChoosedItem);
                    ($scope.quoteType == 1) && getMemoList($scope, $http, currentPage - 1, $scope.memoOwer, $scope.searchText,getChoosedItem);
                }
            }
            //获取选中的item
        function getChoosedItem(data){
            for(var i=0;i<quotesListTS.length;i++){
                for(var j=0;j<data.length;j++){
                    if($scope.quoteType == 2){
                        var id=data[j].version.planId;
                        if(quotesListTS[i].quoteId==id){
                            data[j].show=true;
                        }
                    }else if($scope.quoteType == 1){
                        var id=data[j].pageMemo.id;
                        if(quotesListTS[i].quoteId==id){
                            data[j].show=true;
                        }
                    }
                }
            }
        }
            //获取搜索列表
        $scope.getFileList = function(event, method) {
            if (event.keyCode == 13 || method == 'click') {
                ($scope.quoteType == 2) && getPlanList($scope, $http, 1, 1, $scope.searchText,getChoosedItem);
                ($scope.quoteType == 1) && getMemoList($scope, $http, 1, $scope.memoOwer, $scope.searchText,getChoosedItem);
            }
        }
        //获取引用的文件的详情
        $scope.getEventDetail = function(event, item) {
            if ($scope.quoteType == 1) {
                $scope.quoteId = item.pageMemo.id;
                $scope.temp = "detail-memo-dialog";
            } else if ($scope.quoteType == 2) {
                $scope.quoteId = item.version.planId;
                $scope.temp = "detail-plan-dialog";
            }
            $utils.createModal($scope.temp, $scope, function(newEventModal) {
                newEventModal.cmd("show");
            });
            getQuoteDetail($scope, $http, $scope.quoteId, $scope.quoteType);
        }
        //单选框选择设置
        $scope.setChoose = function(event, item) {
            //保存选择的信息
            var existArr=false;
            var listLength=quoteLength+quotesListTS.length;
            if(quoteLength>0){
                if ($scope.quoteType == 1) {
                    for(var i=0;i<pQuotesList.length;i++){
                        if(pQuotesList[i].quoteId==item.pageMemo.id){
                            existArr=true;
                            break;
                        }
                    }
                } else if ($scope.quoteType == 2) {
                    for(var i=0;i<pQuotesList.length;i++){
                        if(pQuotesList[i].quoteId==item.version.planId){
                            existArr=true;
                            break;
                        }
                    }
                }
            }
            var hasExist=$(event.target).findParents(".label-wrap-checked")==null;
            $scope.obj = {};
            if(hasExist && listLength<5){
                if(!existArr){
                    item.show=true;
                    if ($scope.quoteType == 1) {
                        $scope.obj = {
                            quoteId: item.pageMemo.id,
                            type: 1,
                            quoteTitle: item.plainContent
                        }
                    } else if ($scope.quoteType == 2) {
                        $scope.obj = {
                            quoteId: item.version.planId,
                            type: 2,
                            quoteTitle: item.version.title
                        }
                    }
                    quotesListTS.push($scope.obj);
                }else{
                    var info="该引用已存在，请选择其他引用";
                    alertTip.show({
                        title: info,
                        type: 'warn-red'
                    });
                }
            }else if(hasExist && listLength==5){
                var info="已经达到引用的上线了";
                alertTip.show({
                    title: info,
                    type: 'warn-red'
                });
            }else{
                item.show=false;
                for(var i=0;i<quotesListTS.length;i++){
                    if(($scope.quoteType == 1 && quotesListTS[i].quoteId==item.pageMemo.id)||($scope.quoteType == 2 && quotesListTS[i].quoteId==item.version.planId)){
                        quotesListTS.splice(i,1);
                        break;
                    }
                }
            }
        }

        //确认引用
        $scope.confirmQuote = function(event) {
                parentController.quotesList=(parentController.quotesList).concat(quotesListTS);
                $scope.closeModal();
        }
        //备忘详情确认引用
        $scope.confirmQuoteMemo = function(event, pageQuote) {
            var confirmConfig = {
                 id: pageQuote.pageMemo.id,
                 type: 1,
                 quoteTitle: pageQuote.plainContent,
                 parent: true
            }
            confirmQuoteFn(confirmConfig);
        }
        //计划详情确认引用
        $scope.confirmQuotePlan = function(event, planVersion) {
                var confirmConfig = {
                     id: planVersion.planId,
                     type: 2,
                     quoteTitle: planVersion.title,
                     parent: true
                }
                confirmQuoteFn(confirmConfig);
            }
            //抽离出的引用按钮
        function confirmQuoteFn(config) {
            //是否已经存在
            var hasBeenExisting = false;
            var quotesList=$scope.quotesList;
            for(var i=0;i<quotesList.length;i++){
                var item=quotesList[i];
                if (item.quoteId === config.id) {
                    hasBeenExisting = true;
                    var info="该引用已存在，请选择其他引用";
                    alertTip.show({
                        title: info,
                        type: 'warn-red'
                    });
                }
            }
            if (!hasBeenExisting) {
                $scope.obj = {
                    quoteId: config.id,
                    type: config.type,
                    quoteTitle: config.quoteTitle
                }
                parentController.quotesList.push($scope.obj);
                $scope.closeModal();
                (config.parent) && parentController.closeModal();
            }
        }
        //这是事件详情页引用计划和备忘预览弹出框
        if ($scope.quoteListClick) {
            var quoteFileDate = parentController.quoteFileDate;
            $http({
                method: "get",
                url: "/module/calendar/v1/quote/detail.do?type=" + quoteFileDate.type + "&id=" + quoteFileDate.quoteId + "&eventId=" + parentController.eventId
            }).success(function(jsonData) {
                if (jsonData.meta.code === 200) {
                    if (quoteFileDate.type === 1) {
                        var allUser=getAllUser();
                        jsonData.data.pageQuote.pageMemo.fullName = allUser[jsonData.data.pageQuote.pageMemo.userId];
                        var commentList=jsonData.data.commentList;
                        if(commentList&&commentList.length>0){
                            for(var i=0;i<commentList.length;i++){
                                commentList[i].comment.fullName=allUser[commentList[i].comment.userId];
                            }
                        }
                        $scope.memoCommentList = jsonData.data.commentList;
                        $scope.pageQuote = jsonData.data.pageQuote;
                        $scope.attachmentList = $scope.pageQuote.attachmentList;
                        $scope.isCreate = jsonData.data.isCreater;
                    } else if (quoteFileDate.type === 2) {
                        $scope.quoteDetail = jsonData.data.pagePlan;
                        $scope.quoteDetailVcategorys = jsonData.data.pagePlan.vcategorys;
                        $scope.plan = jsonData.data.pagePlan.plan;
                        $scope.planVersion = jsonData.data.pagePlan.planVersion;
                    }
                }
            });
        }

        //备忘编辑
        $scope.editorMemoFile = function(event, isNew) {
                if (isNew) {
                    $scope.editorMemoContent = '';
                    $scope.createMemo = true;
                } else {
                    $scope.editorMemoContent = $scope.pageQuote.plainContent;
                }
                $scope.temp = "editor-memo-dialog";
                $utils.createModal($scope.temp, $scope, function(newEventModal) {
                    newEventModal.cmd("show");
                });
            }
            //提交备忘
            $scope.submitMemoEditor=function($event,type){
                 if ($scope.editorMemoContent != '') {
                    var obj={};
                    if(type==='e'){
                        obj.url="/module/calendar/v1/quote/editMemo.do";
                        obj.data={
                            "id": $scope.pageQuote.pageMemo.id,
                            "content": $scope.editorMemoContent
                        };
                        obj.callBack=function(jsonData){
                            if (jsonData.meta.code === 200) {
                                //提交成功后修改备忘弹出框
                                parentController.pageQuote.plainContent = $scope.editorMemoContent;
                                //提交成功后，影响事件详情页的备忘title
                                parentController.$parent.quoteFileDate.planTitle = $scope.editorMemoContent.substr(0, 12);
                                $scope.closeModal();
                                parentController.closeModal();
                            }
                        }
                    }else if(type="n"){
                        obj.url="/module/calendar/v1/quote/addMemo.do";
                        obj.data=$scope.editorMemoContent;
                        obj.callBack=function(jsonData){
                            if (jsonData.meta.code === 200) {
                                $scope.obj = {
                                    quoteId: jsonData.data.pageMemo.id,
                                    type: 1,
                                    quoteTitle: jsonData.data.plainContent
                                }
                                $scope.quotesList.push($scope.obj);
                                $scope.closeModal();
                                parentController.closeModal();
                            }
                        }
                    }

                    $http({
                        method: "post",
                        url: obj.url,
                        data: obj.data
                    }).success(function(jsonData){
                        obj.callBack(jsonData);
                    });

                 }else{
                    $scope.isWram=true;
                    setTimeout(changeColorFlag,1000);
                }

                //此处需要弹出框提示
            }
            function changeColorFlag(){
                $scope.isWram=false;
                $scope.$digest();
                clearTimeout(changeColorFlag);
            }
            //新建备忘
        $scope.submitMemoNew = function() {
            if ($scope.editorMemoContent != '' && $scope.editorMemoContent.length <= 140) {
                $http({
                    method: "post",
                    url: "/module/calendar/v1/quote/addMemo.do",
                    data: $scope.editorMemoContent
                }).success(function(jsonData) {
                    if (jsonData.meta.code === 200) {
                        $scope.obj = {
                            quoteId: jsonData.data.pageMemo.id,
                            type: 1,
                            quoteTitle: jsonData.data.plainContent
                        }
                        $scope.quotesList.push($scope.obj);
                        $scope.closeModal();
                        parentController.closeModal();
                    }
                });
            }
        }

        $scope.accessRecord=function(event,id,fileName){
            $scope.fileId=id;
            $scope.fileName=fileName;
            var temp='file-access-record';
            $utils.createModal(temp, $scope, function (newEventModal) {
                newEventModal.cmd("show");
            });
        }
   });
    /**
     * 获取计划列表
     * @param  {[type]} $scope
     * @param  {[type]} $http
     * @param  {[stirng]} currentPage 第几页，默认1
     * @param  {[string]} listType    1为自己创建的计划，2为其他人的（需要计划评阅权限）
     * @param  {[string]} keyword    计划标题搜索关键字
     */
    function getPlanList($scope, $http, currentPage, listType, keyword,callBack) {
        var keyword = keyword ? "&key=" + keyword : '';
        $http({
            method: "get",
            url: "/module/calendar/v1/quote/listPlan.do?currPage=" + currentPage + "&listType=" + listType + keyword

        }).success(function(jsonData) {
            if (jsonData.meta.code === 200) {
                $scope.planList = jsonData.data;
                $scope.totalPage = jsonData.data.totalPage;
                $scope.currentPage = $scope.planList.pageInfo.currPage;
                callBack&&callBack(jsonData.data.pageInfo.objList);
            }
        });
    }

    function getMemoList($scope, $http, currentPage, listType, keyword, callBack) {
        var keyword = keyword ? "&key=" + keyword : '';
        $http({
            method: "get",
            url: "/module/calendar/v1/quote/listMemo.do?currPage=" + currentPage + "&listType=" + listType + keyword
        }).success(function(jsonData) {
            if (jsonData.meta.code === 200) {
                $scope.planList = jsonData.data;
                $scope.totalPage = jsonData.data.totalPage;
                $scope.currentPage = $scope.planList.pageInfo.currPage;
                callBack&&callBack(jsonData.data.pageInfo.objList);
            }
        });
    }
    /**
     * 获取引用详情
     * @param  {[type]} $scope
     * @param  {[type]} $http
     * @param  {[string]} quoteId  引用id 1是备忘2是计划
     * @param  {[string]} quoteType 引用类型
     */
    function getQuoteDetail($scope, $http, quoteId, quoteType) {
        $http({
            method: "get",
            url: "/module/calendar/v1/quote/view.do?type=" + quoteType + "&id=" + quoteId
        }).success(function(jsonData) {
            if (jsonData.meta.code === 200) {
                if ($scope.quoteType == 2) {
                    $scope.quoteDetail = jsonData.data.pagePlan;
                    $scope.quoteDetailVcategorys = jsonData.data.pagePlan.vcategorys;
                    $scope.plan = jsonData.data.pagePlan.plan;
                    $scope.planVersion = jsonData.data.pagePlan.planVersion;
                } else if ($scope.quoteType == 1) {
                    var commentList=jsonData.data.commentList;
                    $scope.pageQuote = jsonData.data.pageQuote;
                    $scope.attachmentList = jsonData.data.pageQuote.attachmentList;
                }
            }
        });
    }
});
