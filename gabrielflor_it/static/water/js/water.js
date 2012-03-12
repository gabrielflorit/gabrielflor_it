var data = ['one', 'two', 'three', 'four'];

var width = 500;
var height = 500;

var svg = d3.select('#tree')
	.append('svg')
	.style('width', width)
	.style('height', height);

var circles = svg.selectAll('circle')
	.data(data)
	.enter()
	.append('circle');

circles
	.attr('cx', function (d, i) {
		return (i * 50) + 10;
	})
	.attr('cy', 10)
	.attr('r', function (d) {
		return d.length;
	})
	.style('fill', 'red');


