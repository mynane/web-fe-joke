﻿/*
 Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.

 For licensing, see LICENSE.md or http://ckeditor.com/license

*/
(function(){CKEDITOR.plugins.add("stylescombo",{requires:"richcombo",lang:"en,zh,zh-cn",init:function(c){var j=c.config,f=c.lang.stylescombo,e={},i=[],k=[];c.on("stylesSet",function(b){if(b=b.data.styles){for(var a,h,d=0,g=b.length;d<g;d++)if(a=b[d],!(c.blockless&&a.element in CKEDITOR.dtd.$block)&&(h=a.name,a=new CKEDITOR.style(a),!c.filter.customConfig||c.filter.check(a)))a._name=h,a._.enterMode=j.enterMode,a._.weight=d+1E3*(a.type==CKEDITOR.STYLE_OBJECT?1:a.type==CKEDITOR.STYLE_BLOCK?2:3),e[h]=
a,i.push(a),k.push(a);i.sort(function(a,b){return a._.weight-b._.weight})}});c.ui.addRichCombo("Styles",{label:f.label,title:f.panelTitle,toolbar:"styles,10",allowedContent:k,panel:{css:[CKEDITOR.skin.getPath("editor")].concat(j.contentsCss),multiSelect:!0,attributes:{"aria-label":f.panelTitle}},init:function(){var b,a,c,d,g,e;g=0;for(e=i.length;g<e;g++)b=i[g],a=b._name,d=b.type,d!=c&&(this.startGroup(f["panelTitle"+d]),c=d),this.add(a,b.type==CKEDITOR.STYLE_OBJECT?a:b.buildPreview(),a);this.commit()},
onClick:function(b){c.focus();c.fire("saveSnapshot");var b=e[b],a=c.elementPath();c[b.checkActive(a)?"removeStyle":"applyStyle"](b);c.fire("saveSnapshot")},onRender:function(){c.on("selectionChange",function(b){for(var a=this.getValue(),b=b.data.path.elements,c=0,d=b.length,g;c<d;c++){g=b[c];for(var f in e)if(e[f].checkElementRemovable(g,!0)){f!=a&&this.setValue(f);return}}this.setValue("")},this)},onOpen:function(){var b=c.getSelection().getSelectedElement(),b=c.elementPath(b),a=[0,0,0,0];this.showAll();
this.unmarkAll();for(var h in e){var d=e[h],g=d.type;d.checkApplicable(b,c.activeFilter)?a[g]++:this.hideItem(h);d.checkActive(b)&&this.mark(h)}a[CKEDITOR.STYLE_BLOCK]||this.hideGroup(f["panelTitle"+CKEDITOR.STYLE_BLOCK]);a[CKEDITOR.STYLE_INLINE]||this.hideGroup(f["panelTitle"+CKEDITOR.STYLE_INLINE]);a[CKEDITOR.STYLE_OBJECT]||this.hideGroup(f["panelTitle"+CKEDITOR.STYLE_OBJECT])},refresh:function(){var b=c.elementPath();if(b){for(var a in e)if(e[a].checkApplicable(b,c.activeFilter))return;this.setState(CKEDITOR.TRISTATE_DISABLED)}},
reset:function(){e={};i=[]}})}})})();