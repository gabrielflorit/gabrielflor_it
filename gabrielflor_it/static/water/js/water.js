var demo = "var data = ['one', 'two', 'three'];\n\n"
+ "d3.select('svg').selectAll('circle')\n"
+ "\t.data(data)\n"
+ "\t.enter()\n"
+ "\t.append('circle')\n"
+ "\t.attr('cx', function (d, i) {\n"
+ "\t\treturn (i * 50) + 40;\n"
+ "\t})\n"
+ "\t.attr('cy', 40)\n"
+ "\t.attr('r', function (d) {\n"
+ "\t\treturn d.length * 5;\n"
+ "\t})\n"
+ "\t.style('fill', 'blue');";

window.onload = function() {
	window.aceEditor = ace.edit("code");
	window.aceEditor.setTheme("ace/theme/twilight");
	var JavaScriptMode = require("ace/mode/javascript").Mode;
	window.aceEditor.getSession().setMode(new JavaScriptMode());
	window.aceEditor.getSession().on('change', function (a, b, c, d) {

		$('svg').empty();

		try {
			eval(window.aceEditor.getSession().getValue());
		}
		catch (error) {}
		finally {};
	});
	window.aceEditor.getSession().setValue(demo);
};
