


DrawingFabric = {};
DrawingFabric.Functionality = {};
DrawingFabric.Canvas = (function(){

  var Property = (function(){

    return function(config){
      this.parser  = config.parser || function(newVal){ return newVal; };
      this.initial = config.initial;
    };

  })();

  buildProperties = function(){
    var that = this;

    var properties = {};

    var toolProperties = {
      'fill':                new Property({initial: 'rgba(255, 255, 255, 1)'}),
      'stroke':              new Property({initial: 'black'}),
      'strokeWidth':         new Property({initial: 2, parser: function(v){ return parseInt(v,10); }}),
      'strokeDashArray':     new Property({initial: null}),
      'fontFamily':          new Property({initial: 'sans-serif'}), // serif, monospace, cursive, fantasy
      'fontSize':            new Property({initial: 36, parser: function(v){ return parseInt(v,10); }}),
      'fontStyle':           new Property({initial: 'normal'}),     // italic, oblique
      'fontWeight':          new Property({initial: 'normal'}),     // bold, bolder, lighter
      'lineHeight':          new Property({initial: 1.0, parser: function(v){ return parseFloat(v); }}),
      'textBackgroundColor': new Property({initial: 'none'}),
      'textDecoration':      new Property({initial: 'none'}),       // underline, overline, line-through
      'textShadow':          new Property({initial: ''})
    };
 
    var propertySetterFactory = function(name,property){
      var stored = property.initial;
      return function(v){
        if(typeof v != 'undefined'){
          stored = property.parser(v);
          that.fabricCanvas.fire("property:change",name);
        }
        return stored;
      };
    };

    for(var name in toolProperties){
      if(toolProperties.hasOwnProperty(name)){
        var property = toolProperties[name];
        properties[name] = propertySetterFactory(name,property);
       
      }
    }

    return properties;
  };

  return function(canvas_id){

    var that = this;

    this.properties = buildProperties.apply(this);

    this.fabricCanvas = new fabric.Canvas(canvas_id);

    this.addFunctionality = function(functionality){
      functionality.initialize.apply(this);
    };
    
  };

}());



DrawingFabric.Functionality.addDoubleClick = (function(){

  return function(){
 
    this.initialize = function(){
      var that = this;
      var obj;
      var handle = function(event){
        obj = that.fabricCanvas.getActiveObject();
        if(obj){
          obj.set('dblselected',true);
          that.fabricCanvas.fire('object:dblselected',{e: event, target: obj});
        }
      };

      that.fabricCanvas.on('before:selection:cleared', function(){
        obj = that.fabricCanvas.getActiveObject();
        if(obj){
          obj.set('dblselected',false);
          obj = null;
        }
      });

      fabric.util.addListener(this.fabricCanvas.upperCanvasEl, 'dblclick', handle);
    };

  };

}());

DrawingFabric.utils = {
  mouseCoord: function(event){
    return {x: event.e.layerX, y: event.e.layerY};
  },
  magnitudeBetweenPoints: function(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2));
  },
  angleFromHorizontal: function(x,y){
    // Avoid divide by 0
    if(x === 0){ if(y >= 0){ return Math.PI * 0.5; } else { return Math.PI * 1.5; } }
    if(y === 0){ if(x >= 0){ return 0;             } else { return Math.PI;       } }

    var quadrant, opposite, adjacent;
    if(y >= 0){
      if(x >= 0){
        quadrant = 0; opposite = y; adjacent = x;
      } else {
        quadrant = 0.5; opposite = x; adjacent = y;
      }
    } else {
      if(x < 0){
        quadrant = 1; opposite = y; adjacent = x;
      } else {
        quadrant = 1.5; opposite = x; adjacent = y;
      }
    }

    return Math.abs(Math.atan( opposite / adjacent )) + quadrant * Math.PI;
  }
};





