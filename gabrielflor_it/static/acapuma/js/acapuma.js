jQuery(document).ready(function ($) {

	var acapuma = {};

	var url = 'http://api.tiles.mapbox.com/v3/mapbox.world-blank-light,velir.acapuma,mapbox.world-bank-borders-en.jsonp';
	var defaultLat = 39;
	var defaultLon = -110;
	var defaultZoom = 4;
	// var minZoom = 4;
	// var maxZoom = 11;

	var chart;
	var iMax = 20;
	var jMax = 5;

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

						acapuma.state = feature.split(',')[0];
						acapuma.puma = feature.split(',')[1];
						acapuma.data = Number(feature.split(',')[2]);

						var totalAmount = acapuma.data;

						var panels = $('#tooltip .numberAndPeople .people .iconAndPanel .panel');
						panels.each(function(index, element) {

							var thisAmount = totalAmount <= 10
								? totalAmount
								: 10;

							totalAmount -= thisAmount;

							$(this).animate({top:(100 - (thisAmount * 10)) + '%'}, 0);
						});

						$('#tooltip .numberAndPeople .number').text(acapuma.data + '%');
						$('#tooltip').css('visibility', 'visible');
					},
					out: function() {
						$('#tooltip').css('visibility', 'hidden');
					},
					click: function(feature) {
					}
				}
			}
		);

	});

});