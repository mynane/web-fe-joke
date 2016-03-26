define(function() {
    calendarApp.directive('comJoinPerson', function($utils, $http, $rootScope) {
        return {
            restrict: 'A',
            templateUrl: "join-person",
            scope: {
                personList:"=initList",
                placeholder:"@placeholder"
            },
            link: function($scope, $element, $attr) {
                //初始化的时候，决定要不要打开
                $scope.isOpen = judgeIsOpen();
                $scope.open = function(){
                    $scope.isOpen = true;
                }
                $scope.disabled = false;
                $scope.$parent[$attr["directiveReturn"]] = {
                    setValue:function(value){
                        $scope.personList = value;
                        $scope.$parent[$attr["initList"]] = value;
                        $scope.isOpen = judgeIsOpen();
                        $scope.$parent.$digest();
                        this.callback(value);
                    },
                    getValue:function(){
                        return $scope.personList;
                    },
                    openSelect: function(){
                        selectPUsers();
                    },
                    disable:function(type){
                        $scope.disabled = type;
                    },
                    callback:function(){},
                    setCallback: function(func){
                        this.callback = func;
                    }
                }
                $scope.openSelectUser = function(event){
                    var target = event.target;
                    if(!($(target).findParents(".the-trace-person")||
                        ($(target).findParents(".choosed-person-item") && $scope.isOpen))){
                        selectPUsers();
                    }
                }
                //打开人员选择树
                function lab_jingoalNewTree(a){
                    utils.syncLoading(true);
                    require(['public/zTree/js/jingoalNewTree'],function(){
                        new JingoalTree(a,$utils,$scope)
                    });
                }
                //选择人员
                function selectPUsers(){
                    if($scope.disabled) return;
                    var checkedNodes = [],
                        alreadyList = $scope.personList;
                    for(var i=0,len=alreadyList.length;i<len;i++){
                        checkedNodes.push({
                            id: alreadyList[i].id,
                            name: alreadyList[i].name
                        });
                    }
                    var treeOps = {
                        url: "/module/tree/getNewTree.do", //这个参数请求只使用一次 最后获取全都是使用的tree里面的option
                        height: 237,//可空,默认是209
                        treeTitle: "选择人员",
                        placeholder: "输入员工名称",
                        hasCheckBox: true,//可空,默认是 false
                        hasRightPanel: true,//可空,默认是 false
                        checkedNodes: JSON.stringify(checkedNodes), //可空
                        treeType: 'byEmployee', // 树初始化之后 默认选择人员
                        showEnc: false, //是否支持选择 ‘友好企业’
                        treeFilterType: '0', //0： 人员， 1：部门， 2：职务
                        permId: '',//权限，默认是空
                        maxSelect: 500,   // 可以选择最大的节点数
                        maxSelectTip: 490, // 提示时选择的最大节点数
                        callback: function(tree,tree2){
                            $scope.$parent[$attr["directiveReturn"]].setValue(tree.getSelectNodes());
                        }
                    };
                    lab_jingoalNewTree(treeOps);
                }
                function judgeIsOpen(){
                    if($scope.personList.length > 0){
                        //创建一个隐藏input元素
                        var inputHelper = document.getElementById("get-font-width-input-helper");
                        if(!inputHelper){
                            inputHelper = document.createElement("input");
                            inputHelper.id = "get-font-width-input-helper";
                            inputHelper.style.cssText = "position:fixed;top:-10000px;width:10px;padding:0;font-size:12px;";
                            document.body.appendChild(inputHelper);
                        }
                        inputHelper.value = "";
                        //获取组件的宽度
                        var comWidth = $element[0].offsetWidth - 20;
                        for(var i = 0, len = $scope.personList.length;i < len;i++){
                            inputHelper.value = inputHelper.value + $scope.personList[i].name;
                            if(inputHelper.scrollWidth + (i+1)*34 > comWidth){
                                return false;
                                break;
                            }
                        }
                    }
                    return true;
                }
                $scope.delPerson = function(personid){
                    var personList = $scope.personList;
                    for(var i=0,len=personList.length;i<len;i++){
                        if(personList[i].id==personid){
                            personList.splice(i,1);
                            break;
                        }
                    }
                }
            }
        }
    });

});
