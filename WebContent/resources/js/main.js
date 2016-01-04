
var contentType,mpImg, canvas, IMAGE_WIDTH, IMAGE_HEIGHT, annoCanvas,
    _reImageHeight, _reImageWidth, _stageHeight, _stageWidth, rotate, nowFitScreen;
    
var switch_image_drag = 0;

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

/********************************
 *  이미지 확대 축소
 *****************************/

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

$('#orgSize').click(function(e){
	_reImageWidth = IMAGE_WIDTH;
	_reImageHeight = IMAGE_HEIGHT;
	_scale = 1;
	img_draw();
});


/********************************
 *  주석 기능
 *****************************/

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


$('#btn_hilite_remove').click(function(e){
hilite_remove();
	
});

/********************************
 *  이미지 회전
 *****************************/

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

/********************************
 *  화면맞춤
 *****************************/

$('#fitScreen').click(function(e){
	_scale = 1;
	_reImageWidth = _stageWidth; 
	_reImageHeight = _stageHeight; 
	nowFitScreen = 0; // 0:화면맞춤 ,  1: 세로맞춤,  2: 가로맞춤
	img_draw();
	
});

$('#fitHeight').click(function(e){
	_scale = 1;
	_reImageHeight = _stageHeight; //이미지의 세로를 플랫폼으로 맞추고
	_reImageWidth = _stageHeight * IMAGE_WIDTH/IMAGE_HEIGHT; //세로에따른 비율계산
	nowFitScreen = 1; // 0:화면맞춤 ,  1: 세로맞춤,  2: 가로맞춤
	img_draw();
});

$('#fitWidth').click(function(e){
	_scale = 1;
	_reImageWidth = _stageWidth; //이미지의 가로를 플랫폼으로 맞추고
	_reImageHeight = _stageWidth * IMAGE_HEIGHT/IMAGE_WIDTH; //가로에따른 비율계산
	nowFitScreen = 2; // 0:화면맞춤 ,  1: 세로맞춤,  2: 가로맞춤
	img_draw();
});


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






function img_draw(){
	console.log("scale",_scale);
	
	//visutil ver
	//mpImg.render({reWidth:_reImageWidth, reHeight:_reImageHeight, rotate:nowRotate, scale:_scale});
	
	//org ver
	console.log('### mpImg :',mpImg);
	mpImg.render({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});		
	DrawAnnoCanvas({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
}

function edit_img(cfg) {
	sel_file = cfg.file;
	$("#btn_add").hide();
	$("#c1").editImg(cfg);
}



$('#btn_url_LoadImage').click(function(e){

	$('#modal_url_LoadImage').modal('show');
});

$('#btn_submit_url_LoadImage').click(function(e){
	var url = $('#input_url_image').val();
	loadImage_url(url);
	$('#modal_url_LoadImage').modal('hide');
});



$('#btn_base64_LoadImage').click(function(e){
	$('#modal_base64_LoadImage').modal('show');
});

$('#btn_submit_base64_LoadImage').click(function(e){
	var b64img = $('#textarea_base64_image').val();
	LoadImageToCanvas(b64img);
	$('#modal_base64_LoadImage').modal('hide');
});





function loadImage_url(_url){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', _url,true);
    
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) {
	 	var arrayBuffer = xhr.response; // Note: not oReq.responseText
	    if (arrayBuffer) {
	        //var x = img.split('.');
	        //var ext = x[x.length - 1];
	        var b64img = _arrayBufferToBase64(arrayBuffer);
	        console.log(b64img);
	        LoadImageToCanvas(b64img);
	    }
    };
    xhr.send();  
}



function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}


$('#file').change(function() {
    var file = document.getElementById("file").files[0];
	var reader = new FileReader();
	
	reader.readAsDataURL(file);
	reader.onload = function(event) {
	  	var data = event.target.result;
		contentType = data.split(",")[0].split(":")[1].split(";")[0];
	    Base64ImageData = data.split(",")[1];
	    LoadImageToCanvas(Base64ImageData);
		
	};

	
	/***********************************************************************
	 *	섬네일 이미지 추가	
	 * *********************************************************************/
	
	//thumCan.on('object:selected', updateDOM);
	//$("#MainImageCanvas").resize({reWidth: _reImageWidth, reHeight:_reImageHeight });
});


/***********************************************************************
 *	이미지로드 기능
 * *********************************************************************/

