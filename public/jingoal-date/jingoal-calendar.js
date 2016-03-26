define(['public/common/jingoal-tools','public/common/art-template'], function (tempdate) {
    utils.load_template(function () {
        /*
        <script type="text/html" charset="utf8" id="template_jingoal_multiple_calendar">
        <table class="table table-condensed noborder day-attend jingoal-calendar">
            <thead>
                <tr>
                    <th class="textright" colspan="2">
                        <i class="commpic-left ch"></i>
                    </th>
                    <th class="textcenter" colspan="3">
                        <div> </div>
                    </th>
                    {{if todayBtn}}
                    <th colspan="2">
                        <i class="commpic-right ch"></i>
                    </th>
                    {{else}}
                    <th>
                        <i class="commpic-right ch"></i>
                    </th>
                    <th>
                        <button class="today-btn"></button>
                    </th>
                    {{/if}}
                </tr>
                <tr>
                    <th> </th>
                    <th> </th>
                    <th> </th>
                    <th> </th>
                    <th> </th>
                    <th> </th>
                    <th> </th>
                    </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="old"><div>28</div></td>
                    <td class="old"><div>29</div></td>
                    <td class="old"><div>30</div></td>
                    <td class="old"><div>31</div></td>
                    <td><div class="active">1</div></td>
                    <td><div>2</div></td>
                    <td><div>3</div></td>
                </tr>
            </tbody>
        </table>
        <div class="clearfix"><a class="pull-right me-padding-right20 clear_multiple_choose" href="javascript:;">清空所有选择</a></div>
        </script>
        <script type="text/html" id="template_jingoal_calendar">
        <!-- 月视图 -->
        <div class="jingoal-calendar-box">
            <table class="table table-condensed noborder day-table me-margin-bottom0">
                <thead>
                    <tr class="jingoal-calender-hd">
                        <th {{if !todayBtn}} colspan="2" {{/if}} class="textright jingoal-calendar-prev-month">
                            <i class="commpic-left ch icon-calendar-smc-prev"></i>
                        </th>
                        <th colspan="3" class="textcenter year-month">
                            <div>2016年1月</div>
                        </th>
                        {{if !todayBtn}}
                        <th colspan="2" class="jingoal-calendar-next-month">
                            <i class="commpic-right ch icon-calendar-smc-next"></i>
                        </th>
                        {{else}}
                        <th class="jingoal-calendar-next-month">
                            <i class="commpic-right ch icon-calendar-smc-next"></i>
                        </th>
                        <th colspan="2" class="today-btn-wrap">
                            <button class="today-btn">今天</button>
                        </th>
                        {{/if}}
                    </tr>
                    <tr>
                        <th class="week_item">一</th>
                        <th class="week_item">二</th>
                        <th class="week_item">三</th>
                        <th class="week_item">四</th>
                        <th class="week_item">五</th>
                        <th class="week_item">六</th>
                        <th class="week_item">日</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="day_item prevmonth" data-date="2015/12/27"><a>27</a></td>
                        <td class="day_item prevmonth" data-date="2015/12/28"><a>28</a></td>
                        <td class="day_item prevmonth selected" data-date="2015/12/29"><a>29</a></td>
                        <td class="day_item prevmonth" data-date="2015/12/30"><a>30</a></td>
                        <td class="day_item prevmonth" data-date="2015/12/31"><a>31</a></td>
                        <td class="day_item present" data-date="2016/1/1"><a>1</a></td>
                        <td class="day_item present" data-date="2016/1/2"><a>2</a></td>
                    </tr>
                    <tr>
                        <td class="day_item present" data-date="2016/1/3"><a>3</a></td>
                        <td class="day_item present choose_day" data-date="2016/1/4"><a>4</a></td>
                        <td class="day_item present" data-date="2016/1/5"><a>5</a></td>
                        <td class="day_item present" data-date="2016/1/6"><a>6</a></td>
                        <td class="day_item present" data-date="2016/1/7"><a>7</a></td>
                        <td class="day_item present" data-date="2016/1/8"><a>8<i></i></a></td>
                        <td class="day_item present" data-date="2016/1/9"><a>9</a></td>
                    </tr>
                    <tr>
                        <td class="day_item present" data-date="2016/1/10"><a>10</a></td>
                        <td class="day_item present" data-date="2016/1/11"><a>11</a></td>
                        <td class="day_item present" data-date="2016/1/12"><a>12</a></td>
                        <td class="day_item present" data-date="2016/1/13"><a>13</a></td>
                        <td class="day_item present" data-date="2016/1/14"><a>14</a></td>
                        <td class="day_item present" data-date="2016/1/15"><a>15</a></td>
                        <td class="day_item present" data-date="2016/1/16"><a>16</a></td>
                    </tr>
                    <tr>
                        <td class="day_item present" data-date="2016/1/17"><a>17</a></td>
                        <td class="day_item present" data-date="2016/1/18"><a>18</a></td>
                        <td class="day_item present" data-date="2016/1/19"><a>19</a></td>
                        <td class="day_item present today" data-date="2016/1/20"><a>20<i></i></a></td>
                        <td class="day_item present" data-date="2016/1/21"><a>21<i></i></a></td>
                        <td class="day_item present" data-date="2016/1/22"><a>22</a></td>
                        <td class="day_item present" data-date="2016/1/23"><a>23</a></td>
                    </tr>
                    <tr>
                        <td class="day_item present" data-date="2016/1/24"><a>24</a></td>
                        <td class="day_item prese nt" data-date="2016/1/25"><a>25</a></td>
                        <td class="day_item present" data-date="2016/1/26"><a>26</a></td>
                        <td class="day_item present" data-date="2016/1/27"><a>27</a></td>
                        <td class="day_item present" data-date="2016/1/28"><a>28</a></td>
                        <td class="day_item present" data-date="2016/1/29"><a>29</a></td>
                        <td class="day_item present" data-date="2016/1/30"><a>30</a></td>
                    </tr>
                    <tr>
                        <td class="day_item present" data-date="2016/1/31"><a>31</a></td>
                        <td class="day_item nextmonth" data-date="2016/2/1"><a>1</a></td>
                        <td class="day_item nextmonth" data-date="2016/2/2"><a>2</a></td>
                        <td class="day_item nextmonth" data-date="2016/2/3"><a>3</a></td>
                        <td class="day_item nextmonth" data-date="2016/2/4"><a>4</a></td>
                        <td class="day_item nextmonth" data-date="2016/2/5"><a>5</a></td>
                        <td class="day_item nextmonth" data-date="2016/2/6"><a>6</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
        </script>
         */
    });
    /**
     *jingoal_calendar
     *@author lirongping
     *@Description 创建一个日历组件
     *@Version v1.0
     *@param elemid string 日历组件的包裹元素
     *@param opt object 配置参数
     *
     */
    /**
     *@Description 日历引擎
     *@method get_current_month_day_array 得到指定月的天数集合
     *@method get_day_week 得到指定天是星期几
     */
    /*
    国际化
    */
    utils.create_i18n({
        zh_CN: {
            week_days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            week_days_simple: ["日", "一", "二", "三", "四", "五", "六"],
            year: "年",
            month: "月",
            day: "日"
        },
        zh_TW: {
            week_days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            week_days_simple: ["日", "一", "二", "三", "四", "五", "六"],
            year: "年",
            month: "月",
            day: "日"
        }
    });
    var jingoal_calendar_engine = {
        calendar_default_options: {
            firstWeekDay: 1,
            rows: 5
        },
        //得到这个月在日历上显示的天数集合
        get_current_month_day_array: function (date, day, extra) {
            extra = $.extend(this.calendar_default_options, extra);
            var year = Number(date.split("/")[0]);
            var month = Number(date.split("/")[1]);
            if (year % 4 == 0) {
                var ruiyear = true;
                if (year % 100 === 0) {
                    if (year % 400 != 0) {
                        ruiyear = false;
                    }
                }
            }
            var feb = 28;
            if (ruiyear) {
                feb = 29
            }
            var month_day = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //每个月有多少天
            var date_day = date + "/1";
            //根据日期构建日期对象,从而得到时星期几
            var week_day = new Date(date_day).getDay();
            //得到上个月要显示几天
            week_day = this.get_prev_day_num(week_day, extra.firstWeekDay, extra.rows);
            var day_array = []; //用来存取所有天数信息
            var day_index = 1;

            //上个月的天数
            if (month == 1) {
                var prev_month = 13;
                var day_month = (year - 1) + "/" + 12;
            } else {
                prev_month = month;
                var day_month = year + "/" + (month - 1);
            }
            for (i = 1; i <= week_day; i++) {
                //如果是1月,从上一年12月取
                day_array.push({
                    value: month_day[prev_month - 2] - week_day + i,
                    type: "prevmonth",
                    date: day_month + "/" + (month_day[prev_month - 2] - week_day + i)
                });
                day_index++;
            }
            //本月天数
            for (var i = 1; i <= month_day[month - 1]; i++) {
                var classes = "present";
                //如果传入天数就高亮天数
                if (typeof day != "undefined") {
                    if (i == day) {
                        classes += " choose_day";
                    }
                }
                var jintian = new Date;
                if (date == jintian.getFullYear() + "/" + (+jintian.getMonth() + 1) && i == jintian.getDate()) {
                    classes += " today";
                }
                day_array.push({
                    value: i,
                    date: date + "/" + i,
                    type: classes
                });
                day_index++;
            }
            //下个月天数
            if (month == 12) {
                day_month = (year + 1) + "/" + 1;
            } else {
                day_month = year + "/" + (month + 1);
            }
            var total_days = day_array.length>35?42:35;
            for (var i = 0; i <= total_days - day_index; i++) {
                day_array.push({
                    value: i + 1,
                    date: day_month + "/" + (i + 1),
                    type: "nextmonth"
                });
            }
            return day_array;
        },
        //根据日历第一列要显示星期几，以及总共有多少行，来决定上个月要显示多少天
        get_prev_day_num: function (firstDayWeek, firstWeekDay, rows) {
            firstDayWeek = firstDayWeek == 0 ? 7 : firstDayWeek;
            var result = firstDayWeek - firstWeekDay;
            if (rows == 5 && result == 7) {
                result = 0;
            }
            return result;
        },
        //得到日历头部日期显示序列
        get_week_day_list: function (firstWeekDay) {
            var result = [];
            for (var i = firstWeekDay; i < 7; i++) {
                result.push(jingoal_lang.week_days_simple[i]);
            }
            for (var i = 0; i < firstWeekDay; i++) {
                result.push(jingoal_lang.week_days_simple[i]);
            }
            return result;
        },
        //得到指定的天,年月,是星期几
        get_day_week: function (day, date) {
            if (typeof date == "undefined") {
                var now = new Date();
                date = now.getFullYear() + "/" + (now.getMonth() + 1);
            }
            if (typeof day == "undefined") {
                day = now.getDate();
            }
            var dt = new Date(date + "/" + day);
            var week_day = dt.getDay();
            return jingoal_lang.week_days[week_day];
        },
        //得到下一个月
        get_next_month: function (month_date) {
            if (typeof month_date == "undefined" && (typeof this.show_date != "undefined")) {
                month_date = this.show_date;
            }
            var year = month_date.split("/")[0];
            var month = month_date.split("/")[1];
            if (month == 12) {
                return Number(year) + 1 + "/" + 1;
            } else {
                return year + "/" + (Number(month) + 1);
            }
        },
        get_prev_month: function (month_date) {
            if (typeof month_date == "undefined" && (typeof this.show_date != "undefined")) {
                month_date = this.show_date;
            }
            var year = month_date.split("/")[0];
            var month = month_date.split("/")[1];
            if (month == 1) {
                return Number(year) - 1 + "/" + 12;
            } else {
                return year + "/" + (Number(month) - 1);
            }
        },
        get_other_day: function (day_date, type) {
            if (typeof day_date == "undefined" && (typeof this.show_date != "undefined") && (typeof this.show_day != "undefined")) {
                day_date = this.show_date + "/" + this.show_day;
            }
            var dayms = 86400000;
            var tempdate = new Date(day_date).getTime();
            if (type == 1) {
                tempdate += dayms;
            } else {
                tempdate -= dayms;
            }
            var resultdate = new Date(tempdate);
            return resultdate.getFullYear() + "/" + (resultdate.getMonth() + 1) + "/" + resultdate.getDate();
        },
        get_next_day: function (day_date) {
            return this.get_other_day(day_date, 1);
        },
        get_prev_day: function (day_date) {
            return this.get_other_day(day_date, -1);
        },
        get_date_str: function (date) {
            return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }
    };
    //继承日历引擎
    jingoal_calendar.prototype = utils.create_object(jingoal_calendar_engine);

    function jingoal_calendar(elemid, opt) {
        "use strict"
        //星期循环工具
        function week_each(cb) {
            for (var i = 0; i < 7; i++) {
                cb(i);
            }
        }

        function add_to_multiple(value) {
            var arr = innerTHIS.multiple_result;
            var is_have = false;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] == value) {
                    is_have = true;
                    break;
                }
            }
            if (!is_have) {
                if (arr.length >= innerTHIS.options.multiple_choose_max.number && innerTHIS.options.multiple_choose_max.number) {
                    innerTHIS.options.multiple_choose_max.callback();
                    return;
                }
                arr.push(value);
            }
            innerTHIS.multiple_result = arr.sort(function (key1, key2) {
                if (new Date(key1) * 1 > new Date(key2) * 1) {
                    return 1;
                } else {
                    return -1;
                }
            });
            return true;
        }

        function del_from_multiple(value) {
            var arr = innerTHIS.multiple_result;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] == value) {
                    arr.splice(i, 1);
                }
            }
        }
        //配置参数
        this.options = {
            today: true,
            startDate: null,
            endDate: null,
            multiple_choose: false,
            addZero: false,
            firstWeekDay: 1,
            multiple_choose_max: {
                number: null,
                callback: function () {
                    //console.log("超出范围");
                }
            },
            callback: function (day) {
                //console.log(day); 
            },
            btncallback: function (date) {
                //console.log(date); 
            }
        };
        $.extend(this.options, opt);
        this.multiple_result = [];
        var now = new Date();
        this.now_date = this.show_date = now.getFullYear() + "/" + (now.getMonth() + 1);
        this.now_day = this.show_day = now.getDate();
        var innerTHIS = this;
        var jd_wrap = (typeof elemid == "string") ? document.getElementById(elemid) : elemid;
        var week_items = jingoal_calendar_engine.get_week_day_list(this.options.firstWeekDay);
        var jd_table_html = template(this.options.multiple_choose ? 'template_jingoal_multiple_calendar' : 'template_jingoal_calendar', this.options);
        jd_wrap.innerHTML = jd_table_html;
        var jd_table = $(jd_wrap).find("table")[0],
            todayBtn = $(jd_wrap).find(".today-btn")[0];
        var self = this;
        //监听表头
        var jd_thead = jd_table.tHead;
        $(jd_thead.rows[0].cells[0]).bind("click", function () {
            date_control.call(innerTHIS, -1)
        });
        $(jd_thead.rows[0].cells[2]).bind("click", function () {
            date_control.call(innerTHIS, 1)
        });
        this.thead_title_date = jd_thead.rows[0].cells[1];
        //创建显示星期的头部
        var thead_week = jd_thead.rows[1];
        week_each(function (key) {
            $(thead_week.cells[key]).addClass("week_item").text(week_items[key]);
        });

        this.jd_tbody = $(jd_table).find("tbody")[0];
        //监听点击事件
        $(this.jd_tbody).click(function (event) {
            var target = JDOM(event.target).isparent_or_owner({
                nodeName: "TD",
                className: "day_item"
            });
            if (target) {
                //不处理禁用的日期
                if ($(target).hasClass("disabled")) {
                    return;
                }
                if (innerTHIS.options.multiple_choose) { //多个选择得时候
                    //高亮点击的天
                    var day = $(target).attr("data-date");
                    var result = /^(\d+)\/(\d+)\/(\d+)$/.exec(day);
                    if ($(target).hasClass("active")) {
                        $(target).removeClass("active");
                        del_from_multiple(day);
                    } else {
                        if (add_to_multiple(day)) {
                            $(target).addClass("active");
                        }
                    }
                    innerTHIS.options.multiple_choose(innerTHIS.getDate());
                    innerTHIS.options.callback(day);
                } else {
                    //高亮点击的天
                    $(innerTHIS.current_day).removeClass("active choose_day");
                    innerTHIS.current_day = target;
                    $(innerTHIS.current_day).addClass("active choose_day");
                    var day = $(target).attr("data-date");
                    var result = /^(\d+)\/(\d+)\/(\d+)$/.exec(day);
                    innerTHIS.show_date = result[1] + "/" + result[2];
                    innerTHIS.show_day = result[3];
                    innerTHIS.current_choose_day = day;
                    innerTHIS.options.callback(day);
                }
            }
        });
        $(todayBtn).click(function(){
            self.show(jingoal_calendar_engine.get_date_str(new Date()));
        });
        //监听多选清空事件
        if (this.options.multiple_choose) {
            var that = this;
            $(jd_wrap).find(".clear_multiple_choose").click(function () {
                that.multiple_result = [];
                that.reload(that.show_date);
                that.options.multiple_choose(that.multiple_result);
            });
        }
        //表内容刷新工具,创建表内容
        if (typeof this.reload === "undefined") {
            jingoal_calendar.prototype.reload = function (date, day) {
                /*对限制条件的日期进行格式化,去零，超出限制的*/
                if (this.options.startDate) this.options.startDate = utils.format_date(this.options.startDate);
                if (this.options.endDate) this.options.endDate = utils.format_date(this.options.endDate);

                for (var i = 0, len = this.multiple_result.length; i < len; i++) {
                    this.multiple_result[i] = utils.format_date(this.multiple_result[i]);
                }
                this.show_date = date;
                if (typeof day != "undefined") {
                    this.show_day = day;
                    this.current_choose_day = date + "/" + day;
                }
                //改变标题
                var year = date.split("/")[0];
                var month = date.split("/")[1];
                this.thead_title_date.innerHTML = "<div>" + year + jingoal_lang.year + month + jingoal_lang.month + "</div>";
                //得到本月的天数集合
                var day_array = this.get_current_month_day_array(date, day, {
                    firstWeekDay: this.options.firstWeekDay
                });
                //和欧阳的样式兼容
                for (var i = 0; i < day_array.length; i++) {
                    //根据开始时间和结束时间来禁用日期
                    if((this.options.startDate&&new Date(day_array[i].date).getTime()<new Date(this.options.startDate).getTime())||(this.options.endDate&&new Date(day_array[i].date).getTime()>new Date(this.options.endDate).getTime())){
                        day_array[i].type = day_array[i].type + " disabled";
                    }
                    //对选中日期高亮
                    if (day_array[i].type.indexOf("present") > -1) {
                        if ((day_array[i].type.indexOf("choose_day") > -1||day_array[i].date==this.current_choose_day)&&!this.options.multiple_choose) {
                            day_array[i].type = day_array[i].type + " active";
                        }
                    }
                }
                var that = this;
                $(this.jd_tbody).html("");
                //显示全部天数
                for (var i = 0; i < day_array.length/7; i++) {
                    var row = this.jd_tbody.insertRow(-1);
                    week_each(function (key) {
                        var td = row.insertCell(-1);
                        var day = day_array[key + i * 7];
                        if (!that.options.multiple_choose && day.type.indexOf("choose_day") > -1) {
                            //标记当前高亮的天
                            that.current_day = that.jd_tbody.rows[i].cells[key];
                        }
                        td.className = "day_item " + day.type;
                        $(td).attr("data-date", day.date);
                        var html_value = that.options.multiple_choose ? "<div>" + day.value + "</div>" : ("<a>" + day.value + "</a>");
                        if (td.className.indexOf("markday") > -1) {
                            td.innerHTML = html_value + "<i></i>";
                        } else {
                            td.innerHTML = html_value;
                        }

                    });
                }
            }
        }
        //高亮需要标记的天数
        if (typeof this.markday === "undefined") {
            jingoal_calendar.prototype.markday = function (marks) {
                var that = this;
                //选择标记
                for (var i = 0; i < that.jd_tbody.rows.length; i++) {
                    week_each(function (key) {
                        var td_value = Number(that.jd_tbody.rows[i].cells[key].innerHTML);
                        if (that.jd_tbody.rows[i].cells[key].className.indexOf("present") > -1) {
                            if (utils.array_key(marks, Number($.trim(td_value))) > -1) {
                                that.jd_tbody.rows[i].cells[key].innerHTML = td_value + "<i></i>";
                            }
                        }
                    });
                }
            }
        }
        //多选的时候可以设置多选项
        if (typeof this.set_multiple_date === "undefined") {
            jingoal_calendar.prototype.set_multiple_date = function (date) {
                this.multiple_result = utils.copy_object(date);
                this.reload(this.show_date);
            }
        }
        //显示特定时间
        if (typeof this.show === "undefined") {
            jingoal_calendar.prototype.show = function (date) {
                date = utils.format_date(date);
                if (!date) {
                    return;
                }
                date = date.toString();
                var date_arr = date.split("/");
                if (new Date(date).getTime() < new Date(this.options.startDate).getTime() || new Date(date).getTime() > new Date(this.options.end).getTime()) {
                    return;
                }
                var year = date_arr[0];
                var month = date_arr[1];
                var day = date_arr[2];
                this.reload(year + "/" + month, day);
            }
        }
        //设置参数
        if (typeof this.setOption === "undefined") {
            jingoal_calendar.prototype.setOption = function (opt) {
                for (var i in opt) {
                    this.options[i] = opt[i];
                }
            }
        }
        //得到当前时间
        if (typeof this.getDate === "undefined") {
            jingoal_calendar.prototype.getDate = function () {
                if (this.options.multiple_choose) {
                    var multiple_result = [];
                    for (var i = 0, len = this.multiple_result.length; i < len; i++) {
                        var dateObj = utils.parse_date(this.multiple_result[i]);
                        if (this.options.addZero) {
                            multiple_result[i] = [utils.addZero(dateObj.year), utils.addZero(dateObj.month), utils.addZero(dateObj.day)].join("/");
                        } else {
                            multiple_result[i] = dateObj.year + "/" + dateObj.month + "/" + dateObj.day;
                        }
                    }
                    return multiple_result;
                } else {
                    var date = this.show_date + "/" + this.show_day;
                    if (this.options.addZero) {
                        var dateObj = utils.parse_date(date);
                        date = [utils.addZero(dateObj.year), utils.addZero(dateObj.month), utils.addZero(dateObj.day)].join("/");
                    }
                }
                return date;
            }
        }
        //得到当前星期
        if (typeof this.getWeek === "undefined") {
            jingoal_calendar.prototype.getWeek = function () {
                return this.get_day_week(this.show_day, this.show_date);
            }
        }
        //设置开始结束时间
        if (typeof this.setStart === "undefined") {
            jingoal_calendar.prototype.setStart = function (date) {
                date = utils.format_date(date);
                this.options.startDate = date;
                this.reload(this.show_date);
            }
        }
        if (typeof this.setEnd === "undefined") {
            jingoal_calendar.prototype.setEnd = function (date) {
                date = utils.format_date(date);
                this.options.endDate = date;
                this.reload(this.show_date);
            }
        }
        //前进后退按钮
        var date_control = function (fangxiang) {
                var year = this.show_date.split("/")[0];
                var month = this.show_date.split("/")[1];
                if (fangxiang < 0) {
                    month--;
                    if (month == 0) {
                        year--;
                        month = 12;
                    }
                    if (this.options.startDate != null) {
                        var start_date_obj = utils.parse_date(this.options.startDate);
                        if (new Date(year + "/" + month + "/" + 1) * 1 < new Date(start_date_obj.year + "/" + start_date_obj.month + "/" + 1) * 1) {
                            return;
                        }
                    }
                } else {
                    month++;
                    if (month == 13) {
                        year++;
                        month = 1;
                    }
                    if (this.options.endDate != null) {
                        var end_date_obj = utils.parse_date(this.options.endDate);
                        if (new Date(year + "/" + month + "/" + 1) * 1 > new Date(end_date_obj.year + "/" + end_date_obj.month + "/" + 1) * 1) {
                            return;
                        }
                    }
                }
                this.reload(year + "/" + month, undefined);
                this.options.btncallback(this.show_date);
            }
            //是否高亮今天
        if (this.options.today) {
            this.reload(this.show_date, this.show_day);
        }
    }
    window.jingoal_calendar = jingoal_calendar;
    window.jingoal_calendar_engine = jingoal_calendar_engine;
});
