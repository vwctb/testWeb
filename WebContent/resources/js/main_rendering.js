
var contentType;
var canvas;
var pixels;
var mpImg;
var IMAGE_WIDTH, IMAGE_HEIGHT;
var _reImageHeight, _reImageWidth, _stageHeight, _stageWidth;
var scrollbarheight = document.getElementById('mainContainer').offsetHeight - document.getElementById('mainContainer').clientHeight;
_stageHeight = $('#mainContainer').innerHeight() - scrollbarheight;
_stageWidth = $('#mainContainer').innerWidth() - scrollbarheight;

console.log('_stageHeight',_stageHeight);
console.log('_stageWidth',_stageWidth);



window.addEventListener("load", function()
{

    function draw()
    {
	    //createCanvasFromRGBA(pixels, canvas, [IMAGE_WIDTH,IMAGE_HEIGHT,_reImageWidth,_reImageHeight]);
	    
    }
    function resize()
    {
    	//canvas = document.getElementById('MainImageCanvas');
		_stageHeight = $('#mainContainer').innerHeight() - scrollbarheight;
		_stageWidth = $('#mainContainer').innerWidth() - scrollbarheight;

		//높이제어(세로기준으로 가로를 맞춤)
		if(_stageHeight < _reImageHeight){ //플랫폼이 이미지의세로보다 작거나 크면
		 _reImageHeight = _stageHeight; //이미지의 세로를 플랫폼으로 맞추고
		 _reImageWidth = _stageHeight * IMAGE_WIDTH/IMAGE_HEIGHT; //세로에따른 비율계산
		 //가로제어(가로기준으로 세로를 맞춤)
		}else if(_stageWidth > _reImageWidth){ //플랫폼이 이미지의가로보다 크면
		 _reImageWidth = _stageWidth; //이미지의 가로를 플랫폼으로 맞추고
		 _reImageHeight = _stageWidth * IMAGE_HEIGHT/IMAGE_WIDTH; //가로에따른 비율계산
		}
		
        draw();
    }
    window.addEventListener("resize", resize);
    resize();
});



$('#loadImage').click(function(e){
	e.preventDefault();
    $('#file').click();
});

$('#Rotate90').click(function(e){
	
 canvas = document.getElementById('MainImageCanvas');
 var deg = 0.5*Math.PI/180;
 var ctx = canvas.getContext("2d");
 ctx.rotate(90);
});

function edit_img(cfg) {
	sel_file = cfg.file;
	$("#btn_add").hide();
	$("#c1").editImg(cfg);
}



$('#file').change(function() {
    var file = document.getElementById("file").files[0];
	var reader = new FileReader();
	reader.onload = function(event) {
		var t1 = new Date().getTime();
	  	var data = event.target.result;
		contentType = data.split(",")[0].split(":")[1].split(";")[0];
	    var Base64ImageData = data.split(",")[1];
	    var dll = new DLL.CImageUtilHtml5();
		var t0 = new Date().getTime();
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
    	pixels = convertDataURIToBinary(resultBase64);

    	createCanvasFromRGBA(pixels,canvas,[IMAGE_WIDTH,IMAGE_HEIGHT,_reImageWidth,_reImageHeight]);
		console.log('---> LoadImage total time: ', ((new Date().getTime()) - t1) + 'ms');
		
		
		
		

		
	};
reader.readAsDataURL(file);
});