function LoadImageToCanvas(Base64ImageData){
	
	var imgCount;
	var resultArray;
	var VIS_TIFF;
	var Base64ImageData;
	
	var t1 = new Date().getTime(); //loadImage total time
	var t0 = new Date().getTime(); //loadImageBuffer() total time
		//var resultBase64 = dll.LoadImageBuffer(Base64ImageData,1);

		VIS_TIFF = new INFOLIBTIFF.ImageLoaderHtml5();
		imgCount = VIS_TIFF.TIFFImagePageCount(Base64ImageData);
		resultArray = VIS_TIFF.LoadImageTIFF(Base64ImageData,1,0);

		console.log('---> LoadImageBuffer() total time: ', ((new Date().getTime()) - t0) + 'ms');

		var xsize = VIS_TIFF.hImageGetX(resultArray);
		var ysize = VIS_TIFF.hImageGetY(resultArray);
		var imgAddr = VIS_TIFF.hImageGetImageAddr(resultArray);
		
		var img = [];
		var size = (xsize*ysize)*4;
		
		// Copy data to Emscripten heap (directly accessed from Module.HEAPU8)
		//console.log('DLL.HEAPU8 : ',DLL.HEAPU8);
		var buf = INFOLIBTIFF.HEAPU8;
		var imgHeapdata = new Uint8Array(buf);
		var imgPtr = imgAddr.e;
		var imgPixels = imgHeapdata.subarray(imgPtr,imgPtr+size);
		//console.log('imgPtr : ',imgPtr);
		console.log('imgCount: ',imgCount);
		//console.log('imgAddr : ',imgAddr);
		//console.log('buf : ',buf);
			
		console.log('x : ',xsize);
		console.log('y : ',ysize);
		
		//console.log('imgPixels : ',imgPixels);
		
		//var resultBase64 = arrayBufferDataUri(resultArray1);
		//var resultBase64 = Base64.encode(resultArray);

		//console.log('resultBase64 : ',resultBase64);
		
		IMAGE_WIDTH = xsize;
		IMAGE_HEIGHT = ysize;
		_reImageHeight = IMAGE_HEIGHT;
		_reImageWidth = IMAGE_WIDTH;

		//console.log('_stageHeight',_stageHeight);
		//console.log('_stageWidth',_stageWidth);
		//console.log('_imageWidth',_reImageWidth);
		//console.log('_imageHeight',_reImageHeight);
  		canvas = document.getElementById('MainImageCanvas');
		annoCanvas = document.getElementById('annoCanvas');
		
		var _canvas = createCanvasFromRGBA(imgPixels,canvas,[IMAGE_WIDTH,IMAGE_HEIGHT]);
		 setTimeout(function() { 

	 		mpImg = new MegaPixImage({canvas:canvas, orgWidth: IMAGE_WIDTH, orgHeight: IMAGE_HEIGHT});
			//ControlImage();
				
		 },100);
		//mpImg = new MegaPixImage({canvas:canvas, orgWidth: IMAGE_WIDTH, orgHeight: IMAGE_HEIGHT});

		/***********************************************************************
		 *	이미지 편집기능 추가 부분 
		 *	이미지로드 속도 향상을 위해 이부분은 기능버튼누를시 동작되도록 해야함	
		 * *********************************************************************/	
		 /*
		mpImg = new MegaPixImage({canvas:_canvas, orgWidth: IMAGE_WIDTH, orgHeight: IMAGE_HEIGHT});
    	
    	//높이제어(세로기준으로 가로를 맞춤)
		if(_stageHeight < _reImageHeight || _stageHeight > _reImageHeight){ //플랫폼이 이미지의세로보다 작거나 크면
			 _reImageHeight = _stageHeight; //이미지의 세로를 플랫폼으로 맞추고
			 _reImageWidth = _stageHeight * IMAGE_WIDTH/IMAGE_HEIGHT; //세로에따른 비율계산
			 nowFitScreen = 1; // 0:화면맞춤 ,  1: 세로맞춤,  2: 가로맞춤
			 
		//가로제어(가로기준으로 세로를 맞춤)
		}else if(_stageWidth > _reImageWidth){ //플랫폼이 이미지의가로보다 크면
			 _reImageWidth = _stageWidth; //이미지의 가로를 플랫폼으로 맞추고
			 _reImageHeight = _stageWidth * IMAGE_HEIGHT/IMAGE_WIDTH; //가로에따른 비율계산
			 nowFitScreen = 2; // 0:화면맞춤 ,  1: 세로맞춤,  2: 가로맞춤
		}
		
		if(mpImg !== undefined) {
			mpImg.render({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:0, scale:1});
			DrawAnnoCanvas({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
		}
		
		if(imgCount>1){
			addThumbnailCanvas(imgCount);
			addThumbnail(imgCount,Base64ImageData,VIS_TIFF);
		}
		*/
		//setThumbNailScroll();
		console.log('---> 이미지 랜더링 시간: ', ((new Date().getTime()) - t0) + 'ms');
		console.log('---> LoadImage total time: ', ((new Date().getTime()) - t1) + 'ms');
	
}

