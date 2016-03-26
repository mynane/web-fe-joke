define(function (require, exports, module) {
    /**
     *@param {parent} 分页控件的父对象 
     *@param {option.allpages} 一共有多少数据
     *@param {option.pageshow} 每页有多少数据
     *@param {option.current} 当前是第几页
     *@param {option.showpages} 最少显示几个元素,默认5个
     *@param {option.maxShowPage} 总页数少于多少就全部显示
     *@param {func} 点击的回调函数
     *@css paging_content分页容器,page_item每页的按钮,focus当前页按钮,page-ellipsis省略号的元素
     *@css page_item_content分页按钮的容器,middle_item_content 第二种情况两边都有省略号是的分页按钮容器,方便与省略号区别开
     *@css paging_li page_prev page_next
     */
    function jingoalPaging(parent, options, func) {
        var allnums = options.allpages,
            everynums = options.pageshow || 10,
            current_page = options.current || 1,
            temp = parseInt(allnums / everynums),
            allpages = allnums % everynums == 0 ? temp : temp + 1,
            showpages = options.showpages || 7,
            maxShowPage = 10,
            unique_id = new Date() * 1;
        if (allpages <= 1) return;
        var offset = showpages % 2 == 0 ? (showpages / 2 - 1) : parseInt(showpages / 2);
        var page_content = $.createElem({
            nodeName: "ul",
            className: "page-list",
            allpages: allpages,
            unselectable: "on"
        });
        var create_item = {
                item: function (index) {
                    return $.createElem({
                        nodeName: "li",
                        className: index == current_page ? "page-item page-item-active" : "page-item",
                        id: unique_id + index,
                        innerHTML: index
                    });
                },
                elipsis: function () {
                    return $.createElem({
                        nodeName: "li",
                        className: "page-ellipsis",
                        innerHTML: "..."
                    });
                }
            }
            //生成分页的四种状态
        var createpage = {
                page0: function (current_page) {
                    if (page_content.getAttribute("state") == 0) {
                        change_focus(current_page);
                    } else {
                        var frag = document.createDocumentFragment();
                        for (var i = 1; i <= allpages; i++) {
                            var item = create_item.item(i);;
                            frag.appendChild(item);
                        }
                        item_content.innerHTML = "";
                        item_content.appendChild(frag);
                        page_content.setAttribute("state", 0);
                    }
                },
                page1: function (current_page) {
                    if (page_content.getAttribute("state") == 1) {
                        change_focus(current_page);
                    } else {
                        var frag = document.createDocumentFragment();
                        //前部
                        for (var i = 1; i <= showpages; i++) {
                            var item = create_item.item(i);;
                            frag.appendChild(item);
                        }
                        //省略
                        var page_elipsis = create_item.elipsis();
                        frag.appendChild(page_elipsis);
                        //最后
                        var page_last = create_item.item(allpages);
                        frag.appendChild(page_last);

                        item_content.innerHTML = "";
                        item_content.appendChild(frag);

                        page_content.setAttribute("state", 1);
                    }
                },
                page2: function (current_page) {
                    if (page_content.getAttribute("state") == 2) {
                        change_focus(current_page, true);
                    } else {
                        var frag = document.createDocumentFragment();
                        var page_first = create_item.item(1);
                        frag.appendChild(page_first);

                        var page_elipsis = create_item.elipsis();
                        frag.appendChild(page_elipsis);

                        var middle_item_content = $.createElem({
                            nodeName: "div",
                            className: "middle_item_content inline-block",
                            id: unique_id + "middle_item_content"
                        });
                        frag.appendChild(middle_item_content);
                        for (var i = current_page - offset; i <= current_page + offset; i++) {
                            var item = create_item.item(i);
                            middle_item_content.appendChild(item);
                        }
                        var page_elipsis = create_item.elipsis();
                        frag.appendChild(page_elipsis);

                        var page_last = create_item.item(allpages);
                        frag.appendChild(page_last);

                        item_content.innerHTML = "";
                        item_content.appendChild(frag);

                        page_content.setAttribute("state", 2);
                    }
                },
                page3: function (current_page) {
                    if (page_content.getAttribute("state") == 3) {
                        change_focus(current_page);
                    } else {
                        var frag = document.createDocumentFragment();
                        var page_first = create_item.item(1);
                        frag.appendChild(page_first);

                        var page_elipsis = create_item.elipsis();
                        frag.appendChild(page_elipsis);

                        for (var i = allpages - showpages + 1; i <= allpages; i++) {
                            var item = create_item.item(i);
                            frag.appendChild(item);
                        }

                        item_content.innerHTML = "";
                        item_content.appendChild(frag);

                        page_content.setAttribute("state", 3);
                    }
                }
            }
            //上一页
        var page_prev = $.createElem({
            nodeName: "li",
            unselectable: "on",
            className: "page-btn-prev",
            innerHTML: "上一页"
        });
        page_content.appendChild(page_prev);
        //分页
        var item_content = $.createElem({
            nodeName: "li",
            className: "page_item_content inline-block"
        });
        page_content.appendChild(item_content);
        //下一页
        var page_next = $.createElem({
            nodeName: "li",
            unselectable: "on",
            className: "page-btn-next",
            innerHTML: "下一页"
        });
        page_content.appendChild(page_next);

        function go_index(value, init) {
            if (value > allpages) {
                value = allpages;
            }
            current_page = value;
            if (allpages <= maxShowPage) {
                createpage.page0(value);
            } else {
                if (value < showpages) {
                    createpage.page1(value);
                } else if (value > allpages - showpages + 1) {
                    createpage.page3(value);
                } else {
                    createpage.page2(value);
                }
            }
            if (current_page == 1) {
                $(page_prev).addClass("disabled");
            } else {
                $(page_prev).removeClass("disabled");
            }
            if (current_page == allpages) {
                $(page_next).addClass("disabled");
            } else {
                $(page_next).removeClass("disabled");
            }
            change_current(value, init);
            $(page_prev).removeClass("disable");
            $(page_next).removeClass("disable");
            console.log(value,page_prev);
            if(value == allpages){
                $(page_next).addClass("disable");
            }else if(value==1){
                $(page_prev).addClass("disable");
            }
        }
        //添加点击事件
        $(page_content).bind("click", function (event) {
            var target = event.target;
            if (target.className == "page-item") {
                var value = parseInt(target.innerHTML);
                go_index(value);
            } else if (target.className.indexOf("page-btn-prev") >= 0) {
                var current = parseInt(page_content.getAttribute("nowpage")) - 1;
                if (current < 1) {
                    return null;
                }
                go_index(current);
            } else if (target.className.indexOf("page-btn-next") >= 0) {
                var current = parseInt(page_content.getAttribute("nowpage")) + 1;
                if (current > allpages) {
                    return null;
                }
                go_index(current);
            }
        });
        parent.appendChild(page_content);
        //change焦点
        function change_focus(now, is_two) {
            if (is_two) {
                var items = new Array();
                for (var i = now - offset; i <= now + offset; i++) {
                    items.push(i);
                }
                var ochilds = document.getElementById(unique_id + "middle_item_content").childNodes;
                for (var i = 0, len = ochilds.length; i < len; i++) {
                    var item = ochilds[i];
                    if (item.nodeType == 1) {
                        item.innerHTML = items[i];
                        if (items[i] == now) {
                            item.className = "page-item page-item-active";
                        } else {
                            item.className = "page-item";
                        }
                        item.id = unique_id + items[i];
                    }
                }
                return null;
            }
            var ochilds = item_content.childNodes;
            for (var i = 0, len = ochilds.length; i < len; i++) {
                var item = ochilds[i];
                if (item.className != "page-ellipsis") {
                    item.className = "page-item";
                }
                if (item.innerHTML == now) {
                    item.className = "page-item page-item-active";
                }
            }
        }

        function change_current(now, init) {
            page_content.setAttribute("nowpage", now);
            if (!init) func(now, everynums);
        }
        setTimeout(function () {
            go_index(current_page, "init");
        }, 0);
        var returnValue = {
            reload: function (an) { //供删除的时候使用,删除后更新分页状态
                if (typeof an != "undefined") {
                    allnums = an;
                } else {
                    allnums = allnums - 1;
                }
                temp = parseInt(allnums / everynums),
                    allpages = allnums % everynums == 0 ? temp : temp + 1;
                page_content.setAttribute("state", "-1");
                if (allnums == 0) {
                    parent.pageObj = false;
                    parent.innerHTML = "";
                    return;
                }
                if (allpages == 1) {
                    parent.pageObj = false;
                    parent.innerHTML = "";
                    func(1, everynums);
                }
                go_index(current_page);
            }
        }
        parent.pageObj = returnValue;
        return returnValue;
    }
    module.exports = jingoalPaging;
    $.fn.jingoalPaging = function(options, func){
        return new jingoalPaging(this[0],options, func);
    }
});