DrawingFabric.Functionality.addText = (function(){

  var utils = DrawingFabric.utils;

  var fixTabKey = function(e){
    if(e.keyCode == 9){
      // get caret position/selection
      var start = this.selectionStart;
      var end   = this.selectionEnd;

      var $this = $(this);
      var value = $this.val();

      // set textarea value to: text before caret + tab + text after caret
      $this.val(value.substring(0, start) + "\t" + value.substring(end));

      // put caret at right position again (add one for the tab)
      this.selectionStart = this.selectionEnd = start + 1;

      // prevent the focus lose
      e.preventDefault();
    }
  };

  return function(){

    this.initialize = function(){

      var that = this;

      var selectedObj;
      var $hiddenInput;

      var createHiddenInput = function(){
        if($hiddenInput){return;}
        $hiddenInput = $('<textarea></textarea>');
        $hiddenInput.css('position','absolute');
        $hiddenInput.css('left','-900000px');
        $hiddenInput.keydown(fixTabKey);
        $(that.fabricCanvas.wrapperEl).append($hiddenInput);
      };
      createHiddenInput();

      var isText = function(){
        return that.tool() == 'text';
      };

      var activeTextObject = function(obj){
        return obj instanceof fabric.Text && obj;
      };

      var setupHiddenInput = function(obj){
        $hiddenInput.val(obj.text);
        $hiddenInput.focus();
      };

      var context = function(){
        return that.fabricCanvas.getSelectionContext();
      };

    
      var withContext = function(yield_){
            var ctx = context();
            ctx.save();
            ctx.font = selectedObj._getFontDeclaration();
            yield_(ctx);
            ctx.restore();
          };
   
    

      var selectionToSelectionByLine = function(indexes){
        var text = selectedObj.text;

        var lines = [];
        // Iterate over the characters to create an array of start and end
        // points for each line (we need a selection box for each line)
        for(var i=indexes[0]; i <= indexes[1]; i++){
          if(i == indexes[0]){
            lines.unshift({start: i});
          }
          if(i == indexes[1]){
            lines[0].end = i;
            break;
          }
          if(text[i] == '\n'){
            lines[0].end = i;
            lines.unshift({start: i+1});
          }
        }

        return lines;
      };

      var cursor;
      var cursorBlinker;
      var renderCaratCursor = function(indexes){
        var coords = cursorIndexToCanvasPosition(indexes[0]);

        removeCarats();
		
        cursor = new fabric.Rect({
          top:        coords.y,
          left:       coords.x,
          originY:    'top',
          originX:    'left',
          height:     coords.dy,
          width:      1,
          angle:      coords.angle,
          selectable: false
        });
        cursorBlinker = setInterval(function(){
          cursor.set('opacity', !cursor.opacity ? 1 : 0);
          that.fabricCanvas.renderAll();
        }, 500);
        that.fabricCanvas.add(cursor);
        lastCoords = coords;
      };

      var selections = [];
      var renderCaratSelection = function(indexes){
        var lines = selectionToSelectionByLine(indexes);

        removeCarats();

        // For each line build a selection box
        for(var j=0; j < lines.length; j++){
          var line        = lines[j];
          var coordsStart = cursorIndexToCanvasPosition(line.start);
          var coordsEnd   = cursorIndexToCanvasPosition(line.end);

          var width = utils.magnitudeBetweenPoints(
            coordsStart.x,
            coordsStart.y,
            coordsEnd.x,
            coordsEnd.y
          );

          // Get start and end of selection box
          var selection = new fabric.Rect({
            top:        coordsStart.y,
            left:       coordsStart.x,
            originY:    'top',
            originX:    'left',
            opacity:    0.5,
            height:     coordsStart.dy,
            width:      width,
            angle:      coordsStart.angle,
            selectable: false
          });

          that.fabricCanvas.add(selection);
          selections.push(selection);
        }
      };

      var removeCarats = function(){
        if(cursor){
        	
          that.fabricCanvas.remove(cursor);
          clearInterval(cursorBlinker);
          cursor = null;
        }
        for(var i = 0; i < selections.length; i++){
          that.fabricCanvas.remove(selections[i]);
        }
        selections = [];
      };

      var cursorIndexToCanvasPosition = function(cursorIndex){
        var dx,dy,x,y;

        var text = selectedObj.text;

        // Iterate over the characters to find which line the index is on
        // and how many characters in it is
        var newLineCount      = 0;
        var charsSinceNewLine = 0;

        for(var i=0; i < cursorIndex; i++){
          if(text[i] == '\n'){
            newLineCount += 1;
            charsSinceNewLine = 0;
          } else {
            charsSinceNewLine += 1;
          }
        }

        var snippet = text.slice(cursorIndex - charsSinceNewLine,cursorIndex);

        withContext(function(ctx){
          dx = ctx.measureText(snippet).width;
          dy = selectedObj.fontSize * selectedObj.lineHeight;

          // Translate to coordinates relative to canvas
          x  = dx * selectedObj.scaleX + selectedObj.left;
          y  = dy * selectedObj.scaleY * newLineCount + selectedObj.top;
          dy = dy * selectedObj.scaleY;

          var point    = new fabric.Point( x, y );
          var origin   = new fabric.Point( selectedObj.left, selectedObj.top );
          var angle    = fabric.util.degreesToRadians(selectedObj.angle);

          var rotatedPoint = fabric.util.rotatePoint(point,origin,angle);
          results = {
            x:     rotatedPoint.x,
            y:     rotatedPoint.y,
            angle: selectedObj.angle,
            dy:    dy
          };
        });

        return results;
      };

      var cursorIndex = function(){
        return [$hiddenInput[0].selectionStart,$hiddenInput[0].selectionEnd];
      };

      var lastIndexes;
      var handleCarat = function(){
        var indexes = cursorIndex();
        if(indexes != lastIndexes){
          if(indexes[0] == indexes[1]){
            renderCaratCursor(indexes);
          } else {
            renderCaratSelection(indexes);
          }
          lastIndexes = indexes;
        }
      };

      $hiddenInput.keyup(function(e){
        if(selectedObj){
          selectedObj.set('text',$hiddenInput.val());
          handleCarat();
          that.fabricCanvas.renderAll();
           
        }
      });

      this.fabricCanvas.on('object:dblselected', function(event){
        selectedObj = activeTextObject(event.target);
        if(selectedObj){
        	
        	
          handleCarat();
          setupHiddenInput(selectedObj);
        
        }
      });

      this.fabricCanvas.on('selection:cleared', function(event){
        selectedObj = null;
        removeCarats();
      });

      var update = function(){
        if(selectedObj){ setupHiddenInput(selectedObj); handleCarat(); }
      };

      this.fabricCanvas.on('object:scaling',  update);
      this.fabricCanvas.on('object:rotating', update);
      this.fabricCanvas.on('object:moving',   update);

      this.fabricCanvas.on('mouse:down', function(event){
        if(isText()){
  		  
		  var pointer = that.fabricCanvas.getPointer(event.e);
	      origX = Math.abs(pointer.x);
	      origY = Math.abs(pointer.y);
		  
		  /*
          var obj = new fabric.Text('',{
            left:        origX,
            top:         origY,
            originY:     'top',
            originX:     'left',
            fontFamily:  that.properties.fontFamily(),
            fontSize:    that.properties.fontSize(),
            fontStyle:   that.properties.fontStyle(),
            lineHeight:  that.properties.lineHeight(),
            // TODO: Makes more sense to map to fill to stroke
            // Need to think of higher level mechanism to represent this
           // stroke:      that.properties.fill(),
            strokeWidth: that.properties.strokeWidth(),
            active:      true,
            dblselected: true
          });
          */
          /////////////////////// TEXT AREA //////////////////////////////////
          
            var SINGLE_LINE = false;
			
			// custom input area
			if (SINGLE_LINE) {
			    var $itext = $('<input/>').attr('type', 'text').addClass('itext');
			}
			else {
			    var $itext = $('<textarea/>').attr('wrap', 'off').addClass('itext');

			}
			
		
	
			
			text = '주석을 입력하세요';
			var itext = new fabric.IText(text, {
			    left:        origX,
	            top:         origY,
	            originY:     'top',
	            originX:     'left',
	            fontFamily:  that.properties.fontFamily(),
	            fontSize:    that.properties.fontSize(),
	            fontStyle:   that.properties.fontStyle(),
	            lineHeight:  that.properties.lineHeight(),
	            // TODO: Makes more sense to map to fill to stroke
	            // Need to think of higher level mechanism to represent this
	           // stroke:      that.properties.fill(),
	            strokeWidth: that.properties.strokeWidth(),
	            active:      true,
	            dblselected: true
	           
			}).on('editing:entered', function(e) {
			    var obj = this;
			   	//alert(this);
			    if (SINGLE_LINE) {
			        var keyDownCode = 0;
			    }
			      	
          		
			    that.fabricCanvas.remove(obj);
			    console.log('obj.fontsize : '+obj.fontSize);
			    console.log('obj.text.length : '+obj.text.length);
			    
			    var reWidth = obj.text.length*(obj.fontSize/1.5);
			    console.log('obj.text : '+obj.text);
			    console.log('obj.scale : '+obj.scaleX);
			    
			    if(reWidth < 100){
			    	reWidth = 200;
			    }
			    var coords = utils.mouseCoord(event);
			    // show input area
			    $itext.css({
			        left: obj.left,
			        top: obj.top,
			        //'width':reWidth*obj.scaleX,
			        //'height': (obj.fontSize*obj.scaleX)+50,
			        'width':(obj.width*obj.scaleX)+10,
			        'height': (obj.height*obj.scaleX)+10,
			        'line-height': obj.lineHeight,
			        'font-family': obj.fontFamily,
			        'font-size': Math.floor(obj.fontSize * Math.min(obj.scaleX, obj.scaleY)) + 'px',
			        'font-weight': obj.fontWeight,
			        'font-style': obj.fontStyle,
			        color: obj.fill
			    })
			    .val(obj.text)
			    .appendTo($(that.fabricCanvas.wrapperEl).closest($('#annoCanvas').parent(".canvas-container")));
			 
			 	$('.itext').on('keyup',function() {
			 	
				  $(this).css('width','0px');
				  $(this).css('height','0px');
				  $(this).css('width',Math.max(50,this.scrollWidth)+'px');
				  $(this).css('height',Math.max(50,this.scrollHeight)+'px');
				});
	
			    // text submit event
			    if (SINGLE_LINE) {
			        // submit text by ENTER key
			        $itext.on('keydown', function(e) {
			            // save the key code of a pressed key while kanji conversion (it differs from the code for keyup)
			            keyDownCode = e.which;
			        })
			        .on('keyup', function(e) {
			            if (e.keyCode == 13 && e.which == keyDownCode) {
			                obj.exitEditing();
			                obj.set('text', $(this).val());
			                $(this).remove();
			                that.fabricCanvas.add(obj);
			                that.fabricCanvas.renderAll();
			                
			                
			            }
			        });
			    }
			    else {
			        // submit text by focusout
			        $itext.on('focusout', function(e) {
			        	
			            obj.exitEditing();
			            obj.set('text', $(this).val());
			            $(this).remove();
			            that.fabricCanvas.add(obj);
			            that.fabricCanvas.renderAll();
			            
			          
			            
			        });
			    }
			    
			    // focus on text
			    setTimeout(function() {
			        $itext.select();
			    }, 1);
			});
			
			console.log('$itext.width() : '+$itext.width());
			//itext.width = $itext.width();
			//itext.height = $itext.height();
			that.fabricCanvas.add(itext);
			that.fabricCanvas.setActiveObject(itext);

			itext.enterEditing();

			//that.fabricCanvas.fire('tool:change','cursor');
			

			that.tool('cursor');


          //that.fabricCanvas.add(obj);
          //that.fabricCanvas.setActiveObject(obj);

          // Disgusting hack that seems to make sure the textarea gets focused
          /*
          setTimeout(function(){
            that.fabricCanvas.fire('object:dblselected',{target:obj,e:event.e});
          },1);
          */
         
         
        // $(".canvas-container").append(btn_delete);
         
         //$(".canvas-container").addStickyNotes({colors: ['#FDFB8C'], top:origY , left:origX , width: '100', height: '100'});
			/* 어노테이션 텍스트 DIV로 추가
			var content = $("<div xmlns='http://www.w3.org/1999/xhtml' class='stickyNote'>"+
					        //"<div class='note'></div>"+
							"<div class='z_index'>1</div>"+
							"<div class='left'>"+origX+"</div>"+
							"<div class='top'>"+origY+"</div>"+
							"<div class='color'>#FDFB8C</div>"+
							"<div class='width'>100</div>"+
							"<div class='height'>100</div>"+
							"<div class='id'>6</div>"+
						    "</div>");
			
			$(".canvas-container").append(content);
			content.addStickyNotesInit();
			*/

        }
      });

    };

  };

}());




