require(['angular/angular.min'], function () {
    window.calendarApp = angular.module('calendar', []);
    //处理angular兼容性的，可以忽略
    // calendarApp.factory('http_response', function ($q) {
    //     var timer;
    //     return {
    //         'request': function (config) {
    //             utils.ayncLoading(true);
    //             //去除空格
    //             if (typeof config.params != "undefined") {
    //                 for (var i in config.params) {
    //                     config.params[i] = utils.trim(config.params[i]);
    //                 }
    //             }
    //             return config;
    //         },
    //         'requestError': function () {
    //             setTimeout(function () {
    //                 utils.ayncLoading(false);
    //             }, 300);
    //         }, 
    //         'response': function (response) {
    //             setTimeout(function () {
    //                 utils.ayncLoading(false);
    //             }, 300);
    //             if ((typeof response.data.meta != "undefined") && response.data.meta.code != 200) {
    //                 return $q.reject(response)
    //             } else {
    //                 return response;
    //             }
    //         }
    //     };
    // });
    calendarApp.config(function ($sceProvider, $locationProvider, $httpProvider, $compileProvider) {
        $httpProvider.interceptors.push('http_response');
        /*
        $httpProvider.interceptors.push('http_response');
        function appendTransform(defaults, transform) {
          defaults = angular.isArray(defaults) ? defaults : [defaults];
          return defaults.concat(transform);
        }
        function get_obj_type(obj){
            return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
        }
        $httpProvider.defaults.transformRequest=appendTransform($httpProvider.defaults.transformRequest,function(data){
            if(typeof data!="undefined"){
                try{
                    data=JSON.parse(data);
                    if(get_obj_type(data)=="object"){
                        var newResult={};
                        for(var i in data){
                            newResult[i]=data[i].replace(/^\s+|\s+$/g,"");
                        }
                    }else if(get_obj_type(data)=="array"){
                        var newResult=[];
                        for(var i=0,len=data.length;i<len;i++){
                            newResult.push(data[i].replace(/^\s+|\s+$/g,""));
                        }
                    }
                    return JSON.stringify(newResult);
                }catch(e){}
            }
        });
        */
        //angular会对a标签href属性的变量进行过滤，对这几个开头的添加信任
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|javascript|mailto|sms):/);
        $locationProvider.html5Mode(false);
        $sceProvider.enabled(false);
    });
    //组件的全局变量
    window.globalModule = {};
    require(['angular/angular.route', //路由服务
        'tpl/all', //加载所有模板
        'i18n/i18n', //引入国际化
        // 'utils/utils', //引入模板指令
        // 'public/alert-tip/alert-tip', //提醒组件
        // 'public/paging/paging', //分页组件
        'public/mgtfile/mgtfile', //引入模板指令
        'directive/ng-template', //引入模板指令
        'controller/body-controller', //全局controller
        'filter/date-format' //自定义过滤
    ], function () {
        var calendarInjecter = angular.bootstrap(document, ['calendar', 'ngRoute']);
    });
});
 // 'directive/event-detail-popup', //详情弹出框指令
        // 'directive/month-view-event-list', //详情弹出框指令
        // 'directive/join-person', //参与人选择组件
        // 'directive/day-view-event-list', //日视图列表指令
        // 'directive/com-modal', //弹框指令
        // 'directive/checkbox', //checkbox指令
        // 'controller/body-controller', //全局controller
        // 'controller/left-controller', //左侧controller
        // 'controller/calendar-view', //台历视图全局controller
        // 'controller/day-view', //日试图controller
        // 'controller/month-view', //月试图controller
        // 'controller/modal-prompt', //确认提示框
        // 'controller/setting-controller', //台历管理controller
        // 'controller/setting-display-controller', // 台历设置
        // 'controller/setting-label-controller', // 台历设置-标签设置
        // 'controller/new-event', //添加事件
        // 'public/jingoal-select/jingoal-select', // 加载组件ckeditor
        // 'controller/event-detail-controller', //事件详情controller