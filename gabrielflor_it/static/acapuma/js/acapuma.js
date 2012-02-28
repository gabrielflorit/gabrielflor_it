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

	// setup the search input
	var input = $('#panelOne input'),
		inputTitle = 'enter your address';
		input.val(inputTitle);

	input.blur(function() {
		if (input.val() === '') {
			input.val(inputTitle);
		}
	}).focus(function() {
		if (input.val() === inputTitle) {
			input.val('');
		}
	});

	$('form.searchLocation').submit(function (e){
		e.preventDefault();
		geocode(input.val());
	});

	function geocode(query) {

		var url = 'http://open.mapquestapi.com/nominatim/v1/search';
		var data = {
			format: 'json',
			countrycodes: 'us',
			limit: 1,
			q: query
		}

		$.getJSON(url, data, function(json) {

			var value = json[0];

			if (value === undefined) {
				$('#panelOne .error').show();
			} else {
				$('#panelOne .error').hide();
				if (value.type == 'state' || value.type == 'county' || value.type == 'maritime'  || value.type == 'country') {
					easey.slow(m, {
						location: new mm.Location(value.lat, value.lon),
						zoom: 7,
						time: 2000
					});
				} else {
					easey.slow(m, {
						location: new mm.Location(value.lat, value.lon),
						zoom: 11,
						time: 2000
					});
				}
			}
		});
	}


});