DrawingFabric.Functionality.canvasResizer = (function(){

  return function(container){

    this.initialize = function(){
      var that = this;
      var getDimensions = function(){
        return {width: container.width(), height: container.height()};
      };
      
      var isVisible = function(){
        return container.is(":visible");
      };
      
      var last;
      var correctSize = function(){
        if(isVisible()){
          var dimensions = getDimensions();
          if(last != dimensions){
            that.fabricCanvas.setDimensions(dimensions);
            last = dimensions;
          }
        } else {
          queueCheck();
        }
      };

      var timer = null;
      var queueCheck = function(){
        clearTimeout(timer);
        timer = setTimeout(correctSize, 1000);
      };

      var validContainer = function(){
        return container &&
               typeof container.width == 'function' &&
               typeof container.height == 'function';
      };

      if(validContainer()){
        $(window).resize(correctSize);
        correctSize();
      }
    };

  };

}());




DrawingFabric.Functionality.drawArcWithMouse = (function(){

  var utils = DrawingFabric.utils;

  return function(){

    this.initialize = function(){
      var that = this;
      var stage, coordinates, shape, guide;

      var isArc = function(){
        return that.tool() == 'arc';
      };

      var center = function(event){
        coordinates.center = utils.mouseCoord(event);

        stage = 'firstPoint';
      };

      var radius = function(){
        return utils.magnitudeBetweenPoints(
          coordinates.center.x,     coordinates.center.y,
          coordinates.firstPoint.x, coordinates.firstPoint.y
        );
      };

      var endOfArc = function(angle){
        var r = radius();

        var coords = {};
        coords.x = (Math.cos(angle) * r + coordinates.center.x);
        coords.y = (Math.sin(angle) * r + coordinates.center.y);

        return coords;
      };

      var guideCircle = function(){
        if(guide){ that.fabricCanvas.remove(guide); }

        guide = new fabric.Circle({
          left:            coordinates.center.x,
          top:             coordinates.center.y,
          fill:            'none',
          stroke:          that.properties.stroke(),
          strokeWidth:     that.properties.strokeWidth(),
          selectable:      false
        });
        guide.set('opacity',0.1);
        guide.setRadius(radius());

        that.fabricCanvas.add(guide);
      };

      var arcCommand = function(){
        var r = radius();

        var x1 = coordinates.firstPoint.x - coordinates.center.x;
        var y1 = coordinates.firstPoint.y - coordinates.center.y;
        var a1 = utils.angleFromHorizontal(x1,y1);

        var x2 = coordinates.secondPoint.x - coordinates.center.x;
        var y2 = coordinates.secondPoint.y - coordinates.center.y;
        var a2 = utils.angleFromHorizontal(x2,y2);

        var sweepAngle = a2 > a1 ? a2 - a1 : 2 * Math.PI + a2 - a1;
        var sweep = sweepAngle > Math.PI ? '1,1' : '0,1';

        var deg = function(rad){ return 180 * rad / Math.PI; };

        var endCoords = endOfArc(a2);

        return 'M'+coordinates.firstPoint.x+','+coordinates.firstPoint.y+' A'+r+','+r+' 0 '+sweep+' '+endCoords.x+','+endCoords.y;
      };

      var arc = function(){
        shape = new fabric.Path(arcCommand());
        shape.set('fill','none');
        shape.set('stroke',that.properties.stroke());
        shape.set('strokeWidth',that.properties.strokeWidth());
        return shape;
      };

      var firstPoint = function(event){
        coordinates.firstPoint = utils.mouseCoord(event);

        stage = 'secondPoint';
      };

      var firstPointGuide = function(event){
        coordinates.firstPoint = utils.mouseCoord(event);

        guideCircle();
      };

      var secondPoint = function(event){
        if(shape){ that.fabricCanvas.remove(shape); }

        shape = arc();

        that.fabricCanvas.add(shape);
        that.fabricCanvas.remove(guide);

        reset();
      };

      var secondPointGuide = function(event){
        coordinates.secondPoint = utils.mouseCoord(event);

        if(shape){ that.fabricCanvas.remove(shape); }

        shape = shape = arc();

        that.fabricCanvas.add(shape);
      };

      var reset = function(){
        stage = 'center';
        coordinates = {};
        shape = null;
        guide = null;
      };
      reset();

      this.fabricCanvas.on('mouse:move',function(event){
        if(isArc()){
          switch(stage){
          case 'firstPoint':
            firstPointGuide(event);
            break;
          case 'secondPoint':
            secondPointGuide(event);
            break;
          }
        }
      });

      this.fabricCanvas.on('mouse:down',function(event){
      	
        if(isArc()){
          switch(stage){
          case 'center':
            center(event);
            break;
          case 'firstPoint':
            firstPoint(event);
            break;
          case 'secondPoint':
            secondPoint(event);
            break;
          }
        }
      });

    };

  };

}());




