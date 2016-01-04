
(function() {
	
  var orgImgData, canvas, orgWidth, orgHeight;
 
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
  	
  	var t1 = new Date().getTime(); //renderImageToCanvas total time
  	
  	//console.log("scale :",opt.scale);
    var W = orgWidth, H = orgHeight,
        width = opt.reWidth*opt.scale, height = opt.reHeight*opt.scale,
        rotate = opt.rotate;
	
	var W2 = Math.round(width);
	var H2 = Math.round(height);
	
	var tctx = canvas.getContext('2d');
	canvas.width = W2;
	canvas.height = H2;
	
	
	console.log('W :',W);
	console.log('H :',H);
	console.log('W2 :',W2);
	console.log('H2 :',H2);
	console.log('opt.scale :',opt.scale);
	console.log('orgWidth :',orgWidth);
	console.log('orgHeight :',orgHeight);


	var img = new Image;

	img.onload = function(){
	  tctx.drawImage(img, 0, 0,orgWidth,orgHeight,0,0,W2,H2);
	  // ...and then steps 3 and on
	};
	img.src = orgImgData;

	
	
    tctx.restore();
    
    transformCoordinate(canvas,tctx,width,height,rotate);
    //tctx = data = img = null;    	
    
	console.log('---> renderImageToCanvas total time: ', ((new Date().getTime()) - t1) + 'ms');
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
  	
    canvas = opt.canvas;
    if(orgImgData === undefined){
    	
    	console.log('undefined orgImgData');
    	orgImgData=canvas.toDataURL();  	
    }else{
    	console.log('orgImgData:',opt.orgImgData);
    	orgImgData=opt.orgImgData;
    }

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
