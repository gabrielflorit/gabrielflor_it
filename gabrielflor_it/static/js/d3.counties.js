var data, svg, states, scale, minValue, maxValue, legend, legendGradient, legendTicks, map, chosenBreaks, continuousScale;
var legendGradientWidth = 30;
var legendGradientHeight = 200;
var years = [];
var currentYearIndex = 0;
var tooltip = '';
var allValues = [];
var noData = 'rgb(255,255,255)';
var hue = 230;
var breaks = 4;
var classifications = ['interval', 'quantile', 'k-means', 'continuous'];
var classificationIndex = 0;

function createBreaks() {

	chosenBreaks = [];

	switch (classifications[classificationIndex])
	{
		case 'interval':
			var equalIntervalsScale = d3.scale.linear()
				.domain([0, breaks])
				.range([minValue, maxValue]);

			for (var i = 0; i <= breaks; i++) {
				chosenBreaks.push(equalIntervalsScale(i));
			}
		break;

		case 'quantile':
			for (var i = 0; i <= breaks; i++) {
				chosenBreaks.push(d3.quantile(allValues, i/breaks));
			}
		break;

		case 'k-means':
			var kData = d3.zip(allValues);
			var kScale = science.stats.kmeans().k(breaks)(kData);

			var kClusters = {};
			for (var i = 0; i < breaks; i++) {
				kClusters[i] = [];
			}

			for (var i = 0; i < allValues.length; i++) {
				var assignment = kScale.assignments[i];
				kClusters[assignment].push(allValues[i]);
			}

			var tempKMeansBreaks = [];

			for (var i = 0; i < breaks; i++) {
				tempKMeansBreaks.push(kClusters[i][0]);
				tempKMeansBreaks.push(kClusters[i][kClusters[i].length - 1]);
			}

			tempKMeansBreaks = tempKMeansBreaks.sort(sortNumber);

			chosenBreaks.push(tempKMeansBreaks[0]);
			for (var i = 1; i < tempKMeansBreaks.length; i = i + 2) {
				chosenBreaks.push(tempKMeansBreaks[i]);
			}
		break;

		default:
		break;
	}
}

function displayCurrentSettings() {

	$('#controls-classification .current').text(classifications[classificationIndex]);
	$('#controls-year .current').text(years[currentYearIndex]);

	if (classifications[classificationIndex] == 'continuous') {
		$('#controls-breaks .current').text('n/a');
	} else {
		$('#controls-breaks .current').text(breaks);
	}

	$('#controls-hue .current').text(hue);
}

function sortNumber(a, b) {
	return a - b;
}

function getFips(d) {

	return d.properties.GEO_ID.substring(9, 14);
}

function drawTitleAndMisc() {

	svg.append('svg:text')
		.attr('class', 'title')
		.attr('transform', 'translate(515, 22)')
		.text('Poverty estimates by county, ' + years[0] + '-' + years[years.length - 1]);

	svg.append('svg:text')
		.attr('class', 'year')
		.attr('transform', 'translate(15, 60)')
		.text('');

	svg.append('svg:text')
		.attr('class', 'notes')
		.attr('x', 950)
		.attr('y', 475)
		.attr('text-anchor', 'end')
		.text('By: GABRIEL FLORIT');

	svg.append('svg:text')
		.attr('class', 'notes')
		.attr('x', 950)
		.attr('y', 490)
		.attr('text-anchor', 'end')
		.text('Source: Small Area Income & Poverty Estimates, U.S. Census Bureau');
}