DrawingFabric.Functionality.drawLineWithMouse = (function(){

  var utils = DrawingFabric.utils;

  return function(){

    this.initialize = function(){
      var that = this;

      var drawing = false;
      var startCoords, path;

      var isPath = function(){
        return 'line' == that.tool();
      };

      this.fabricCanvas.on('mouse:move', function(event){
        if(drawing){
          if(path){ that.fabricCanvas.remove(path); }
          
        
            var pointer = that.fabricCanvas.getPointer(event.e);
    		var coords = utils.mouseCoord(event);
    		
    		/*
    		console.log("시작x : "+startCoords.x);
    		console.log("시작y : "+startCoords.y);
    		console.log("coords.x : "+coords.x);
    		console.log("coords.y : "+coords.y);
    		console.log("포인터.x : "+pointer.x);
    		console.log("포인터.y : "+pointer.y);
		    */
		   
          path = new fabric.Path('M' + (startCoords.x) + ',' + (startCoords.y)+'L'+Math.abs(pointer.x)+','+Math.abs(pointer.y));
          path.set({
            stroke:      that.properties.stroke(),
            strokeWidth: that.properties.strokeWidth(),
            fill:        'none'
          });

          that.fabricCanvas.add(path);
          that.fabricCanvas.renderAll();
        }
      });

      this.fabricCanvas.on('mouse:down', function(event){
        if(drawing){
          drawing = false;
          path    = null;
        } else if (isPath()) {
          drawing = true;
          var orign =  that.fabricCanvas.getPointer(event.e);
          //var coords = utils.mouseCoord(event);
          startCoords = orign;
          
        }
      });


    };

  };

}());




