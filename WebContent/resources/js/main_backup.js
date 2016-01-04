
var contentType,mpImg, canvas, IMAGE_WIDTH, IMAGE_HEIGHT, annoCanvas,
    _reImageHeight, _reImageWidth, _stageHeight, _stageWidth, rotate;

var scrollbarheight = document.getElementById('mainContainer').offsetHeight - document.getElementById('mainContainer').clientHeight;
_stageHeight = $('#mainContainer').innerHeight() - scrollbarheight;
_stageWidth = $('#mainContainer').innerWidth() - scrollbarheight;

//console.log('_stageHeight',_stageHeight);
//console.log('_stageWidth',_stageWidth);

var _scale=1;
var nowRotate=0;

$('#loadImage').click(function(e){
	e.preventDefault();
    $('#file').click();
});



// 프린트 
$('#print').click(function(e){
	e.preventDefault();
    //window.print();
    /*
    var win=window.open();
    win.document.write("<br><img src='"+canvas.toDataURL()+"'/>");
    win.print();
    win.location.reload();
    */
   /*
    $('#MainImageCanvas').printThis({
    	importCSS:true
    	
    });
*/
//var note =  $('.stickyNote')[0].outerHTML;

//var note = $(".stickyNote").clone().wrapAll("<div/>").parent().html();

//alert("width:"+$(".stickyNote").width());
//alert("left:"+$(".stickyNote").position().left);

/* DIV를 SVG로 변환하여 캔버스 병합 후 프린트(어노테이션 DIV 텍스트 출력 방법)

var nWidth = $(".stickyNote").width(),
	nHeight = $(".stickyNote").height(),
	nleft = $(".stickyNote").position().left,
	ntop = $(".stickyNote").position().top;
console.log('nleft:'+nleft);
console.log('ntop:'+ntop);

var text = $('.note').val();
var notedata = '<svg xmlns="http://www.w3.org/2000/svg" width="'+canvas.width+'" height="'+canvas.height+'">' +
	           '<foreignObject width="100%" height="100%">' +
	            '<div xmlns="http://www.w3.org/1999/xhtml" style="width:'+nWidth+'px; height:'+nHeight+'px;left:'+nleft+'px;top:'+ntop+'px;padding:15px; position:absolute; background-color: rgb(253, 251, 140);box-shadow: 4px 4px 4px darkgray;  " >'+
	            text +
	            '</div>'+
				'</foreignObject>' +
	           '</svg>';
    
    var img = new Image();
	img.src = 'data:image/svg+xml;,'+notedata;
	console.log(notedata);
    var can3 = document.createElement("canvas");
    var ctx3 = can3.getContext('2d');
    can3.width = canvas.width;
    can3.height = canvas.height;
    
    ctx3.drawImage(canvas, 0, 0);
    ctx3.drawImage(annoCanvas, 0, 0);
	ctx3.drawImage(img, 0, 0);
	
	var win=window.open();
    win.document.write("<br><img src='"+can3.toDataURL()+"'/>");
    win.print();
    win.location.reload();
    */
   
    var can3 = document.createElement("canvas");
    var ctx3 = can3.getContext('2d');

    can3.width = canvas.width;
    can3.height = canvas.height;
    ctx3.drawImage(canvas, 0, 0);
    ctx3.drawImage(annoCanvas, 0, 0);
	
	var win=window.open();
    win.document.write("<br><img src='"+can3.toDataURL()+"'/>");

	// win.location.reload();
 	//win.print();
	setTimeout(function(){win.print(); }, 1);
    
});


$('#CloseUp').click(function(e){
	_scale += 0.2;
	img_draw();
});

$('#CloseDown').click(function(e){
	if(_scale >= 0.3){
		_scale -= 0.2;
	}
	img_draw();

});

$('#btn_hilite_add').click(function(e){
	$('#modal_input').modal('show');
	
	canvas.disableInput = function() {
	  removeListener(_this.upperCanvasEl, 'mousemove', _this._onMouseMove);
	  removeListener( fabric.document, 'mousemove', _this._onMouseMove);
	  removeListener( fabric.document, 'mousedown', _this._onMouseDown);
	};
	
});

