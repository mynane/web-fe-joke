define(function() {
    calendarApp.factory('$utils', function($compile, $rootScope) {
        return {};
        // var modalMaskIndex = 1000,
        //     proMptScope = $rootScope.$new(),
        //     allUsers=null;
        // return {
        //     createModal: function(templateurl, $scope, callback) {
        //         modalMaskIndex++;
        //         var scope = $scope.$new(),
        //             modalContainer = document.getElementById("modal-container"),
        //             modalWrap = document.createElement("div"),
        //             maskElem = document.createElement("div"),
        //             modalElem;
        //         maskElem.className = "modal-mask";
        //         //阻止事件冒泡
        //         angular.element(maskElem).unbind('click').bind('click', function(event) {
        //             event.stopPropagation();
        //         });
        //         angular.element(modalWrap).unbind('click').bind('click', function(event) {
        //             event.stopPropagation();
        //         });
        //         maskElem.style.zIndex = modalMaskIndex++;
        //         modalWrap.className = "modal-hide-support";
        //         scope.modalScope = $scope;
        //         scope.modalMaskIndex = modalMaskIndex;
        //         if(typeof templateurl == "string"){
        //             modalElem = document.createElement("div");
        //             modalElem.setAttribute("ng-template",templateurl);
        //             modalWrap.appendChild(modalElem);
        //         } else {
        //             modalElem = templateurl;
        //             modalWrap.appendChild(modalElem);
        //         }
        //         modalContainer.appendChild(modalWrap);
        //         modalContainer.appendChild(maskElem);
        //         scope.closeModal = function() {
        //             hide();
        //         }
        //         $compile(modalElem)(scope);
        //         setTimeout(function() {
        //             callback({
        //                 cmd: function(command) {
        //                     scope.$broadcast.apply(scope, arguments);
        //                     if (command == "hide") {
        //                         hide();
        //                     }
        //                 }
        //             },scope);
        //         }, 0);

        //         function hide() {
        //             modalContainer.removeChild(modalWrap);
        //             modalContainer.removeChild(maskElem);
        //             scope.$destroy();
        //         }
        //     },
        //     createPrompt:function(opt,submit,cancel){
        //         var mptScope = proMptScope.$new();
        //         mptScope.modalTitle = "提示";
        //         mptScope.type = "warn-red";
        //         for(var i in opt){
        //             mptScope[i] = opt[i];
        //         }
        //         this.createModal("modal-prompt",mptScope,function(modal,scope){
        //             modal.cmd("show");
        //             scope.$on("prompt-submit", function(){
        //                 submit && submit();
        //                 setTimeout(function(){
        //                     mptScope.$destroy();
        //                 },1000);
        //             });
        //             scope.$on("prompt-cancel", function(){
        //                 cancel && cancel();
        //                 setTimeout(function(){
        //                     mptScope.$destroy();
        //                 },1000);
        //             });
        //         });
        //     },
        //     bindInput:function(elem,callback){
        //         if("oninput" in document.createElement("input")&&(typeof ie9=="undefined")){
        //            angular.element(elem).bind("input paste",function(event){
        //                 if(document.activeElement!=elem){
        //                     return false;
        //                 }
        //                 callback(event);
        //            });
        //         }else{
        //             elem.historyValue=elem.value;
        //             angular.element(elem).bind("keydown paste",function(event){
        //                 setTimeout(function(){
        //                     var isChange=false;
        //                     if(elem.historyValue!=elem.value){
        //                         callback(event);
        //                         elem.historyValue=elem.value;
        //                     }
        //                 },0);
        //             });
        //         }
        //     },
        //     get_focus_position:function(input){
        //         var position=0;
        //         if(typeof input.selectionStart=="undefined"){
        //             input.focus();
        //             var sel=document.selection.createRange();
        //             sel.moveStart("character",-input.value.length);
        //             position=sel.text.length;
        //         }else{
        //             position=input.selectionStart;
        //         }
        //         return position==0?input.value.length:position;
        //     },
        //     set_input_position:function(input,position){
        //         if(input.setSelectionRange){
        //             input.setSelectionRange(position,position);
        //         }else{
        //             var range=input.createTextRange();
        //             range.collapse(true);
        //             range.moveStart("character",position);
        //             range.select();
        //         }
        //     },
        //     limit_input:function(elem,opt){
        //         var _this = this;
        //         elem.setAttribute("history_value",elem.value);
        //         _this.bindInput(elem,function(event){
        //             var value=elem.value,isOk=true;
        //             if(typeof opt.length!="undefined"){
        //                 if(elem.value.length>opt.length){
        //                     isOk=false;
        //                     opt.error&&opt.error("length");
        //                 }
        //             }
        //             if(typeof opt.char!="undefined"){
        //                 var position=_this.get_focus_position(elem);
        //                 var newValue=value.charAt(position-1);
        //                 if(opt.char(newValue)){//不能输入的元素
        //                     isOk=false;
        //                     opt.error&&opt.error("char");
        //                 }
        //             }
        //             if(isOk){
        //                 elem.setAttribute("history_value",elem.value);
        //                 opt.success&&opt.success(value,position,newValue);
        //             }else{
        //                 elem.value=elem.getAttribute("history_value");
        //             }
        //         });
        //     },
        //     getAllUser:function(){
        //         if(allUsers != null){
        //             return allUsers;
        //         }else{
        //             $.ajax({
        //                 type: 'get',
        //                 async: false,
        //                 url: '/module/calendar/v1/getAllUsers.do',
        //                 success: function(jsonData) {
        //                     if(jsonData.meta.code==200){
        //                         allUsers = {};
        //                         for(var i=0,len=jsonData.data.length;i<len;i++){
        //                             var item = jsonData.data[i];
        //                             allUsers[item.id] = item.fullName;
        //                         }
        //                     }
        //                 }
        //             });
        //             return allUsers;
        //         }
        //     },
        //     parseDate: function(datestr) {
        //         var dateObj = datestr.split("/");
        //         return {
        //             year: dateObj[0],
        //             month: dateObj[1],
        //             day: dateObj[2]
        //         }
        //     },
        //     getDateStr: function(date) {
        //         return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        //     },
        //     getOffsetOfParent: function(eLem, parentElement) {
        //         var parent = eLem,
        //             result = {
        //                 top: 0,
        //                 left: 0
        //             };
        //         while (parent && parent != parentElement) {
        //             result.top += parent.offsetTop;
        //             result.left += parent.offsetLeft;
        //             parent = parent.offsetParent;
        //         }
        //         return result;
        //     },
        //     cssSupport: function(type) {
        //         var fn = {
        //             calc: function() {
        //                 var prop = 'width:';
        //                 var value = 'calc(10px);';
        //                 var el = document.createElement('div');
        //                 el.style.cssText = prop + ["-webkit-", "-moz-", "-ms-", "", ""].join(value + prop);
        //                 return !!el.style.length;
        //             },
        //             transition: function() {
        //                 var el = document.createElement('div');
        //                 var prefix = ["transition", "mozTransition", "msTransition", "webkitTransition"],
        //                     result = false;
        //                 for (var i = 0, len = prefix.length; i < len; i++) {
        //                     if (prefix[i] in el.style) {
        //                         result = true;
        //                         break;
        //                     }
        //                 }
        //                 return result;
        //             }
        //         };
        //         return fn[type]();
        //     },
        //     getCss3Prefix:function(css){
        //         var el = document.createElement('div'),
        //             cssUpper = css.toUpperCase();
        //         var prefix = [css, "moz" + cssUpper, "ms" + cssUpper, "webkit" + cssUpper],
        //             result = false;
        //         for (var i = 0, len = prefix.length; i < len; i++) {
        //             if (prefix[i] in el.style) {
        //                 return prefix[i];
        //             }
        //         }
        //         return css;
        //     },
        //     diffDate: function(date1, date2) {
        //         return (new Date(date1) * 1) > (new Date(date2) * 1);
        //     }
        // }
    });
    // //全部人员获取
    // var allUser = {};
    // var swit = 0; //默认没请求数据
    // window.getAllUser = function() {
    //     if (swit) {
    //         return allUser;
    //     } else {
    //         $.ajax({
    //             type: 'get',
    //             async: false,
    //             url: '/module/calendar/v1/getAllUsers.do',
    //             error: function(data){
    //             },
    //             success: function(jsonData) {
    //                 if(jsonData.meta.code==200){
    //                     var data=jsonData.data;
    //                     for(var i=0;i<data.length;i++){
    //                         var id=data[i].id;
    //                         allUser[id] = data[i].fullName;
    //                     }
    //                     swit = 1;
    //                 }
    //             }
    //         });
    //         return allUser;
    //     }
    // }
});