DrawingFabric.Functionality.drawShapeWithMouse = (function(){

  return function(){

    var mouseState, mouseObject, mouseStartCoord;
    var utils = DrawingFabric.utils;

    this.initialize = function(){
      var that = this;

      var newObject = function(args){
        switch(that.tool()){
        case 'ellipse':
          return new fabric.Ellipse(args);
        case 'rectangle':
          return new fabric.Rect(args);
        case 'triangle':
          return new fabric.Triangle(args);
        }
      };

      var setDimensions = function(object,width,height){
        switch(that.tool()){
        case 'ellipse':
          object.set('rx',width * 0.5).
                 set('ry',height * 0.5).
                 set('width',width).
                 set('height',height);
          break;
        case 'triangle':
        case 'rectangle':
          object.set('width',width).
                 set('height',height);
          break;
        }
        
      };

      var isObject = function(){
        return ['ellipse','rectangle','triangle'].indexOf(that.tool()) >= 0;
      };
		var origX,origY,objectRect;
      this.fabricCanvas.on('mouse:down', function(event){
        if(isObject()){

          mouseStartCoord = utils.mouseCoord(event);
          mouseState      = 'down';

		  var pointer = that.fabricCanvas.getPointer(event.e);
		  origX = pointer.x;
		  origY = pointer.y;
		  //var pointer = that.fabricCanvas.getPointer(event.e);

          objectRect = newObject({
            left:        origX,
            top:         origY,
            originX: 'left',
        	originY: 'top',
        	width: 1,
       		height:1,
            fill:        that.properties.fill(),
            stroke:      that.properties.stroke(),
            strokeWidth: that.properties.strokeWidth(),
            active:      true
          });
          that.fabricCanvas.add(objectRect);
          that.fabricCanvas.setActiveObject(objectRect);
          mouseObject = objectRect;
          
          //console.log("width"+pointer.x-origX);
		  //console.log("height"+pointer.y-origY);
        }
      });

      this.fabricCanvas.on('mouse:up', function(event){
        mouseState  = 'up';
        if(mouseObject){
          // Remove object if mouse didn't move anywhere
          var coords = utils.mouseCoord(event);
          if(coords.x == mouseStartCoord.x && coords.y == mouseStartCoord.y){
            that.fabricCanvas.remove(mouseObject);
          }
          mouseObject.setCoords();
          mouseObject = null;
          that.tool('cursor');
        }
      });

      this.fabricCanvas.on('mouse:move', function(event){

        if(isObject() && mouseState == 'down'){
          // Resize object as mouse moves
          var coords = utils.mouseCoord(event);
          

/*
          var centerX, centerY;
          if(event.e.altKey){
            centerX = mouseStartCoord.x;
            centerY = mouseStartCoord.y;
            width  *= 2;
            height *= 2;
          } else {
            centerX = mouseStartCoord.x + 0.5 * width;
            centerY = mouseStartCoord.y + 0.5 * height;
          }
*/

		  var pointer = that.fabricCanvas.getPointer(event.e);

		   if(origX>pointer.x){
		        mouseObject.set({ left: Math.abs(pointer.x) });
		    }
		    if(origY>pointer.y){
		        mouseObject.set({ top: Math.abs(pointer.y) });
		    }
		    
          setDimensions(mouseObject,Math.abs(origX - pointer.x),Math.abs(origY - pointer.y));


          that.fabricCanvas.renderAll();
        }
      });
    };

  };

}());




