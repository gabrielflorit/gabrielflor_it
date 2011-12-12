var data;
var years = [];
var states;
var currentYearIndex = 0;
var tooltip = '';
var allValues = [];
var minValue, maxValue;
var scale;
var noData = 'rgb(255,255,255)';
var hue = 230;
var breaks = 4;
var classifications = ['interval', 'quantile', 'continuous'];
var classificationIndex = 0;

function sortNumber(a, b) {
	return a - b;
}

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
		for (var i = 0; i < years.length; i++) {
			var year = data[years[i]];
			for (var datum in year) {
				allValues.push(year[datum]);
			}
		}

		// create a sorted array
		allValues = allValues.sort(sortNumber);

		minValue = d3.min(allValues);
		maxValue = d3.max(allValues);

		scale = d3.scale.linear()
			.domain([minValue, maxValue])
			.range([0, 100]);

		drawTitleAndMisc();

		setTimeout(function() {
			drawLegend();
			drawMap();

			$('#loading').hide();
			$('#controls-classification').show();
			$('#controls-year').show();
			$('#controls-breaks').show();
			$('#controls-hue').show();
		}, 500);
	});
});

function displayCurrentSettings() {

	$('#controls-classification .current').text(classifications[classificationIndex]);
	$('#controls-year .current').text(years[currentYearIndex]);

	if (classificationIndex == 2) {
		$('#controls-breaks .current').text('n/a');
	} else {
		$('#controls-breaks .current').text(breaks);
	}

	$('#controls-hue .current').text(hue);
}

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

var legend = svg.append('svg:g')
	.attr('transform', 'translate(904, 240)');
var legendGradient = legend.append('svg:g');
var legendTicks = legend.append('svg:g');

function eraseLegend() {

	legend.selectAll('text').remove();
	legendGradient.selectAll('rect').remove();
	legendTicks.selectAll('text').remove();
}

function drawLegend() {

	switch (classificationIndex)
	{
		case 0:
		case 2:
			legend.append('svg:text')
				.attr('class', 'legend-title')
				.attr('x', -25)
				.attr('y', -20)
				.text('percent');
		break;

		case 1:
			legend.append('svg:text')
				.attr('class', 'legend-title')
				.attr('x', -28)
				.attr('y', -20)
				.text('quantile');
		break;
	}

	var legendGradientWidth = 30;
	var legendGradientHeight = 200;

	// create the color gradient
	switch (classificationIndex)
	{
		case 0:
		case 1:
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
			break;

		case 2:
			legendGradient.selectAll('rect')
				.data(d3.range(0, 100, 1))
				.enter()
				.insert('svg:rect')
				.attr('x', 1)
				.attr('y', function (d, i) {
					return i * 2;
				})
				.attr('width', legendGradientWidth)
				.attr('height', 2)
				.attr('fill', function (d, i) {
					return d3.hsl('hsl(' + hue + ', 100%, ' + d + '%)').toString();
				});
			break;
	}

	var ticksScale = d3.scale.linear()
		.domain([0, breaks])
		.range([minValue, maxValue]);

	// add the ticks
	switch (classificationIndex)
	{
		case 0:
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
				.text(function(d, i) {
					return d3.format('.0f')(ticksScale(d)) + '%';
				});
		break;

		case 1:
			legendTicks.selectAll('text')
				.data(d3.range(breaks, 0, -1))
				.enter()
				.insert('svg:text')
				.attr('class', 'legend-tick')
				.attr('text-anchor', 'end')
				.attr('x', -4)
				.attr('y', function (d, i) {
					return i * (legendGradientHeight/breaks) + 5 + (legendGradientHeight/(breaks*2));
				})
				.text(String);
		break;

		case 2:
			legendTicks.selectAll('text')
				.data([maxValue, minValue])
				.enter()
				.insert('svg:text')
				.attr('class', 'legend-tick')
				.attr('text-anchor', 'end')
				.attr('x', -4)
				.attr('y', function (d, i) {
					return i * legendGradientHeight + 5;
				})
				.text(function(d, i) {
					return d3.format('.0f')(d) + '%';
				});
			break;
	}

	// this is a dumb way of creating a border!
	legend.append('svg:rect')
		.attr('y', 0)
		.attr('x', 1)
		.attr('width', legendGradientWidth)
		.attr('height', legendGradientHeight)
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

		switch (classificationIndex)
		{
			case 0:
				if (data <= breaksToData(i))
					return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - i * 100/breaks) + '%)').toString();
			break;

			case 1:
				if (data <= d3.quantile(allValues, i/breaks))
					return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - i * 100/breaks) + '%)').toString();
			break;

			case 2:
				return d3.hsl('hsl(' + hue + ', 100%, ' + (100 - dataToPercent(data)) + '%)').toString();
			break;
		}
	}
}

d3.select(window).on("keydown", function () {

	switch (d3.event.keyCode) {

		// c
		case 67:
			classificationIndex++;
			if (classificationIndex > classifications.length - 1) {
				classificationIndex = 0;
			}
			drawMapAndLegend();
			break;

		// up
		case 38:
			breaks++;
			drawMapAndLegend();
			break;

		// down
		case 40:
			if (breaks > 2) {
				breaks--;
				drawMapAndLegend();
			}
			break;

		// h
		case 72:
			hue = hue + 5;
			if (hue > 360) {
				hue = 0;
			}
			drawMapAndLegend();
			break;

		// left
		case 37:
			if (currentYearIndex > 0) {
				currentYearIndex--;
				drawMap();
			}
			break;

		// right
		case 39:
			if (currentYearIndex < years.length - 1) {
				currentYearIndex++;
				drawMap();
			}
			break;
	}
});

function drawMapAndLegend() {

	eraseLegend();
	drawLegend();
	drawMap();
}

function drawMap() {

	svg.select('.year')
		.text(years[currentYearIndex]);

	map.selectAll('path')
		.style('fill', quantize);

	displayCurrentSettings();
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