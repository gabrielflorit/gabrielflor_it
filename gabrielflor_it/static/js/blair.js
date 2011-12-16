(function() {

$(document).ready(function() {

	var canvas = document.getElementById("blair");
	var ctx = canvas.getContext("2d");

	var img = new Image();
	var steps = 10;

	img.addEventListener('load', function() {

		var data, pixels;

		for (var i = 0; i < steps; i++) {
			
			ctx.drawImage(this, this.width * i, 0);

			data = ctx.getImageData(0, 0, this.width, this.height);
			pixels = data.data;

			for (var j = 0; j < pixels.length; j += 4) {

				pixels[j] = 255 - (i*255/steps);
//				pixels[j + 1] = 0;
//				pixels[j + 2] = 0;
			}

			ctx.putImageData(data, this.width * i, 0);
		}
	});

	img.src = '../static/img/blair.png';
});

})()