function ControlImage(){
    	
    	//높이제어(세로기준으로 가로를 맞춤)
		if(_stageHeight < _reImageHeight || _stageHeight > _reImageHeight){ //플랫폼이 이미지의세로보다 작거나 크면
			 _reImageHeight = _stageHeight; //이미지의 세로를 플랫폼으로 맞추고
			 _reImageWidth = _stageHeight * IMAGE_WIDTH/IMAGE_HEIGHT; //세로에따른 비율계산
			 nowFitScreen = 1; // 0:화면맞춤 ,  1: 세로맞춤,  2: 가로맞춤
			 
		//가로제어(가로기준으로 세로를 맞춤)
		}else if(_stageWidth > _reImageWidth){ //플랫폼이 이미지의가로보다 크면
			 _reImageWidth = _stageWidth; //이미지의 가로를 플랫폼으로 맞추고
			 _reImageHeight = _stageWidth * IMAGE_HEIGHT/IMAGE_WIDTH; //가로에따른 비율계산
			 nowFitScreen = 2; // 0:화면맞춤 ,  1: 세로맞춤,  2: 가로맞춤
		}
		
		if(mpImg !== undefined) {
			mpImg.render({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:0, scale:1});
			DrawAnnoCanvas({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
		}
		
		if(imgCount>1){
			addThumbnailCanvas(imgCount);
			addThumbnail(imgCount,Base64ImageData,VIS_TIFF);
		}
	
}


function addThumbnailCanvas(imgCount){
	
}


function addThumbnail(imgCount,Base64ImageData,VIS_TIFF){
	var tCanvas;
	var xsize;
	var ysize;
	var width=[], height=[];
	var imgArray = [];
	
	if(imgCount>1) {
		for (var i=0; i < imgCount; i++) {
			var resultArray = VIS_TIFF.LoadImageTIFF(Base64ImageData,i+1,0);	
			xsize = VIS_TIFF.hImageGetX(resultArray);
			ysize = VIS_TIFF.hImageGetY(resultArray);
			var imgAddr = VIS_TIFF.hImageGetImageAddr(resultArray);
			var size = (xsize*ysize)*4;
			var buf = INFOLIBTIFF.HEAPU8;
			var imgHeapdata = new Uint8Array(buf);
			var imgPtr = imgAddr.e;
			var imgPixels = imgHeapdata.subarray(imgPtr,imgPtr+size);
			tCanvas = document.createElement('canvas');
			tCanvas.width=xsize;
			tCanvas.height=ysize;	
			createCanvasFromRGBA(imgPixels,tCanvas,[xsize,ysize]);
			imgArray[i] = tCanvas.toDataURL();
			width[i]=xsize;
			height[i]=ysize;
		}

		setThumbnail(imgCount,imgArray,width,height);
	}
}

function setThumbnail(_imgCount,_imgArry,_width,_height){
	var thumbgWidth= Number($(".thumbnail_bg").width())-20; //섬네일 캔버스 사이즈 
	//var thumbgHeight= Number($(".thumbnail_bg").height());
	//console.log(thumbgWidth);
	//섬네일 캔버스 높이 계산
	//var thumbgHeight = 130*thumbnail.length;
	var thumbgHeight = 150*_imgArry.length; //섬네일 캔버스 사이즈 
	console.log('####thumbgHeight',_imgArry.length);
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

	
	//console.log('imgArry.length: '+_imgArry.length);
	var topsize = 0;
	var cnt = 0;
	for(var i=0; i < _imgArry.length; i++){

		 var image = _imgArry[i];
		 fabric.Image.fromURL(image, function (img) {
			  thumCan.add(img).renderAll();  
		 },{	
		 id:i,
		 left: (thumbgWidth/4)-12,
		 top: topsize,
		 width:100,
		 height:130,
		 hasControls : false,
		 lockMovementY: true,
		 lockMovementX: true
		 });	
		 topsize+=150;
	}


	var annoArry = []; 
	var preAnnoJsonDataIndex=0;
	var updateDOM = function(event){
	    var shape = event.target;
		console.log("오브젝트 선택");
		//console.log("shape:"+shape);
		//console.log("shape id:"+shape.id);
		//annoCanvas = document.getElementById('annoCanvas');
	
		var annoC = getAnnoCanvas();
		
		annoArry[preAnnoJsonDataIndex] = JSON.stringify(annoC.fabricCanvas.toDatalessJSON());
	
		//console.log("annoArry[preAnnoJsonDataIndex] : " +  annoArry[preAnnoJsonDataIndex]);
	
		annoC.fabricCanvas.clear();
	    annoC.fabricCanvas.loadFromDatalessJSON(annoArry[shape.id]);
	    annoC.fabricCanvas.renderAll();
		
		//var img = new Image();
		//img.src = imgArry[shape.id];
		//console.log('shape.id',shape.id);
		//console.log('imgArry',_imgArry);
		imgscreenfit(_imgArry[shape.id],_width[shape.id],_height[shape.id]);
		preAnnoJsonDataIndex = shape.id;
	
		//alert(shape.id + '번 이미지 선택');
		//console.log("propertyName(n): "+shape.get(n));
	    //console.log("conf.value: "+conf.value);
		//console.log("DrawingFabric.item(0) : "+DrawingFabric.getObjects().indexOf(event.target));

 	};
	thumCan.on('object:selected', updateDOM);

}

function imgscreenfit(img,IMAGE_WIDTH,IMAGE_HEIGHT){	
	
	mpImg = new MegaPixImage({canvas:canvas, orgImgData:img, orgWidth: IMAGE_WIDTH, orgHeight: IMAGE_HEIGHT});
	
	_reImageWidth = IMAGE_WIDTH;
	_reImageHeight = IMAGE_HEIGHT;
	
	
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
		mpImg.render({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
		DrawAnnoCanvas({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});

	}

}


//canvas calse control function
function canvasScale(opt){
	var _width = Math.round(opt.reWidth*opt.scale), 
	    _height = Math.round(opt.reHeight*opt.scale),
	    _rotate = opt.rotate; 
	    
    ctx = canvas.getContext('2d');
    
    ctx.canvas = _width;
    ctx.canvas = _height;
    
	ctx.restore();
	
	$('MainImageCanvas').css({"transform":"rotate("+_rotate+"deg)"});
	
};

function setThumbNailScroll(){
    //var s = $("#thumbnailCanvas");
    //var pos = s.position();
	
	$('.thumbnail_bg').scroll(function () {
	   var windowpos = $('.thumbnail_bg').scrollTop();
       // s.html("Distance from top:" + pos.top + "<br />Scroll position: " + windowpos);
        console.log("Scroll position: " + windowpos);
        /*
        if (windowpos >= pos.top) {
            s.addClass("stick");
        } else {
            s.removeClass("stick");
        }*/
     });
}



//가로고정, 세로고정시 화면 리사이즈 이벤트
window.addEventListener("load", function(){
    function draw()
    {
    	
    	if(mpImg !== undefined){
			//visutil ver
			//mpImg.render({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
			
			//org ver
			console.log('화면 비율 변경 ');
			mpImg.render({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
			DrawAnnoCanvas({reWidth:_reImageWidth, reHeight: _reImageHeight, rotate:nowRotate, scale:_scale});
		}
			
    }
    function resize()
    {
		//canvas = document.getElementById('MainImageCanvas');
		_stageHeight = $('#mainContainer').innerHeight() - scrollbarheight;
		_stageWidth = $('#mainContainer').innerWidth() - scrollbarheight;
		
		//nowFitScreen = 0; // nowFitScreen :: 0:화면맞춤 ,  1: 세로맞춤,  2: 가로맞춤
		
		if(nowFitScreen == 0){
			
			//화면맞춤
			_reImageWidth = _stageWidth; 
			_reImageHeight = _stageHeight; 
			
		}else if(nowFitScreen == 1){
			
			//세로맞춤
			if(_stageHeight < _reImageHeight || _stageHeight > _reImageHeight){ //플랫폼이 이미지의세로보다 작거나 크면
				
				 _reImageWidth = _stageHeight * IMAGE_WIDTH/IMAGE_HEIGHT; //세로에따른 비율계산
				 _reImageHeight = _stageHeight; //이미지의 세로를 플랫폼으로 맞추고
				 
			}
			
		}else{
			
			//가로맞춤
			if(_stageHeight > _reImageHeight || _stageHeight < _reImageHeight){ //플랫폼이 이미지의세로보다 작거나 크면
				
				_reImageWidth = _stageWidth; //이미지의 가로를 플랫폼으로 맞추고
				_reImageHeight = _stageWidth * IMAGE_HEIGHT/IMAGE_WIDTH; //가로에따른 비율계산
				
			}
			
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













