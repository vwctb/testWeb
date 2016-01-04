

function convertDataURIToBinary(dataURI) {

  //var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  //var base64 = dataURI.substring(base64Index);
  var raw = window.atob(dataURI);
  var rawLength = raw.length;
  var array = new Uint8ClampedArray(new ArrayBuffer(rawLength));
  for(var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

function createCanvasFromRGBA(pixels,canvas, shape) {
  "use strict";
  if(!pixels) {
    throw new Error('must specify pixels');
  }
  if (!Array.isArray(shape)) {
    throw new Error('must specify [width, height,reWidth,reHeight] shape');
  }

	var W = shape[0], H = shape[1];
	if (!(W+H)) return;
	var width = shape[2], height = shape[3];
	
	var W2 = Math.round(width);
	var H2 = Math.round(height);
	var ctx = canvas.getContext("2d");
	ctx.save();
	
	var img2 = ctx.getImageData(0, 0, W2, H2);
	var data = pixels;
	var data2 = img2.data;
	
	console.log('data :'+data);
	console.log('data2 :'+data2);
	
	var ratio_w = W / W2;
	var ratio_h = H / H2;
	var ratio_w_half = Math.ceil(ratio_w/2);
	var ratio_h_half = Math.ceil(ratio_h/2);
	var gx_r,gx_g,gx_b,gx_a;
   

  for(var j = 0; j < H2; j++){
		for(var i = 0; i < W2; i++){
			var x2 = (i + j*W2) * 4;
			var weight = 0;
			var weights = 0;
			var weights_alpha = 0;
			var gx_r = gx_g = gx_b = gx_a = 0;
			var center_y = (j + 0.5) * ratio_h;
			for(var yy = Math.floor(j * ratio_h); yy < (j + 1) * ratio_h; yy++){
				var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
				var center_x = (i + 0.5) * ratio_w;
				var w0 = dy*dy; //pre-calc part of w
				for(var xx = Math.floor(i * ratio_w); xx < (i + 1) * ratio_w; xx++){
					var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
					var w = Math.sqrt(w0 + dx*dx);
					if(w >= -1 && w <= 1){
						//hermite filter
						weight = 2 * w*w*w - 3*w*w + 1;
						if(weight > 0){
							dx = 4*(xx + yy*W);
							//alpha
							gx_a += weight * data[dx + 3];
							weights_alpha += weight;
							//colors
							if(data[dx + 3] < 255)
								weight = weight * data[dx + 3] / 250;
							gx_r += weight * data[dx];
							gx_g += weight * data[dx + 1];
							gx_b += weight * data[dx + 2];
							weights += weight;
							}
						}
					}		
				}
			data2[x2]     = gx_r / weights;
			data2[x2 + 1] = gx_g / weights;
			data2[x2 + 2] = gx_b / weights;
			data2[x2 + 3] = gx_a / weights_alpha;
			}
		}
  
    canvas.width = W2;
    canvas.height = H2; 
    var tctx = canvas.getContext('2d');
    tctx.clearRect(0, 0, Math.max(W, W2), Math.max(H, H2));
	tctx.putImageData(img2, 0, 0);
    tctx.restore();

  //context.putImageData(imageData, 0, 0);
  //return context.canvas;
}

function createImgFromRGBA(pixels,canvas, shape) {
  "use strict";
  if(!pixels) {
    throw new Error('must specify pixels');
  }
  if (!Array.isArray(shape)) {
    throw new Error('must specify [width, height] shape');
  }
  canvas.width = shape[0];
  canvas.height = shape[1];

  var context = canvas.getContext('2d');
  var imageData = context.createImageData(shape[0], shape[1]);
  var canvdata = imageData.data;
  //console.log("canvdata.length : ",canvdata.length);
   
  for (var i = 0; i < canvdata.length; i += 4) {
    canvdata[i] = pixels[i];
    canvdata[i + 1] = pixels[i + 1];
    canvdata[i + 2] = pixels[i + 2];
    canvdata[i + 3] = pixels[i + 3];
	}
	
  context.putImageData(imageData, 0, 0);

  
  return null;
}
