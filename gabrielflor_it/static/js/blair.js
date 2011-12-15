var hue = 0;

function draw() {

	var path = d3.selectAll('path')
		.style('fill', function(d, i) {

			var current = d3.select(this);
			var fill = current.style('fill');
			var hsl = d3.hsl(fill);

			hsl.s = 360;
			hsl.h = hue;

			return hsl;

		})
		.style('stroke', 'none');
}

d3.select(window).on("keydown", function () {

	switch (d3.event.keyCode) {

		// left
		case 37:
			hue--;
			if (hue < 0) {
				hue = 360;
			}

			draw();
			break;

		// right
		case 39:
			hue++;
			if (hue > 360) {
				hue = 0;
			}

			draw();
			break;
	}
});



