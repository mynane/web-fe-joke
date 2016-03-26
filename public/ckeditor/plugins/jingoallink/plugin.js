(function(){	
	CKEDITOR.plugins.add( 'jingoallink', {
		icons: 'jingoallink',
		hidpi: false,
		
		init: function( editor ) {
			//var allowed = 'a[!href]', required = 'a[href]';
			var selectedLink = null;
			
			var popbg = 'background-image: url(\'' + this.path.replace(/([\/\w]*cksource)[\/\w]*/, '$1') + '/tools.png\');',
				popbar = 'position:absolute;z-index:10;border:1px solid #dddddd;height:23px;padding:4px;background-repeat:repeat-x;background-position:0 -43px;-moz-box-shadow: 0 0 10px rgba(0,0,0,.50);-webkit-box-shadow: 0 0 10px rgba(0,0,0,.50);box-shadow: 0 0 10px rgba(0,0,0,.50);';
			
			function render(){
				var doc = editor.document;
				if(doc.getById(editor.name + 'link-plugin')){
					return;
				}
				
				var iconlink = 'float:left;width:18px;height:18px;margin:0 5px;background-position: -206px -4px;',
					link = 'float:left;white-space:nowrap;color:#828282;line-height:23px;margin:0 3px;text-decoration:underline;',
					sp1 = 'float:left;width:2px;height:25px;margin:-1px 3px 0;background-position:-269px -6px;',
					linkedit = 'float:left;width:15px;height:21px;margin:0 3px;background-position:-76px -1px;',
					linkremove = 'float:left;width:17px;height:20px;margin:0 5px;background-repeat:no-repeat;background-position:-10px -2px;',
					input = 'float:left;width:200px;margin:1px 7px 0 5px;border:1px solid #c9c9c9;	',
					finish = 'float:left;width:20px;height:20px;margin:0 5px;background-position:-140px -1px;';
				
				var template = 
					'<div style="position:absolute;left:-1000px;top:0px;' + popbar + '" unselectable="on" id="' + editor.name + 'link-plugin">' +
						'<span unselectable="on" style="' + popbg + iconlink + '"></span>' + 
						'<span unselectable="on" class="linkcommon" id="' + editor.name + 'link-view" style=" ">' + 
							'<span class="ie89" style="max-width:184px; overflow:hidden; height:23px;float:left;">' + 
								'<a target="blank" unselectable="on" href="" id="' + editor.name + 'link-link" style="' + link + '">http://www.jingoal.com</a>' + 
							'</span>' + 
							'<span unselectable="on" style="' + popbg + sp1 + '"></span>' + 
							'<a unselectable="on" title="' + editor.lang.jingoallink.editlink + '" style="' + popbg + linkedit + '" href="javascript:;" id="' + editor.name + 'link-edit"></a>' + 
							'<span unselectable="on" style="' + popbg + sp1 + '"></span>' + 
							'<a title="' + editor.lang.jingoallink.clearlink + '" style="' + popbg + linkremove + '" unselectable="on" href="javascript:;" id="' + editor.name + 'link-remove"></a>' + 
						'</span>' + 
						'<span unselectable="on" style="display:none;" class="linkedit" id="' + editor.name + 'link-modify">' + 
							'<iframe id="' + editor.name + 'input-frame" style="float:left;width:218px;height:23px;border:none;" frameborder="0"></iframe>' + 
							'<span unselectable="on" style="' + popbg + sp1 + '"></span>' + 
							'<a unselectable="on" title="' + editor.lang.jingoallink.confirm + '" style="' + popbg + finish + '" href="javascript:;" id="' + editor.name + 'link-save"></a>' + 
						'</span>' + 
					'</div>';
				CKEDITOR.dom.element.createFromHtml(template).appendTo(editor.container);
				editor.container.setStyle('position', 'relative');
				
    			var link = doc.getById(editor.name + 'link-link');
    			link.on('mouseenter', function(){link.setStyle('color', '#535353');});
    			link.on('mouseout', function(){link.setStyle('color', '#828282');});
    			
    			var linkedit = doc.getById(editor.name + 'link-edit');
    			linkedit.on('mouseenter', function(){linkedit.setStyle('background-position', '-110px -1px');});
    			linkedit.on('mouseout', function(){linkedit.setStyle('background-position', '-76px -1px');});
    			linkedit.on('click', function(){
    				getLinkview().hide();
    				getLinkmodify().show();
    				setTimeout(function(){
    					position();
    				}, 0);
    				
    				if(selectedLink){
    					getInput().setValue(selectedLink.getAttribute('href'));
    				}
    			});
    			
    			var linkremove = doc.getById(editor.name + 'link-remove');
    			linkremove.on('mouseenter', function(){linkremove.setStyle('background-position', '-43px -2px');});
    			linkremove.on('mouseout', function(){linkremove.setStyle('background-position', '-10px -2px');});
    			linkremove.on('click', unlink);
    			
    			var linksave = doc.getById(editor.name + 'link-save');
    			linksave.on('mouseenter', function(){linksave.setStyle('background-position', '-173px -1px');});
    			linksave.on('mouseout', function(){linksave.setStyle('background-position', '-140px -1px');});
    			linksave.on('click', function(){
    				
    				var url = getInput().getValue();
    				    url = (/^\s*http(s)?\:\/\//.test(url)) ? url : 'http://' + url;
    				    
    				//如果有选中的链接，更改链接的属性    
    				if(selectedLink){
    					selectedLink.setAttribute('href', url);
    					selectedLink.removeAttribute('data-cke-saved-href');
    					
    				//给选区增加链接
    				}else{
    					makelink(url);
    				}
    				
    				link.setAttribute('href', url);
    				link.setText(url);
    				
    				getLinkmodify().hide();
    				getLinkview().show();
    				position();
    				setTimeout(function(){
    					hidePop();
    				}, 800);
    				
    			});
    			
    			var frame = editor.document.getById(editor.name + 'input-frame'),
    			    doc = frame.getFrameDocument();
    			doc.write('<!DOCTYPE html>' +
    					'<html>' +
    					'<head><style>html,body{margin:0;padding:0};<\/style>' + 
    					'<\/head>' +
    					'<body><input type="text" style="' + input + '" id="' + editor.name + 'link-input"><\/body>' +
    				'<\/html>');
    			
    			editor.editable().on('scroll', hidePop);
			}
			
			function getLinkmodify(){
        		return editor.document.getById(editor.name + 'link-modify');
        	}
        	
        	function getLinkview(){
        		return editor.document.getById(editor.name + 'link-view');
        	}
        	
        	function getInput(){
				var frame = editor.document.getById(editor.name + 'input-frame'),
			        doc = frame.getFrameDocument();
				
				return doc.getById(editor.name + 'link-input');
			}
        	
        	function getPopLink(){
        		return editor.document.getById(editor.name + 'link-link');
        	}
        	
        	function getPop(){
        		
        		var pop = editor.document.getById(editor.name + 'link-plugin');
        		if(!pop){
        			render();
        		}
        		return editor.document.getById(editor.name + 'link-plugin');
        	}
        	
        	function hidePop(){
        		getPop().setStyles({
        			top: '0px',
        			left: '-1000px'
        		});
        	}
        	
        	editor.on('selectionChange', function(){
        		selectedLink = getSelectedLink(editor);
            	if(selectedLink && selectedLink instanceof CKEDITOR.dom.element){
    				getPop();//防止pop未渲染
    				
    				getPopLink().setAttribute('href', selectedLink.getAttribute('href'));
    				getPopLink().setText(selectedLink.getAttribute('href'));
    				
    				editor.getSelection().selectElement(selectedLink);
    				
            		getLinkmodify().hide();
            		getLinkview().show();
            		
            		position();
            	}else{
            		hidePop();
            	}
        	});
        	
        	editor.addCommand( 'poplinkedit', {
                exec: function( editor ) {
                	var pop = getPop(),
                	    link = getPopLink(),
                	    linkmodify = getLinkmodify(),
                	    linkview = getLinkview();
                	
                	if(selectedLink){
            			linkmodify.hide();
        				linkview.show();
        				link.setAttribute('href', selectedLink.getAttribute('href'));
        				link.setText(selectedLink.getAttribute('href'));
        				position();
        				
                		return;
                	}
                	
                	getInput().setValue('');
                	linkmodify.show();
    				linkview.hide();
    				position();
                }
            });
        	
            if(editor.ui.addButton){
        		editor.ui.addButton( 'JingoalLink', {
                    label: editor.lang.jingoallink.insertlink,
                    command: 'poplinkedit'
                });
        	}
            
            //获得选中的链接
        	function getSelectedLink( editor ) {
        		var selection = editor.getSelection();
        		var selectedElement = selection.getSelectedElement();
        		if ( selectedElement && selectedElement.is( 'a' ) )
        			return selectedElement;

        		var range = selection.getRanges()[ 0 ];

        		if ( range ) {
        			range.shrink( CKEDITOR.SHRINK_TEXT );
        			return editor.elementPath( range.getCommonAncestor() ).contains( 'a', 1 );
        		}
        		return null;
        	}
        	
        	//移除链接
        	function unlink(){
        		var style = new CKEDITOR.style( { element: 'a', type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1 });
        		editor.removeStyle( style );
        	}
        	
        	//创建链接
        	function makelink(url){
        		var range = editor.getSelection().getRanges()[ 0 ];

				if ( range.collapsed ) {
					
					var text = new CKEDITOR.dom.text( url, editor.document );
					range.insertNode( text );
					range.selectNodeContents( text );
				}

				var style = new CKEDITOR.style( { element: 'a', attributes: {'href' : url, 'target' : '_blank'} });
				style.type = CKEDITOR.STYLE_INLINE; 
				style.applyToRange( range );
				range.select();
        	}
        	
            //获取pop位置
            function position(offsetWidth){
            	var rect,
            	    link = getSelectedLink(editor);
            	
            	if(link){
            		
            		rect = link.getClientRect();
            		
            	} else {
            		var range = editor.getSelection().getRanges()[0],
            			reference = new CKEDITOR.dom.element.createFromHtml( '<span>&nbsp;</span>', editor.document ),
    					afterCaretNode, startContainerText, isStartText;
            		
            		var clone = range.clone();
            		
            		clone.optimize();
            		if ( isStartText = clone.startContainer.type == CKEDITOR.NODE_TEXT ) {
        				startContainerText = clone.startContainer.getText();
        				afterCaretNode = clone.startContainer.split( clone.startOffset );
        				reference.insertAfter( clone.startContainer );
        			}else{
        				clone.insertNode( reference );
        			}
            		
            		rect = reference.getClientRect();
            		
            		if ( isStartText ) {
            			clone.startContainer.setText( startContainerText );
        				afterCaretNode.remove();
        				
        				clone.select();
        			}

        			reference.remove();
            	}
            	
            	getPop().setAttribute('style', 'position:absolute;top:0px;left:0px;' + popbar + popbg);
            	var left = rect.left,
            	    top = rect.top + rect.height + 2,
            	    container = editor.container.getClientRect(),
            	    offsetWidth = offsetWidth ? offsetWidth : getPop().$.offsetWidth + 10;
            	
            	left = left - container.left;
            	left = (left + offsetWidth > container.width) ? (container.width - offsetWidth - 2) : left;
            	getPop().setAttribute('style', 'position:absolute;top:' + (top - container.top) + 'px;left:' + left + 'px;' + popbar + popbg);
           	
            	getLinkmodify().$.style.display !== 'none' && editor.document.getById(editor.name + 'input-frame').$.contentWindow.document.getElementById(editor.name + 'link-input').focus();
            }
	    }
	});
})();