var data; // loaded asynchronously
var years = [];
var currentYearIndex = 0;
var tooltip = '';
var allValues = [];
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
        .attr('fill', 'rgb(255, 255, 255)')
        .on("mouseover", function(d) {
        
/*        	var state = d.properties.NAME;
        	if (data[state][currentYearIndex]) {
	            tooltip = state + ': <b>' + d3.format('.1f')(scale(data[state][currentYearIndex])) + '</b>';
	        }
	        else {
	            tooltip = state + ': <b>N/A</b>';
	        }
*/
        });
});

var title = svg.append('svg:text')
    .attr('class', 'title')
    .attr('transform', 'translate(515, 22)')
    .text('Poverty estimates by county, 2003-2009');
    
var year = svg.append('svg:text')
    .attr('class', 'year')
    .attr('transform', 'translate(15, 60)')
    .text('');
    
function searchDataByYearAndFips(data, year, fips) {

    var datum;
    for (var i = 0; i < data.length; i++ ) {
    
        datum = data[i];
        if (datum.Year == year && datum.Fips == fips) {
            return datum.Data;
        }
    }
}
    
d3.csv('/static/data/saipe_2003_2009.csv', function(csv) {

    // get the years from the csv (will do it later)
    years = d3.range(2003, 2010);

    data = csv;

    // get min and max for legend
    for (var i = 0; i < data.length; i++) {
        
        if (!isNaN(data[i].Data)) {
            allValues.push(eval(data[i].Data));
        }
    }

    var minValue = d3.min(allValues);
    var maxValue = d3.max(allValues);

    scale = d3.scale.linear().domain([minValue, maxValue]).range([0, 100]);

    drawMap(0);






/*    d3.csv(chorovars.csv, function(csv) { 
    
        
        data = {};
        allValues = [];
    
        for (var i = 0; i < popCsv.length; i++) {
    
            var state = popCsv[i];
            var stateData = [];
    
            for (var j = 0; j < years.length; j++) {

                var datum = searchDataByYearAndState(csv, years[j], state['name']);    
                
                if (datum) {
                    var theValue = datum / state[years[j]];
                    stateData.push(theValue);
                    
                    // hiding DC because it's too small, and skews everything else
                    if (state['name'] != 'District of Columbia')
                        allValues.push(theValue);
                }
                else {
                    stateData.push(undefined);
                }
            }
    
            data[state['name']] = stateData;
            
            if (i == popCsv.length - 1) {

                var minValue = d3.min(allValues);
                var maxValue = d3.max(allValues);

                scale = d3.scale.linear().domain([minValue, maxValue]).range([0, 100]);

                drawLegend();
                drawMap(0);
                
                currentYearIndex = 0;

                $('#loading').hide();
                $('#controls-leftright').show();
                $('#controls-updown').show();
                $('#controls-upperbound').show();
                $('#controls-lowerbound').show();
            }
        }
    });*/
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
        .text('Intensity');

    svg.append('svg:text')
        .attr('class', 'legend-tick')
        .attr('transform', 'translate(881, 245)')
        .text('100');

    svg.append('svg:text')
        .attr('class', 'legend-tick')
        .attr('transform', 'translate(895, 443)')
        .text('0');
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
        
        // q
        case 81:
            if (colorMapMax < 100)
                colorMapMax++;
            drawMapAndLegend();
            break;

        // a
        case 65:
            if (colorMapMax > 51)
                colorMapMax--;
            drawMapAndLegend();
            break;

        // o
        case 79:
            if (colorMapMin < 49)
                colorMapMin++;
            drawMapAndLegend();
            break;

        // l
        case 76:
            if (colorMapMin > 1)
                colorMapMin--;
            drawMapAndLegend();
            break;

        // h
        case 72:
            $('#controls-updown').fadeOut();
            hue++;
            if (hue > 360)
                hue = 0;
            drawMapAndLegend();
            break;

        // left
        case 37:
            $('#controls-leftright').fadeOut();
            if (currentYearIndex > 0) 
                currentYearIndex--;
            drawMap(150);
            break;
        
        // right
        case 39:
            $('#controls-leftright').fadeOut();
            if (currentYearIndex < years.length - 1) 
                currentYearIndex++; 
            drawMap(150);
            break;
    }
});

function drawMapAndLegend() {

    eraseLegendColorMap();
    drawLegendColorMap();
    drawMap(0);
}

function drawMap(duration) {

    svg.select('.year').text(years[currentYearIndex]);

    region.selectAll('path')
        .transition()
        .duration(duration)
        .style('fill', quantize);
}

function quantize(d) {

    var fips = d.properties.GEO_ID.substring(9, 14);

    var datum = searchDataByYearAndFips(data, years[currentYearIndex], fips);

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