$('#btn_dialog_submit').click(function(e){
	var width = parseInt($('#input_hilite_width').val()), 
	height = parseInt($('#input_hilite_height').val()),
	color = $('.selectpicker').val();
	hilite_add(width,height,color);
	$('#modal_input').modal('hide');
});

var switch_image_drag = 0;
$('#btn_image_drag').click(function(e){

if(switch_image_drag == 0){
	$('#mainContainer').dragOn({cursor:'pointer',easing:true});
	$('#annoCanvas').css('cursor','pointer');
	var annoc = getAnnoCanvas();
	annoc.fabricCanvas.selection = false;
	annoc.fabricCanvas.defaultCursor = 'pointer';
	switch_image_drag =1;
}else{
	$('#mainContainer').dragOn({cursor:'default',easing:false});
	var annoc = getAnnoCanvas();
	annoc.fabricCanvas.selection = true;
	annoc.fabricCanvas.defaultCursor = 'default';
	switch_image_drag = 0;
}


});



$('#btn_hilite_remove').click(function(e){
hilite_remove();
	
});

$('#orgSize').click(function(e){
	_reImageWidth = IMAGE_WIDTH;
	_reImageHeight = IMAGE_HEIGHT;
	_scale = 1;
	img_draw();
});


$('#Rotate90L').click(function(e){
	switch (nowRotate) {
	  case 0:
	  	  nowRotate = 6;
	      break;
	  case 3:
	      nowRotate = 8;
	      break;
      case 6:
	      nowRotate = 3;
	      break;
      case 8:
		  nowRotate = 0;
	      break;
	 }
 	img_draw();
});

$('#Rotate90R').click(function(e){
	
	switch (nowRotate) {
	  case 0:
	  	  nowRotate = 8;
	      break;
	  case 8:
	      nowRotate = 3;
	      break;
      case 3:
	      nowRotate = 6;
	      break;
      case 6:
		  nowRotate = 0;
	      break;
	 }
	
 	img_draw();
});

$('#Rotate180').click(function(e){
 	switch (nowRotate) {
	  case 0:
	  	  nowRotate = 3;
	      break;
	  case 8:
	      nowRotate = 6;
	      break;
      case 3:
	      nowRotate = 0;
	      break;
      case 6:
		  nowRotate = 8;
	      break;
	 }
	
 	img_draw();
});


$('#fitScreen').click(function(e){
	_scale = 1;
	_reImageWidth = _stageWidth; 
	_reImageHeight = _stageHeight; 
	img_draw();
	
});


$('#fitHeight').click(function(e){
	_scale = 1;
	_reImageHeight = _stageHeight; //이미지의 세로를 플랫폼으로 맞추고
	_reImageWidth = _stageHeight * IMAGE_WIDTH/IMAGE_HEIGHT; //세로에따른 비율계산
	img_draw();
});
$('#fitWidth').click(function(e){
	_scale = 1;
	_reImageWidth = _stageWidth; //이미지의 가로를 플랫폼으로 맞추고
	_reImageHeight = _stageWidth * IMAGE_HEIGHT/IMAGE_WIDTH; //가로에따른 비율계산
	img_draw();
});