DrawingFabric.Functionality.drawWithMouse = (function(){

  var utils = DrawingFabric.utils;

  return function(){

    this.initialize = function(){
      var that = this;

      var drawing = false;

      var setProperties = function(){
        that.fabricCanvas.freeDrawingBrush.color = that.properties.stroke();
        that.fabricCanvas.freeDrawingBrush.width = that.properties.strokeWidth();
      };

      this.fabricCanvas.on('tool:change',function(t){
        if(t == 'draw'){
        	
          drawing = true;
          that.fabricCanvas.isDrawingMode = true;
          setProperties();
        } else if (drawing){
          drawing = false;
          that.fabricCanvas.isDrawingMode = false;
        }
      });

      this.fabricCanvas.on('property:change', function(name){
        if(drawing && (name == 'stroke' || name == 'strokeWidth')){
          setProperties();
        }
      });

    };

  };

}());



DrawingFabric.Functionality.keyboardCommands = (function(){

  return function(config){

    this.initialize = function(){

      var that = this;

      var activeObject = function(){
        var obj = that.fabricCanvas.getActiveGroup() || that.fabricCanvas.getActiveObject();
        if(obj && !obj.get('dblselected')){ return obj; }
      };

      var move = function(x,y){
        var obj = activeObject();
        if(obj){
          obj.set('left',obj.left + x);
          obj.set('top',obj.top + y);
          obj.setCoords();
          that.fabricCanvas.renderAll();
        }
      };

      var destroy = function(){
        var obj = activeObject();
        if(obj){
        	if(obj.hasOwnProperty('_objects')){
        		
	        	obj.forEachObject(function(a) {
	          		that.fabricCanvas.remove(a);
	  			});
	  			
	            that.fabricCanvas.discardActiveGroup();
	            that.fabricCanvas.renderAll();
	          } else {
	            destroyObject(obj);
	          }
        }
      };

      var destroyObject = function(obj){
        that.fabricCanvas.remove(obj);
      };

      this.fabricCanvas.on('key:down',function(e){
        var scale = (e.shiftKey && 10) || 1;

        switch(e.which){
        case 76: // l
        case 37: // left
          move(-1 * scale,0);
          break;
        case 72: // h
        case 39: // right
          move(1 * scale,0);
          break;
        case 75: // k
        case 38: // up
          move(0,-1 * scale);
          break;
        case 74: // j
        case 40: // down
          move(0,1 * scale);
          break;

        case 8:  // backspace
        case 46: // delete
          destroy();
        }
      });

    };

  };

}());




DrawingFabric.Functionality.keyboardEvents = (function(){

  return function(config){

    this.initialize = function(){

      var lastDownTarget;
      var that = this;
      var element = this.fabricCanvas.upperCanvasEl;

      $(document).mousedown(function(e){
        lastDownTarget = e.target;
      });

      $(document).keydown(function(e){
        if(lastDownTarget == element && $(':focus').length === 0){
          that.fabricCanvas.fire('key:down',e);
          // Prevent bubbling
          // Keyboard events should use our key:down method
          // Helps stop page scrolling when using cursor keys
          return false;
        }
      });

    };
  };

}());


