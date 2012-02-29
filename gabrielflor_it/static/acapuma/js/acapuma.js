jQuery(document).ready(function ($) {

	var url = 'http://api.tiles.mapbox.com/v3/mapbox.world-blank-light,velir.acapuma,mapbox.world-bank-borders-en.jsonp';
	var defaultLat = 39;
	var defaultLon = -97;
	var defaultZoom = 4;
	// var minZoom = 4;
	// var maxZoom = 11;

	var chart;
	var iMax = 20;
	var jMax = 5;
	var interaction;
	var theTileJson;

	wax.tilejson(url, function (tilejson) {

		theTileJson = tilejson;

		mm = com.modestmaps;
		m = new mm.Map('map', new wax.mm.connector(tilejson),
			null,
			[
				new mm.MouseHandler(),
				new mm.TouchHandler()
			]
		);

		var ua = navigator.userAgent.toLowerCase(),
			isMobile = ua.indexOf('mobile') != -1;
		if (!isMobile) {
			wax.mm.zoomer(m).appendTo(m.parent);
		}

  		m.setCenterZoom(new mm.Location(defaultLat, defaultLon), defaultZoom);
		wax.mm.hash(m, tilejson, {
			defaultCenter: new mm.Location(defaultLat, defaultLon),
			defaultZoom: defaultZoom,
			manager: wax.mm.locationHash
		});
		interaction = wax.mm.interaction(m, tilejson, 
			{
				callbacks: {
					over: displayTooltip,
					out: hideTooltip,
					click: function(feature) {
					}
				}
			}
		);

	});

	function hideTooltip() {
		$('#tooltip').css('visibility', 'hidden');
	}

	function displayTooltip(feature) {

		var acapuma = {};
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

		$('#tooltip .place').text(feature);
		$('#tooltip .numberAndPeople .number').text(acapuma.data + '%');
		$('#tooltip').css('visibility', 'visible');
	}

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
		geocode(input.val(), function() {
			DoIt();
		});
	});

	$('#kfflogo').on('click', function(e) {
			DoIt();
	});

	

	function DoIt() {
			var domMap = $('#map');

			var x = domMap.offset().left + Math.floor(domMap.width()/2);
			var y = domMap.offset().top + Math.floor(domMap.height()/2);

			var pos = {x: x, y: y};

			var interaction2 = wax.mm.interaction(m, theTileJson);





			interaction2.getCenterFeature(pos, function(feature) {
				displayTooltip(feature);
			});
	}

	function geocode(query, theCallback) {

		var url = 'http://open.mapquestapi.com/nominatim/v1/search';
		var data = {
			format: 'json',
			countrycodes: 'us',
			limit: 1,
			q: query
		}

		$.getJSON(url, data, function(json) {

			var value = json[0];
			hideTooltip();

			if (value === undefined) {
				$('#panelOne .error').show();
			} else {
				$('#panelOne .error').hide();
				easey.slow(m, {
					location: new mm.Location(value.lat, value.lon),
					zoom: (value.type == 'state' || value.type == 'county' || value.type == 'maritime'  || value.type == 'country') ? 9 : 9,
					time: 2000,
					callback: function() {
						setTimeout(theCallback, 0);
					}
				});
			}
		});
	}


});