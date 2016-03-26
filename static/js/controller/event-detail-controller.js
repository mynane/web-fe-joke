define(['public/ckeditor/editor','../directive/set-remind'],function () {
    calendarApp.controller("EventDetailPageController", function ($scope, $http, $utils,$element) {
        var bodyScope = $scope.bodyScope;
        $scope.eventId = $scope.eventDetailId;
        //获取页面数据
        getContextData($scope, $http,$utils,paging);
        //编辑事件后刷新
        $scope.$on('eventDetailReflash',function(event,str){
            if(str==='reflash'){
                getContextData($scope, $http,$utils,paging);
                getViewOrParticipator($scope, $http, 'participator', 1);
            }
        })
        $scope.isShow = false; //评论提示框内容是否是显示
        $scope.transfer = {};
        $scope.transfer.create = false; //是否通知创建人
        $scope.transfer.join = false; //是否通知共享人
        $scope.viewIndex = 1; //默认参与人显示第几页
        $scope.classes = 'view';
        $scope.isQuoteFile = false; //是否显示引用按钮
        $scope.isScroll = $scope.isScrollTo;
        var commentListId = document.getElementById('comment-list');
        var eventCommentAttach = document.getElementById('eventCommentAttach');
        var eventCommentPage = document.getElementById('eventCommentPage');
        //ie下页面整体布局调整
        //监听onresize事件,如果还有页面要用,就必须提取成方法进行调用
        if (!$utils.cssSupport("calc")) {
            var resizeTimer,
                resizeFn;
            angular.element(window).bind("resize", resizeFn = function () {
                //动态改变,计算出的单元格的高度
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    changeHeight();
                }, 100);
            });
            //ie下动态改变高度
            function changeHeight(isInit) {
                windowHeight = $(window).height();
                var tableWrap = document.getElementById("event-detail-container");
                tableWrap.style.height = (windowHeight - 98) + "px"; //月视图可变区域的高度
            }
            changeHeight();
            //移除resize事件
            $scope.$on("$destroy", function () {
                //清除配置,不然scroll会重复请求
                angular.element(window).unbind("resize", resizeFn);
            });
        }

        //编辑器初始化
        Editor.create("event-detail-comment", {minHeight: 150, lang:'zh_CN', min:false});
        //评论分页
        function paging(){
            $scope.currentPage=1;
            angular.element(eventCommentPage).html('');
            $("#eventCommentPage").jingoalPaging({
                allpages:$scope.commentListJson.length,
                pageshow:8,
                current:$scope.currentPage,
                maxShowPage:5
            },function(page){
                $scope.currentPage=page;
                var index=(page-1)*8;
                var commentList=$scope.commentListJson;
                $scope.commentList=commentList.slice(index,index+8);
                $scope.$digest();

            });
        }
        //编辑事件
        $scope.editorEvent=function(event,data){
            $http({
                method:"get",
                url:"/module/calendar/v1/event/editEventPre.do?id="+data.pageEvent.event.id
            }).success(function(jsonData){
                    $scope.newEvent(jsonData.data);
            });
        }
        //上传文件
        $("#eventCommentAttach").mgtfileupload({fileSize:10});
        //获取事件详情参与人
        getViewOrParticipator($scope, $http, 'participator', 1);
        //设置页面是否提醒
        $scope.setCommentNotify = function (event) {
            $http({
                method: "post",
                url: "/module/calendar/v1/event/setCommentRemind.do?eventId=" + $scope.eventId
            }).success(function (jsonData) {
                if (jsonData.meta.code === 200) {
                    $scope.pageEvent.commentRemind = !$scope.pageEvent.commentRemind;
                }
            });
        };
        //删除评论
        var deletedPop=null;
        var deleteCom=null;
        $scope.deleteComment = function (event, comment) {
            $element.bind('click',deleteCom=function(event){
                if($(event.target).findParents(".comment-delete-pop")==null){
                    deletedPop.css('display','none');
                    $element.unbind('click',deleteCom);
                }
            });
            var target = event.target;
            var parent = angular.element(target).parent('.comment-handle');
            if(deletedPop!=null){
                deletedPop.css('display','none');
                deletedPop=null
            }
            deletedPop=angular.element(parent).children('.comment-delete-pop');
            deletedPop.css('display','block');
            event.stopPropagation();
        }

        //取消删除
        $scope.cancelDelete=function(event){
            deletedPop.css('display','none');
            $element.unbind('click',deleteCom);
        }
        //确认删除
        $scope.confirmDelete=function(event,comment){
            var id=comment.id;
            $http({
                method: "post",
                url: "/module/calendar/v1/event/comment/del.do?id=" + id
            }).success(function (jsonData) {
                if (jsonData.meta.code === 200) {
                    getCommentList($scope, $http,$utils, paging);
                    deletedPop.css('display','none');
                    $element.unbind('click',deleteCom);
                }
            });
        }
        //评论提交
        $scope.commentSubmit = function () {
            var content = Editor.getValue("event-detail-comment");
            var eventId = $scope.eventId;
            var att = $("#eventCommentAttach").mgtfileupload({result: true});
            if (content !== '' || att.length>0) {
                $scope.isShow = false;
                $http({
                    method: "post",
                    url: "/module/calendar/v1/event/comment/add.do",
                    data: {
                        "comment": {
                            "eventId": eventId,
                            "content": content
                        },
                        "atts": att
                    }
                }).success(function (jsonData) {
                    if (jsonData.meta.code === 200) {
                        getCommentList($scope, $http,$utils,paging);
                        Editor.clear("event-detail-comment");
                        angular.element(eventCommentAttach).html('');
                        $("#eventCommentAttach").mgtfileupload({fileSize:10});
                    }
                });
            } else {
                $scope.isShow = true;
            }
        }
        $scope.commentListIsDesc = function () {
                $scope.isDesc = !$scope.isDesc;
                getCommentList($scope, $http, $utils, paging);
            }
            //事件详情页刷新
        $scope.eventDetailReflesh = function() {
                getContextData($scope, $http, $utils ,paging);
            }
        //删除事件
        $scope.deleteEvent = function(event,data) {
            if(data.own){
                $utils.createPrompt({
                    title:"你确定要删除吗"
                },function(){
                    $http({
                        method: "post",
                        url: "/module/calendar/v1/event/del.do?id=" + $scope.eventId
                    }).success(function(jsonData) {
                        if (jsonData.meta.code === 200) {
                            bodyScope.$emit("updateCalendarView");
                        }
                    })
                 },function(){});
            }
        }
            //事件详情页，返回按钮
        $scope.getBack = function (event) {
            bodyScope.$emit("updateCalendarView");
        }

        //事件详情全部台历
        $scope.allCalendar = function (event) {
            bodyScope.currentCalendarId = -1;
            bodyScope.$emit("updateCalendarView", {
                type: "changeCalendarId"
            });
        }
        //获取事件可见人
        $scope.showPersonCanSee = function ($event, index) {
                $scope.temp = "person-list-detail";
                $scope.viewIndex = index; //默认参与人显示第几页
                $scope.classes = 'view';
                $utils.createModal($scope.temp, $scope, function (newEventModal) {
                    newEventModal.cmd("show");
                });
            }
            //获取事件参与人
        $scope.showPersonJoin = function ($event, index) {
            $scope.temp = "person-list-detail";
            $scope.viewIndex = index; //默认参与人显示第几页
            $scope.classes = 'participator';
            $utils.createModal($scope.temp, $scope, function (newEventModal) {
                newEventModal.cmd("show");
            });
        }
        $scope.editorComment = function ($event, item3) {
            //处理事件编辑弹出框
            $scope.temp = "editor-dialog-box";
            $scope.editorCommentItem = item3;
            $utils.createModal($scope.temp, $scope, function (newEventModal) {
                newEventModal.cmd("show");
            });
        }

        $scope.showQuoteDetail = function (event, data) {
            //触发事件
            $scope.quoteListClick = true;
            $scope.quoteFileDate = data;
            var temp='';
            if (data.type === 1) {
                temp = "detail-memo-dialog";
            } else if (data.type === 2) {
                temp = "detail-plan-dialog";
            }
            $utils.createModal(temp, $scope, function (newEventModal) {
                newEventModal.cmd("show");
            });
        }
        //文件预览
        $scope.accessRecord=function(event,id,fileName){
            $scope.fileId=id;
            $scope.fileName=fileName;
            var temp='file-access-record';
            $utils.createModal(temp, $scope, function (newEventModal) {
                newEventModal.cmd("show");
            });
        }
    });
    calendarApp.controller("fileAccessRecord", function ($scope, $http, $utils,$element,fileIconChangeFilter) {
        var parentController = $scope.modalScope;
        var fileClassName=fileIconChangeFilter(parentController.fileName)
        $http({
            method: "get",
            url: "/module/attach/"+parentController.fileId+"/record.do?f=calendar"
        }).success(function (jsonData) {
            $scope.fileDetail=jsonData.replace(new RegExp('<script[^]*>[\\s\\S]*?</'+'script>','gi'),'');
            setTimeout(function(){
                $($element).find('.ico_cnt').parent().append('<i class="'+fileClassName+'"></i>');
            },0)
        });
        var closeModal=null;
        $element.bind('click',closeModal=function(event){
            var target=event.target;
            if($(target).findParents(".mgtPopClose")!=null){
                $element.unbind('click',closeModal);
                $scope.closeModal();
            }
        })

    })
    calendarApp.controller("modelPersonDialog", function ($scope, $http, $utils) {
        var parentController = $scope.modalScope;

        if ($scope.classes == "view") {
            $scope.title = "可见人";
        } else {
            $scope.title = "参与人";
        }
        getViewOrParticipator($scope, $http, $scope.classes, 1);
        //下一页
        $scope.getNextList = function (event) {
                var index = $scope.currentPage;
                if (index < $scope.totalPage) {
                    getViewOrParticipator($scope, $http, $scope.classes, index + 1);
                }
            }
            //上一页
        $scope.getPrevList = function (evert) {
            var index = $scope.currentPage;
            if (index > 1) {
                getViewOrParticipator($scope, $http, $scope.classes, index - 1);
            }
        }
    });
    calendarApp.controller("modelCommentEditorDialog", function ($scope, $http, $utils) {
            var parentController = $scope.modalScope;
            var currentPage=1;
            $scope.isShow = false;
            //初始化编辑器
            Editor.create("event-detail-comment-edit", {minHeight: 150, lang:'zh_CN', min:false});
            var eventCommentPage = document.getElementById('eventCommentPage');
            //评论分页
            function paging(){
                angular.element(eventCommentPage).html('');
                $("#eventCommentPage").jingoalPaging({
                    allpages:parentController.commentListJson.length,
                    pageshow:8,
                    current:currentPage,
                    maxShowPage:5
                },function(page){
                    currentPage=page;
                    var index=(page-1)*8;
                    var commentList=parentController.commentListJson;
                    parentController.commentList=commentList.slice(index,index+8);
                    parentController.$digest();
                });
            }
            var fileListArr = $scope.editorCommentItem.atts;
            fileListArr = JSON.parse(JSON.stringify(fileListArr));
            document['attachs_eventCommentA'] = fileListArr;
            $("#eventCommentA").mgtfileupload({fileSize:10,attached:'eventCommentA'});
            $scope.sendEditorContent = function() {
                var ckEditorContent = Editor.getValue("event-detail-comment-edit");
                var attends=$("#eventCommentA").mgtfileupload({result: true});
                var att =[];
                for(var i=0;i<attends.length;i++){
                    if(!attends[i].deleted){
                        att.push(attends[i]);
                    }
                }
                if (ckEditorContent == '' && att.length == 0) {
                    $scope.isShow = true;
                } else {
                    $http({
                        method: "post",
                        url: "/module/calendar/v1/event/comment/edit.do",
                        data: {
                            "comment": {
                                "id": $scope.editorCommentItem.comment.id,
                                "eventId": $scope.editorCommentItem.comment.eventId,
                                "content": ckEditorContent
                            },
                            "atts": att
                        }
                    }).success(function (jsonData) {
                        if (jsonData.meta.code === 200) {
                            getCommentList($scope, $http,$utils, paging ,parentController);
                            $scope.closeModal();
                        }
                    });
                    $scope.isShow = false;
                }
            }
        })
        /**
         * 获取参与人或共享人
         * classes 如果是view就是获取参与人，是participator获取共享人
         */
    function getViewOrParticipator($scope, $http, classes, pageIndex) {
        var pageIndex = pageIndex ? pageIndex : 1;
        var getResult = null;
        $http({
            method: "get",
            url: "/module/calendar/v1/event/getShareUsers.do?eventId=" + $scope.eventId + "&curr=" + pageIndex + "&type=" + classes
        }).success(function (jsonData) {
            if (jsonData.meta.code === 200) {
                $scope.person = jsonData.data.pageInfo;
                $scope.isCanShow = $scope.person.total / $scope.person.number;
                $scope.currentPage = $scope.person.currPage;
                $scope.totalPage = Math.ceil($scope.isCanShow);
                $scope.personObjList = $scope.person.objList.join('，  ');
            }
        });
    }
    /**
     * 获取事件评论列表
     * @param  {[type]}  $scope 
     * @param  {[type]}  $http  
     * 
     */
    function getCommentList($scope, $http,$utils,callback, parentController) {
        var parentController = parentController ? parentController : $scope;
        $http({
            method: "get",
            url: "/module/calendar/v1/event/comment/list.do?id=" + $scope.eventId + "&isDesc=" + $scope.isDesc
        }).success(function (jsonData) {
            if (jsonData.meta.code === 200) {
                var allUser=$utils.getAllUser();
                var data=jsonData.data;
                for(var i=0;i< data.length;i++){
                    var id=data[i].comment.commentUserId;
                    data[i].comment.fullName = allUser[id];
                }
                parentController.commentList = jsonData.data.slice(0,8);
                parentController.commentListJson = jsonData.data;
                callback();
            }
        });
    }

    function getContextData($scope, $http, $utils, callback) {
        $http({
            method: "get",
            url: "/module/calendar/v1/event/detailView.do?eventId=" + $scope.eventId
        }).success(function (jsonData) {
            $scope.eventDetailDate = jsonData;
            if (jsonData.meta.code === 200) {
                var allUser=$utils.getAllUser();
                $scope.data = jsonData.data;
                $scope.meta = jsonData.meta;
                $scope.pageEvent = jsonData.data.pageEvent;
                var commentList = jsonData.data.commentList;
                for (var i = 0; i < commentList.length; i++) {
                    var id = commentList[i].comment.commentUserId;
                    commentList[i].comment.fullName = allUser[id];
                }
                $scope.commentList = jsonData.data.commentList.slice(0,8);
                $scope.commentListJson = jsonData.data.commentList;
                $scope.isDesc = jsonData.data.desc;
                $scope.quotes = jsonData.data.pageEvent.quotes;
                $scope.loginUserId=CookieUtil.getItem('uid');
                callback();
            }
        });
    }
});