DrawingFabric.Functionality.scale = (function(){

	return function(config){
		
		
		transformCoordinate(config.width,config.height,config.rotate);

    	this.initialize = function(){
    	  var that = this;
	      that.fabricCanvas.setDimensions({
	        width: config.width,
	        height: config.height
	      });
	      that.fabricCanvas.setZoom(config.scale); 
	    };
	  
	};
}());


var reCanvasWidth, reCanvasHeight, reCanvasRotate;
function transformCoordinate(width, height, rotate) {
    console.log('rotate: '+rotate);
    switch (rotate) {
      case 2:
        // horizontal flip

        break;
      case 3:
        // 180 rotate left
        $('#annoCanvas').parent(".canvas-container").css('transform','translate(-50%, -50%) rotate(180deg)');
        break;
      case 4:
        // vertical flip
        break;
      case 5:
        // vertical flip + 90 rotate right
        break;
      case 6:
        // 90 rotate right
        $('#annoCanvas').parent(".canvas-container").css('transform','translate(-50%, -50%) rotate(90deg)');
        break;
      case 7:
        // horizontal flip + 90 rotate right
        break;
      case 8:
        // 90 rotate left
        $('#annoCanvas').parent(".canvas-container").css('transform','translate(-50%, -50%) rotate(-90deg)');
        break;
      default:
      	
		var scrollbarheight = document.getElementById('mainContainer').offsetHeight - document.getElementById('mainContainer').clientHeight;
		_stageHeight = $('#mainContainer').innerHeight() - scrollbarheight;
		_stageWidth = $('#mainContainer').innerWidth() - scrollbarheight;
		
		if(_stageHeight <= $('#MainImageCanvas').height()){
			$('#MainImageCanvas').removeClass( 'canvasCloseDown' );
			$('#MainImageCanvas').addClass( 'canvasCloseUp' );
			$('#mainContainer > .canvas-container').removeClass('canvasCloseDown');
		    $('#mainContainer > .canvas-container').addClass('canvasCloseUp');
		    $('#annoCanvas').parent(".canvas-container").css('transform','translate(-50%, 0)');
		    //$('#mainContainer').addClass('mainCanvasDown');
		}else{
			$('#MainImageCanvas').removeClass( 'canvasCloseUp' );
			$('#MainImageCanvas').addClass( 'canvasCloseDown' );
		    $('#mainContainer > .canvas-container').removeClass('canvasCloseUp');
			$('#mainContainer > .canvas-container').addClass('canvasCloseDown');
			$('#annoCanvas').parent(".canvas-container").css('transform','translate(-50%, -50%)');
			//$('#mainContainer').addClass('mainCanvasDown');
		}
        break;
    }
  }


DrawingFabric.Functionality.mouseInfo = (function(){

  return function(config){

    this.initialize = function(){

      this.fabricCanvas.on("mouse:move",function(event){
        config.x.html(event.e.layerX);
        config.y.html(event.e.layerY);
      });

    };

  };

}());



DrawingFabric.Functionality.selectWithCursor = (function(){

  var utils = DrawingFabric.utils;

  return function(){

    this.initialize = function(){

      var that = this;

      var findTargetOrig = this.fabricCanvas.findTarget;

      this.fabricCanvas.on('tool:change',function(t){
      	
        if(t == 'cursor'){
        	
          that.fabricCanvas.selection = true;
          that.fabricCanvas.findTarget = findTargetOrig;
        } else {
        	
          that.fabricCanvas.selection = false;
          that.fabricCanvas.findTarget = function(){};
        }
      });

    };

  };

}());

