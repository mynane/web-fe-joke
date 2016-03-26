define(['public/common/jingoal-tools', 'public/common/art-template', 'public/mousewheel/mouse-wheel'], function () {
    utils.load_template(function () {
        /*
        <script type="text/html" charset="utf8" id="template-jingoal-time">
            <div class="input-group">
                <div class="input-right-label input-select vertical-middle"><i class="mid-icon icon-triangle-down"></i></div>
                <div class="text-input-wrap">
                    <input type="text">
                </div>
                <div class="disabled-mask"></div>
            </div>
        </script>
        <script type="text/html" charset="utf8" id="template-jingoal-time-select">
            <ul class="select-list" style="max-height:310px;overflow:auto;">
                {{each list as item}}
                <li class="select-item" value="{{item.value}}" name="{{item.name}}">
                    <a href="javascript:void(0)">{{item.name}}</a>
                </li>
                {{/each}}
            </ul>
        </script>
        */
    });
    /**
     *@author lirongping
     *@Description 创建一个时间组件
     *@Version v1.0
     *@param elemid string 时间组件的input元素
     *@param opt object 设置参数,可以用来设置回调函数
     */
    ;
    (function ($) {
        $.fn.jingoal_time = function (opt) {
            var time = jingoal_time($(this)[0], opt);
            return time;
        }
    })(jQuery);

    function jingoal_time(elemid, opt) {
        var oldValue = null,
            disabled = false;

        function get_focus_position(input) {
            var position = 0;
            if (document.selection) {
                input.focus();
                var sel = document.selection.createRange();
                sel.moveStart("character", -input.value.length);
                position = sel.text.length;
            } else {
                position = input.selectionStart;
            }
            return position;
        }

        function set_input_position(input, start, end) {
            if (input.setSelectionRange) {
                input.setSelectionRange(start, end);
            } else {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveStart("character", start);
                range.moveEnd("character", end);
                range.select();
            }
        }

        function get_input_select_text(input) {
            if (document.selection) {
                var sel_text = document.selection.createRange().text;
            } else {
                if ($.browser.mozilla) {
                    return input.value.substring(input.selectionStart, input.selectionEnd);
                } else {
                    var sel_text = document.getSelection().toString();
                }
            }
            return (typeof sel_text == "undefined") ? 0 : sel_text;
        }

        function set_inputhidden_value(value) {
            if (value != oldValue) {
                //如果存在回调的话
                if (typeof opt.callback !== "undefined") {
                    opt.callback(value);
                }
            }
            time_input_clone.value = value;
            oldValue = value;
        }
        var time_input = (typeof elemid == "string") ? document.getElementById(elemid) : elemid;
        if (typeof time_input != "undefined" && typeof time_input.js_obj != "undefined") {
            return time_input.js_obj;
        }
        if (time_input == null || time_input == undefined) {
            return;
        }
        opt = (typeof opt === "undefined") ? {} : opt;
        //将input转化为隐藏元素
        var time_input_clone = time_input.cloneNode();
        time_input_clone.type = "hidden";
        var time_wrap = $("<div></div>").addClass("time_wrap vertical-middle").append($(time_input_clone));
        var hour_wrap = $("<div style='width:60px;'></div>").addClass("hour_wrap mid-text").appendTo(time_wrap);
        var maohao_wrap = $("<div style='width:10px;text-align:center;'>:</div>").addClass("maohao_wrap mid-text").appendTo(time_wrap);
        var minute_wrap = $("<div style='width:60px;'></div>").addClass("minute_wrap mid-text").appendTo(time_wrap);
        var time_inputs = [],
            time_inputs_wrap = [];
        //监听mousedown元素
        utils.register_monse_down_element();
        //创建时间选择组件
        var create_show = function (wrap, type) { //type指的是小时还是分钟
            //隐藏弹出框
            function hide_popup() {
                try {
                    time_select.style.display = "none";
                    wrap[0].appendChild(time_select);
                } catch (e) {}
            }

            type = (typeof type != "undefined") ? type : "hour";
            var timeInputWrap = $(template("template-jingoal-time", {})).appendTo(wrap);
            timeInputWrap.find(".disabled-mask").click(function (event) {
                event.stopPropagation();
                event.preventDefault();
            });
            var time_input = timeInputWrap.find("input")[0];
            timeInputWrap.click(function (event) {
                time_input.focus();
            });
            time_inputs_wrap.push(timeInputWrap);
            //如果有默认值就自动设置
            if ($.trim(time_input_clone.value) == "") {
                var nowtime = new Date();
            } else {
                if (time_input_clone.value.split(":").length < 1) {
                    time_input_clone.value = "8:30";
                }
                var nowtime = {
                    getHours: function () {
                        var hour = parseInt(time_input_clone.value.split(":")[0]);
                        if (hour > 23 || hour < 0) {
                            hour = 8;
                        }
                        return utils.addZero(hour);
                    },
                    getMinutes: function () {
                        var minute = parseInt(time_input_clone.value.split(":")[1]);
                        if (minute > 59 || minute < 0) {
                            minute = 30;
                        }
                        return utils.addZero(minute);
                    }
                }
            }
            //创建select组件
            var selectList = [];
            if (type == "hour") {
                time_input.value = utils.addZero(nowtime.getHours());
                for (var i = 0; i < 24; i++) {
                    selectList.push({
                        name: utils.addZero(i),
                        value: i
                    });
                }
            } else {
                size = 204;
                time_input.value = utils.addZero(nowtime.getMinutes());
                for (var i = 0; i < 6; i++) {
                    selectList.push({
                        name: i + "0",
                        value: parseInt(i + "0")
                    });
                }
            }
            var time_select = $(template("template-jingoal-time-select", {
                list: selectList
            })).addClass("time_select").appendTo(wrap)[0];
            $(time_select).mousewheelStopPropagation(); //避免滚动相互影响
            time_inputs.push(time_input);
           
            //当从一个input到另一个input的时候，ie的focus事件失灵bug
            if (utils.browser.isIe) {
                $(time_input).click(function () {
                    time_input.focus();
                });
            }
            //选中显示select
            $(time_input).bind("focus", function (event) {
                document.body.appendChild(time_select);
                time_select.style.display = "block";
                var offset = timeInputWrap.offset();
                time_select.style.top = utils.get_absolute_top(time_input.parentNode.parentNode, time_select) + "px";
                time_select.style.left = offset.left + "px";
                utils.mousewheel.disable(time_select);
                setTimeout(function () {
                    if ($.browser.mozilla) {
                        time_input.select();
                    } else {
                        set_input_position(time_input, 0, get_focus_position(time_input));
                    }
                    //设置值
                    var items = $(time_select).find(".select-item");
                    for (var i = 0, len = items.length; i < len; i++) {
                        if (items[i].getAttribute("value") == parseInt(time_input.value)) {
                            $(items[i]).addClass("active");
                            items[i].scrollIntoView();
                        } else {
                            $(items[i]).removeClass("active");
                        }
                    }
                    //监听全局隐藏事件
                    $(document.body).bind("mousedown", function (event) {
                        if (!(JDOM(event.target).isparent_or_owner({
                                elem: time_select
                            }) || JDOM(event.target).isparent_or_owner({
                                elem: time_input
                            }))) {
                            time_input.blur();
                            hide_popup();
                            utils.mousewheel.enable(time_select);
                            $(document.body).unbind("mousedown", arguments.callee);
                        }
                    });
                }, 0);
            });
            $(time_input).bind("blur", function (event) {
                if (related_element != null && JDOM(related_element).isparent_or_owner({
                        className: "time_select"
                    })) {
                    return null;
                }
                hide_popup();
            });
            //input改变的话,改变隐藏元素的值
            $(time_input).bind("change", function (event) {
                var old_value = time_input_clone.value.split(":");
                var input_value = time_input.value;
                time_input.value = utils.addZero(input_value);
                if (type == "hour") {
                    if (input_value > 23 || input_value < 0 || !/^\d+$/.test(input_value)) {
                        time_input.value = utils.addZero(old_value[0]);
                    }
                } else {
                    if (input_value > 59 || input_value < 0 || !/^\d+$/.test(input_value)) {
                        time_input.value = utils.addZero(old_value[1]);
                    }
                }
                set_inputhidden_value(parseInt(time_inputs[0].value) + ":" + parseInt(time_inputs[1].value));
            });
            $(time_input).bind("keydown", function (event) {
                var sel_text = get_input_select_text(time_input);
                if (sel_text.length > 0) {
                    return;
                }
                if (time_input.value.length >= 2) {
                    if ((event.keyCode >= 48 && event.keyCode <= 90) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 32) {
                        event.preventDefault();
                    }
                }
            });
            //select改变的话,改变input的值
            $(time_select).bind("click", function (event) {
                event.stopPropagation();
                var item = $(event.target).findParents(".select-item")[0];
                time_input.value = utils.addZero(item.getAttribute("name"));
                set_inputhidden_value(time_inputs[0].value + ":" + time_inputs[1].value);
                hide_popup();
            });
        }
        create_show(hour_wrap);
        create_show(minute_wrap, "minute");
        //用组件替换text类型的input
        time_input.parentNode.replaceChild(time_wrap[0], time_input);
        time_input_clone.js_obj = {
            setValue: function (time) {
                if (!time) return;
                var time_value = $.trim(time).split(":");
                set_inputhidden_value(time);
                time_inputs[0].value = utils.addZero((time_value[0] > 23 || time_value[0] < 0) ? time_inputs[0].value : time_value[0]);
                time_inputs[1].value = utils.addZero((time_value[1] > 59 || time_value[1] < 0) ? time_inputs[1].value : time_value[1]);
            },
            getValue: function () {
                return time_input_clone.value;
            },
            getHour: function () {
                return time_input_clone.value.split(":")[0];
            },
            getMinute: function () {
                return time_input_clone.value.split(":")[1];
            },
            disable: function (is) {
                for (var i = 0, len = time_inputs_wrap.length; i < len; i++) {
                    if (is) {
                        time_inputs_wrap[i].addClass("disabled");
                    } else {
                        time_inputs_wrap[i].removeClass("disabled");
                    }
                }
            }
        };
        if (opt.defaultValue) {
            time_input_clone.js_obj.setValue(opt.defaultValue);
        }else{
            var nowtime = new Date();
            time_input_clone.js_obj.setValue(nowtime.getHours() + ":" + utils.addZero(nowtime.getMinutes()));
        }
        return time_input_clone.js_obj;
    }
});
