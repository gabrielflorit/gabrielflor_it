jQuery(document).ready(function ($) {

	var acapuma = {};

	var url = 'http://api.tiles.mapbox.com/v3/mapbox.world-blank-bright,velir.aca_puma,mapbox.world-bank-borders-en.jsonp';
	var defaultLat = 39;
	var defaultLon = -98;
	var defaultZoom = 4;
	var minZoom = 4;
	var maxZoom = 9;

	wax.tilejson(url, function (tilejson) {

		mm = com.modestmaps;
		m = new mm.Map('map', new wax.mm.connector(tilejson),
			null,
			[
				new mm.MouseHandler(),
				new mm.TouchHandler()
			]
		);
		m.setCenterZoom(new mm.Location(defaultLat, defaultLon), defaultZoom);
		wax.mm.hash(m, tilejson, {
			defaultCenter: new mm.Location(defaultLat, defaultLon),
			defaultZoom: defaultZoom,
			manager: wax.mm.locationHash
		});
		interaction = wax.mm.interaction(m, tilejson, 
			{
				callbacks: {
					over: function(feature) {
						// acapuma.state = feature.split(',')[0];
						// acapuma.puma = feature.split(',')[1];
						// acapuma.data = feature.split(',')[2];
						// drawPopup(feature);
					},
					out: function() {
						// clearPopup();
					},
					click: function(feature) {
					}
				}
			}
		);

	});

// function clearTooltip() {
// 	$('.wax-tooltip', $('#map')).remove();
// }

// function drawTooltip(feature) {

// 	clearPopup();

// 	var tooltip = $('<div class="tooltip"/>');

// 	// // find this county
// 	// var county = companiesPerYear.filter(function(value, index, array) {
// 	// return value.fips == currentFIPS;
// 	// })[0];

// 	// var thisDecade = $('.decades .selected').attr('rel');

// 	// var innerHTML = '';
// 	// innerHTML += "<div class='title'>" + county.name + ' ' + county.type + ', ' + county.state + "</div>";
// 	// innerHTML += "<div class='numberAndLegend" + (county.companiesPerYear.length > 0 ? '' : ' noData' ) + "'>";
// 	// innerHTML += "  <div class='number'>" + d3.format('.1f')(Number(county[thisDecade])) + "</div>";
// 	// innerHTML += "  <div class='legend'>companies per 100,000 people (in " + thisDecade + ")</div>";
// 	// innerHTML += "</div>";
// 	// if (county.companiesPerYear.length == 0) {
// 	// innerHTML += "<div class='noCompanies'>no companies</div>";
// 	// }
// 	// innerHTML += "<div id='chart'" + (county.companiesPerYear.length > 0 ? '' : "class='noData'" ) + ">";
// 	// innerHTML += "</div>";

// 	tooltip.innerHTML = feature;
// 	$('#map')[0].appendChild(tooltip);

// 	// addChart(county);
// }


});