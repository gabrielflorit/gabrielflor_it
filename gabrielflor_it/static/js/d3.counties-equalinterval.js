var data;
var years = [];
var states;
var currentYearIndex = 0;
var tooltip = '';
var allValues = [];
var minValue, maxValue;
var scale;
var noData = 'rgb(255,255,255)';
var hue = 231;

var path = d3.geo.path();

var svg = d3.select('#chart')
			.append('svg:svg');

var map = svg.append('svg:g')
			.attr('class', 'map');

d3.json('../static/data/states.json', function (json) {

	states = json;
});

d3.json('../static/geojson/counties.json', function (json) {

	var features = [];

	// ignore puerto rico
	for (var i = 0; i < json.features.length; i++) {
		var feature = json.features[i];
		if (feature.properties && feature.properties.STATE && feature.properties.STATE <= 56) {
			features.push(feature);
		}
	}

	map.selectAll('path')
		.data(features)
		.enter()
		.append('svg:path')
		.attr('d', path)
		.attr('fill', noData)
		.on('mouseover', function (d) {

			d3.select(this).style('stroke', 'white').style('stroke-width', '1px');

			var name = d.properties.NAME;
			var fips = getFips(d);

			var datum = data[years[currentYearIndex]][fips];

			if (datum) {
				tooltip = name + ' County, ' + states[d.properties.STATE] 
					+ '<br/><span><b>' + years[currentYearIndex] 
					+ '</b> rate: <b>' + d3.format('.1f')(datum) 
					+ '%</b></span>';
			} else {
				tooltip = name + ' County, ' + states[d.properties.STATE] 
					+ ': <b>N/A</b>';
			}
		})
		.on('mouseout', function (d) {

			d3.select(this).style('stroke', 'none')
		});

	d3.json('../static/data/saipe_1997_2009.json', function (saipe) {

		// get the years from the csv (will do it later)
		years = d3.range(1997, 2010);

		data = saipe;

		// get max and min
			var year = data[years[years.length - 1]];
			for (var datum in year) {
				allValues.push(year[datum]);
			}

		currentYearIndex = years.length - 1;

		minValue = d3.min(allValues);
		maxValue = d3.max(allValues);

		scale = d3.scale.linear()
			.domain([minValue, maxValue])
			.range([0, 100]);

		drawTitleAndMisc();
		setTimeout(function() {
			drawLegend();
			// drawLegendBorder();
			drawMap();

			$('#loading').hide();
			$('#controls-leftright').show();
			$('#controls-hue').show();
			$('#controls-upperbound').hide();
			$('#controls-lowerbound').hide();
		}, 500);
	});
});

function drawTitleAndMisc() {

	var title = svg.append('svg:text')
		.attr('class', 'title')
		.attr('transform', 'translate(515, 22)')
		.text('Poverty estimates by county, ' + d3.min(years) + '-' + d3.max(years));

	var year = svg.append('svg:text')
		.attr('class', 'year')
		.attr('transform', 'translate(15, 60)')
		.text('');

	var notes = svg.append('svg:text')
		.attr('class', 'notes')
		.attr('x', 950)
		.attr('y', 475)
		.attr('text-anchor', 'end')
		.text('By: GABRIEL FLORIT');

	var notes = svg.append('svg:text')
		.attr('class', 'notes')
		.attr('x', 950)
		.attr('y', 490)
		.attr('text-anchor', 'end')
		.text('Source: Small Area Income & Poverty Estimates, U.S. Census Bureau');
}

// function eraseLegendColorMap() {

// 	legend.selectAll('rect').remove();
// }

var legend = svg.append('svg:g')
.attr('transform', 'translate(904, 240)');

function drawLegend() {

	legend.append('svg:text')
		.attr('class', 'legend-title')
		.attr('x', -25)
		.attr('y', -20)
		.text('percent');

	var legendGradientWidth = 30;
	var legendGradientHeight = 200;

	var legendGradient = legend.append('svg:g');
	var legendTicks = legend.append('svg:g');

	// create the color gradient
	legendGradient.selectAll('rect')
		.data(d3.range(0, breaks, 1))
		.enter()
		.insert('svg:rect')
		.attr('x', 1)
		.attr('y', function (d, i) {
			return i * (legendGradientHeight/breaks);
		})
		.attr('width', legendGradientWidth)
		.attr('height', (legendGradientHeight/breaks))
		.attr('fill', function (d, i) {
			return d3.hsl('hsl(' + hue + ', 100%, ' + (i * (100/breaks)) + '%)').toString();
		});

	var ticksScale = d3.scale.linear()
		.domain([0, breaks])
		.range([minValue, maxValue]);

	// add the ticks
	legendTicks.selectAll('text')
		.data(d3.range(breaks, -1, -1))
		.enter()
		.insert('svg:text')
		.attr('class', 'legend-tick')
		.attr('text-anchor', 'end')
		.attr('x', -4)
		.attr('y', function (d, i) {
			return i * (legendGradientHeight/breaks) + 5;
		})
		.text(function (d, i) {
			return d3.format('.0f')(ticksScale(d)) + '%';
		});

	// this is a dumb way of creating a border!
	legend.append('svg:rect')
		.attr('y', 0)
		.attr('x', 0)
		.attr('width', legendGradientWidth + 1)
		.attr('height', legendGradientHeight + 1)
		.attr('fill', 'none')
		.attr('stroke', '#ccc')
		.attr('style', 'shape-rendering: crispEdges');
}

function convertPercentToColor(data) {

	var breaksToData = d3.scale.linear()
		.domain([0, breaks])
		.range([minValue, maxValue]);

	var dataToPercent = d3.scale.linear()
		.domain([minValue, maxValue])
		.range([0, 100]);

	for (var i = 1; i <= breaks; i++) {
		if (data <= breaksToData(i))
			return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - i * 100/breaks) + '%)').toString();
	}
}

d3.select(window).on("keydown", function () {

	switch (d3.event.keyCode) {

		// h
	case 72:
		$('#controls-hue').fadeOut();
		hue = hue + 5;
		if (hue > 360) hue = 0;
		// drawMapAndLegend();
		break;

		// left
	case 37:
		$('#controls-leftright').fadeOut();
		if (currentYearIndex > 0) {
			currentYearIndex--;
			// drawMap();
		}
		break;

		// right
	case 39:
		$('#controls-leftright').fadeOut();
		if (currentYearIndex < years.length - 1) {
			currentYearIndex++;
			// drawMap();
		}
		break;
	}
});

// function drawMapAndLegend() {

// 	eraseLegendColorMap();
// 	drawLegendColorMap();
// 	drawMap();
// }

function drawMap() {

	svg.select('.year')
		.text(years[currentYearIndex]);

	map.selectAll('path')
		.style('fill', quantize);
}

function getFips(d) {

	return d.properties.GEO_ID.substring(9, 14);
}

function quantize(d) {

	var fips = getFips(d);

	var datum = data[years[currentYearIndex]][fips];

	if (datum) {
		return convertPercentToColor(datum);
	} else {
		return noData;
	}
}

$(function () {
	$(".map").tooltip({
		bodyHandler: function () {
			return tooltip;
		},
		track: true,
		delay: 0,
		showURL: false,
		showBody: " - ",
		fade: 250,
		extraClass: "tooltip"
	});
});