(function(){	
	CKEDITOR.plugins.add( 'jingoalcombo', {
		requires: 'menubutton,justify,list,indent',
		icons: 'jingoaljustify,jingoallist,jingoalindent',
		hidpi: false,
		
		init: function( editor ) {
			var left = CKEDITOR.tools.prototypedCopy(editor.getCommand('justifyleft')),
				center = CKEDITOR.tools.prototypedCopy(editor.getCommand('justifycenter')),
				right = CKEDITOR.tools.prototypedCopy(editor.getCommand('justifyright'));
			
			left.checkAllowed = function(){return true};
			left.state = CKEDITOR.TRISTATE_OFF;
			center.checkAllowed = function(){return true};
			center.state = CKEDITOR.TRISTATE_OFF;
			right.checkAllowed = function(){return true};
			right.state = CKEDITOR.TRISTATE_OFF;
			
			//聚合对齐方式功能
			var justifyItems = {};
			justifyItems.justifyleft = {
	    		label: editor.lang.justify.left,
	    		group: 'justifyGrp',
	    		state: CKEDITOR.TRISTATE_OFF,
	    		order: 1,
	    		onClick: function(){
	    			left.exec(editor);
	    		}
		    };
			justifyItems.justifycenter = {
			    label: editor.lang.justify.center,
			    group: 'justifyGrp',
			    state: CKEDITOR.TRISTATE_OFF,
			    order: 1,
	    		onClick: function(){
	    			center.exec(editor);
	    		}
		    };
			justifyItems.justifyright = {
			    label: editor.lang.justify.right,
			    group: 'justifyGrp',
			    state: CKEDITOR.TRISTATE_OFF,
			    order: 1,
	    		onClick: function(){
	    			right.exec(editor);
	    		}
		    };
		    // Initialize groups for menu.
		    editor.addMenuGroup( 'justifyGrp', 1 );
		    editor.addMenuItems( justifyItems );
		    
		    editor.ui.add( 'JingoalJustify', CKEDITOR.UI_MENUBUTTON, {
		    	label: editor.lang.jingoalcombo.model,
				onMenu: function() {
					var activeItems = {};
					activeItems[ 'justifyleft' ] = CKEDITOR.TRISTATE_OFF;
					activeItems[ 'justifycenter' ] = CKEDITOR.TRISTATE_OFF;
					activeItems[ 'justifyright' ] = CKEDITOR.TRISTATE_OFF;
					return activeItems;
				}
		    });
		    
		    var numberList = CKEDITOR.tools.prototypedCopy(editor.getCommand('numberedlist')),
		    	bulletlist = CKEDITOR.tools.prototypedCopy(editor.getCommand('bulletedlist'));
		    numberList.state = CKEDITOR.TRISTATE_OFF;
		    numberList.checkAllowed = function(){
		    	return true;
		    }
		    bulletlist.state = CKEDITOR.TRISTATE_OFF;
		    bulletlist.checkAllowed = function(){
		    	return true;
		    }
		    
		    //列表组合
		    var listItems = {};
	    	listItems.numberedlist = {
	    		label: editor.lang.list.numberedlist,
	    		group: 'listGrp',
	    		state: CKEDITOR.TRISTATE_OFF,
	    		order: 1,
	    		onClick: function() {
	    			numberList.exec(editor);
	    		}
		    };
	    	listItems.bulletedlist = {
			    label: editor.lang.list.bulletedlist,
			    group: 'listGrp',
			    state: CKEDITOR.TRISTATE_OFF,
			    order: 1,
			    onClick: function() {
			    	bulletlist.exec(editor);
			    }
		    };
		    // Initialize groups for menu.
		    editor.addMenuGroup( 'listGrp', 1 );
		    editor.addMenuItems( listItems );
		    
		    editor.ui.add( 'JingoalList', CKEDITOR.UI_MENUBUTTON, {
		    	label: editor.lang.jingoalcombo.list,
				onMenu: function() {
					var activeItems = {};
					activeItems[ 'numberedlist' ] = CKEDITOR.TRISTATE_OFF;
					activeItems[ 'bulletedlist' ] = CKEDITOR.TRISTATE_OFF;
					return activeItems;
				}
		    });
		    
		    //缩进组合
		    var indentItems = {};
		    indentItems.indent = {
	    		label: editor.lang.indent.indent,
	    		group: 'indentGrp',
	    		state: CKEDITOR.TRISTATE_OFF,
	    		order: 1,
	    		onClick: function() {
	    			editor.execCommand('indent');
	    		}
		    };
		    indentItems.outdent = {
			    label: editor.lang.indent.outdent,
			    group: 'indentGrp',
			    state: CKEDITOR.TRISTATE_OFF,
			    order: 1,
			    onClick: function() {
			    	editor.execCommand('outdent');
			    }
		    };
		    // Initialize groups for menu.
		    editor.addMenuGroup( 'indentGrp', 1 );
		    editor.addMenuItems( indentItems );
		    
		    editor.ui.add( 'JingoalIndent', CKEDITOR.UI_MENUBUTTON, {
		    	label: editor.lang.jingoalcombo.indent,
				onMenu: function() {
					var activeItems = {};
					activeItems[ 'indent' ] = CKEDITOR.TRISTATE_OFF;
					activeItems[ 'outdent' ] = CKEDITOR.TRISTATE_OFF;
					return activeItems;
				}
		    });
		    
		    
//		    if ( editor.contextMenu ) {
//	    		//对齐菜单
//	    	    editor.addMenuGroup( 'justifyGroup', 200 );
//	    	    
//	    	    editor.addMenuItem( 'justifyleftItem', {
//	    	        label: editor.lang.justify.left,
//	    	        command: 'justifyleft',
//	    	        group: 'justifyGroup'
//	    	    });
//	    	    editor.addMenuItem( 'justifycenterItem', {
//	    	        label: editor.lang.justify.center,
//	    	        command: 'justifycenter',
//	    	        group: 'justifyGroup'
//	    	    });
//	    	    editor.addMenuItem( 'justifyrightItem', {
//	    	        label: editor.lang.justify.right,
//	    	        command: 'justifyright',
//	    	        group: 'justifyGroup'
//	    	    });
//	    	    
//	    	    //缩进菜单
//	    	    editor.addMenuGroup( 'indentGroup', 210 );
//	    	    
//	    	    editor.addMenuItem( 'indentItem', {
//	    	        label: editor.lang.indent.indent,
//	    	        command: 'indent',
//	    	        group: 'indentGroup'
//	    	    });
//	    	    editor.addMenuItem( 'outdentItem', {
//	    	        label: editor.lang.indent.outdent,
//	    	        command: 'outdent',
//	    	        group: 'indentGroup'
//	    	    });
//	    	    
//	    	    editor.contextMenu.addListener( function( element ) {
//	    	        if ( element.getAscendant( 'p', true ) ) {
//	    	            return { 
//	    	            	justifyleftItem: CKEDITOR.TRISTATE_OFF,
//	    	            	justifycenterItem: CKEDITOR.TRISTATE_OFF,
//	    	            	justifyrightItem: CKEDITOR.TRISTATE_OFF,
//	    	            	indentItem: CKEDITOR.TRISTATE_OFF,
//	    	            	outdentItem: CKEDITOR.TRISTATE_OFF
//	    	            };
//	    	        }else{
//	    	        	return { 
//	    	            	indentItem: CKEDITOR.TRISTATE_OFF,
//	    	            	outdentItem: CKEDITOR.TRISTATE_OFF
//	    	            };
//	    	        }
//	    	    });
//	    	}
	    }
	});
})();