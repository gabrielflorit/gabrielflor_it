(function() {

var data, svg, minValue, maxValue, legend, legendGradient, legendTicks, map, continuousScale, currentCounty, states;
var spark, sparkx, sparky, sparkline;
var sparkLineWidth = 220;
var sparkLineHeight = 120;
var legendGradientWidth = 30;
var legendGradientHeight = 200;
var extraTranslateRight = 200;
var years = [];
var noData = 'rgb(255,255,255)';
var highlightColor = d3.rgb(198, 42, 42);
highlightColor = d3.rgb('red').darker();

var currentYearIndex = 0;
var hue = 230;

function displayCurrentSettings() {

	$('#controls-year .current').text(years[currentYearIndex]);
}

function sortNumberAscending(a, b) {
	return a - b;
}

function sortKeyValueDescending(a, b) {
	return b.value - a.value;
}

function getFips(d) {
	return d.properties.GEO_ID.substring(9, 14);
}

function getCountyName(d) {

	var county = d.properties.NAME + ' County';
	var state = states[d.properties.STATE];

	return [county,state];
}

function getCountyByFips(fips) {
	
	return map.selectAll('path')[0].filter(function(value, index, array) {
		return getFips(value.__data__) == fips;
	})[0];
}

function drawTitleAndMisc() {

	svg.append('svg:text')
		.attr('class', 'title')
		.attr('transform', 'translate(' + (515 + extraTranslateRight) + ', 25)')
		.text('Poverty estimates by county, ' + years[0] + '-' + years[years.length - 1]);

	svg.append('svg:text')
		.attr('class', 'year')
		.attr('transform', 'translate(15, 50)')
		.text('');

	svg.append('svg:text')
		.attr('class', 'notes')
		.attr('transform', 'translate(' + (950 + extraTranslateRight) + ', 475)')
		.attr('text-anchor', 'end')
		.text('By: GABRIEL FLORIT');

	svg.append('svg:text')
		.attr('class', 'notes')
		.attr('transform', 'translate(' + (950 + extraTranslateRight) + ', 490)')
		.attr('text-anchor', 'end')
		.text('Source: Small Area Income & Poverty Estimates, U.S. Census Bureau');
}

function drawLegend() {

	legend.append('svg:text')
		.attr('class', 'legend-title')
		.attr('x', -25)
		.attr('y', -20)
		.text('percent');

	// create the color gradient
	legendGradient.selectAll('rect')
		.data(d3.range(0, 1, 0.01))
		.enter()
		.insert('svg:rect')
		.attr('x', 1)
		.attr('y', function (d, i) {
			return i * 2;
		})
		.attr('width', legendGradientWidth)
		.attr('height', 2)
		.attr('fill', function (d, i) {
			return d3.hsl(hue, 1, d);
		});

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

function convertPercentToColor(percent) {

	return d3.hsl(hue, 1, 1 - continuousScale(percent));
}

function quantize(d) {

	var fips = getFips(d);

	var datum = data[years[currentYearIndex]][fips];

	return datum ? convertPercentToColor(datum) : noData;
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

legend = svg.append('svg:g').attr('transform', 'translate(' + (904 + extraTranslateRight) + ', 240)');
legendGradient = legend.append('svg:g');
legendTicks = legend.append('svg:g');

map = svg.append('svg:g').attr('class', 'map')
	.attr('transform', 'translate(' + (extraTranslateRight + 50) + ', 0)');
spark = svg.append('svg:g').attr('class', 'spark')
	.attr('transform', 'translate(55, 200)');
var countyName = svg.append('svg:g').attr('class', 'countyName')
	.attr('transform', 'translate(15, 230)');
var topFive = svg.append('svg:g').attr('class', 'topFive')
	.attr('transform', 'translate(15, 300)');
var topFiveInfo = svg.append('svg:g').attr('class', 'topFiveInfo')
	.attr('transform', 'translate(15, 400)');

d3.json('../static/data/states.json', function (json) {

	states = json;
});

function drawSpark() {

	var fips = getFips(currentCounty);
	var name = getCountyName(currentCounty);

	var sparkdata = [];
	for (var i = 0; i < years.length; i++) {
		var datum = data[years[i]][fips];
		sparkdata.push(datum);
	}

	spark.selectAll("path")
		.data([sparkdata])
		.attr("d", sparkline);

	spark.selectAll('circle')
		.data([sparkdata[currentYearIndex]])
		.attr('cx', function(d, i) {
			return sparkx(currentYearIndex);
		})
		.attr('cy', function(d, i) {
			return sparky(d);
		});

	spark.selectAll('text')
		.data([sparkdata[0], sparkdata[sparkdata.length - 1]])
		.attr('y', function(d, i) {
			return sparky(d) + 5;
		})			
		.text(function(d, i) {
			return d3.format('.1f')(d);
		});

	countyName.selectAll('text')
		.data(name)
		.text(function(d, i) {
			return d;
		});
}

function drawTopFive() {

	var topFiveData = d3.entries(data[years[currentYearIndex]])
	.sort(sortKeyValueDescending)
	.slice(0, 5);

	topFive.selectAll('text')
	.data(topFiveData)
	.text(function(d, i) {

		var county = getCountyByFips(d.key);
		return d.value + ', ' + getCountyName(county.__data__);
	});

}

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

			d3.select(this)
				.style('fill', highlightColor);

			currentCounty = d;

			drawSpark();
		})
		.on('mouseout', function (d) {

			d3.select(this)
				.style('fill', convertPercentToColor(data[years[currentYearIndex]][getFips(d)]));
		});

	d3.json('../static/data/saipe.json', function (saipe) {

		for (var year in saipe) {
			years.push(parseInt(year));
		}

		data = saipe;

		// get this year's top 5
		var topFiveData = d3.entries(data[years[currentYearIndex]])
			.sort(sortKeyValueDescending)
			.slice(0, 5);

		// get max and min
		var allYears = [];
		for (var i = 0; i < years.length; i++) {
			var yearValues = data[years[i]];
			allYears.push(d3.values(yearValues));
		}

		var sortedValues = d3.merge(allYears)
			.sort(sortNumberAscending);

		minValue = d3.min(sortedValues);
		maxValue = d3.max(sortedValues);

		continuousScale = d3.scale.linear().domain([minValue, maxValue]).range([0, 1]);
		sparkx = d3.scale.linear().domain([0, years.length]).range([0, sparkLineWidth]);
		sparky = d3.scale.linear().domain([minValue, maxValue]).range([0, -sparkLineHeight]);

		sparkline = d3.svg.line()
			.x(function(d,i) { 
				return sparkx(i); 
			})
			.y(function(d) { 
				return sparky(d); 
			})
			.interpolate('linear');

		currentCounty = getCountyByFips(topFiveData[0].key).__data__;
		var fips = getFips(currentCounty);
		var name = getCountyName(currentCounty);

		var sparkdata = [];
		for (var i = 0; i < years.length; i++) {
			var datum = data[years[i]][fips];
			sparkdata.push(datum);
		}

		topFive.selectAll('text')
			.data(topFiveData)
			.enter()
			.insert('svg:text')
			.attr('y', function(d, i) {
				return i * 20;
			})
			.text(function(d, i) {

				var county = getCountyByFips(d.key);
				return d.value + ', ' + getCountyName(county.__data__);
			})
			.on('mouseover', function (d) {

				var county = getCountyByFips(d.key);
				d3.select(county)
					.style('fill', highlightColor);
				currentCounty = county.__data__;
				drawSpark();
			})
			.on('mouseout', function (d) {

				var county = getCountyByFips(d.key);
				d3.select(county)
					.style('fill', convertPercentToColor(d.value));
			});

		spark.append("svg:path").attr("d", sparkline(sparkdata));
		spark.selectAll('text')
			.data([sparkdata[0], sparkdata[sparkdata.length - 1]])
			.enter()
			.insert('svg:text')
			.attr('text-anchor', function(d, i) {
				return i == 0 ? 'end' : 'start';	
			})
			.attr('x', function(d, i) {
				return i * (sparkLineWidth - 22) - 8;
			})
			.attr('y', function(d, i) {
				return sparky(d) + 5;
			})			
			.text(function(d, i) {
				return d3.format('.1f')(d);
			});
		
		spark.selectAll('circle')
			.data([sparkdata[currentYearIndex]])
			.enter()
			.insert('svg:circle')
			.attr('cx', function(d, i) {
				return sparkx(currentYearIndex);
			})
			.attr('cy', function(d, i) {
				return sparky(d);
			})
			.attr('r', 5);

		countyName.selectAll('text')
			.data(name)
			.enter()
			.insert('svg:text')
			.attr('class', function(d, i) {
				return i == 0 ? 'county' : 'state';
			})
			.attr('y', function(d, i) {
				return i * 25;
			})			
			.text(function(d, i) {
				return d;
			});

		drawTitleAndMisc();

		setTimeout(function() {
			drawMapAndLegend();

			$('#controls').show();
			$('#about').show();
			$('#loading').hide();

		}, 500);
	});
});

function eraseLegend() {
	legend.selectAll('text').remove();
	legendGradient.selectAll('rect').remove();
	legendTicks.selectAll('text').remove();
}

function drawMapAndLegend() {
	eraseLegend();
	drawLegend();
	drawMap();
}

function yearLeft() {
	currentYearIndex--;
	if (currentYearIndex < 0) {
		currentYearIndex = years.length - 1;
	}
	drawMap();
	drawSpark();
	drawTopFive();
}

function yearRight() {
	currentYearIndex++;
	if (currentYearIndex > years.length - 1) {
		currentYearIndex = 0;
	}
	drawMap();
	drawSpark();
	drawTopFive();
}

d3.select(window).on("keydown", function () {
	switch (d3.event.keyCode) {

		// left
		case 37:
			yearLeft();
			break;

		// right
		case 39:
			yearRight();
			break;
	}
});

$('#year-left').click(function() {
	yearLeft();
});

$('#year-right').click(function() {
	yearRight();
});

})()