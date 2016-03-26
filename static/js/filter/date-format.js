define(function() {
    calendarApp.filter('dayViewDateFormat', function($sce) {
        return function(datestr) {
            var now = new Date();
            if (jingoal_calendar_engine.get_date_str(now) == datestr) {
                var today = true;
            }
            var date = new Date(datestr),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();
            var result = year + "年" + month + "月" + day + '<span class="week">' + jingoal_calendar_engine.get_day_week(date.getDate(), datestr.substr(0, datestr.lastIndexOf("/"))) + '</span>' + (today ? '<b class="tody-phrase">（今天）</b>' : '');
            return $sce.trustAsHtml(result);
        }
    });

    /**
     * 将毫秒数12312312312转化成 2016-1-20 星期三 下午 18:26 
     */

    calendarApp.filter('secondToDay', function() {
        return function(input,short) {
            var now = new Date(input);
            var year = now.getFullYear(); //年
            var month = now.getMonth() + 1; //月
            var day = now.getDate(); //日
            var hh = now.getHours(); //时
            var mm = now.getMinutes(); //分
            if(month<10){
                month="0"+month;
            }
            if(day<10){
                day="0"+day;
            }
            // if(hh>12){
            //     hh=" 下午 "+hh;
            // }else{
            //     hh=" 上午 0"+hh;
            // }
            if(mm<10){
                mm='0'+mm;
            }
            var str=year+'-'+month+'-'+day+' '+hh+':'+mm;
            if(short){
                str=month+'-'+day+' '+hh+':'+mm;
            }

            return str;
        }
    });
    /**
     * 将引用编号转化成名称
     */
     calendarApp.filter('fileType', function() {
        return function(input) {
            var file=['','备忘','计划'];
            if(input){
                return file[input];
            }
        }
    });

     /**
      * 重复类型
      */
     calendarApp.filter('repeatMethod',function(){
        return function(input) {
            var repeat=['不重复','按天','按周','按月','按年'];
            return repeat[input];
        }
     });
     /**
      * 结束类型
      */
     calendarApp.filter('repeatEnd',function(){
        return function(obj) {
            var repeatEndType=obj.eventRepeat.repeatEndType;
            var repeatType=obj.eventRepeat.repeatType;
             var now = new Date(obj.eventRepeat.endTime);
            var str='';
            var repeat=['不重复','每天','每周','每月','每年'];
            (repeatType===2) && (repeat[2]+=obj.weekStr);
            (repeatType===3) && (repeat[3]+=getDay(obj.event.beginTime)+'日');
            (repeatType===4) && (repeat[4]+=getMonthDay(obj.event.beginTime));
            str+=repeat[repeatType];
            if(repeatEndType===1){
                str+=' ; '+'从不结束';
            }else if(repeatEndType===2){
                str+=' ; '+obj.eventRepeat.endNumber+'次后结束';
            }else if(repeatEndType===3){
               str+=' ; '+getDate(now);
            }
            return str;
        }

        function getDate(date){
            var now=date;
            var year = now.getFullYear(); //年
            var month = now.getMonth() + 1; //月
            var day = now.getDate(); //日
            var weekNumber=now.getDay(); //周
            var week=['星期天','星期一','星期二','星期三','星期四','星期五','星期六'];

            return year+'年'+month+'月'+day+'日'+'结束';
        }
     });
     /**
      * 到期提醒
      */
     calendarApp.filter('timeLine',function(){
        return function(obj) {
            var eventAwoke=obj.eventAwoke;
            var timeArr=getArr(eventAwoke.fullAwokeTime);
            var str='';
            if(eventAwoke.type==1){
                str = "前一天 "+eventAwoke.fullTime;
            }else if(eventAwoke.type==2){
                str = "同一天 "+eventAwoke.fullTime;
            }else if(eventAwoke.type==3){
                str = timeArr[0]+"年"+timeArr[1]+"月"+timeArr[2]+"日 "+eventAwoke.fullTime;
            }
           return str;
        }
        function getArr(time){
            if(time){
                arr=time.split('/');
                return arr;
            }
        }
     });
     calendarApp.filter('cutName',function(){
        return function(input,length) {
            var re=/^\d+$/g;
            if(re.test(input)){
                length=13;
            }

           if(input.length>=length){
                input=input.substr(0,length-2)+'...';
                return input;
           }else{
             return input;
           }
        }
        function getBitLength(str){
            return str.replace(/[^\x00-\xff]/g,"aa").length;
        }
     });
      function getWeek(now){
            var week=now.getDay();
            var weekArr=['天','一','二','三','四','五','六'];
            return weekArr[week];
        }
        function getDay(time){
            var now=new Date(time);
            var day = now.getDate(); //日
            return day;
        }
        function getMonthDay(time){
            var now=new Date(time);
            var month = now.getMonth() + 1; //月
            var day = now.getDate(); //日
            return month+'年'+day+'日';
        }
        //获取文件icon
        var fileJson={
            'doc':['doc','docx'],
            'txt':'txt',
            'xls':'xls',
            'pdf':'pdf',
            'ppt':'ppt',
            'music':['mp3','mp4'],
            'apk':['apk'],
            'zip':'zip',
            'html':['html','xhtml','xml'],
            'java':'java',
            'jpg':['jpg','png','jpeg','bmp','gif'],
            'video':['avi','aiff','mov','mpeg','mpg','qt','ram','viv'],
            'damage':'damage',
            'folder':'folder',
            'cloud':'cloud',
            'rar':'rar',
            'unknown':'unknown'
        }
        calendarApp.filter('fileIconChange',function(){
            return function(filename) {
                var index1=filename.lastIndexOf(".");
                var index2=filename.length;
                var postf=filename.substring(index1+1,index2);//后缀名 
                var type='unknown';
                for(var index in fileJson){
                    var item = fileJson[index];
                    if(item instanceof Array){
                        for(var i=0;i<item.length;i++){
                            if(item[i]===postf){
                                type=index;
                                break;
                            }
                        }
                    }else{
                        if(item===postf){
                            type=index;
                            break;
                        }
                    }
                }
                return 'icon-file32-'+type;
            }
        })
});