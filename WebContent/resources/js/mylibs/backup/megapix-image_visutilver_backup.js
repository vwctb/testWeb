
(function() {
	
  var pixels,canvas,orgWidth,orgHeight;
  
  function detectSubsampling(img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    if (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, -iw + 1, 0);
      // subsampled image becomes half smaller in rendering size.
      // check alpha channel value to confirm image is covering edge pixel or not.
      // if alpha value is 0 image is not covering, hence subsampled.
      return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
    } else {
      return false;
    }
  }

  /**
   * Detecting vertical squash in loaded image.
   * Fixes a bug which squash image vertically while drawing into canvas for some images.
   */
  function detectVerticalSquash(img, iw, ih) {
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, ih).data;
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
      var alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio===0)?1:ratio;
  }

  /**
   * Rendering image element (with resizing) and get its data URL
   */
  function renderImageToDataURL(img, options, doSquash) {
    var canvas = document.createElement('canvas');
    renderImageToCanvas(img, canvas, options, doSquash);
    return canvas.toDataURL("image/jpeg", options.quality || 1);
  }

  /**
   * Rendering image element (with resizing) into the canvas element
   */
  function renderImageToCanvas(opt) {
  	//console.log("scale :",opt.scale);
    var W = orgWidth, H = orgHeight, 
        width = opt.reWidth*opt.scale, height = opt.reHeight*opt.scale,
        rotate = opt.rotate;
	
	var W2 = Math.round(width);
	var H2 = Math.round(height);
	
	var bufCanvas = document.createElement('canvas');
	var bufctx = bufCanvas.getContext("2d");
	bufctx.save();
	
	canvas.width = W2;
    canvas.height = H2;
    
    var bufCanvas2 = document.createElement('canvas');
	var bufctx2 = bufCanvas2.getContext("2d");
    var tctx = canvas.getContext('2d');
    
	bufCanvas2.width = W2;
    bufCanvas2.height = H2; 
    
	var img2 = bufctx.getImageData(0, 0, W2, H2);
	var data = pixels;
	var data2 = img2.data;
	
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

    bufctx2.clearRect(0, 0, Math.max(W, W2), Math.max(H, H2));
	bufctx2.putImageData(img2, 0, 0);
	
	var img = new Image;
	img.onload = function(){
		 		 
	  tctx.drawImage( this ,W2/2-width/2 , H2/2-height/2);
	  
	  // ...and then steps 3 and on
	};

	img.src = bufCanvas2.toDataURL();
    tctx.restore();
    transformCoordinate(canvas,tctx,width,height,rotate);
    bufCanvs = ctx = bufctx = data = data2 =null;    	
    
  }

  /**
   * Transform canvas coordination according to specified frame size and orientation
   * Orientation value is from EXIF tag
   */
  function transformCoordinate(canvas, ctx, width, height, orientation) {
    switch (orientation) {
      case 5:
      case 6:
      case 7:
      case 8:
        canvas.width = height;
        canvas.height = width;
        break;
      default:
        canvas.width = width;
        canvas.height = height;
    }
    switch (orientation) {
      case 2:
        // horizontal flip
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        break;
      case 3:
        // 180 rotate left
        ctx.translate(width, height);
        ctx.rotate(Math.PI);
        break;
      case 4:
        // vertical flip
        ctx.translate(0, height);
        ctx.scale(1, -1);
        break;
      case 5:
        // vertical flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.scale(1, -1);
        break;
      case 6:
        // 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(0, -height);
        break;
      case 7:
        // horizontal flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(width, -height);
        ctx.scale(-1, 1);
        break;
      case 8:
        // 90 rotate left
        ctx.rotate(-0.5 * Math.PI);
        ctx.translate(-width, 0);
        break;
      default:
        break;
    }
  }
  
  var URL = window.URL && window.URL.createObjectURL ? window.URL :
            window.webkitURL && window.webkitURL.createObjectURL ? window.webkitURL :
            null;

  /**
   * MegaPixImage class
   */
  
  function MegaPixImage(opt) {
  	
    pixels = opt.pixels;
    canvas = opt.canvas;
    orgHeight = opt.orgHeight;
    orgWidth = opt.orgWidth;
    
  }

  /**
   * Rendering megapix image into specified target element
   */
  
  MegaPixImage.prototype.render = function(options) {
 
	//console.log("options",options);
    renderImageToCanvas(options);
    
    if (this.blob) {
      this.blob = null;
      URL.revokeObjectURL(this.srcImage.src);
    }
  };

  /**
   * Export class to global
   */
  if (typeof define === 'function' && define.amd) {
    define([], function() { return MegaPixImage; }); // for AMD loader
  } else if (typeof exports === 'object') {
    module.exports = MegaPixImage; // for CommonJS
  } else {
    this.MegaPixImage = MegaPixImage;
  }

})();
