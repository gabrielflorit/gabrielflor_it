$('#code').on('click', function(e) {
	this.contentEditable = true;
})

$('#code').on('keyup', function(e) {

	$('svg').empty();

	try {
		eval($(this).text());
	}
	catch (error) {}
	finally {};
})

// var data = ['one', 'two', 'three', 'four'];

// var svg = d3.select('#display')
// 	.append('svg')
// 	.style('width', '100%')
// 	.style('height', '99%');

// svg.selectAll('circle')
// 	.data(data)
//   .enter()
// 	.append('circle')
// 	.attr('cx', function (d, i) {
// 		return (i * 50) + 10;
// 	})
// 	.attr('cy', 10)
// 	.attr('r', function (d) {
// 		return d.length;
// 	})
// 	.style('fill', 'red');

// $('a').on('click', function(e) {
// 	e.preventDefault();

// 	var circles = svg.selectAll('circle')
// 		.data(data)
// 	  .transition()
// 	  	.duration(1000)
// 		.attr('cx', function (d, i) {
// 			return (i * 60) + 10;
// 		})
// 		.attr('cy', 10)
// 		.attr('r', function (d) {
// 			return d.length;
// 		});
// });






