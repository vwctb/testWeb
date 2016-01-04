// varsion 1.0.2
(function($) {
	$.fn.addStickyNotes = function(options) {
		var defaults = { 
			colors: ['#FDFB8C'],
			width: '150',
			height: '150',
			left: '0',
			top:'0',
			save:['note', 'width', 'height', 'top', 'left', 'z-index', 'background-color', 'id']
		};
		var settings = $.extend(false, defaults, options);
		$(this).each(function() {
      var sticky = new StickyNote(this, settings);
    });
	};
	
	$.fn.addStickyNotesInit = function(options) {
		var sticky = $(this);
		sticky.attr('id', (sticky.children('.id').text()));
		btn_delete = $("<a href='#' class='delete' style='position:absolute;left:0;top:0;background: url(images/delete.png);text-indent: -99999px;width:14px;height:14px;'>x</a>");
		//content = '<div class="textnote">'+sticky.children('.note').text()+'</div>';
		content = '<div class="textnote"></div>';
		color = (sticky.children('.color')[0] ? sticky.children('.color').text() : context.colors[context.color_index = ((++context.color_index)%(context.colors.length))]);
		sticky.css('background-color', color)
		.css('width', (sticky.children('.width').text())+'px')
		.css('height', (sticky.children('.height').text())+'px')
		.css('z-index', (sticky.children('.z_index').text()||++context.z_index))
		.css('top', (sticky.children('.top').text()||context.top))
		.css('left', (sticky.children('.left').text()||context.left))
		.css('box-shadow','4px 4px 4px darkgray')
		
		.html(content).draggable({start : function(){sticky.css('z-index', ++context.z_index);},
		stop : function(){context.callback(sticky);}}).resizable({stop : function(){context.callback(sticky);}});
		context.inPlaceEdit(sticky);
		sticky.append(btn_delete);
		btn_delete.click(function(){$(this.parentNode).remove();});
	};
	
	function StickyNote(wrapper, options) {
		console.log(options);
    this.init(wrapper, options);
  };
  StickyNote.prototype = {
		wrapper: false,
		id: 0,
		z_index:0,
		colors: ['#FDFB8C'],
		color_index: 3,
		width: '150',
		height: '150',
		left: '0',
		top:'0',
		save:['note', 'width', 'height', 'top', 'left', 'z-index', 'background-color', 'id'],
		init: function(wrapper, options){
			this.wrapper = $(wrapper);
			context = this;
			$.each(options, function(k, v){
				console.log(k.toString());
				switch(k.toString()){
					case 'type':
						context.method_type = v;
						
					case 'colors':
						context.colors = v;
						context.color_index = v.length-1;
						context.url = v || "#";
						
					case 'height':
						context.height = v;
						
					case 'width':
						context.width = v;
						break;
					case 'top' :
						context.top = v;
						break;
					case 'left':
						context.left = v;
						
					case 'save' :
						context.save = v;
				}
			});
			this.initializeExistingStickyNotes();
			this.initializeZIndexAndID();
			//this.initializeStickyNote();
		},
		initializeExistingStickyNotes : function(){
			var context = this;
			$('.stickyNote').each(function(){
				var sticky = $(this);
				this.id=(sticky.children('id').text()||++context.id);
				btn_delete = $("<a href='#' class='delete'>x</a>");
				content = '<div class="textnote">'+sticky.children('.note').text()+'</div>';
				color = (sticky.children('.color')[0] ? sticky.children('.color').text() : context.colors[context.color_index = ((++context.color_index)%(context.colors.length))]);
				sticky.css('background-color', color)
				.css('width', (sticky.children('.width').text()||context.width)+'px')
				.css('height', (sticky.children('.height').text()||context.height)+'px')
				.css('z-index', (sticky.children('.z_index').text()||++context.z_index))
				.css('top', (sticky.children('.top').text()||context.top))
				.css('left', (sticky.children('.left').text()||context.left))
				.html(content).draggable({start : function(){sticky.css('z-index', ++context.z_index);},
				stop : function(){context.callback(sticky);}}).resizable({stop : function(){context.callback(sticky);}});
				context.inPlaceEdit(sticky);
				sticky.append(btn_delete);
				btn_delete.click(function(){$(this.parentNode).remove();});
			});
		},
		initializeZIndexAndID : function(){
			var context = this;
			$('.stickyNote').each(function(){
				if( context.z_index < $(this).css('z-index')){context.z_index = $(this).css('z-index');}
				if( context.id < parseInt(this.id)){context.id = parseInt(this.id);}
			});
		},
		stickyNoteStyles : function(sticky){
			this.color_index = ((++this.color_index)%(this.colors.length));
			var color=this.colors[this.color_index];
			sticky.css('background-color', color).css('height', this.height).css('width', this.width).css('left', this.left).css('top', this.top).css('z-index', this.z_index).children('form').children('textarea').css('background-color', color);
		},
		initializeStickyNote : function(){
			var context = this;
			div = $("<div class='stickyNote' id='newStickyNote'></div>");
			var form=context.createForm();
			div.append(form);
			link = $("<a href='#' class='delete'>x</a>");
			div.prepend(link);
			link.click(function(){$(this.parentNode).remove();});
			context.wrapper.append(div);
			context.stickyNoteStyles(div);
			div.draggable({start : function(){div.css('z-index', ++context.z_index);},stop : function(){context.callback(div);}}).resizable({stop : function(){context.callback(div);}});
			
		},
		createForm : function(){
			form = $("<form></form>");
			textarea = $("<textarea name='note' class='note' style='resize:none;'></textarea>");
			form.append(textarea);
			return form;
		},
		inPlaceEdit : function(sticky){
			var context = this;
			sticky.click(function(){
				div = $(this);
				var form=context.createForm();
				form.children('textarea').val(div.children('.textnote').text()).css('background-color', div.css('background-color'));
				div.append(form).children('.textnote').remove();
				//context.saveNoteOnBlur();
				div.unbind('click');
			});
		},
		callback : function(div){
			if(this.url.length>1){
				var data = "";
				$.each(this.save, function(){
					if(data.length>0){data += "&";};
					data += (this + "=");
					switch(this.toString()){
						case 'note':
							//alert(1);
							data += div.children('.textnote').text();
						case 'id':
							//alert('div[0].id:'+div[0].id);
							data += div[0].id;
						default :
							data+=div.css(this.toString());
					}
				});
				
			}
		}
	};
})(jQuery);