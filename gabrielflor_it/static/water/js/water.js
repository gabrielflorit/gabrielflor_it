var demo = "var data = ['one', 'two', 'three', 'cuatro', 'cinco', 'seis'];\n\n"
+ "d3.select('svg').selectAll('circle')\n"
+ "\t.data(data)\n"
+ "\t.enter()\n"
+ "\t.append('circle')\n"
+ "\t.attr('cx', function(d, i) {\n"
+ "\t\treturn (i * 50) + 40;\n"
+ "\t})\n"
+ "\t.attr('cy', 40)\n"
+ "\t.attr('r', function(d) {\n"
+ "\t\treturn d.length * 5;\n"
+ "\t})\n"
+ "\t.style('stroke', 'maroon')\n"
+ "\t.style('stroke-width', 1)\n"
+ "\t.style('fill', 'tan');";


window.onload = function() {
	window.aceEditor = ace.edit("editor");

	// set the theme
	window.aceEditor.setTheme("ace/theme/twilight");

	// set mode to javascript
	var JavaScriptMode = require("ace/mode/javascript").Mode;
	window.aceEditor.getSession().setMode(new JavaScriptMode());

	// redraw svg when we update our code
	window.aceEditor.getSession().on('change', function() {

		$('svg').empty();

		try {
			eval(window.aceEditor.getSession().getValue());
		}
		catch (error) {}
		finally {};
	});

	// set the demo code
	window.aceEditor.getSession().setValue(demo);

	// work in progress - this is the beginning of token selectors
	window.aceEditor.on("click", function(e) {
		var editor = e.editor;
		var pos = editor.getCursorPosition();
		var token = editor.session.getTokenAt(pos.row, pos.column);
		if (/\bconstant.numeric\b/.test(token.type)) {
			console.log(token.value, 'is a constant.numeric');
		}
	});

	// turn off horizontal scrollbar
	window.aceEditor.renderer.setHScrollBarAlwaysVisible(false);

	// turn off print margin visibility
	window.aceEditor.setShowPrintMargin(false);
};

$('.font-control').on('click', function(e) {
		e.preventDefault();

		// increase/decrease font
		$('#editor').css('font-size', $(this).attr('class').indexOf('decrease') != -1 ? '-=1' : '+=1');
});