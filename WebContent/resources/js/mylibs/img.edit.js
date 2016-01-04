(function($) {
	$.fn.extend({
		editImg:function(cfg) {
			var self = $(this);
			var canvas = self[0];
			var cw = self.width();
			var ch = self.height();
			canvas.width = cw;
			canvas.height = ch;
			var ctx = canvas.getContext('2d');

			self.data('width', cw);
			self.data('height', ch);
			self.data('ctx', ctx);
			self.data('scale', cfg.scale ? cfg.scale : 1);
			self.data('x', cfg.x ? cfg.x : 0);
			self.data('y', cfg.y ? cfg.y : 0);
			self.data('deg', cfg.deg ? cfg.deg : 0);
			self.data('flipX', cfg.flipX ? cfg.flipX : 0);
			self.data('flipY', cfg.flipY ? cfg.flipY : 0);

			console.log("cw : "+cw);
            console.log("ch : "+ch);
			ctx.clearRect(0, 0, cw, ch);
			var img = new Image();
	 		img.src = cfg.file;
	 		img.onload = function() {
	 			var ratio = img.width / img.height;
	 			var iw = img.width*(ch/img.height); // iw : image width
	 			var ih = ch;                        // ih : image height
	 			self.data('iw', iw);
				self.data('ih', ih);
				self.data('file', cfg.file);
	 			ctx.drawImage(img, 0, 0, iw, ih);
	 			self.data('img', img);
	 			self.repaint({});
	 		};

			console.log("img : "+img);
            console.log("ctx : "+ctx);
            console.log("cfg : "+cfg);

		},
        
		repaint: function(options) {
			var self = $(this);
			var ctx = self.data('ctx');
			var cw = self.data('width');
			var ch = self.data('height');
			var scale = self.data('scale');
			var x = self.data('x');
			var y = self.data('y');
			var deg = self.data('deg');
			var flipX = self.data('flipX');
			var flipY = self.data('flipY');
			var tiffimg = self.data('tiffimg');
			
			if (options.tiffimg) {				
                alert("tiffimg 123:"+options.tiffimg);
			}
			if (options.flipX) {
				flipX = flipX == 1 ? 0 : 1;
				self.data('flipX', flipX);
			}
			if (options.flipY) {
				flipY = flipY == 1 ? 0 : 1;
				self.data('flipY', flipY);
			}
			if (options.scale) {
				var scale = self.data('scale') + options.scale;
				self.data('scale', scale);
			}
			if (options.deg) {
				options.deg = flipX == 1 ? -options.deg : options.deg;
				options.deg = flipY == 1 ? -options.deg : options.deg;
				var deg = self.data('deg') + options.deg*Math.PI/180;
				self.data('deg', deg);
                console.log("deg : "+deg);
			}
			if (options.x) {
				options.x = flipX == 1 ? -options.x : options.x;
				var x = self.data('x') + options.x*Math.cos(-deg);
				var y = self.data('y') + options.x*Math.sin(-deg);
				self.data('x', x);
				self.data('y', y);
			}
			if (options.y) {
                options.y = flipY == 1 ? -options.y : options.y;
                var x = self.data('x') + options.y*Math.sin(deg);
                var y = self.data('y') + options.y*Math.cos(deg);
                self.data('x', x);
                self.data('y', y);
			}
			ctx.clearRect(0, 0, cw, ch);
 			ctx.save();
 			ctx.translate(cw/2 , ch/2);
 			ctx.rotate(deg);
			var iw = self.data('iw');
			var ih = self.data('ih');
			if (flipX == 1) {
				deg = -2*deg;
				ctx.rotate(deg);
				ctx.scale(-1, 1);
			} 
			if (flipY == 1) {
				deg = -2*deg;
				ctx.rotate(deg);
				ctx.scale(1, -1);
			} 

			ctx.drawImage(self.data('img'), x - cw*scale/2, y - ch*scale/2, iw*scale, ih*scale);
			ctx.restore();
			
		},
		config: function() {
			var self = $(this);
			var cfg = {};
			cfg.scale = self.data('scale');
			cfg.x = self.data('x');
			cfg.y = self.data('y');
			cfg.deg = self.data('deg');
			cfg.flipX = self.data('flipX');
			cfg.flipY = self.data('flipY');
			cfg.file = self.data('file');
			return cfg;
		}
	});
})(jQuery);






