//如果元素是本身或者是父元素
function JDOM(elem) {
    return {
        isparent_or_owner: function(obj) {
            var parent_elem = elem;
            while (parent_elem) {
                if (parent_elem != null && parent_elem != document.body) {
                    var isparent = true;
                    for (var i in obj) {
                        if (!(i == "className" ? new RegExp("(^| )"+obj[i]+"( |$)").test(parent_elem[i]) : (i=="elem"?parent_elem==obj[i]:parent_elem[i] == obj[i]))) {
                            isparent = false;
                        }
                    }
                    if (isparent) {
                        return parent_elem;
                    } else {
                        parent_elem = parent_elem.parentNode;
                    }
                } else {
                    return false;
                }
            }
            return false;
        }
    }
}
function cssIe7FirstLast(elem) {
    var first = elem.firstChild;
    while (first.nodeType !== 1) {
        first = first.nextSibling;
    }
    var classname = first.className;
    classname = classname.split(/\s+/).indexOf('first-child');
    classname += classname + 'first-child';
};
$.fn.findParents = function(selector){
   var attrs = {};
    if (selector.nodeType !== undefined && selector.nodeType === 1) { //可以传入html标签实例
        attrs.elem = selector;
    } else { //也可以传入id，class选择器
        var reg_result = /^(?:#(.+))|(?:\.(.+))$/g.exec(selector);
        if (reg_result[1] !== undefined && reg_result[1] !== '') {
            attrs.id = reg_result[1];
        }
        if (reg_result[2] !== null && reg_result[2] !== '') {
            attrs.className = reg_result[2];
        }
    }
    var parent_elem = this[0];
    while (parent_elem) {
        if (parent_elem !== null && parent_elem !== document.body) {
            var isparent = true;
            for (var i in attrs) {
                if (attrs.hasOwnProperty(i)) {
                    if (!(i === 'className' ? new RegExp('(^| )' + attrs[i] + '( |$)').test(parent_elem[i]) : (i === 'elem' ? parent_elem === attrs[i] : parent_elem[i] === attrs[i]))) {
                        isparent = false;
                    }
                }
            }
            if (isparent) {
                return $(parent_elem);
            }
            parent_elem = parent_elem.parentNode;
        } else {
            return null; //如果没有找到就返回null
        }
    }
}
$.createElem = function(selector){
   if (!(selector && selector.nodeName)) {
       return null;
   }
   if ((selector.reload !== undefined) && selector.reload) {
       var elem = typeof selector.id === 'string' ? document.getElementById(selector.id) : selector.id;
       elem.innerHTML = '';
   } else {
       elem = document.createElement(selector.nodeName);
   }
   for (i in selector) {
       if (selector.hasOwnProperty(i)) {
           if (i !== 'nodeName') {
               if (i === 'childs') {
                   var tmp_obj = selector[i],
                       j;
                   for (j = 0, len = tmp_obj.length; j < len; j++) {
                       if (tmp_obj[j]) {
                           if (tmp_obj[j].ownerDocument) {
                               elem.appendChild(tmp_obj[j]);
                           } else {
                               elem.appendChild($.createElem(tmp_obj[j]));
                           }
                       }
                   }
               } else if (i === 'css') {
                   var styles = selector[i];
                   for (j in styles) {
                       if (styles.hasOwnProperty(j)) {
                           if (j === 'float') {
                               if (document.all) {
                                   elem.style.styleFloat = styles[j];
                               } else {
                                   elem.style.cssFloat = styles[j];
                               }
                           } else {
                               elem.style[j] = styles[j];
                           }
                       }
                   }
               } else if (i === 'className') {
                   $(elem).addClass(selector[i]);
               } else if (elem[i] !== undefined) {
                   elem[i] = selector[i];
               } else {
                   elem.setAttribute(i, selector[i]);
               }
           }
       }
   }
   return elem;
}
var CookieUtil = {
    getItem: function(name) {
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null,
            cookieEnd;
        if (cookieStart > -1) {
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
    },
    setItem: function(name, value, time) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value)+"; path=/";
        var date = new Date();
        if (time != undefined) {
            date.setTime(date.getTime() + time);
            cookieText += "; expires=" + date.toGMTString();
        }
        document.cookie = cookieText;
    },
    removeItem: function(name) {
        this.setItem(name, "", -24*10000);
    }
};
var utils = {
    expand:function(obj){//对utils添加方法
        for(var i in obj){
            this[i]=obj[i];
        }
    },
    trim:function(str){
        return str.replace(/^\s*|\s*$/,"");
    },
    browser:{
            isIe:/msie|Trident/gi.test(navigator.userAgent)
    },
    mousewheel:{//禁止滚动影响弹出层的位置
            disable:function(liwai){
                this.liwai=liwai;
                $(document.body).bind("mousewheel DOMMouseScroll",this.handler);
            },
            enable:function(){
                $(document.body).unbind("mousewheel DOMMouseScroll",this.handler);
            },
            handler:function(event){
                if(!JDOM(event.target).isparent_or_owner({elem:utils.mousewheel.liwai})){
                    event.preventDefault()
                }
            }
    },
    //获取一个item在数组中的索引
    array_key:function(arr,item) {
        if (typeof Array.prototype.indexOf === "undefined") {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (item == arr[i]) {
                    return i;
                }
            }
            return -1;
        } else {
            return arr.indexOf(item);
        }
    },
    create_object:function(obj){//兼容Object.create
        if (typeof Object.create === "undefined") {
            function f() {}
            f.prototype = obj;
            return new f();
        } else {
            return Object.create(obj);
        }
    },
    remove_htmltag:function(html){/*去除html标签*/
        var div = document.createElement("div");
        div.innerHTML = html;
        return $(div).text();
    },
    copy_object:function(obj){
        return JSON.parse(JSON.stringify(obj));
    },
    create_i18n:function(obj){
        if(typeof mgt_language=="undefined"){
            window.mgt_language="zh_CN";
        }
        if(typeof jingoal_i18n=="undefined"){
            window.jingoal_i18n={};
        }
        utils.extend(jingoal_i18n,obj);
        window.jingoal_lang=jingoal_i18n[mgt_language];
    },
    parse_date: function(date) {
        var temp_date = date.split("/");
        return {
            year: temp_date[0],
            month: temp_date[1],
            day: temp_date.length == 3 ? temp_date[2] : null
        };
    },
    get_obj_type:function(obj){
        return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
    },
    extend:function(old_obj,new_obj){
        function inner_extend(o_obj,n_obj){
            for(var i in n_obj){
                if(typeof n_obj[i]=="object"){
                    if(typeof o_obj[i]!="object"){
                        o_obj[i]={}
                    }
                    inner_extend(o_obj[i],n_obj[i]);
                }else{
                    o_obj[i]=n_obj[i]
                }
                
            }
        }
        inner_extend(old_obj,new_obj);
        return old_obj;
    },
    format_date:function(date){
        var reg = /^(\d{4})\/(\d+)\/(\d+)$/;
        var result = reg.exec(date);
        if(result == null||isNaN(new Date(date)*1)||!(result[1]>=1970&&result[1]<=2099&&result[2]>=1&&result[2]<=12&&result[3]>=1&&result[3]<=31))return false;
        return parseInt(Number(result[1])) + "/" + parseInt(Number(result[2])) + "/" + parseInt(Number(result[3]));
    },
    addZero:function(minute){
        if(parseInt(Number(minute))<10){
            return "0"+parseInt(Number(minute));
        }
        return minute;
    },
    create_mask:function(parent){
        parent=parent||document.body;
        var zujian_mask=document.getElementById("popup_component_mask");
        var zujian_mask=document.createElement("div");
        zujian_mask.className="popup_component_mask";
        $(zujian_mask).mousewheelStopPropagation();//避免滚动相互影响
        parent.appendChild(zujian_mask);
        if(typeof arguments.callee.register_event=="undefined"){
            utils.load_css(function(){
                /*
                .popup_component_mask,#popup_component_mask{
                    position:fixed;
                    top:0;
                    left:0;
                    bottom:0;
                    right:0;
                    display:none;
                    z-index:10000;
                    background: white;
                    filter:alpha(opacity=0);
                    background: rgba(255,255,255,0);
                }
                */
            });
            //获取当前focus和blur的触发相关元素
            this.register_monse_down_element();
            arguments.callee.register_event=true;
        }
        return zujian_mask;
    },
    register_monse_down_element:function(){
        if(typeof arguments.callee.register_event=="undefined"){
            //获取当前focus和blur的触发相关元素
            window.related_element=null;
            $(document.body).bind("mousedown",function(event){
                window.related_element=event.target;
            });
            $(document.body).bind("mouseup",function(event){
                window.related_element=null;
            });
            arguments.callee.register_event=true;
        }
    },
    get_absolute_top:function(focus_elem,pop_elem){
        var window_height=$(window).height();
        var fixed_offset=focus_elem.getBoundingClientRect();
        var absolute_offset=$(focus_elem).offset();
        var pop_height=pop_elem.offsetHeight;
        if(window_height-fixed_offset.bottom<=pop_height){
            return absolute_offset.top-pop_height;
        }else{
            return absolute_offset.top+focus_elem.offsetHeight;
        }
    },
    //获取对象类型
    getObjType: function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    },
    htmlEncode:function(text){  
        return text.replace(/&/g,'&amp').replace(/\"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    },
    htmlDecode:function(text){  
        return text.replace(/&amp;/g,'&').replace(/&quot;/g,'\"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
    },
    load_template:function(templte_func){
        var funcstr=templte_func.toString();
        //funcstr=funcstr.replace(/[\n\r]/g,"==-==");
        var reg=/<script.*id\s*=\s*(['"])(.+?)\1>([\s\S]+?)<\/script>/gm;
        do{
            reg_result=reg.exec(funcstr);
            if(reg_result!=null){
                var script=document.createElement("script");
                script.id=reg_result[2];
                try{
                    script.innerHTML=reg_result[3];
                }catch(e){
                    script.text=reg_result[3];
                }
                script.type="text/html";
                document.getElementsByTagName("head")[0].appendChild(script);
            }else{
                break;
            }
        }while(reg.lastIndex<=funcstr.length)
    },
    load_css:function(css_func){
        var funcstr=css_func.toString();
        var reg=/\/\*([\s\S]+)\*\//gm;
        var style=document.createElement("style");
        style.type="text/css";
        reg_result=reg.exec(funcstr);
        if(style.styleSheet){
            style.styleSheet.cssText =reg_result[1];
        }else{
            style.innerHTML=reg_result[1];
        }
        document.getElementsByTagName('HEAD')[0].appendChild(style); 
    },
    syncLoading:function(type){
        if(type){
            document.getElementById("sync-loading").style.display="block";
        }else{
            document.getElementById("sync-loading").style.display="none";
        }
    },
    ayncLoading:function(type){
        if(type){
            document.getElementById("aync-loading").style.display="block";
        }else{
            document.getElementById("aync-loading").style.display="none";
        }
    }
}