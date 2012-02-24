jQuery(document).ready(function ($) {

	var acapuma = {};

	// var url = 'http://api.tiles.mapbox.com/v3/mapbox.world-black,velir.acapuma.jsonp';
//mapbox.world-borders-dark
//	var url = 'http://api.tiles.mapbox.com/v3/mapbox.world-blank-light,velir.acapuma,mapbox.world-bank-borders-en.jsonp';
	var url = 'http://api.tiles.mapbox.com/v3/mapbox.world-blank-light,velir.acapuma,mapbox.world-borders-dark.jsonp';
	var defaultLat = 39;
	var defaultLon = -98;
	var defaultZoom = 4;
	var minZoom = 4;
	var maxZoom = 11;

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

						var bigNumber = acapuma.data;
						var yesSquares = [];
						var noSquares = [];

						var scatterData = [];
						for (var i = 0; i < iMax; i++) {
							for (var j = 0; j < jMax; j++) {
								if (bigNumber > 0) {
									yesSquares.push([i,j]);
								} else {
									noSquares.push([i,j]);
								}
								bigNumber--;
							}
						}

						$('#tooltip .numberAndChart .number').text(acapuma.data + '%');
						drawChart(yesSquares, noSquares);
						$('#tooltip').show();
					},
					out: function() {
						$('#tooltip').hide();
					},
					click: function(feature) {
					}
				}
			}
		);

	});

	// create basic chart options
	var options = {
		chart: {
			animation: false,
			renderTo: 'chart',
			type: 'scatter',
			height: 90,
			borderWidth: 0,
			margin: [0,0,0,0],
			backgroundColor: '#183966'
		},
		credits: {
			enabled: false
		},
		legend: {
			enabled: false	
		},
		yAxis: {
			gridLineWidth: 0,
			tickInterval: 1,
			min: -1,
			max: jMax,
			title: {
				text: ''
			},
			labels: {
				enabled: false
			}
		},
		xAxis: {
			lineWidth: 0,
			tickWidth: 0,
			min: -1,
			max: iMax,
			labels: {
				enabled: false
			}
		},
		title: {
			text: ''
		},
		series: []
	};

	function drawChart(yesSquares, noSquares) {

		if (chart) {

			chart.series[0].setData(yesSquares, false);
			chart.series[1].setData(noSquares, false);
			chart.redraw();

		} else {

			// create the two series
			var yesSeries = { 
				marker: {
					symbol: 'square',
					fillColor: '#fff',
					radius: 2.5,
					lineColor: '#fff',
					lineWidth: 0.25
				}
			};
			yesSeries.data = yesSquares;

			var noSeries = { 
				marker: {
					symbol: 'square',
					fillColor: '#183966',
					radius: 2.5,
					lineColor: '#fff',
					lineWidth: 0.25
				}
			};
			noSeries.data = noSquares;

			options.series.push(yesSeries);
			options.series.push(noSeries);

			chart = new Highcharts.Chart(options);
		}
	}
});