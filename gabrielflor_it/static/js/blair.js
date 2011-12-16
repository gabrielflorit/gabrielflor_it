(function() {

var masterBlairs;
var numberOfBlairs;
var totalNumberOfBlairs = 8;

$(document).ready(function() {

	var files = [
					'blair', 
					'blaircontrast50'];
	
	masterBlairs = [];
	numberOfBlairs = files.length;


	while (files.length > 0) {
		
		var file = files.pop();
		loadMasterBlairs(file);
	}
});

function loadMasterBlairs(file) {

    d3.xml('../static/svg/' + file + '.svg', 'image/svg+xml', function(xml) {

    	var source = $('#source');
		source.get(0).appendChild(xml.documentElement);

		masterBlairs.push(file);
		if (masterBlairs.length == numberOfBlairs) {
			cloneBlairs();
		}
    });
}

function cloneBlairs() {

	var svgs = $('#source svg');

	for (var i = 0; i < masterBlairs.length; i++) {

		var thisBlair = masterBlairs[i];

		$('body').append('<div id="' + thisBlair + '"></div>');
		var destination = $('#' + thisBlair);

		svgs.each(function(ei, e) {

			if (ei == i) {

				for (var j = 0; j < totalNumberOfBlairs; j++) {
					$(e).clone().attr('id', thisBlair + j).appendTo(destination);
					draw($('#' + thisBlair + j + ' path'), j*360/totalNumberOfBlairs);
				}
			}
		});
	}

	svgs.remove();
}

function draw(selector, hue) {

	$(selector).each(function(i, e) {

		var fill = e.style['fill'];
		var color = d3.hsl(fill);
		color.s = 1;
		color.h = hue;
		e.style['fill'] = color.toString();

		e.style['stroke'] = 'none';
	});
}

})()


// d3.select(window).on("keydown", function () {

// 	switch (d3.event.keyCode) {

// 		// left
// 		case 37:
// 			hue = hue - 30;
// 			if (hue < 0) {
// 				hue = 360;
// 			}

// 			draw();
// 			break;

// 		// right
// 		case 39:
// 			hue = hue + 30;
// 			if (hue > 360) {
// 				hue = 0;
// 			}

// 			draw();
// 			break;
// 	}
// });

