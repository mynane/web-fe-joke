﻿/*
 Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.

 For licensing, see LICENSE.md or http://ckeditor.com/license

*/
(function(){CKEDITOR.plugins.add("placeholder",{requires:"widget,dialog",lang:"en,zh,zh-cn",icons:"placeholder",hidpi:!0,onLoad:function(){CKEDITOR.addCss(".cke_placeholder{background-color:#ff0}")},init:function(a){var b=a.lang.placeholder;CKEDITOR.dialog.add("placeholder",this.path+"dialogs/placeholder.js");a.widgets.add("placeholder",{dialog:"placeholder",pathName:b.pathName,template:'<span class="cke_placeholder">[[]]</span>',downcast:function(){return new CKEDITOR.htmlParser.text("[["+this.data.name+
"]]")},init:function(){this.setData("name",this.element.getText().slice(2,-2))},data:function(){this.element.setText("[["+this.data.name+"]]")}});a.ui.addButton&&a.ui.addButton("CreatePlaceholder",{label:b.toolbar,command:"placeholder",toolbar:"insert,5",icon:"placeholder"})},afterInit:function(a){var b=/\[\[([^\[\]])+\]\]/g;a.dataProcessor.dataFilter.addRules({text:function(f,d){var e=d.parent&&CKEDITOR.dtd[d.parent.name];if(!e||e.span)return f.replace(b,function(b){var c=null,c=new CKEDITOR.htmlParser.element("span",
{"class":"cke_placeholder"});c.add(new CKEDITOR.htmlParser.text(b));c=a.widgets.wrapElement(c,"placeholder");return c.getOuterHtml()})}})}})})();