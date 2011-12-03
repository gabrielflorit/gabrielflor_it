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
		var sortedValues = allValues.sort(sortNumber);

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
//		.attr('height', 200)
		.attr('height', 140)
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
		.text('percent');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 245)
		.attr('text-anchor', 'end')
		.text('70%');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 264)
//		.attr('y', 443)
		.attr('text-anchor', 'end')
		.text('60%');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 284)
//		.attr('y', 443)
		.attr('text-anchor', 'end')
		.text('50%');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 304)
//		.attr('y', 443)
		.attr('text-anchor', 'end')
		.text('40%');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 324)
//		.attr('y', 443)
		.attr('text-anchor', 'end')
		.text('30%');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 344)
//		.attr('y', 443)
		.attr('text-anchor', 'end')
		.text('20%');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 364)
//		.attr('y', 443)
		.attr('text-anchor', 'end')
		.text('10%');

	svg.append('svg:text')
		.attr('class', 'legend-tick')
		.attr('x', 902)
		.attr('y', 383)
//		.attr('y', 443)
		.attr('text-anchor', 'end')
		.text('0%');
}

function drawLegendColorMap() {

	legend.selectAll('rect')
//		.data(d3.range(0, 100, 1))
		.data(d3.range(70, 0, -1))
		.enter()
		.insert('svg:rect')
		.attr('y', function (d, i) {
			return i * 2;
		})
		.attr('x', 60)
		.attr('width', 30)
		.attr('height', 2)
		.attr('fill', function (d, i) {
			return convertPercentToColor(d);
		});
}

function convertPercentToColor(data) {

/*	.Blues .q0-7{fill:}
.Blues .q1-7{fill:}
.Blues .q2-7{fill:}
.Blues .q3-7{fill:}
.Blues .q4-7{fill:}
.Blues .q5-7{fill:}
.Blues .q6-7{fill:}*/

	if (data < 10)
		return 'rgb(239,243,255)';
	else if (data < 20)
		return 'rgb(198,219,239)';
	else if (data < 30)
		return 'rgb(158,202,225)';
	else if (data < 40)
		return 'rgb(107,174,214)';
	else if (data < 50)
		return 'rgb(66,146,198)';
	else if (data < 60)
		return 'rgb(33,113,181)';
	else if (data < 70)
		return 'rgb(8,69,148)';
	else if (data < 80)
		return 'yellow';
	else if (data < 90)
		return 'orange';
	else if (data < 100)
		return 'red';

	//return d3.hsl('hsl(' + hue + ', 100%, ' + data + '%)').toString();
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