function drawLegend() {

	switch (classifications[classificationIndex])
	{
		case 'interval':
		case 'continuous':
		case 'k-means':
			legend.append('svg:text')
				.attr('class', 'legend-title')
				.attr('x', -25)
				.attr('y', -20)
				.text('percent');
		break;

		case 'quantile':
			legend.append('svg:text')
				.attr('class', 'legend-title')
				.attr('x', -28)
				.attr('y', -20)
				.text('quantile');
		break;

		default:
		break;
	}

	var heightByBreaks = legendGradientHeight/breaks;

	// create the color gradient
	switch (classifications[classificationIndex])
	{
		case 'interval':
		case 'quantile':
		case 'k-means':
			legendGradient.selectAll('rect')
				.data(d3.range(0, breaks, 1))
				.enter()
				.insert('svg:rect')
				.attr('x', 1)
				.attr('y', function (d, i) {
					return i * heightByBreaks;
				})
				.attr('width', legendGradientWidth)
				.attr('height', heightByBreaks)
				.attr('fill', function (d, i) {
					return d3.hsl('hsl(' + hue + ', 100%, ' + (i * (100/breaks)) + '%)').toString();
				});
			break;

		case 'continuous':
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

		default:
		break;
	}

	// add the ticks
	switch (classifications[classificationIndex])
	{
		case 'interval':
			legendTicks.selectAll('text')
				.data(d3.range(breaks, -1, -1))
				.enter()
				.insert('svg:text')
				.attr('class', 'legend-tick')
				.attr('text-anchor', 'end')
				.attr('x', -4)
				.attr('y', function (d, i) {
					return i * heightByBreaks + 5;
				})
				.text(function(d, i) {
					return d3.format('.0f')(chosenBreaks[d]) + '%';
				});
		break;

		case 'quantile':
			legendTicks.selectAll('text')
				.data(d3.range(breaks, 0, -1))
				.enter()
				.insert('svg:text')
				.attr('class', 'legend-tick')
				.attr('text-anchor', 'end')
				.attr('x', -4)
				.attr('y', function (d, i) {
					return i * heightByBreaks + 5 + (legendGradientHeight/(breaks*2));
				})
				.text(String);
		break;

		case 'continuous':
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

		case 'k-means':
			legendTicks.selectAll('text')
				.data(d3.range(breaks, -1, -1))
				.enter()
				.insert('svg:text')
				.attr('class', 'legend-tick')
				.attr('text-anchor', 'end')
				.attr('x', -4)
				.attr('y', function (d, i) {
					return i * heightByBreaks + 5;
				})
				.text(function(d, i) {
					return d3.format('.0f')(chosenBreaks[d]) + '%';
				});
		break;

		default:
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

	for (var i = 1; i <= breaks; i++) {

		var color = '';

		switch (classifications[classificationIndex])
		{
			case 'interval':
				if (data <= chosenBreaks[i]) {
					color = d3.hsl('hsl(' + hue + ', 100%, ' + (100 - i * 100/breaks) + '%)').toString();
				}
			break;

			case 'quantile':
				if (data <= chosenBreaks[i]) {
					color = d3.hsl('hsl(' + hue + ', 100%, ' + (100 - i * 100/breaks) + '%)').toString();
				}
			break;

			case 'continuous':
				color = d3.hsl('hsl(' + hue + ', 100%, ' + (100 - continuousScale(data)) + '%)').toString();
			break;

			case 'k-means':
				if (data <= chosenBreaks[i]) {
					color = d3.hsl('hsl(' + hue + ', 100%, ' + (100 - i * 100/breaks) + '%)').toString();
				}
			break;

			default:
			break;
		}

		if (color.length > 0) {
			return color;
		}
	}
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

function drawMap() {

	svg.select('.year')
		.text(years[currentYearIndex]);

	map.selectAll('path')
		.style('fill', quantize);

	displayCurrentSettings();
}

var path = d3.geo.path();

svg = d3.select('#chart').append('svg:svg');

legend = svg.append('svg:g').attr('transform', 'translate(904, 240)');
legendGradient = legend.append('svg:g');
legendTicks = legend.append('svg:g');

map = svg.append('svg:g').attr('class', 'map');

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
				tooltip = name + ' County, ' + states[d.properties.STATE] +
					'<br/><span><b>' + years[currentYearIndex] +
					'</b> rate: <b>' + d3.format('.1f')(datum) +
					'%</b></span>';
			} else {
				tooltip = name + ' County, ' + states[d.properties.STATE] +
					': <b>N/A</b>';
			}
		})
		.on('mouseout', function (d) {

			d3.select(this).style('stroke', 'none');
		});

	d3.json('../static/data/saipe_1997_2009.json', function (saipe) {

		// TODO: get the years from the actual data
		years = d3.range(1997, 2010);

		data = saipe;

		// get max and min
		for (var i = 0; i < years.length; i++) {
			var year = data[years[i]];
			for (var datum in year) {
				allValues.push(year[datum]);
			}
		}

		allValues = allValues.sort(sortNumber);

		minValue = d3.min(allValues);
		maxValue = d3.max(allValues);

		continuousScale = d3.scale.linear()
			.domain([minValue, maxValue])
			.range([0, 100]);

		drawTitleAndMisc();

		setTimeout(function() {
			drawMapAndLegend();

			$('#loading').hide();
			$('#controls-classification').show();
			$('#controls-year').show();
			$('#controls-breaks').show();
			$('#controls-hue').show();
		}, 500);
	});
});

function eraseLegend() {

	legend.selectAll('text').remove();
	legendGradient.selectAll('rect').remove();
	legendTicks.selectAll('text').remove();
}

function drawMapAndLegend() {

	createBreaks();

	eraseLegend();
	drawLegend();
	drawMap();
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
			hue++;
			if (hue > 360) {
				hue = 0;
			}
			drawMapAndLegend();
			break;

		// j
		case 74:
			hue--;
			if (hue < 0) {
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