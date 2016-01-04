

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
  if(!pixels) {
    throw new Error('must specify pixels');
  }
  if (!Array.isArray(shape)) {
    throw new Error('must specify [width, height] shape');
  }


  var context = canvas.getContext('2d');
  var imageData = context.createImageData(shape[0], shape[1]);
  var canvdata = imageData.data;
  
  canvas.width = shape[0];
  canvas.height = shape[1];
  
  console.log("### width : ",shape[0]);
  console.log("### height : ",shape[1]);
  
  //console.log("canvdata.length : ",canvdata.length);
   
  for (var i = 0; i < canvdata.length; i += 4) {
    canvdata[i] = pixels[i];
    canvdata[i + 1] = pixels[i + 1];
    canvdata[i + 2] = pixels[i + 2];
    canvdata[i + 3] = pixels[i + 3];
	}
  context.putImageData(imageData, 0, 0);

  return canvas;
}
