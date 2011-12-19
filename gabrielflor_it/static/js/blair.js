(function() {

$(document).ready(function() {

	var canvas = document.getElementById("blair");
	var ctx = canvas.getContext("2d");

	var img = new Image();
	var steps = 8;

	img.addEventListener('load', function() {

		var data, pixels;
		var col1, col2, col3;
		var r, g, b;

		for (var i = 0; i < steps; i++) {
			
			ctx.drawImage(this, this.width * i, 0);

			data = ctx.getImageData(this.width * i, 0, this.width, this.height);
			pixels = data.data;

			for (var j = 0; j < pixels.length; j += 4) {

				r = pixels[j + 0];
				g = pixels[j + 1];
				b = pixels[j + 2];

				pixels[j + 0] = 255 - (255*i/steps);
				pixels[j + 2] = (255*i/steps);
			}

			ctx.putImageData(data, this.width * i, 0);
		}
	});

	img.src = '../static/img/blair.png';
});

})()
