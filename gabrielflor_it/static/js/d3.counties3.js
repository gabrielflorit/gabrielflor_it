var data;
var years = [];
var states;
var currentYearIndex = 0;
var tooltip = '';
var allValues = [];
var minValue, maxValue;
var scale;
var noData = 'rgb(255,255,255)';

var path = d3.geo.path();

var svg = d3.select('#chart').append('svg:svg');

var region = svg.append('svg:g').attr('class', 'region');

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

	region.selectAll('path')
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
		for (var i = years.length - 1; i < years.length; i++) {
			var year = data[years[i]];
			for (var datum in year) {
				allValues.push(year[datum]);
			}
		}

		// create a sorted array
		allValues = allValues.sort(sortNumber);

		minValue = d3.min(allValues);
		maxValue = d3.max(allValues);

		// need to get min and max from data
		scale = d3.scale.linear()
			.domain([minValue, maxValue])
			.range([0, 100]);

		drawCopy();
		setTimeout(function () {
			drawLegend();
			drawLegendBorder();
			drawMap();

			$('#loading').hide();
			$('#controls-leftright').show();
			$('#controls-hue').show();
			$('#controls-upperbound').hide();
			$('#controls-lowerbound').hide();
		}, 500);
	});
});

function sortNumber(a, b) {
	return a - b;
}

var legend = svg.append('svg:g')
	.attr('width', 200)
	.attr('height', 200)
	.attr('transform', 'translate(845, 240)');

function drawCopy() {

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

function drawLegendBorder() {

	// this is a dumb way of creating a border!
	svg.append('svg:rect')
		.attr('y', 240)
		.attr('x', 905)
		.attr('width', 30)
		.attr('height', 200)
		.attr('fill', 'none')
		.attr('stroke', '#ccc')
		.attr('style', 'shape-rendering: crispEdges');
}

var hue = 231;

function eraseLegendColorMap() {

	legend.selectAll('rect').remove();
}

function drawLegend() {

	drawLegendColorMap();

	svg.append('svg:text')
		.attr('class', 'legend-title')
		.attr('transform', 'translate(879, 220)')
		.text('quantile');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 260)
		.attr('text-anchor', 'end')
		.text('8th');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 285)
		.attr('text-anchor', 'end')
		.text('7th');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 310)
		.attr('text-anchor', 'end')
		.text('6th');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 335)
		.attr('text-anchor', 'end')
		.text('5th');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 360)
		.attr('text-anchor', 'end')
		.text('4th');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 385)
		.attr('text-anchor', 'end')
		.text('3rd');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 410)
		.attr('text-anchor', 'end')
		.text('2nd');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 435)
		.attr('text-anchor', 'end')
		.text('1st');
}

function drawLegendColorMap() {

	legend.selectAll('rect')
		.data(d3.range(0, 8, 1))
		.enter()
		.insert('svg:rect')
		.attr('y', function (d, i) {
			return i * 25;
		})
		.attr('x', 60)
		.attr('width', 30)
		.attr('height', 25)
		.attr('fill', function (d, i) {
			return d3.hsl('hsl(' + hue + ', 100%, ' + (d * 12.5) + '%)').toString();
		});
}

function convertPercentToColor(data) {

	if (data <= d3.quantile(allValues, 0.125)) {
		return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - 12.5) + '%)').toString();
	}
	if (data <= d3.quantile(allValues, 0.25)) {
		return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - 25) + '%)').toString();
	}
	else if (data <= d3.quantile(allValues, 0.375)) {
		return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - 37.5) + '%)').toString();
	}
	else if (data <= d3.quantile(allValues, 0.50)) {
		return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - 50) + '%)').toString();
	}
	else if (data <= d3.quantile(allValues, 0.625)) {
		return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - 62.5) + '%)').toString();
	}
	else if (data <= d3.quantile(allValues, 0.75)) {
		return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - 75) + '%)').toString();
	}
	else if (data <= d3.quantile(allValues, 0.875)) {
		return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - 87.5) + '%)').toString();
	}
	else if (data <= d3.quantile(allValues, 1)) {
		return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - 100) + '%)').toString();
	}
}

d3.select(window).on("keydown", function () {

	switch (d3.event.keyCode) {

		// h
	case 72:
		$('#controls-hue').fadeOut();
		hue = hue + 5;
		if (hue > 360) hue = 0;
		drawMapAndLegend();
		break;

		// left
	case 37:
		$('#controls-leftright').fadeOut();
		if (currentYearIndex > 0) {
			currentYearIndex--;
			drawMap();
		}
		break;

		// right
	case 39:
		$('#controls-leftright').fadeOut();
		if (currentYearIndex < years.length - 1) {
			currentYearIndex++;
			drawMap();
		}
		break;
	}
});

function drawMapAndLegend() {

	eraseLegendColorMap();
	drawLegendColorMap();
	drawMap();
}

function drawMap() {

	svg.select('.year')
		.text(years[currentYearIndex]);

	region.selectAll('path')
		.style('fill', quantize);
}

function getFips(d) {

	return d.properties.GEO_ID.substring(9, 14);
}

function quantize(d) {

	var fips = getFips(d);

	var datum = data[years[currentYearIndex]][fips];

	if (datum) {
//		return convertPercentToColor(100 - scale(datum));
		return convertPercentToColor(datum);
	} else {
		return noData;
	}
}

$(function () {
	$(".region").tooltip({
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