DrawingFabric.Functionality.selectedProperties = (function(){

  return function(config){

    this.initialize = function(){

      var eachConfig = function(fun){
        for(var n in config){
          if(config.hasOwnProperty(n) && that.properties.hasOwnProperty(n)){
            fun(n,config[n]);
          }
        }
      };

      var showDomElement = function($element){
        if($element){ $element.show(); }
      };

      var hideDomElement = function($element){
        if($element){ $element.hide(); }
      };

      var setDomElementValue = function($element,value){
        if(value === null || value == "none"){ return; }
        if($element.is('[type="checkbox"]')){
          $element.prop("checked",value == $element.val());
        } else {
          $element.val((value||'').toString());
        }
        $element.trigger('change');
      };

      var getDomElementValue = function($element){
        if($element.is('[type="checkbox"]')){
          if($element.prop("checked")){
            return $element.val();
          } else {
            return 'normal';
          }
        } else {
          return $element.val();
        }
      };

      var domInputChangeFactory = function(property){
        return function(event){
          var value = getDomElementValue($(event.target));
          var parsedValue = that.properties[property](value);
          if(currentShape && supported && supported.indexOf(property) >= 0){
            currentShape.set(propertyName(property),parsedValue);
            that.fabricCanvas.renderAll();
          }
        };
      };

      var bindDomElements = function(){
        eachConfig(function(n,conf){
          var $e = conf.value;
          var defaultValue = that.properties[n]();
          $e.change(domInputChangeFactory(n));
          setDomElementValue( $e, defaultValue );
        });
      };

      var supportedProperties = function(shape){
        var properties          = that.properties;
        var shapeProperties     = shape.originalState;
        var supportedProperties = [];
        for(var p in properties){
          if(properties.hasOwnProperty(p) && shapeProperties.hasOwnProperty(p)){
            supportedProperties.push(p);
          }
        }
        return supportedProperties;
      };

      var that = this;

      bindDomElements();

      var currentShape;
      var supported;
      var updateDOM = function(event){
        var shape = event.target;
		
        if(currentShape != shape){ supported = supportedProperties(shape); }
        currentShape = shape;
		//console.log("오브젝트 선택");
		
		//console.log("propertyName(n): "+shape.get(n));
        //console.log("conf.value: "+conf.value);
		//console.log("DrawingFabric.item(0) : "+DrawingFabric.getObjects().indexOf(event.target));
		
        eachConfig(function(n,conf){
          if(supported.indexOf(n) >= 0){
          	
            showDomElement(conf.parent);
            setDomElementValue(conf.value,currentShape.get(propertyName(n)));
            
            
          } else {
            hideDomElement(conf.parent);
          }
        });
        
        
      };

      var updateDOMTool = function(event){
      	
      	
        var supportedToolProperties = that.toolProperties();

        eachConfig(function(n,conf){
          if(supportedToolProperties.indexOf(n) >= 0){
            showDomElement(conf.parent);
          } else {
            hideDomElement(conf.parent);
          }
        });
      };
      updateDOMTool();

      // It makes more sense in the UI
      // to have the fill setting map to stroke, and stroke to fill for text
      var propertyMappings = {
        text: {
          stroke: 'fill',
          fill:   'stroke'
        }
      };

      var propertyName = function(property){
        if( currentShape &&
            propertyMappings[currentShape.type] &&
            propertyMappings[currentShape.type][property] ){
          return propertyMappings[currentShape.type][property];
        } else {
          return property;
        }
      };

      var updateShape = function(property,value){
        if(currentShape){
          currentShape.set(propertyName(property),value);
          that.fabricCanvas.renderAll();
        }
      };

      this.fabricCanvas.on('object:selected', updateDOM);
      this.fabricCanvas.on('object:modified', updateDOM);
      this.fabricCanvas.on('object:scaling',  updateDOM);
      this.fabricCanvas.on('object:moving',   updateDOM);

      this.fabricCanvas.on('tool:change', updateDOMTool);

      this.fabricCanvas.on('selection:cleared', function(event){
        currentShape = null;
        supported    = null;
      });

    };

  };

}());




DrawingFabric.Functionality.tools = (function(){

  return function(config){

    var tool;

    this.initialize = function(){

      var that = this;

      var select = function(tool){
      	/*
      	// 툴 선택
      	if(tool == 'cursor' || tool == 'text'){
      		$('.properties').hide();
      	}else{
      		$('.properties').show();
      	}
      	*/
      	//alert('tool:'+tool);
        $tool_elements.removeClass('active');
        config[tool].addClass('active');
      };

      var $tool_elements = $();
      build_tool = function(tool,elements){
        $tool_elements = $tool_elements.add(elements);
        elements.click( function(){ that.tool(tool);});
      };

      build_tool('cursor',    config.cursor);
      build_tool('ellipse',   config.ellipse);
      build_tool('rectangle', config.rectangle);
      build_tool('triangle',  config.triangle);
      build_tool('line',      config.line);
      build_tool('draw',      config.draw);
      build_tool('arc',       config.arc);
      build_tool('text',      config.text);

      this.tool = function(t){
        if(t && t != tool){
          tool = t;
          select(tool);
          
          that.fabricCanvas.fire('tool:change',tool);
          return tool;
        } else {
          return tool;
        }
      };

      this.toolProperties = function(){
        switch(tool){
        case 'cursor':
        case 'triangle':
        case 'rectangle':
        case 'ellipse':
        	return ['fill', 'stroke', 'strokeWidth', 'strokeDashArray'];
        case 'line':
        case 'arc':
          return ['stroke', 'strokeWidth', 'strokeDashArray'];
        case 'draw':
          return ['stroke', 'strokeWidth', 'strokeDashArray'];
          
        case 'text':
        /*
        return ['stroke', 'strokeWidth', 'strokeDashArray',
                'fontFamily', 'fontStyle', 'fontSize', 'fontWeight', 'lineHeight',
                'textBackgroundColor', 'textDecoration', 'textShadow'];
        */
        default:
          return [];
        }
      };
      drawingThis = this;
      this.tool('cursor');
    };

  };

}());




