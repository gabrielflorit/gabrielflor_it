jQuery(document).ready(function ($) {

	$.ajax({
            url: 'http://open.mapquestapi.com/nominatim/v1/search?format=json&json_callback=callback&countrycodes=us&limit=1&q=iowa',
            type: 'jsonp',
            jsonpCallback: 'tryThis',
            error: function(a, b, c) {
            	alert('n');
            },
            success: function(value) {
				alert('y');
            }
        });

	var pumas = [];
	var stateNames;

	d3.csv('../static/acapuma/data/PUMA-to-Census-Locations.csv', function(csv) {

		d3.csv('../static/acapuma/data/states.csv', function(statesCsv) {

			stateNames = statesCsv;

			pumas = d3.nest()
				.key(function(d) {
					return d.STATE_PUMA;
				})
				.entries(csv);

			var defaultLat = 39;
			var defaultLon = -97;
			var defaultZoom = 4;
			var minZoom = 4;
			var maxZoom = 10;

			var interaction;

			// grab the url zoom level, if there is one - otherwise this returns 0
			var urlZoomLevel = location.hash.substring(1).split('/').map(Number)[0];

			// set the url zoom level to default zoom
			urlZoomLevel = urlZoomLevel > 0 ? urlZoomLevel : defaultZoom;

			// set the current zoom level to the url zoom level
			var currentZoomLevel = urlZoomLevel;

			// construct the initial url
			var url = constructMapUrl(urlZoomLevel);

			wax.tilejson(url, function (tilejson) {

				setZoomLimits(tilejson);

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
							out: hideTooltip/*,
							click: function(feature) {
							}*/
						}
					}
				);

				m.addCallback('zoomed', function() {
				// if we're going from 5 to 6, or from 6 to 5, change base layers
					if (m.coordinate.zoom >= 6 && currentZoomLevel < 6 ||
						m.coordinate.zoom <= 5 && currentZoomLevel > 5) {
						refreshMap(constructMapUrl(m.coordinate.zoom));
						currentZoomLevel = m.coordinate.zoom;
						displayTooltipForCenterOfMap();
					}
				});
			});

			function constructMapUrl(zoomLevel) {
				var baseLayer = zoomLevel > 5 ? 'mapbox.world-borders-dark' : 'mapbox.world-bank-borders-en';
				return 'http://api.tiles.mapbox.com/v3/mapbox.world-blank-light,velir.acapuma,' + baseLayer + '.jsonp';
			}

			function setZoomLimits(tilejson) {
				tilejson.minzoom = minZoom;
				tilejson.maxzoom = maxZoom;
			}

			function refreshMap(url) {
				wax.tilejson(url, function (tilejson) {
					setZoomLimits(tilejson);
					m.setProvider(new wax.mm.connector(tilejson));
					$('.wax-legend .my-legend .title .decade').text($('.decades .selected').attr('rel'));
				});
			}

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

				var thePuma = pumas.filter(function(element, index, array) {
					var keyState = element.key.split('|||')[0];
					var keyPuma = element.key.split('|||')[1];
					return (keyState == Number(acapuma.state) && keyPuma == Number(acapuma.puma))
				});

				if (thePuma && thePuma[0]) {
					var parts = thePuma[0].values.map(function(element, index, array) {
						return element.CONTAINS;
					});
					$('#tooltip .places').text(parts.join(', '));
				} else {
					$('#tooltip .places').text('');
				}

				$('#tooltip .explanation .state').text(stateNames.filter(function(element, index, array) {
					return Number(element.code) == Number(acapuma.state);
				})[0].name);
				$('#tooltip .numberAndPeople .number').text(acapuma.data + '%');
				$('#tooltip').css('visibility', 'visible');

				// hide loading message
				$('#panelOne .loading').hide();
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
				if (input.val() === inputTitle) {c
					input.val('');
				}
			});

			$('form.searchLocation').submit(function (e) {
				e.preventDefault();

				geocode(input.val(), currentZoomLevel > 5 ? displayTooltipForCenterOfMap : null);
			});

			function displayTooltipForCenterOfMap() {
					var domMap = $('#map');

					var x = domMap.offset().left + Math.floor(domMap.width()/2);
					var y = domMap.offset().top + Math.floor(domMap.height()/2);

					var pos = {x: x, y: y};

					setTimeout(function() {
						interaction.getCenterFeature(pos, function(feature) {
							displayTooltip(feature);
						});
					}, 500);
			}

			function geocode(query, tooltipCallback) {

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
						$('#panelOne .loading').hide();
					} else {
						$('#panelOne .error').hide();
						$('#panelOne .loading').show();
						easey.slow(m, {
							location: new mm.Location(value.lat, value.lon),
							zoom: (value.type == 'state') ? 7 : 9,
							time: 2000,
							callback: tooltipCallback
						});
					}
				});
			}
		});
	});
});