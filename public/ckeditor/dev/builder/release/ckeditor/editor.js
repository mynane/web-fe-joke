﻿window.Editor||(window.Editor=function(){function m(a,b){var c=document.createElement("script");c.type="text/javascript";c.src=a;"undefined"!==typeof c.onreadystatechange?c.onreadystatechange=function(){if("loaded"==c.readyState||"complete"==c.readyState)c.onreadystatechange=null,b&&"function"===typeof b&&b()}:c.onload=function(){setTimeout(function(){b&&"function"===typeof b&&b()},0)};document.body.appendChild(c)}function n(a){i?a():h?j.push(a):(h=!0,m((staticUrl||"")+"/static/v2/cksource/dev/builder/release/ckeditor/ckeditor.js?v="+
o,function(){i=!0;h=!1;a&&"function"===typeof a&&a();for(var b=null;b=j.shift();)b&&"function"===typeof b&&b()}))}var o=7,i=!1,h=!1,j=[],k=[],l=navigator.userAgent.toLowerCase(),d=!1;if(d=0>l.indexOf("msie")||7<parseFloat(l.match(/msie (\d+)/)[1]))var e={skin:"jingoal",customConfig:"",title:"",entities:!1,entities_latin:!1,entities_greek:!1,entities_additional:!1,fontSize_sizes:"10/10px;12/12px;14/14px;16/16px;18/18px;24/24px;32/32px;",extraAllowedContent:"ol ul li[align]{text-align,margin-left};a[!href,target];img{width,height,display}[!src,width,height];table td tr th caption[*]{*}(*);div[align]{text-align};p{text-align}[align];blockquote;"},
q=function(a,b){if(a&&"string"===typeof a){var c=document.getElementById(a);if(c){var d=c.offsetWidth,g=c.offsetHeight;e.width=0<d?d:c.style.width;e.height=b.minHeight?b.minHeight:0<g?g:c.style.height;b&&b.lang&&"zh_TW"==b.lang?(e.font_names="宋體/simsun,serif;楷體/DFKai-SB;黑體/simhei,sans-serif;幼圓/幼圆,幼圓;微軟雅黑/微软雅黑,微軟雅黑;Times New Roman;Arial;Courier New",e.language="zh"):(e.font_names="宋体/simsun,serif;楷体/DFKai-SB;黑体/simhei,sans-serif;幼圆/幼圆,幼圓;微软雅黑/微软雅黑,微軟雅黑;Times New Roman;Arial;Courier New",e.language=
"zh-cn");e.toolbar=b&&b.min?[["Bold","Italic","Underline"],["Font","FontSize","-","TextColor","BGColor"],["JingoalJustify","JingoalList","JingoalIndent","JingoalLink"]]:[["Bold","Italic","Underline"],["Font","FontSize","-","TextColor","BGColor"],"JustifyLeft JustifyCenter JustifyRight NumberedList BulletedList Indent Outdent JingoalLink".split(" ")];var f=CKEDITOR.replace(a,e);b&&(b.min&&f.container)&&setTimeout(function(){for(var a=f.container.getElementsByTag("a"),b=0;b<a.count();b++){var c=new CKEDITOR.dom.element(a.getItem(b).$);
c.hasClass("cke_button")&&c.setStyle("padding","3px 1px")}},0);(function p(){setTimeout(function(){try{if(b.minHeight){f.editable().getParent().setStyles({"min-height":parseInt(b.minHeight)+"px","max-height":parseInt(g>0?g:c.style.height)+"px",overflow:"auto",height:"auto"});f.editable().setStyle("min-height",parseInt(b.minHeight)+"px")}var a=f.container,d;(d=a.getPrivate())&&d.events&&delete d.events.contextmenu;a.removeListener("contextmenu");a.find(".cke_top").getItem(0).disableContextMenu()}catch(e){p()}},
100)})()}}};return{_wipeHTML:function(a){return a.replace(/\s*<\/?[^>]+>\s*/gi,function(a){return/<\s*(\/li|br\s*\/?|\/?\s*p)\s*>/g.test(a)?"\n":""})},_escape:function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/  /g," &nbsp;")},_unescape:function(a){return a.replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&amp;/g,"&")},_isEmpty:function(a){a=this._unescape(a.replace(/\s*<\/?[^>]+>\s*/gi,
""));a=a.replace(String.fromCharCode(8203),"");return 0>=a.replace(/^\s*(.*?)\s*$/g,"$1").length},create:function(a,b){if(d)n(function(){q(a,b)});else{var c=document.getElementById(a);c&&(c.value=this._unescape(this._wipeHTML(c.value.replace(/[\n\r]/g,""))),k[a]=c.value.replace(/^\s*(.*?)\s*$/g,"$1"))}},getValue:function(a){if(d)var b=CKEDITOR.instances[a],a=b?b.getData():document.getElementById(a).value;else a=document.getElementById(a).value,a=this._escape(a).replace(/\n(\r)?/g,"<br>");return a},
contentChanged:function(a){return d?CKEDITOR.instances[a].checkDirty():document.getElementById(a).value.replace(/^\s*(.*?)\s*$/g,"$1")!=k[a]},clear:function(a){if(d){var b=CKEDITOR.instances[a];if(b){try{b.setData("")}catch(c){}setTimeout(function(){b.focus()},10);(a=b.document.getById(b.name+"link-plugin"))&&a.setStyles({top:"0px",left:"-1000px"})}}else document.getElementById(a).value=""}}}());