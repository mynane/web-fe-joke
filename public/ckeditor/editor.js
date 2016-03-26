
window.Editor || (window.Editor = (function(){
	var version = 7;
	
	var scriptLoaded = false,
		loading = false,
		pending = [],
		initVaules = []; // IE7下textarea 输入内容，用于判断内容是否发生变化
	
	//
	function loadScript(path, callback){
		var script = document.createElement( 'script' );
		script.type = 'text/javascript';
		script.src = path;
		
		if ( typeof( script.onreadystatechange ) !== "undefined" ) {
			script.onreadystatechange = function() {
				if ( script.readyState == 'loaded' || script.readyState == 'complete' ) {
					script.onreadystatechange = null;
					callback && typeof callback === 'function' && callback();
				}
			};
		} else {
			script.onload = function() {
				setTimeout( function() {
					callback && typeof callback === 'function' && callback();
				}, 0 );
			};
		}
		document.body.appendChild(script);
	}
	
	//当编辑器脚本加载完毕执行的动作
	function onScriptLoaded(callback){
		scriptLoaded = true;
		loading = false;
		
		callback && typeof callback === 'function' && callback();
		
		var fn = null;
		while(fn = pending.shift()){
			fn && typeof fn === 'function' && fn();
		}
	}
	
	// 加载css样式
	function loadCss(path){
		var link = document.createElement( 'link' );
		link.type = 'text/css';
		link.rel = 'Stylesheet';
		link.href = path;
		
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	
	//加载ckeditor
	function loadCKEditor(callback){
		
		if(scriptLoaded){
			callback();
		}else{
			if(loading){
				pending.push(callback);
				return;
			}
			loading = true;

			loadScript((staticUrl || '') + '/static/v2/cksource/dev/builder/release/ckeditor/ckeditor.js?v=' + version, function(){
				onScriptLoaded(callback);
			});
		}
	}
	
	//非ie及ie8以上的版本使用ckeditor,ie7及以下版本不使用编辑器
	var agent = navigator.userAgent.toLowerCase(),
		useCKEditor = false;
	
	useCKEditor = agent.indexOf('msie') < 0 || parseFloat(agent.match(/msie (\d+)/)[1]) > 7;
	if(useCKEditor){
		var config = {
				skin: 'jingoal',
				customConfig : '',
			    title: '',
			    entities: false,
			    entities_latin: false,
			    entities_greek: false,
			    entities_additional: false,
				fontSize_sizes: '10/10px;12/12px;14/14px;16/16px;18/18px;24/24px;32/32px;',
			    extraAllowedContent:'ol ul li[align]{text-align,margin-left};a[!href,target];img{width,height,display}[!src,width,height];table td tr th caption[*]{*}(*);div[align]{text-align};p{text-align}[align];blockquote;'//自定义插件需要允许的标签
			};
		
		var _create = function(domId, option){
			if(!domId || typeof domId !== 'string'){
				return;
			}
			
			var obj = document.getElementById(domId);
			if(!obj){
				return;
			}
			
			var offsetWidth = obj.offsetWidth, offsetHeight = obj.offsetHeight;
			config.width = offsetWidth > 0 ? offsetWidth : obj.style.width;
			config.height = option.minHeight ? option.minHeight : (offsetHeight > 0 ? offsetHeight : obj.style.height);
			
			if(option && option.lang && option.lang == 'zh_TW'){
				config.font_names = '宋體/simsun,serif;楷體/DFKai-SB;黑體/simhei,sans-serif;幼圓/幼圆,幼圓;微軟雅黑/微软雅黑,微軟雅黑;Times New Roman;Arial;Courier New';
				config.language = 'zh';
			}else{
				config.font_names = '宋体/simsun,serif;楷体/DFKai-SB;黑体/simhei,sans-serif;幼圆/幼圆,幼圓;微软雅黑/微软雅黑,微軟雅黑;Times New Roman;Arial;Courier New';
				config.language = 'zh-cn';
			}
			if(option && option.min){
				config.toolbar = [
				                  [ 'Bold', 'Italic', 'Underline' ],
				                  [ 'Font', 'FontSize', '-', 'TextColor', 'BGColor'],
				                  [ 'JingoalJustify', 'JingoalList', 'JingoalIndent', 'JingoalLink']// 'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 
				              ];
			}else{
				config.toolbar =  [
				                   	[ 'Bold', 'Italic', 'Underline' ],
				                   	[ 'Font', 'FontSize', '-', 'TextColor', 'BGColor'],
				                   	[ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'NumberedList', 'BulletedList', 'Indent', 'Outdent', 'JingoalLink']// 'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 
				  		          ];
			}
			var editor = CKEDITOR.replace(domId, config);
			//减小工具栏按钮的间距
			if(option && option.min && editor.container){
				setTimeout(function(){
					var anchors = editor.container.getElementsByTag('a');
					for(var i = 0;i < anchors.count();i++){
						var ele = new CKEDITOR.dom.element(anchors.getItem(i).$);
						if(ele.hasClass('cke_button')){
							ele.setStyle('padding', '3px 1px');
						}
					}
				}, 0);
			}
			
			(function enableContextMenu(){
				setTimeout(function(){
					try{
						//高度自适应
						if(option.minHeight){
							editor.editable().getParent().setStyles({
								'min-height' : parseInt(option.minHeight) + 'px',
								'max-height' : parseInt(offsetHeight > 0 ? offsetHeight : obj.style.height) + 'px',
								'overflow' : 'auto',
								'height' : 'auto'
							});
							editor.editable().setStyle('min-height', parseInt(option.minHeight) + 'px');
						}
						
						//打开编辑器的原生右键菜单
						var domObject = editor.container, _;
						(_ = domObject.getPrivate()) && _.events && delete _.events['contextmenu'];
						domObject.removeListener('contextmenu');
						
						domObject.find('.cke_top').getItem(0).disableContextMenu();
					}catch(e){
						enableContextMenu();
					}
				}, 100);
			})();
			
//			(function disableResizing(){
//				try{
//					setTimeout(function(){document.execCommand('enableObjectResizing', false);}, 100);
//				}catch(e){
//					disableResizing();
//				}
//			})();
		}
	}
	
	return {
		_wipeHTML: function(val){
			return val.replace(/\s*<\/?[^>]+>\s*/gi,function(sMatch){
				if((/<\s*(\/li|br\s*\/?|\/?\s*p)\s*>/g).test(sMatch)){
					return '\n';
				} else {
					return '';
				}
			});
		},
		_escape : function(val) {
			return val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/  /g,' &nbsp;');
		},
		_unescape : function(val) {
			return val.replace(/&nbsp;/g,' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
		},
		_isEmpty : function(val){
			val = this._unescape(val.replace(/\s*<\/?[^>]+>\s*/gi,''));
			val = val.replace(String.fromCharCode(8203), '');
			return val.replace(/^\s*(.*?)\s*$/g,'$1').length <= 0;
		},
		create : function(domId, option){
			if (useCKEditor) {
				loadCKEditor(function(){
					_create(domId, option);});
			} else {
				var obj = document.getElementById(domId);
				if (obj) {
					obj.value =  this._unescape(this._wipeHTML(obj.value.replace(/[\n\r]/g,'')));
					initVaules[domId] = obj.value.replace(/^\s*(.*?)\s*$/g,'$1');
				}
			}
		},
		getValue : function(domId){
			var val;
			if (useCKEditor) {
				var editor = CKEDITOR.instances[domId];
				if(editor){
					val = editor.getData();
				}else{
					val = document.getElementById(domId).value;
				}
			} else {
				val = document.getElementById(domId).value;
				val = this._escape(val).replace(/\n(\r)?/g,'<br>');
			}
			return val;
		},
		contentChanged : function(domId){
			if (useCKEditor) {
				var editor = CKEDITOR.instances[domId];
				return editor.checkDirty();
			} else {
				return document.getElementById(domId).value.replace(/^\s*(.*?)\s*$/g,'$1') != initVaules[domId];
			}
		},
		clear : function(domId){
			if (useCKEditor) {
				var editor = CKEDITOR.instances[domId];
				if(editor){
					try{
						editor.setData('');//ie9下会报异常
					}catch(e){}
					setTimeout(function(){editor.focus();}, 10);
					var pop = editor.document.getById(editor.name + 'link-plugin');
					if(pop){
						pop.setStyles({
		        			top: '0px',
		        			left: '-1000px'
		        		});
					}
				}
			} else {
				document.getElementById(domId).value = "";
			}
		}
	}
	
})());