function img_draw(){
	console.log("scale",_scale);
	
	//visutil ver
	//mpImg.render({reWidth:_reImageWidth, reHeight:_reImageHeight, rotate:nowRotate, scale:_scale});
	
	//org ver
	mpImg.render(canvas,{width:_reImageWidth, height: _reImageHeight, rotate:nowRotate, scale:_scale});		
	DrawAnnoCanvas({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
}

function edit_img(cfg) {
	sel_file = cfg.file;
	$("#btn_add").hide();
	$("#c1").editImg(cfg);
}

$('#file').change(function() {
    var file = document.getElementById("file").files[0];
	var reader = new FileReader();
	
	reader.onload = function(event) {
		
		
		
		
		
		
		/* visutil ver 이미지 로드방식
		var t1 = new Date().getTime(); //loadImage total time
	  	var data = event.target.result;
		contentType = data.split(",")[0].split(":")[1].split(";")[0];
	    var Base64ImageData = data.split(",")[1];
	    var dll = new DLL.CImageUtilHtml5();
		var t0 = new Date().getTime(); //loadImageBuffer() total time
		var resultBase64 = dll.LoadImageBuffer(Base64ImageData,1);
		console.log('---> LoadImageBuffer() total time: ', ((new Date().getTime()) - t0) + 'ms');
		
		IMAGE_WIDTH = 1653;
		IMAGE_HEIGHT = 2338;
		_reImageHeight = IMAGE_HEIGHT;
		_reImageWidth = IMAGE_WIDTH;
			
		//높이제어(세로기준으로 가로를 맞춤)
		if(_stageHeight < _reImageHeight || _stageHeight > _reImageHeight){ //플랫폼이 이미지의세로보다 작거나 크면
		 _reImageHeight = _stageHeight; //이미지의 세로를 플랫폼으로 맞추고
		 _reImageWidth = _stageHeight * IMAGE_WIDTH/IMAGE_HEIGHT; //세로에따른 비율계산
		 //가로제어(가로기준으로 세로를 맞춤)
		}else if(_stageWidth > _reImageWidth){ //플랫폼이 이미지의가로보다 크면
		 _reImageWidth = _stageWidth; //이미지의 가로를 플랫폼으로 맞추고
		 _reImageHeight = _stageWidth * IMAGE_HEIGHT/IMAGE_WIDTH; //가로에따른 비율계산
		}
		
		console.log('_stageHeight',_stageHeight);
		console.log('_stageWidth',_stageWidth);
		console.log('_imageWidth',_reImageWidth);
		console.log('_imageHeight',_reImageHeight);
	
		canvas = document.getElementById('MainImageCanvas');
		annoCanvas = document.getElementById('annoCanvas');
		var pixels = convertDataURIToBinary(resultBase64);
		//createCanvasFromRGBA(pixels,canvas,[IMAGE_WIDTH,IMAGE_HEIGHT,_reImageWidth,_reImageHeight]);
		*/
		
		//////////////////////////////////////////////visutil ver 이미지/////////////////////////////////////////////
		/*
		mpImg = new MegaPixImage({pixels:pixels,canvas: canvas, orgWidth: IMAGE_WIDTH, orgHeight: IMAGE_HEIGHT});
		
		if(mpImg !== undefined){
			mpImg.render({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:0, scale:1});
			DrawAnnoCanvas({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
		}
		*/
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		
		canvas = document.getElementById('MainImageCanvas');
		annoCanvas = document.getElementById('annoCanvas');
		var img =  new Image();
		img.src = reader.result;
		
		mpImg = new MegaPixImage(img);
		IMAGE_WIDTH = img.width;
		IMAGE_HEIGHT = img.height;
		_reImageHeight = IMAGE_HEIGHT;
		_reImageWidth = IMAGE_WIDTH;
			
		//높이제어(세로기준으로 가로를 맞춤)
		if(_stageHeight < _reImageHeight || _stageHeight > _reImageHeight){ //플랫폼이 이미지의세로보다 작거나 크면
		 _reImageHeight = _stageHeight; //이미지의 세로를 플랫폼으로 맞추고
		 _reImageWidth = _stageHeight * IMAGE_WIDTH/IMAGE_HEIGHT; //세로에따른 비율계산
		 //가로제어(가로기준으로 세로를 맞춤)
		}else if(_stageWidth > _reImageWidth){ //플랫폼이 이미지의가로보다 크면
		 _reImageWidth = _stageWidth; //이미지의 가로를 플랫폼으로 맞추고
		 _reImageHeight = _stageWidth * IMAGE_HEIGHT/IMAGE_WIDTH; //가로에따른 비율계산
		}
		
		if(mpImg !== undefined){
			mpImg.render(canvas,{width: _reImageWidth, height: _reImageHeight });
			DrawAnnoCanvas({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
		}

		/*
		var imgOrgCanvas = createImgFromRGBA(pixels,[IMAGE_WIDTH,IMAGE_HEIGHT]);
		imgController = new ImgController(imgOrgCanvas);
		console.log('canvas : ',imgController);
		imgController.render({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:0});
		*/
		//console.log('---> LoadImage total time: ', ((new Date().getTime()) - t1) + 'ms');

	};
	reader.readAsDataURL(file);
});

$( document ).ready(function() {
	var thumbgWidth= Number($(".thumbnail_bg").width())-20;
	//var thumbgHeight= Number($(".thumbnail_bg").height());
	//console.log(thumbgWidth);
	//섬네일 캔버스 높이 계산
	//var thumbgHeight = 130*thumbnail.length;
	var thumbgHeight = 150*3;
	
	var thumCanvas =document.getElementById('thumbnailCanvas');
	thumCanvas.width=thumbgWidth;
	thumCanvas.height=thumbgHeight;
	
	var thumCan = new fabric.Canvas('thumbnailCanvas');
	//thumCan.renderAll();
	
	//섬네일 캔버스 그룹선택 방지
	thumCan.selection=false;
	
	var object = thumCan._objects;
	
	var topsize = 0;
	//Create Custom Image Object on Canvas
	var imgArry = new Array("images/0001.jpg","images/0002.jpg","images/0003.jpg");
	console.log('imgArry.length: '+imgArry.length);
	var topsize = 0;
	var cnt = 0;
	for(var i=0; i < imgArry.length; i++){
		 
		 
		 var image = imgArry[i];
		 
		 fabric.Image.fromURL(image, function (img) {
			  thumCan.add(img).renderAll();  
		 },{	
		 id:i,
		 left: (thumbgWidth/4)-8,
		 top: topsize,
		 width:100,
		 height:130,
		 hasControls : false,
		 lockMovementY: true,
		 lockMovementX: true
		 });	
		 topsize+=150;
	}
	

		//console("thumCan lengh :"+thumCan.item.length());
		// thumCan.item(1).lockMovementX = true;
		//thumCan.item(1).lockMovementY = true;	

		/*
		//Call the Object by ID
		var objArray = thumCan.getObjects();
		var tmpObject;
		for (var j = 0; j < objArray.length; j++) {
			
			console.log("objArray : "+objArray[j].id);
		        if(objArray[j].id == "01"){
		        	
		        	console.log("objArray : "+objArray[j]);
		        	console.log("id : "+objArray[j].id);
		            tmpObject = objArray[j];
		            break;
		        }
		} */

		var annoArry = ['','',''];
		var preAnnoJsonDataIndex=0;
		var updateDOM = function(event){
        var shape = event.target;
		//console.log("오브젝트 선택");
		//console.log("shape:"+shape);
		//console.log("shape id:"+shape.id);
		
		canvas = document.getElementById('MainImageCanvas');
		annoCanvas = document.getElementById('annoCanvas');

		var annoC = getAnnoCanvas();
		annoArry[preAnnoJsonDataIndex] = JSON.stringify(annoC.fabricCanvas.toDatalessJSON());

		console.log("annoArry[preAnnoJsonDataIndex] : " +  annoArry[preAnnoJsonDataIndex]);

		annoC.fabricCanvas.clear();
	    annoC.fabricCanvas.loadFromDatalessJSON(annoArry[shape.id]);
	    annoC.fabricCanvas.renderAll();
		
		var img = new Image();
		img.src = imgArry[shape.id];
		

		imgscreenfit(img);	
		preAnnoJsonDataIndex = shape.id;
		

		//alert(shape.id + '번 이미지 선택');
		//console.log("propertyName(n): "+shape.get(n));
        //console.log("conf.value: "+conf.value);
		//console.log("DrawingFabric.item(0) : "+DrawingFabric.getObjects().indexOf(event.target));

     };
	thumCan.on('object:selected', updateDOM);


});


function imgscreenfit(img){
	mpImg = new MegaPixImage(img);
	
	IMAGE_WIDTH = img.width;
	IMAGE_HEIGHT = img.height;
	_reImageHeight = IMAGE_HEIGHT;
	_reImageWidth = IMAGE_WIDTH;

	//높이제어(세로기준으로 가로를 맞춤)
	if(_stageHeight < _reImageHeight || _stageHeight > _reImageHeight){ //플랫폼이 이미지의세로보다 작거나 크면
	 _reImageHeight = _stageHeight; //이미지의 세로를 플랫폼으로 맞추고
	 _reImageWidth = _stageHeight * IMAGE_WIDTH/IMAGE_HEIGHT; //세로에따른 비율계산
	 //가로제어(가로기준으로 세로를 맞춤)
	}else if(_stageWidth > _reImageWidth){ //플랫폼이 이미지의가로보다 크면
	 _reImageWidth = _stageWidth; //이미지의 가로를 플랫폼으로 맞추고
	 _reImageHeight = _stageWidth * IMAGE_HEIGHT/IMAGE_WIDTH; //가로에따른 비율계산
	}
	
	if(mpImg !== undefined){
		mpImg.render(canvas,{width:_reImageWidth, height:_reImageHeight, rotate:nowRotate, scale:_scale });
		DrawAnnoCanvas({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
	}
}



//가로고정, 세로고정시 화면 리사이즈 이벤트
window.addEventListener("load", function(){
    function draw()
    {
    	
    	if(mpImg !== undefined){
			//visutil ver
			//mpImg.render({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
			
			//org ver
			mpImg.render(canvas,{width:_reImageWidth, height: _reImageHeight, rotate:nowRotate, scale:_scale});
			DrawAnnoCanvas({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
		}
			
    }
    function resize()
    {
		//canvas = document.getElementById('MainImageCanvas');
		_stageHeight = $('#mainContainer').innerHeight() - scrollbarheight;
		_stageWidth = $('#mainContainer').innerWidth() - scrollbarheight;
	
		//높이제어(세로기준으로 가로를 맞춤)
		if(_stageHeight < _reImageHeight || _stageHeight > _reImageHeight){ //플랫폼이 이미지의세로보다 작거나 크면
		 _reImageHeight = _stageHeight; //이미지의 세로를 플랫폼으로 맞추고
		 _reImageWidth = _stageHeight * IMAGE_WIDTH/IMAGE_HEIGHT; //세로에따른 비율계산
		 //가로제어(가로기준으로 세로를 맞춤)
		}
	    draw();
    }
    
    window.addEventListener("resize", resize);
    resize();
    //$('.canvas-container').css('position','absolute');
    

    
    
});


/*
 *  하이라이트 기능
 */

function hilite_add(_width,_height,_color){
	
	var annoc = getAnnoCanvas();

	var rect = new fabric.Rect({
        left:        (_reImageWidth/2)-(_width/2),
        top:         (_reImageHeight/2)-(_height/2),
        originX:	'left',
    	originY:	'top',
    	width:		_width,
   		height:		_height,
        fill:		_color,
        opacity: 	.5,
        active:     true,
        hasRotatingPoint: false,
        id:'hilite'
    });
	annoc.fabricCanvas.add(rect);
	annoc.fabricCanvas.renderAll();
   
}
function hilite_remove(){
	
	var annoc = getAnnoCanvas();
	var hiliteObjects = annoc.fabricCanvas._objects;
	var len = hiliteObjects.length;
	
	// 오브젝트를 지우면 길이도 같이 줄어들기 때문에 발생하는 문제 해결을 위한 변수
	var ctr = 0;

    if(hiliteObjects.length !== 0){
    	for(var i = 0; i < len; i++){		
    		console.log('i :'+i);
    		
    		if(hiliteObjects[i-ctr].id =='hilite'){
    			
     			annoc.fabricCanvas.remove(hiliteObjects[i-ctr]);
     			ctr++;
     			
     		}
    	}
    	annoc.fabricCanvas.renderAll();
    }
}













