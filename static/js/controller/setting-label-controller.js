define(function() {
    calendarApp.controller("SettingLabelController", function($scope, $http, $utils) {
        // 标签管理通用变量
        // (ps:tag是服务命名，页面中有许多地方用label，就继续用这个)
        $scope.labelEditState = "new"; // 弹窗框的状态，编辑(edit)或新建(new)
        $scope.editStateHead = "新建";
        $scope.nameInvalid = false; // 用于提交数据时验证，标签名是否合法
        $scope.nameInvalidMsg = ""; // 同上，标签名不合法的提示信息
        $scope.descInvalid = false; // 标签说明是否合法，默认是合法的
        $scope.descLength = 0; // 说明内容字符长度，默认为0
        $scope.initLoad = true;
        $scope.labelPager = {
            total: 0,
            currPage: 1, // 标签列表当前index，从1开始
            resetPage: true // 首次加载或需要重新加载pager控件，该属性为true
        };
        $scope.labelList = null; // 
        $scope.isPerm = false; // 是否有标签管理的权限，默认为false
        $scope.currLabel = null; //查看标签详情时，当前标签；包含标签关联事件数量

        var bodyScope = $scope.bodyScope;
        bodyScope.settingView = $scope;

        // 加载该界面就立即执行的事
        getLabelList();

        /*
         * 打开标签编辑窗口
         * 点击【新建标签】，查看详情弹框点击【编辑】
         */
        $scope.showLabelEditPanel = function(method, labelModel) {
            if (method === "edit") { // 编辑标签
                $scope.labelInfo = $scope.currLabel.tag;
                $scope.descLength = $scope.labelInfo.info.length;
                $scope.editStateHead = '编辑';
            } else { // 新建标签
                method = 'new';
                $scope.labelInfo = null;
                $scope.editStateHead = '新建';
            }
            $scope.labelEditState = method;
            $utils.createModal("setting-label-edit", $scope, function(obj) {
                obj.cmd("show");
            });
        }

        /*
         * 打开有标签管理权限或标签管理员窗口
         * 点击“标签管理员”或者“系统管理员”
         */
        $scope.showAdminPanel = function(param) {
            var adminList = null;
            $scope.adminListStr = "";

            // 1.加载数据
            if (param === 0) { // 标签管理权限
                $scope.curAuthorityHead = "有标签管理权限的用户";

                $http({
                    method: 'get',
                    url: '/module/calendar/v1/tag/viewManagers.do'
                }).success(function(jsonData) {
                    if (jsonData.meta.code === 200) {
                        adminList = jsonData.data;
                        $scope.adminListStr = adminList != null && adminList.length != null ? adminList.join(',') : '';
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

            } else { // 系统管理员
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
                }).error(function(jsonData) {
                    alertTip.show({
                        title: jsonData.meta.message,
                        type: 'warn-red'
                    });
                });
            }


            // 2.打开弹出面板
            $utils.createModal("setting-label-authority", $scope, function(obj) {
                obj.cmd("show");
            });
        }

        /*
         * 查看标签详情
         */
        $scope.showLabelDetail = function($event, labelModel) {
            if (!$scope.isPerm) { // 没有管理权限的用户
                $scope.currLabel = {
                    tag: labelModel
                };
            } else {
                // 打开窗口便置空，若不这样做，会出现的情况是: 
                // 1) 第一次打开加载了currLabel，关闭弹出层；
                // 2) 第二次马上打开了，这时请求还未完成，currLabel就是第一次http请求获取的数据
                $scope.currLabel = null;

                $http({
                    method: 'get',
                    url: '/module/calendar/v1/tag/detail.do?id=' + labelModel.tagId
                }).success(function(jsonData) {
                    if (jsonData.meta.code === 200) {
                        $scope.currLabel = jsonData.data;
                    } else {
                        alert(jsonData.meta.message);
                    }
                }).error(function(jsonData) {
                    alertTip.show({
                        title: jsonData.meta.message,
                        type: 'warn-red'
                    });
                });
            }
            $utils.createModal("setting-label-detail", $scope, function(obj) {
                obj.cmd("show");
            });
        }

        /*
         * 停用、启用标签
         */
        $scope.disableLabel = function(labelModel) {
            if (labelModel == undefined) {
                return false;
            }

            $http({
                method: 'post',
                url: '/module/calendar/v1/tag/stopOrStartTag.do?tagId=' + labelModel.tagId
            }).success(function(jsonData) {
                if (jsonData.meta.code === 200) {
                    alertTip.show({
                        title: "操作成功"
                    });
                    getLabelList();
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
         * 子弹框使用更新数据 
         */
        $scope.updateLabelList = function() {
            getLabelList();
        }

        /*
         * 编辑标签时，提交数据，不用再获取列表直接更新内存中的数据
         */
        $scope.updateLabel = function() {
            var labeList = $scope.labelList;

            for (var i = 0, arrLength = labeList.length; i <= arrLength; i++) {
                if (labeList[i].tagId === $scope.labelInfo.tagId) {
                    $scope.labelList[i] = $scope.labelInfo;
                    break;
                }
            }
        }


        /*
         * 以分页的方式从服务器获取标签列表
         */
        function getLabelList() {
            // 1.请求数据前先滚到页面顶部
            $scope.scrollToTop();
            
            $http({
                method: 'get',
                url: '/module/calendar/v1/tag/tagList.do?currPage=' + $scope.labelPager.currPage
            }).success(function(jsonData) {
                if (jsonData.meta.code === 200) {
                    $scope.isPerm = jsonData.data.isPerm;
                    $scope.labelList = jsonData.data.tagList.objList;
                    $scope.labelPager.number = jsonData.data.tagList.number;
                    $scope.labelPager.total = jsonData.data.tagList.total;
                    var pageNum = Math.ceil(jsonData.data.tagList.total / jsonData.data.tagList.number);
                    showLabelPager(pageNum);
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
         * 根据条件创建或不创建标签分页组件
         */
        function showLabelPager(pageNum) {
            // 第一次或页数增加时，重置分页组件
            if ($scope.labelPager.resetPage || pageNum != $scope.labelPager.pageNum) {
                $("#labelPage").html(""); // 先清空元素内子元素
                $scope.labelPager.currPage = 1; // 跳转到第一页去

                $("#labelPage").jingoalPaging({
                    allpages: $scope.labelPager.total,
                    pageshow: $scope.labelPager.number,
                    current: $scope.labelPager.currPage,
                    maxShowPage: 5
                }, function(page) {
                    $scope.labelPager.currPage = page;
                    getLabelList();
                });
            }

            $scope.labelPager.pageNum = pageNum; // 总页数变更
            $scope.labelPager.resetPage = false; // 至此已经不是第一次初始化界面了
        }
    });

    /*
     * 标签添加/编辑使用的controller
     */
    calendarApp.controller("labelEditCtrl", function($scope, $http, $utils, $rootScope) {
        $scope.submission = false; // 数据是否为提交中（提交label表单时），默认为false

        // 提交信息
        $scope.submitInfo = function() {
            // 1.对提交的信息进行验证
            var labelInfo = $scope.labelInfo;

            // 检查输入  1).标签是否正确
            if (labelInfo == null || getClearStr(labelInfo.name) == "") {
                $scope.nameInvalid = true;
                $scope.nameInvalidMsg = "请输入标签名称";
            } else if (labelInfo.name.length > 16) {
                $scope.nameInvalid = true;
                $scope.nameInvalidMsg = "标签名不能超过16个字哦。" // 此处应有不同字符处理（中文、繁体）
            }


            // 2).说明是否超出限制
            $scope.descInvalid = checkDesc(); // 提交的时候才显示错误提示框
            // 3).输入错误就不用继续往下执行啦
            if ($scope.nameInvalid || $scope.descInvalid) {
                return false;
            }

            // 标签为空赋值为空字符串
            labelInfo.info = labelInfo.info || '';

            // 2.标注当前状态为提交数据状态，提交按钮不可用
            $scope.submission = true;

            // 3.根据当前操作方式提交数据
            if ($scope.labelEditState == "edit") {
                if ($scope.currLabel == null || $scope.currLabel.tag == null) {
                    return false;
                }
                $http({
                    method: "post",
                    data: {
                        "name": labelInfo.name,
                        'info': labelInfo.info,
                        'tagId': $scope.currLabel.tag.tagId
                    },
                    url: "/module/calendar/v1/tag/edit.do"
                }).success(function(jsonData) {
                    $scope.submission = false; // 数据提交成功，按钮可用了；这里实际是数据提交失败才会用到
                    if (jsonData.meta.code === 200) {
                        $scope.closeModal();
                        $scope.updateLabel(); // 调用“SettingLabelController”,bodyController更新列表,不需要去服务器再获取一次数据
                    } else {
                        alert(jsonData.meta.message);
                    }
                }).error(function(jsonData) {
                    alertTip.show({
                        title: jsonData.meta.message,
                        type: 'warn-red'
                    });
                });
            } else {
                $http({
                    method: "post",
                    data: {
                        "name": labelInfo.name,
                        'info': labelInfo.info
                    },
                    url: "/module/calendar/v1/tag/add.do"
                }).success(function(jsonData) {
                    $scope.submission = false; // 设置按钮可用
                    if (jsonData.meta.code === 200) {
                        $scope.closeModal();
                        $scope.labelPager.resetPage = true; // 跳转到第一页，并重新加载Pager
                        $scope.labelPager.currPage = 1;
                        $scope.updateLabelList(); // 调用“SettingLabelController”,bodyController更新列表
                    } else {
                        alertTip.show({
                            title: jsonData.meta.message,
                            type: 'warn-red'
                        });
                    }
                }).error(function(jsonData) {
                    $scope.submission = false; // 设置按钮可用
                    alertTip.show({
                        title: jsonData.meta.message,
                        type: 'warn-red'
                    });
                });
            }
        }

        // 当标签名input获取焦点时，移除错误提示相关信息
        $scope.focusName = function() {
                $scope.nameInvalid = false;
            }
            // 标签说明内容更改时
        $scope.descChange = function() {
            checkDesc();
        }

        function checkDesc() {
            var invalid = false;
            $scope.descLength = $scope.labelInfo && $scope.labelInfo.info ? $scope.labelInfo.info.length : 0;
            invalid = $scope.descLength > 60;
            $scope.descInvaldMsg = invalid ? "标签说明超出限制，请不要超出60字哦！" : '';
            return invalid;
        }

        function getClearStr(str) {
            if (typeof str == "undefined") {
                return "";
            }
            return str.replace(/(^s*)|(s*$)/g, "");
        }
    });

    /*
     * 标签详情使用的controller
     */
    calendarApp.controller("labelDetailCtrl", function($scope, $http, $utils, $rootScope) {
        // 删除标签
        $scope.deleteLabel = function() {
            $utils.createPrompt({
                title: "你确定要删除吗"
            }, function() { // 确定删除执行的操作
                if ($scope.currLabel == null) {
                    alert("不着急，等看完全貌再来判决也不迟哦。");
                    return false;
                }
                $http({
                    method: 'post',
                    url: '/module/calendar/v1/tag/delTag.do?id=' + $scope.currLabel.tag.tagId
                }).success(function(jsonData) {
                    if (jsonData.meta.code === 200) {
                        alertTip.show({ title: "操作成功" });
                        $scope.closeModal();
                        $scope.currLabel = null; //删除该数据了，目前model就为空了。
                        $scope.updateLabelList(); // 调用“SettingLabelController”,更新列表
                    } else {
                        alertTip.show({ title: jsonData.meta.message });
                    }
                }).error(function(jsonData) {
                    alertTip.show({ title: jsonData.meta.message });
                });
            }, function() {

            });
        };
        // 编辑标签，主要打开标签
        $scope.editLabel = function() {
            $scope.closeModal();

            $scope.showLabelEditPanel("edit"); // 调用“SettingLabelController”,打开编辑窗口
        }
    });
});
