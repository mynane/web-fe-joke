define(["./jingoal-calendar"], function () {
    (function ($) {
        $.fn.jingoal_date_input = function (opt) {
            return jingoalDateInput($(this)[0], opt);
        }
    })(jQuery);
    /**
     * @author lirongping
     * @Description 将一个input元素转化为日期选择器
     * @param elemid 要转化的元素node对象
     * @param opt 要传入的参数和配置
     */
    function jingoalDateInput(elemid, opt) {
        //隐藏弹出框
        function hide_mask() {
            try {
                jingoal_input_date_wrap.style.display = "none";
                input.parentNode.insertBefore(jingoal_input_date_wrap, input);
            } catch (e) {}
        }
        //检测input是否是特殊的值
        function isAllowNull(value) {
            if ((options.isAllowNull || options.isAllowNull.toString() == "") && (value == "" || value == options.isAllowNull)) {
                return true;
            }
            return false;
        }
        //默认参数
        var options = {
            callback: function () {},
            isAllowNull: false,
            date_format: "yyyy" + jingoal_lang.year + "mm" + jingoal_lang.month + "dd" + jingoal_lang.day + "   " + "week",
            addZero: false,
            readonly: false,
            firstWeekDay: 0
        }

        //继承参数
        $.extend(options, opt);
        var input = (typeof elemid == "string") ? document.getElementById("elemid") : elemid,
            oldValue = null;
        if (typeof input != "undefined" && typeof input.js_obj != "undefined") {
            return input.js_obj;
        }
        //监听mousedown元素
        utils.register_monse_down_element();
        if (input == undefined || input == null) {
            return false;
        }
        /*分析参数*/
        if (options.readonly) {
            input.setAttribute("readonly", "true")
            $(input).attr('unselectable', 'on');
            $(input).bind("focus", function (event) {
                event.preventDefault();
                input.blur();
            });
        } else {
            $(input).removeAttr("readonly");
        }
        //日期的格式化函数,将2014/5/12 转化为可读的类似2014年5月12日  星期三
        var yyyy = "(\\d{4})",
            mm = "(\\d{1,2})",
            dd = "(\\d{1,2})";
        var format = options.date_format;
        var date_switch = {
                encode: function (date) { //日期的格式化函数,将2014/5/12 转化为可读的类似2014年5月12日  星期三
                    var reg = /^(\d+)\/(\d+)\/(\d+)$/;
                    var result = reg.exec(date);
                    if (result == null) return;
                    var week = jingoal_calendar_engine.get_day_week(result[3], result[1] + "/" + result[2]);
                    var year = options.addZero ? utils.addZero(result[1]) : result[1];
                    var month = options.addZero ? utils.addZero(result[2]) : result[2];
                    var day = options.addZero ? utils.addZero(result[3]) : result[3];
                    return format.replace("yyyy", year).replace("mm", month).replace("dd", day).replace("week", week);
                },
                decode: function (datestr) {
                    var reg = new RegExp("^" + format.replace("yyyy", yyyy).replace("mm", mm).replace("dd", dd).replace("week", ".+") + "$");
                    var result = reg.exec(datestr);
                    if (result == null) {
                        return false;
                    } else {
                        return utils.format_date(result[1] + "/" + result[2] + "/" + result[3]);
                    }
                }
            }
            //创建对应的日历元素
        var jingoal_input_date_wrap = document.createElement("div");
        jingoal_input_date_wrap.className = "jingoal_input_date_wrap";
        $(jingoal_input_date_wrap).mousewheelStopPropagation(); //避免滚动相互影响

        input.parentNode.insertBefore(jingoal_input_date_wrap, input);
        $(jingoal_input_date_wrap).click(function (event) {
            event.stopPropagation();
        });
        //创建一个日历对象
        var dateplugin = new jingoal_calendar(jingoal_input_date_wrap, options);
        //设置input的值
        var set_input_value = function (input, value) {
                function setValue_noCursor(input, value) {
                    function get_focus_position(input) {
                        var position;
                        if (document.selection) {
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
                            range.move("character", start);
                            range.select();
                        }
                    }
                    if (/msie|Trident/gi.test(navigator.userAgent) && !input.getAttribute("readonly") && document.activeElement == input) {
                        var position = get_focus_position(input);
                        input.value = value;
                        set_input_position(input, position, position);
                    } else {
                        input.value = value;
                    }
                }
                if (isAllowNull(value)) {
                    var now = new Date();
                    dateplugin.show(now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate());
                    setValue_noCursor(input, options.isAllowNull);
                    input.setAttribute("date", options.isAllowNull);
                    input.setAttribute("date-lang", options.isAllowNull);
                } else {
                    dateplugin.show(value);
                    setValue_noCursor(input, date_switch.encode(dateplugin.getDate(), dateplugin.getWeek()));
                    input.setAttribute("date", value);
                    input.setAttribute("date-lang", (new Date(value)).getTime());
                }
                var date = input.getAttribute("date");
                if (oldValue != date) {
                    if (typeof options.callback !== "undefined") {
                        options.callback(date);
                    }
                    oldValue = date;
                }
            }
            //用于修改input的值
        var show_input_value = function (input) {
            if (isAllowNull(input.value)) {
                set_input_value(input, options.isAllowNull);
                return;
            }
            var value = date_switch.decode(input.value);
            if (value) {
                set_input_value(input, value);
            } else {
                set_input_value(input, dateplugin.getDate());
            }
        }

        //如果有默认值,就自动设置
        if (input.getAttribute("date") != null||options.defaultValue) {
            set_input_value(input, input.getAttribute("date")||options.defaultValue);
        } else {
            set_input_value(input, dateplugin.getDate());
        }
        //设置回调函数
        dateplugin.setOption({
            callback: function (day) {
                set_input_value(input, day);
                hide_mask();
            }
        });
        //当从一个input到另一个input的时候，ie的focus事件失灵bug
        if (utils.browser.isIe) {
            $(input).click(function () {
                input.focus();
            });
        }
        //监听input的click事件
        var inputFocusFunction,inputGroupElem;
        $(input).bind(options.readonly ? "click" : "focus", inputFocusFunction = function () {
            show_input_value(input);
            //将起立放到相应的地方
            document.body.appendChild(jingoal_input_date_wrap);
            jingoal_input_date_wrap.style.display = "block";
            var input_offset = $(input).offset();
            jingoal_input_date_wrap.style.top = utils.get_absolute_top(input, jingoal_input_date_wrap) + "px";
            jingoal_input_date_wrap.style.left = input_offset.left + "px";
            utils.mousewheel.disable(jingoal_input_date_wrap);
            setTimeout(function () {
                //监听全局隐藏事件
                $(document.body).bind("mousedown", function (event) {
                    if (!(JDOM(event.target).isparent_or_owner({
                            elem: jingoal_input_date_wrap
                        }) || JDOM(event.target).isparent_or_owner({
                            elem: input
                        }))) {
                        input.blur();
                        hide_mask();
                        $(document.body).unbind("mousedown", arguments.callee);
                        utils.mousewheel.enable();
                    }
                });
            }, 0);
        });
        //对新版台历做一些特殊处理，以后可以删掉
        if((inputGroupElem = $(input).findParents(".input-group")) && $(inputGroupElem).find(".icon-triangle-down")){
            $(inputGroupElem).find(".input-right-label").bind("click", inputFocusFunction);
        }
        if (!options.readonly) {
            $(input).blur(function () {
                if (related_element != null && JDOM(related_element).isparent_or_owner({
                        className: "jingoal_input_date_wrap"
                    })) {
                    return null;
                }
                hide_mask();
            });
        }
        $(input).change(function () {
            show_input_value(input);
        });
        //对外提供接口
        input.js_obj = {
            setValue: function (date) {
                if(!date) return;
                date = utils.format_date(date);
                dateplugin.show(date);
                set_input_value(input, date);
            },
            getLangValue: function () {
                return input.getAttribute("date-lang");
            },
            getDate: function () {
                return input.getAttribute("date");
            },
            getValue: function () {
                return input.getAttribute("date");
            },
            setStart: function (date) {
                date = utils.format_date(date);
                dateplugin.setStart(date);
            },
            setEnd: function (date) {
                date = utils.format_date(date);
                dateplugin.setEnd(date);
            }
        };
        return input.js_obj;
    }
});
