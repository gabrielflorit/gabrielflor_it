var data; // loaded asynchronously
var years = [];
var currentYearIndex = 0;
var tooltip = '';
var allValues = [];
var minValue, maxValue;
var scale;
var noData = 'rgb(255,255,255)';

var path = d3.geo.path();

var svg = d3.select('#chart')
    .append('svg:svg');

var region = svg.append('svg:g')
    .attr('class', 'region');
    
d3.json('static/geojson/counties.json', function(json) {

    region.selectAll('path')
        .data(json.features)
        .enter().append('svg:path')
        .attr('d', path)
        .attr('fill', noData);
});

var title = svg.append('svg:text')
    .attr('class', 'title')
    .attr('transform', 'translate(515, 22)')
    .text('Poverty estimates by county, 2003-2009');
    
var year = svg.append('svg:text')
    .attr('class', 'year')
    .attr('transform', 'translate(15, 60)')
    .text('');
    
d3.json('/static/data/saipe_2003_2009.json', function(json) {

    // get the years from the csv (will do it later)
    years = d3.range(2003, 2010);

    data = json;

    // get max and min
    for (var i = 0; i < years.length - 1; i++) {
        var year = data[years[i]];
        for (var datum in year) {
            allValues.push(year[datum]);
        }
    }

    minValue = d3.min(allValues);
    maxValue = d3.max(allValues);

    // need to get min and max from data
    scale = d3.scale.linear().domain([minValue, maxValue]).range([0, 100]);

    drawLegend();
    drawMap();
    
    $('#loading').hide();
    $('#controls-leftright').show();
    $('#controls-updown').show();
    $('#controls-upperbound').hide();
    $('#controls-lowerbound').hide();
});

var hue = 231;

var legend = svg.append('svg:g')
    .attr('width', 200)
    .attr('height', 200)
    .attr('transform', 'translate(845, 240)');

// this is a dumb way of creating a border!
svg.append('svg:rect')
    .attr('y', 240)
    .attr('x', 905)
    .attr('width', 30)
    .attr('height', 200)
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('style', 'shape-rendering: crispEdges');

function eraseLegendColorMap() {

    legend.selectAll('rect')
        .remove();
}

function drawLegend() {

    drawLegendColorMap();

    svg.append('svg:text')
        .attr('class', 'legend-title')
        .attr('transform', 'translate(870, 220)')
        .text('Poverty');

    svg.append('svg:text')
        .attr('class', 'legend-tick')
        .attr('transform', 'translate(865, 245)')
        .text(maxValue + '%');

    svg.append('svg:text')
        .attr('class', 'legend-tick')
        .attr('transform', 'translate(885, 443)')
        .text(minValue + '%');
}

function drawLegendColorMap() {

    legend.selectAll('rect')
        .data(d3.range(0, 100, 1))
        .enter().insert('svg:rect')
        .attr('y', function(d, i) { return i * 2; })
        .attr('x', 60)
        .attr('width', 30)
        .attr('height', 2)
        .attr('fill', function(d, i) { 
            return convertPercentToColor(d);
        });
}

var colorMapMin = 0;
var colorMapMax = 100;

function convertPercentToColor(data) {
    
    // respect color map ranges
    var newData = ((data * (colorMapMax - colorMapMin)) / 100) + colorMapMin;

    return d3.hsl('hsl(' + hue + ', 100%, ' + newData + '%)').toString(); 
}

d3.select(window).on("keydown", function() {

    switch (d3.event.keyCode) {
        
        // h
        case 72:
            $('#controls-updown').fadeOut();
            hue = hue + 5;
            if (hue > 360)
                hue = 0;
            drawMapAndLegend();
            break;

        // left
        case 37:
            $('#controls-leftright').fadeOut();
            if (currentYearIndex > 0) 
                currentYearIndex--;
            drawMap();
            break;
        
        // right
        case 39:
            $('#controls-leftright').fadeOut();
            if (currentYearIndex < years.length - 1) 
                currentYearIndex++; 
            drawMap();
            break;
    }
});

function drawMapAndLegend() {

    eraseLegendColorMap();
    drawLegendColorMap();
    drawMap();
}

function drawMap() {

    svg.select('.year').text(years[currentYearIndex]);

    region.selectAll('path')
        .style('fill', quantize);
}

function quantize(d) {

    var fips = d.properties.GEO_ID.substring(9, 14);

    var datum = data[years[currentYearIndex]][fips];

    if (datum) {
        return convertPercentToColor(100 - scale(datum));
    } else {
        return noData;
    }
}

/*
$(function() {
    $(".states").tooltip({
	    bodyHandler: function() {
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
*/
