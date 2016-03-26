define(['public/common/jingoal-tools','public/common/art-template','public/mousewheel/mouse-wheel'],function () {
    utils.load_template(function () {
        /*
        <script type="text/html" id="template_jingoal_mark">
            <div class="select-wrap" style="width:100%;position:relative;">
                <i class="icon-cross-del del_mark_btn" style="position:absolute;right:28px;top:11px;z-index: 1;display:none;cursor:pointer;"></i>
                <div class="input-group" style="width:100%;">
                    <div class="add-on input-right-label input-select vertical-middle"><i class="choose_mark_btn mid-icon icon-triangle-down"></i></div>
                    {{if !searchAble}}
                    <div class="text-input-wrap readonly">
                        <span class="textlike w-tag" data-id="{{#current_mark.id}}">{{#current_mark.name}}</span>
                    </div>
                    {{else}}
                    <div class="text-input-wrap">
                        <input class="w-tag" data-id="{{#current_mark.id}}" type="text" value="{{#current_mark.name}}">
                    </div>
                    {{/if}}
                </div>
                <div class="dropdown-menu w-choose-dropmenu" style="display:none;">
                    <ul class="select-list mark_list" style="max-height:307px;width:100%;overflow-x:hidden;overflow-y:auto;">
                        {{each mark_list as mark index}}
                        <li class="select-item" data-id="{{mark.id}}">
                            <a href="javascript:void(0)">{{mark.name}}</a>
                        </li>
                        {{/each}}
                    </ul>
                    {{if bottom_btn}}
                        <div class="newcal-bottom bottom_btn"><i class="muted">{{#bottom_btn.name}}</i></span></div>
                    {{/if}}
                </div>
            </div>
        </script>
         */
    });;
    (function ($) {
        /*
        国际化
         */
        utils.create_i18n({
            zh_CN: {
                default_mark_title: "选择标签",
                noSearchMark: "未找到结果"
            },
            zh_TW: {
                default_mark_title: "選擇標簽",
                noSearchMark: "未找到結果"
            }
        });
        $.fn.jingoal_mark_choose = function (mark_data) {
            var default_mark_data = {
                default_mark_title: jingoal_lang.default_mark_title,
                current_mark: {
                    name: jingoal_lang.default_mark_title,
                    id: "-1"
                },
                callback:function(){},
                bottom_btn: false
            };
            //隐藏弹框事件监听函数
            var document_hide_popup_function;
            if (typeof mark_data.default_mark_title != "undefined") {
                default_mark_data.current_mark.name = mark_data.default_mark_title;
            }
            mark_data = $.extend(default_mark_data, mark_data);
            var default_mark_title = mark_data.default_mark_title;
            //增加新的参数
            if(mark_data.defaultValue!=undefined){
                for(var i=0,len=mark_data.mark_list.length;i<len;i++){
                    if(mark_data.mark_list[i].id == mark_data.defaultValue){
                        mark_data.current_mark = {
                            name:mark_data.mark_list[i].name,
                            id:mark_data.mark_list[i].id
                        };
                        break;
                    }
                }
            }
            var mark_input = $(this)[0];
            if (JDOM(mark_input).isparent_or_owner({
                    className: "jin_mark_choose"
                })) {
                return
            }
            if ($.trim(mark_input.value) != "" && mark_input.getAttribute("data-id") != null && mark_input.getAttribute("data-id") != "") {
                mark_data.current_mark = {
                    name: mark_input.value,
                    id: mark_input.getAttribute("data-id")
                }
            }
            var html = template('template_jingoal_mark', mark_data);
            var mark_choose_wrap = $("<div class=\"jin_mark_choose\"></div>");
            mark_choose_wrap.html(html);
            var input_wrap = mark_choose_wrap.find(".select-wrap")[0];
            var current_mark_elem = mark_choose_wrap.find(".w-tag")[0];
            var choose_mark_btn = mark_choose_wrap.find(".choose_mark_btn")[0];
            var del_mark_btn = mark_choose_wrap.find(".del_mark_btn")[0];
            var bottom_btn = mark_choose_wrap.find(".bottom_btn")[0];
            //检测是否存在底部按钮事件，存在的话监听事件
            var bottom_btn = mark_choose_wrap.find(".bottom_btn")[0];
            if (typeof bottom_btn != "undefined") {
                if (mark_data.bottom_btn.callback) {
                    $(bottom_btn).bind("click", function () {
                        hide_dropdown_menu();
                        mark_data.bottom_btn.callback();
                    });
                }
            }
            //遮罩层,为了浮出弹出框外面
            var dropdown_menu = mark_choose_wrap.find(".dropdown-menu")[0];
            $(dropdown_menu).find(".mark_list").mousewheelStopPropagation(); //避免滚动相互影响
            //监听mousedown元素
            utils.register_monse_down_element();
            $(current_mark_elem).blur(function () {
                if (related_element != null && (JDOM(related_element).isparent_or_owner({
                        className: "dropdown-menu"
                    }) || JDOM(related_element).isparent_or_owner({
                        className: "add-on"
                    }))) {
                    return null;
                }
                try {
                    hide_dropdown_menu();
                } catch (e) {}
            });
            var mark_list = mark_choose_wrap.find(".mark_list")[0];
            var mark_list_children = mark_list.childNodes;
            var current_mark = null;
            //兼容ie8- ie8-元素删除之后，内容获取不到，保存当前的选择值
            function save_current_mark(elem) {
                current_mark = {
                    name: $.trim($(elem).text()),
                    id: elem.getAttribute("data-id")
                };
            }
            //创建标签列表
            function create_mark_list(mark_list_data) {
                if (mark_list_data.length == 0) {
                    mark_list.innerHTML = "<div class=\"muted noinfo\" style=\"margin-left:5px;\">" + jingoal_lang.noSearchMark + "</div>";
                    return false;
                }
                mark_list.innerHTML = "";
                var frag = document.createDocumentFragment();
                //给当前的标签加上active
                var current_mark_value = mark_input_hidden.getAttribute("data-id");
                for (var i = 0, len = mark_list_data.length; i < len; i++) {
                    var span = document.createElement("li");
                    span.setAttribute("data-id", mark_list_data[i].id);
                    span.className = "select-item";
                    $(span).html('<a href="javascript:void(0)">'+utils.htmlEncode(mark_list_data[i].name)+'</a>');
                    if (typeof mark_list_data[i].title != "undefined") {
                        $(span).attr("title", mark_list_data[i].title);
                    }
                    if (current_mark_value == mark_list_data[i].id) {
                        $(span).addClass("active");
                    }
                    if (len == 1) {
                        $(span).addClass("active");
                    }
                    frag.appendChild(span);
                }
                mark_list.appendChild(frag);
            }
            //隐藏弹出框
            function hide_dropdown_menu() {
                var result_children = [];
                mark_list_children = mark_list.childNodes;

                for (var i = 0, len = mark_list_children.length; i < len; i++) {
                    if ($(mark_list_children[i]).hasClass("active")) {
                        result_children.push(mark_list_children[i]);
                    }
                }
                if (result_children.length == 1) {
                    save_current_mark(result_children[0]);
                }
                change_mark_value();
                dropdown_menu.style.display = "none";
                mark_list.style.maxHeight = "307px";
                mark_choose_wrap[0].appendChild(dropdown_menu);
                current_mark_elem.blur();
                //弹窗隐藏时，执行的操作
                utils.mousewheel.enable(); //允许body体滚动
                $(document.body).unbind("mousedown", document_hide_popup_function);
            }
            //显示弹出框
            function show_dropdown_menu() {
                //先把弹出元素放到body体里面，防止出现滚动条
                document.body.appendChild(dropdown_menu);
                var input_wrap_rect = input_wrap.getBoundingClientRect();
                var input_wrap_offset = $(input_wrap).offset();
                var window_height = $(window).height();
                dropdown_menu.style.left = input_wrap_offset.left + "px";
                if (window_height - input_wrap_rect.bottom <= $(dropdown_menu).height()) {
                    if (input_wrap_rect.top < $(dropdown_menu).height()) {
                        dropdown_menu.style.bottom = "auto";
                        dropdown_menu.style.top = parseInt(input_wrap_offset.top) + 30 + "px";
                        mark_list.style.maxHeight = window_height - input_wrap_rect.bottom - 34 + "px";
                    } else {
                        dropdown_menu.style.top = "auto";
                        dropdown_menu.style.bottom = (window_height - parseInt(input_wrap_offset.top)) + "px";
                    }
                } else {
                    dropdown_menu.style.bottom = "auto";
                    dropdown_menu.style.top = parseInt(input_wrap_offset.top) + 30 + "px";
                }
                dropdown_menu.style.width = input_wrap.offsetWidth-2+"px";
                //先把弹出元素放到body体里面，防止出现滚动条
                create_mark_list(mark_data.mark_list);
                dropdown_menu.style.display = "block";
                utils.mousewheel.disable(mark_list); //弹框弹出后，禁止body滚动，防止错位
                setTimeout(function () {
                    //监听全局隐藏事件
                    $(document.body).bind("mousedown", document_hide_popup_function = function (event) {
                        if (!(JDOM(event.target).isparent_or_owner({
                                elem: dropdown_menu
                            }) || JDOM(event.target).isparent_or_owner({
                                elem: input_wrap
                            }))) {
                            hide_dropdown_menu();
                        }
                    });
                }, 0);

            }
            //改变标签值
            function change_mark_value(obj) {
                function set_value(val) {
                    if(current_mark_elem.nodeName=="INPUT"){
                        current_mark_elem.value = val.name;
                    }else{
                        current_mark_elem.innerHTML = val.name;
                    }
                    mark_input_hidden.value = val.name;
                    mark_input_hidden.setAttribute("data-id", val.id);
                    /*判断这个值是否存在在列表中*/
                    var is_disabled = true;
                    for (var i = 0; i < mark_data.mark_list.length; i++) {
                        if (mark_data.mark_list[i].id == val.id) {
                            is_disabled = false;
                        }
                    }
                    if (is_disabled) {
                        $(current_mark_elem).addClass("muted");
                    } else {
                        $(current_mark_elem).removeClass("muted");
                    }
                    mark_data.callback({value:val.id,name:val.name});
                }
                setObj = null;
                if (obj !== undefined) {
                    for (var i = 0; i < mark_data.mark_list.length; i++) {
                        console.log(mark_data.mark_list[i].id ,obj);
                        if (mark_data.mark_list[i].id == obj) {
                            setObj = {
                                id:obj,
                                name:mark_data.mark_list[i].name
                            };
                        }
                    }
                    if(!setObj){
                        setObj = {
                            name: default_mark_title,
                            id: -1
                        }
                    }
                }
                console.log(setObj);
                if (setObj) {
                    set_value(setObj);
                    current_mark = setObj;
                } else if (current_mark == null) { //如果第一次设置的话
                    set_value({
                        name: mark_data.current_mark.name,
                        id: mark_data.current_mark.id
                    });
                } else { //已经设置过值
                    set_value({
                        name: current_mark.name,
                        id: current_mark.id
                    });
                }
            }
            //设置默认选项,在这里设置了current_mark 这个值是全局设置值的枢纽
            for (var i = 0, j = 0, len = mark_list_children.length; i < len; i++) {
                if (mark_list_children[i].nodeType != 1) {
                    continue;
                }
                $(mark_list_children[i]).text(mark_data.mark_list[j].name);
                j++;
                if (mark_list_children[i].getAttribute("data-id") == mark_data.current_mark.id) {
                    mark_list_children[i].className = "active";
                    save_current_mark(mark_list_children[i]);
                    break;
                }
            }
            //添加时间删除触发标记
            mark_data.searchAble && $(mark_choose_wrap).mouseover(function () {
                var value = $.trim(current_mark_elem.value);
                if (value != "" && value != default_mark_title) {
                    del_mark_btn.style.display = "block";
                }
            });
            mark_data.searchAble && $(mark_choose_wrap).mouseout(function () {
                del_mark_btn.style.display = "none";
            });
            //当从一个input到另一个input的时候，ie的focus事件失灵bug
            if (utils.browser.isIe) {
                $(current_mark_elem).click(function () {
                    current_mark_elem.focus();
                });
            }
            //添加过滤事件
            $(current_mark_elem).bind(mark_data.searchAble?"focus":"click",function () {
                current_mark_elem.value = "";
                show_dropdown_menu();
                del_mark_btn.style.display = "none";
            });
            $(current_mark_elem).bind("input propertychange", function () {
                // ie10+  当input元素为空值时，blur也会触发input事件，这是bug，兼容这个操作
                if (document.activeElement != current_mark_elem) {
                    return false;
                }
                var value = current_mark_elem.value;
                if ($.trim(value) != "") {
                    var search_str = $.trim(value).replace(/(?:\s+)/g, "|");
                    var match_data = [];
                    var mark_list_data = utils.copy_object(mark_data.mark_list);
                    var reg = new RegExp(search_str, "g");
                    for (var i = 0, len = mark_list_data.length; i < len; i++) {
                        if (mark_list_data[i].name.match(reg)) {
                            match_data.push(mark_list_data[i]);
                        }
                    }
                    if (match_data.length == 0) {
                        mark_list.innerHTML = "<div class=\"muted noinfo\" style=\"margin-left:5px;\">" + jingoal_lang.noSearchMark + "</div>";
                        return false;
                    }
                    create_mark_list(match_data);
                } else {
                    create_mark_list(mark_data.mark_list);
                }
            });
            //键盘快捷选择
            $(current_mark_elem).keyup("keyup", function (event) {
                var getActive = function () {
                    mark_list_children = mark_list.childNodes;
                    for (var i = 0, len = mark_list_children.length; i < len; i++) {
                        if ($(mark_list_children[i]).hasClass("active")) {
                            return mark_list_children[i];
                        }
                    }
                    return mark_list_children[0] != undefined ? mark_list_children[0] : null;
                }
                if (event.keyCode == 40) {
                    var active_span = getActive();
                    if (active_span != null) {
                        if (active_span.nextSibling != null && $(active_span).hasClass("active")) {
                            $(active_span).removeClass("active");
                            $(active_span.nextSibling).addClass("active");
                            save_current_mark(active_span.nextSibling);
                        } else {
                            $(active_span).addClass("active");
                            save_current_mark(active_span);
                        }
                    }
                } else if (event.keyCode == 38) {
                    var active_span = getActive();
                    if (active_span != null) {
                        if (active_span.previousSibling != null && $(active_span).hasClass("active")) {
                            $(active_span).removeClass("active");
                            $(active_span.previousSibling).addClass("active");
                            save_current_mark(active_span.previousSibling);
                        } else {
                            $(active_span).addClass("active");
                            save_current_mark(active_span);
                        }
                    }
                } else if (event.keyCode == 13) {
                    var childs = mark_list.childNodes;
                    for (var i = 0, len = childs.length; i < len; i++) {
                        var span = childs[i];
                        if ($(span).hasClass("active")) {
                            save_current_mark(span);
                            change_mark_value();
                            hide_dropdown_menu();
                        }
                    }
                }
            });
            //添加监听事件
            mark_choose_wrap.click(function (event) {
                var target = event.target;
                if (JDOM(target).isparent_or_owner({
                        className: "add-on"
                    })) {
                    if (dropdown_menu.style.display == "none") {
                        current_mark_elem.focus();
                        current_mark_elem.click();
                    } else {
                        hide_dropdown_menu();
                    }
                    del_mark_btn.style.display = "none";
                } else if ($(target).hasClass("del_mark_btn")) { //移除标签
                    change_mark_value(-1);
                    del_mark_btn.style.display = "none";
                }
            });
            $(dropdown_menu).click(function (event) {
                var target = $(event.target).findParents(".select-item");
                if(!target) return;
                target = target[0];
                if ($(target).hasClass("noinfo")) {
                    return
                }
                if ($(target.parentNode).hasClass("mark_list")) {
                    save_current_mark(target);
                    $(target).addClass("active");
                    $(target).siblings().removeClass("active");
                    change_mark_value();
                    hide_dropdown_menu();
                }
            });
            //克隆input为hidden元素
            var mark_input_hidden = mark_input.cloneNode();
            mark_input_hidden.type = "hidden";
            //初始化值
            change_mark_value();
            mark_choose_wrap.append($(mark_input_hidden));
            mark_input.parentNode.replaceChild(mark_choose_wrap[0], mark_input);
            return {
                insertItem: function (obj) {
                    mark_data.mark_list.push(obj);
                },
                setValue: function (obj) {
                    change_mark_value(obj);
                },
                reload: function(arr,defaultValue){
                    defaultValue = defaultValue||0;
                    mark_data.mark_list = arr;
                    mark_data.current_mark = {
                        name:mark_data.mark_list[defaultValue].name,
                        id:mark_data.mark_list[defaultValue].id
                    };
                    current_mark=null;
                    change_mark_value();
                },
                setOption:function(obj){
                    for(var i in obj){
                        mark_data[i] = obj[i];
                    }
                }
            }
        }
    })(jQuery);
});
