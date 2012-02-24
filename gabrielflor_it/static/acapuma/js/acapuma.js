jQuery(document).ready(function ($) {

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
	});

});