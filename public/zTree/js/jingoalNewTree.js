define(['lcss!public/zTree/zTreeStyle/jingoalNewTree',
    'lcss!public/zTree/zTreeStyle/zTreeStyle',
    'public/zTree/js/jquery.ztree.excheck-3.5.min',
    'public/zTree/js/i18n'
], function () {
    /**
     * jingoalNewTree 支持选择部门和职务
     * 
     * nodeType: 选择节点的类型
     *  	  0: 员工，1: 部门，2：职务
     * 
     **/

    function getTimedUrl(url) {
        return url + (url.indexOf('?') > 0 ? '&' : '?') + 't=' + new Date().getTime();
    }

    //移除该树
    function removeJingoalTreeFromWindow(suffix) {
        $.fn.zTree.destroy('jingoalTree' + suffix);
        $("#jingoalTreeModal" + suffix)[0].modalObj.cmd("hide");
        window.dialogNewTree = null;
    };

    /**切换了列表类型或者是选项卡时清除搜索下拉 和 搜索框的值*/
    function resetSearchFilter(suffix) {
        $("#jingoalTreeSearchInput" + suffix).val("");
        $("#jingoalTreeSearchInput" + suffix).blur();
    }

    // 重设树的高度
    function resizeJingoalTreeScrollPanel(treeId, opt, suffix) {
        var h = opt.height;
        var t = $("#" + treeId);
        if ($.browser.ie7) {
            var aw = t.data("oldWidth");
            if (!aw) {
                t.data("oldWidth", true)
                t.width(t.width() - 2);
            }
        }
        t.height(h);
    };

    window.JingoalTree || (window.JingoalTree = (function () {
        var globalSuffix = 0,
            _nodes = {}, // 人员集合
            NODE_TYPE_EMPLOYEE = 0,
            NODE_TYPE_DEPT = 1,
            NODE_TYPE_DUTY = 2; // 树节点类型， 0: 员工， 1：部门，2：职务 

        function getNode(uid) {
            if (_nodes[uid]) {
                return _nodes[uid];
            } else {
                return null;
            }
        }

        function Node(id, name, fromEnc, type) {
            this.id = typeof (id) === 'undefined' ? 0 : id;
            this.name = typeof (name) === 'undefined' ? '' : name;
            this.fromEnc = typeof (fromEnc) === 'undefined' ? 0 : fromEnc;
            this.type = typeof (type) === 'undefined' ? 0 : type;
        }

        function createNode(id, name, fromEnc, type) {
            var node = getNode(id);
            if (node == null) {
                type = getNodeType(type);
                node = _nodes[id] = new Node(id, name, fromEnc, type);
            }
            return node;
        }

        function getNodeType(type) {
            switch (type) {
            case NODE_TYPE_DEPT:
                return 'dept';
                break;
            case NODE_TYPE_DUTY:
                return 'duty';
                break;
            default:
                return 'employee';
                break;
            }
        }

        function getNodeName(type) {
            switch (type) {
            case NODE_TYPE_DEPT:
                return tree_lang.dept;
                break;
            case NODE_TYPE_DUTY:
                return tree_lang.duty;
                break;
            default:
                return tree_lang.employee;
                break;
            }
        }

        /**
         * 过滤节点，如果节点下没有子元素，则设置该节点的isparent为false，并修改节点图片为iconSkin
         * @param node
         * @param iconSkin
         * @param treeType
         */
        function _filterNode(node, iconSkin, treeType) {
            node.iconSkin = iconSkin;

            if (treeType == "byEmployee" && (node.isParent && node.children.length == 0)) {
                node.nocheck = true;
            } else if (!node.children || node.children == null || node.children.length == 0) {
                node.nocheck = false;
                return;
            }
            for (var i = 0; i < node.children.length; i++) {
                _filterNode(node.children[i], iconSkin, treeType);
            }
        }

        return function (opt, $utils, $scope) {
            // 默认设置
            var option = {
                treeTitle: '', // 弹出树标题
                showSend: false, // 是否显示消息设置
                treeType: '',
                isDialog: true,
                permId: '', // 权限
                checkedNodes: '', //json字符串
                height: 209, // 高度
                itemUrl: '',
                placeholder: tree_lang.placeholder, //msg: '输入员工、部门或职务名称',
                treeFilterType: '0,1,2', //0： 人员， 1：部门， 2：职务
                showEnc: false, //是否支持选择 '友好企业', 如果不支持选择人员，该属性无效[默认不支持]
                allDept: false, // 是否获取所有的部门, 如果不支持部门选择，该属性无效
                maxSelect: 200, // 可以选择最大的节点数
                maxSelectTip: 190 // 提示时选择的最大节点数
            };
            $.extend(option, opt);

            // 初始化树 配置
            var setting = {
                check: {
                    enable: option.hasCheckBox,
                    nocheckInherit: false
                },
                data: {
                    simpleData: {
                        enable: false
                    }
                },
                callback: {
                    onCheck: function (event, treeId, treeNode) {
                        // 处理树节点选中
                        function handleNode(node) {
                            if (node.isParent) {
                                var childs = node.children;
                                for (var i = 0; i < childs.length; i++) {
                                    handleNode(childs[i]);
                                }
                            } else {
                                if (node.checked) {
                                    addNode(createNode(node.id, node.name, node.nec, node.type));
                                } else {
                                    var nodeType = getNodeType(node.type);
                                    removeNode(node.id + "-" + nodeType, false);
                                }
                            }
                        }

                        handleNode(treeNode);
                    },
                    onClick: function (event, treeId, treeNode) {
                        /*if(type == 'byDept'){
                        	$("#singleSelectName" + suffix).val(treeNode.name);
                        	$("#singleSelectId" + suffix).val(treeNode.id);
                        } else if (treeNode != null && !treeNode.isParent ) {
                        	if($.type(option.onUserClick) === 'function'){
                        		option.onUserClick(treeNode);
                        	}
                        }*/
                    },
                    onDblClick: function (event, treeId, treeNode) {
                        if (treeNode != null && $.type(option.onUserDblClick) === 'function') {
                            option.onUserDblClick(treeNode);
                        }
                    }
                },
                view: {
                    selectedMulti: false
                }
            };

            var ownGroup = "<div class='pagination-centered' style='margin-top:10px;'>" + i18n.noDefinedGroup + "</div>", //如果自定义组为空的话 显示的内容，方便国际化
                appBase = globalCp,
                suffix = globalSuffix++,
                treeId = "jingoalTree" + suffix,
                nodes = new Array(),
                type = option.treeType != '' ? option.treeType : "byEmployee", //默认根据部门获取所有的员工
                treeData = null;

            var parentLevel = 0,
                parentId = 0;

            if (option.isDialog) {
                var treeDialogUrl = '/common/tree/dialogJingoalTree.jsp?treeType=';
                if (option.itemUrl != '') {
                    treeDialogUrl = option.itemUrl;
                }
                $.ajax({
                    url: appBase + treeDialogUrl + type,
                    data: {
                        permId: option.permId,
                        showEnc: option.showEnc,
                        isAllDept: option.allDept,
                        t: new Date().getTime()
                    },
                    context: document.body,
                    success: function (html) {
                        utils.syncLoading(false);
                        $(document.body).append(html);
                        initTree($.parseJSON($("#defaultTreeData").text()), type);
                        $("#defaultTreeData").remove();
                        //lirongping
                        /*在这里新加类*/
                        var wrap = $("#jingoalTreeModal" + suffix);
                        wrap.addClass("modal-wrap");
                        var header = wrap.find(".modal-header");
                        header.addClass("modal-title");
                        header.find(".close").attr("onclick", "void(0)").attr("ng-click", "closeModal()");
                        $("#jingoalTreeSearchOk" + suffix).find(".commpic-search").addClass("icon-search-grey");
                        var footer = wrap.find(".modal-footer");
                        $("#jingoalTreeOk" + suffix).addClass("cancel");
                        $("#jingoalTreeCancel" + suffix).addClass("confirm");
                        wrap.attr("com-modal", "true");
                        $utils.createModal(wrap[0], $scope, function (modal) {
                            modal.cmd("show");
                            wrap[0].modalObj = modal;
                        });
                        option.itemUrl = '';
                    },
                    error:function(){
                        utils.syncLoading(false);
                    }
                });
                window.dialogNewTree = this;
            }


            /**
             * 一个页面中可以能有多个tree，为了相互不影响，需要修改某些需要操作的dom元素id
             */
            function initDom() {
                $('.replaceid').each(function (index, item) {
                    item.id = item.id + suffix;
                });
                $('.replacename').each(function (index, item) {
                    item.name = item.name + suffix;
                });

                $("#treeTitle" + suffix).text(option.treeTitle);

                if (option.showSend) {
                    $("#chooseSend" + suffix).css("display", "block");
                } else {
                    $("#chooseSend" + suffix).css("display", "none");
                }
                // 选择树的类型
                if (option.treeFilterType) {
                    if (option.treeFilterType.indexOf('0') == -1) {
                        $("#orgEmp" + suffix).addClass('hide');
                        $("#jingoalTreeSubtab" + suffix).addClass('hide');
                    }
                    if (option.treeFilterType.indexOf('1') == -1) {
                        $("#orgDept" + suffix).addClass('hide');
                    }
                    if (option.treeFilterType.indexOf('2') == -1) {
                        $("#orgDuty" + suffix).addClass('hide');
                    }
                }
            }

            /**
             * 初始化树
             */
            function initTree(data, treeType) {
                // 初始化页面元素
                initDom();

                setData(data, treeType);
                // 预选人员
                reverseSelect(treeId, option.checkedNodes);
                if (option.itemUrl != '') {
                    $("#defaultUserNamesData").remove();
                    $("#defaultUserIdsData").remove();
                }
                // 调整尺寸
                setTimeout(function () {
                    resizeJingoalTreeScrollPanel(treeId, option, suffix);
                }, 0);
                bindEvent();
                bindEventToTab();

                bindEventsToSearch();

                if (option.hasRightPanel) {
                    bindEventToRight();
                }
                if (option.showSend) {
                    bindSendClick();
                }
            }

            /**
             * 填充树
             * @param data
             * @param ids
             * @param showFilter
             * @param names
             */
            function setData(data, treeType, showFilter) {
                treeData = data;

                resetSearchFilter(suffix);
                if (treeType == 'byEmployee') {
                    _filterNode(data[0], '', treeType);
                } else {
                    _filterNode(data[0], 'dept', treeType);
                }
                data[0].iconSkin = "root";
                data[0].open = true;

                $.fn.zTree.init($("#" + treeId), setting, data);
            }

            /**
             * 树初始化完成时预选择人员
             * @param treeId
             * @param checkedNodeStr
             */
            function reverseSelect(treeId, checkedNodeStr) {
                if (checkedNodeStr !== '' && checkedNodeStr.length > 0) {
                    var checkedNodes = $.parseJSON(checkedNodeStr);

                    if (checkedNodes.length > 0) {
                        $.each(checkedNodes, function (i, item) {
                            addNode(createNode(item.id, item.name, item.nec, item.type));
                        });
                    }
                }
            }

            /**
             * 绑定确定/取消 按钮事件
             */
            function bindEvent() {
                $("#jingoalTreeCancel" + suffix).click(function () {
                    removeJingoalTreeFromWindow(suffix);
                    if (option.callCancelback) {
                        option.callCancelback();
                    }
                });

                $("#jingoalTreeOk" + suffix).click(function () {
                    if (nodes.length > option.maxSelect) {
                        lab_mgtNotification({
                            message: "<i class='commpic-warn'></i>" + tree_lang.maxSelectTip0 + option.maxSelect + tree_lang.maxSelectTip1,
                            type: 'error',
                            position: "top-center",
                            closable: false
                        });
                        return;
                    }
                    option.callback(window.dialogNewTree);
                    $("#jingoalTreeModal" + suffix)[0].modalObj.cmd("hide");
                });
            }

            /**
             * 选项卡绑定事件
             * @returns
             */
            function bindEventToTab() {
                var treeArg = {
                    treeType: 'byEmployee',
                    treeFilter: 'ownCompany',
                    permId: option.permId,
                    isAllDept: option.allDept
                };

                // 人员筛选 过滤
                $("#jingoalTreeSubtab" + suffix + " > label").click(function (event) {
                    var filterType = $(event.target).data('type');
                    switch (filterType) {
                    case 'ownCompany':
                        $("#ownCompany" + suffix + " > span:eq(0)").addClass("dialogtree-radioed");
                        $("#encCompany" + suffix + " > span:eq(0)").removeClass("dialogtree-radioed");
                        $("#customGroup" + suffix + " > span:eq(0)").removeClass("dialogtree-radioed");
                        break;
                    case 'encCompany':
                        $("#encCompany" + suffix + " > span:eq(0)").addClass("dialogtree-radioed");
                        $("#ownCompany" + suffix + " > span:eq(0)").removeClass("dialogtree-radioed");
                        $("#customGroup" + suffix + " > span:eq(0)").removeClass("dialogtree-radioed");
                        break;
                    case 'customGroup':
                        $("#customGroup" + suffix + " > span:eq(0)").addClass("dialogtree-radioed");
                        $("#encCompany" + suffix + " > span:eq(0)").removeClass("dialogtree-radioed");
                        $("#ownCompany" + suffix + " > span:eq(0)").removeClass("dialogtree-radioed");
                        break;
                    }

                    treeArg.treeFilter = filterType;
                    treeFilter(treeArg);
                });

                // 选员工
                $("#orgEmp" + suffix).click(function () {
                    treeArg.treeType = "byEmployee";
                    treeFilter(treeArg);
                });

                // 选部门
                $("#orgDept" + suffix).click(function () {
                    treeArg.treeType = "byDept";
                    treeFilter(treeArg);
                });

                //选职务
                $("#orgDuty" + suffix).click(function () {
                    treeArg.treeType = "byDuty";
                    treeFilter(treeArg);
                });
            }

            /**
             * 搜索的事件绑定
             * @returns
             */
            function bindEventsToSearch() {
                $("#jingoalTreeSearchInput" + suffix).keyup(function (event) {
                    var searchText = $.trim($(this).val());
                    if (searchText == '' || searchText.length == 0) {
                        $("#searchResult" + suffix).empty().hide();
                        return;
                    }
                });
                $("#jingoalTreeSearchInput" + suffix).keydown(function (event) {
                    // enter键搜索
                    if (event.keyCode == 13) {
                        event.preventDefault();
                        search($.trim($(this).val()));
                    }
                });

                $("#jingoalTreeSearchOk" + suffix).click(function () {
                    search($("#jingoalTreeSearchInput" + suffix).val());
                });

                $("#jingoalTreeSearchInput" + suffix).attr('placeholder', option.placeholder);
            }

            function search(searchText) {
                if (searchText == null || searchText.length == 0) {
                    $("#searchResult" + suffix).empty().hide();
                    return;
                } else {
                    var searchResult = $("#searchResult" + suffix);
                    if (searchResult.length == 0) {
                        $(document.body).append("<div class='serch_panel replaceid hide' id='searchResult" + suffix + "'></div>");
                    }
                    $("#searchResult" + suffix).empty().hide();

                    setTimeout(function () {
                        $.ajax({
                            type: 'post',
                            url: appBase + '/tree/findTreeNodeByKey.do',
                            dataType: "json",
                            data: {
                                key: searchText,
                                permId: option.permId,
                                type: option.treeFilterType
                            },
                            success: function (data) {
                                $(".searchList").empty();

                                var employees = data.employee;
                                var depts = data.dept;
                                var duts = data.duty;

                                if ((employees !== undefined && employees.length > 0) || (depts !== undefined && depts.length > 0) || (duts !== undefined && duts.length > 0)) {
                                    appendSearchResult(NODE_TYPE_EMPLOYEE, employees);
                                    appendSearchResult(NODE_TYPE_DEPT, depts);
                                    appendSearchResult(NODE_TYPE_DUTY, duts);
                                } else {
                                    $("#searchResult" + suffix).empty();

                                    var $emptyResult = $("<div class='panel_Null'></div>")
                                        .append("<span class='panelSpan'>" + tree_lang.empty_result + "</span>")
                                        .append("<span class='panel_line'></span>");
                                    $("#searchResult" + suffix).append($emptyResult); //msg: 没有找到匹配结果
                                }
                            }
                        });
                    }, 100);
                    $("#searchResult" + suffix).show();
                }
            }

            // 拼装搜索结果
            function appendSearchResult(type, nodes) {
                if (nodes == undefined) return;

                var $searchListDiv = $("#searchList" + type + suffix),
                    $searchListHeader = $("#searchListHeader" + type + suffix),
                    $searchListUl = $("#searchListUl" + type + suffix);
                if ($searchListDiv.length == 0 && nodes.length > 0) {
                    $searchListDiv = $("<div id='searchList" + type + suffix + "'></div>");
                    $searchListHeader = $("<div id='searchListHeader" + type + suffix + "' class='panel_header'></div>");
                    $searchListHeader.append("<span class='panelSpan'>" + tree_lang.find + getNodeName(type) + nodes.length + "个</span>");
                    $searchListHeader.append("<span class='panel_line'/>");

                    $searchListUl = $("<ul class='searchList' id='searchListUl" + type + suffix + "'></ul>");

                    $searchListDiv.append($searchListHeader);
                    $searchListDiv.append($searchListUl);

                    $("#searchResult" + suffix).append($searchListDiv);
                }

                $.each(nodes, function (i, item) {
                    // 添加搜索的结果
                    var $searchLi = $("<li></li>")
                        .append("<span style='*float:left;'>" + item.name + "</span>");

                    if (isExistNode(item.id, type)) {
                        $searchLi.append("<span class='pull-right text' id='node_" + suffix + getNodeType(type) + item.id + "'>" + tree_lang.has_selected + "</span>");
                    } else {
                        $searchLi.append("<span class='pull-right' id='node_" + suffix + getNodeType(type) + item.id + "'><button class='btn'>" + tree_lang.add + "</button></span>");
                    }
                    $searchListUl.append($searchLi);

                    $("#node_" + suffix + getNodeType(type) + item.id).click({
                        node: item,
                        type: type
                    }, popUserClick);
                });
            }

            //搜索弹出框选择人员的事件
            function popUserClick(event) {
                var node = event.data.node;
                var type = event.data.type;
                addNode(createNode(node.id, node.name, node.nec, node.type));
                $("#node_" + suffix + getNodeType(type) + node.id).text(tree_lang.has_selected).addClass("text");
            };

            function treeFilter(treeArg) {
                $.post(getTimedUrl(option.url), treeArg,
                    function (data) {
                        switch (treeArg.treeType) {
                        case 'byEmployee':
                            resizeJingoalTreeScrollPanel(treeId, option, suffix);
                            $("#jingoalTreeSubtab" + suffix).removeClass('hide');
                            $("#orgEmp" + suffix).addClass("active");
                            $("#orgDept" + suffix).removeClass("active");
                            $("#orgDuty" + suffix).removeClass("active");
                            break;
                        case 'byDept':
                            resizeJingoalTreeScrollPanel(treeId, {
                                height: option.height + 30
                            }, suffix);
                            $("#jingoalTreeSubtab" + suffix).addClass('hide');
                            $("#orgEmp" + suffix).removeClass("active");
                            $("#orgDept" + suffix).addClass("active");
                            $("#orgDuty" + suffix).removeClass("active");
                            break;
                        case 'byDuty':
                            resizeJingoalTreeScrollPanel(treeId, {
                                height: option.height + 30
                            }, suffix);
                            $("#jingoalTreeSubtab" + suffix).addClass('hide');
                            $("#orgEmp" + suffix).removeClass("active");
                            $("#orgDept" + suffix).removeClass("active");
                            $("#orgDuty" + suffix).addClass("active");
                            break;
                        }
                        setData(data, treeArg.treeType, treeArg.treeFilter);
                    });
            }

            //给右边栏绑定事件
            function bindEventToRight() {
                // 清空操作
                $("#popsrli" + suffix + " > ul:eq(0) > li:eq(3)").click(function () {
                    if (nodes.length > 0) {
                        $.fn.zTree.getZTreeObj(treeId).checkAllNodes(false);
                        for (var i = 0; i < nodes.length; i++) {
                            removeNode(nodes[i].id + "-" + nodes[i].type, true);
                            i--;
                        }
                    }
                });

                $("#popsrli" + suffix + " > ul:eq(1)").click(function (event) {
                    try {
                        var nodeid = $(event.target).data('nodeid');
                        removeNode(nodeid, true);
                    } catch (e) {}
                });
            }

            /**
             * 
             */
            function bindSendClick() {
                $("input[name='smsAwork" + suffix + "']").click(function () {
                    if ($("input[name='smsAwork" + suffix + "']").is(':checked')) {
                        $("#sms_awoke_div").css("display", "");
                    } else {
                        $("#sms_awoke_div").css("display", "none");
                    }
                });
                $("#goBuy").click(function () {
                    if (!!window.ActiveXObject && !window.XMLHttpRequest) { //ie6
                        window.open("/module/purchase/index.do");
                    } else {
                        parent.parent.tm.tab.show('RA21B1');
                    }
                });
            }

            // 判断指定的节点是否选中
            function isExistNode(id, type) {
                type = getNodeType(type);
                var result = false;
                $.each(nodes, function (i, node) {
                    if (node.id == id && node.type == type) {
                        result = true;
                        return false;
                    }
                });
                return result;
            }

            /**
             * 添加一个用户到数组中并返回新数组，保证用户唯一性
             * @param node
             */
            function addNode(node) {
                //显示到右面板中
                if (document.getElementById('uid_' + node.id + "-" + node.type) == null) {
                    nodes.push(node);

                    var iconClass = 'ico_employee';
                    if (node.type == 'dept') {
                        iconClass = 'ico_dept';
                    } else if (node.type == 'duty') {
                        iconClass = 'ico_duty';
                    }
                    var $nodeli;
                    if (node.fromEnc) {
                        $nodeli = $("<li id='uid_" + node.id + "-" + node.type + "' data-nodeid='" + node.id + "-" + node.type + "' class='clearfix " + iconClass + "'></li>")
                            .append("<a title='" + node.name + "' data-nodeid='" + node.id + "-" + node.type + "'>" + node.name + "(友)</a>")
                            .append("<span data-nodeid='" + node.id + "-" + node.type + "' class='dialogtree-close'></span>");
                    } else {
                        $nodeli = $("<li id='uid_" + node.id + "-" + node.type + "' data-nodeid='" + node.id + "-" + node.type + "' class='clearfix " + iconClass + "'></li>")
                            .append("<a title='" + node.name + "' data-nodeid='" + node.id + "-" + node.type + "'>" + node.name + "</a>")
                            .append("<span data-nodeid='" + node.id + "-" + node.type + "' class='dialogtree-close'></span>");
                    }
                    $("#popsrli" + suffix + " > ul:eq(1)").append($nodeli);
                }
                resetSelectTip();
            }

            /**
             * 移除一个用户
             * @param nodeid
             * @param sync
             */
            function removeNode(nodeid, sync) {
                var uid = nodeid.split('-')[0];
                if ($('#uid_' + nodeid).length > 0) {
                    $('#uid_' + nodeid).remove();

                    var index = -1;
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].id == uid) {
                            index = i;
                            break;
                        }
                    }
                    if (index >= 0) {
                        nodes.splice(index, 1);
                    }

                    if (sync) {
                        var tree = $.fn.zTree.getZTreeObj(treeId); //可以优化
                        var node = tree.getNodesByFilter(function (n) {
                            if (n.id == uid) {
                                return true;
                            }
                            return false;
                        }, true);

                        if (node != null) {
                            tree.checkNode(node, false, true);
                        }
                    }

                    // 恢复搜索添加
                    var type = nodeid.split('-')[1];
                    var $node = $("#node_" + suffix + type + uid.split('-')[0]);
                    if ($node.length > 0) {
                        $node.removeClass('text');
                        $node.html("<button class='btn'>" + tree_lang.add + "</button>");
                    }
                }
                resetSelectTip();
            }

            function resetSelectTip() {
                $("#nodeSelected" + suffix).text(nodes.length);
                if (nodes.length > option.maxSelectTip &&
                    nodes.length <= option.maxSelect) {
                    $("#nodeSelected" + suffix).removeClass("remark_r");
                    $("#selected0" + suffix).removeClass("hide");
                    $("#selected1" + suffix).addClass("hide");
                    $("#nodeRemainSelected" + suffix).text(option.maxSelect - nodes.length);
                }

                // 大于最大选择树
                if (nodes.length > option.maxSelect) {
                    $("#nodeSelected" + suffix).addClass("remark_r");
                    $("#selected0" + suffix).addClass("hide");
                    $("#selected1" + suffix).removeClass("hide");
                    $("#nodeOverSelected" + suffix).text(nodes.length - option.maxSelect);
                }

                if (nodes.length <= option.maxSelectTip) {
                    $("#nodeSelected" + suffix).removeClass("remark_r");
                    $("#selected0" + suffix).addClass("hide");
                    $("#selected1" + suffix).addClass("hide");
                }
            }

            function getNodeIds(type) {
                var ids = [];
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].type == type) {
                        ids.push(nodes[i].id);
                    }
                }
                return ids;
            };

            function getNodeNames(type) {
                var names = [];
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].type == type) {
                        names.push(nodes[i].name);
                    }
                }
                return names;
            };

            this.getSelectedUids = function () {
                return getNodeIds('employee');
            };
            this.getSelectedDeptIds = function () {
                return getNodeIds('dept');
            };
            this.getSelectedDutyIds = function () {
                return getNodeIds('duty');
            };

            this.getSelectedUnames = function () {
                return getNodeNames('employee');
            };
            this.getSelectedDeptNames = function () {
                return getNodeNames('dept');
            };
            this.getSelectedDutyNames = function () {
                return getNodeNames('duty');
            };
            this.getSelectNodes = function () {
                return nodes
            };

            this.destroy = function () {
                if (option.isDialog) {
                    removeJingoalTreeFromWindow(suffix);
                    if (option.callCancelback) {
                        option.callCancelback();
                    }
                }

            };
            return this;
        }
    })());
});
