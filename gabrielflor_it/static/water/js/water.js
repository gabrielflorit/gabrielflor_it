$(function() {

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
	if (token && /\bconstant.numeric\b/.test(token.type)) {
		console.log(token.value, 'is a constant.numeric');
		console.log([editor.renderer.$cursorLayer.pixelPos.left,editor.renderer.$cursorLayer.pixelPos.top].join(','));

		// position slider centered above the cursor
		var scrollerOffset = $('.ace_scroller').offset();
		var cursorOffset = editor.renderer.$cursorLayer.pixelPos;
		var sliderTop = scrollerOffset.top + cursorOffset.top - Number($('#editor').css('font-size').replace('px', ''))*0.8;
		var sliderLeft = scrollerOffset.left + cursorOffset.left - $('#slider').width()/2;

		// sync the slider size with the editor size
		$('#slider').css('font-size', $('#editor').css('font-size'));
		$('#slider').css('font-size', '-=4');
		$('#slider').offset({top: sliderTop, left: sliderLeft});

		// show the slider
		$('#slider').css('visibility', 'visible');

		// prevent click event from bubbling up to body, which
		// would then trigger an event to hide the slider
		e.stopPropagation();
	}
});

// turn off horizontal scrollbar
window.aceEditor.renderer.setHScrollBarAlwaysVisible(false);

// turn off print margin visibility
window.aceEditor.setShowPrintMargin(false);

// increase/decrease font
// increase/decrease slider
$('.font-control').on('click', function(e) {
	e.preventDefault();

	if ($(this).attr('class').indexOf('decrease') != -1) {
		$('#editor').css('font-size', '-=1');
	} else {
		$('#editor').css('font-size', '+=1');
	}
});

// create slider
$( "#slider" ).slider({
	value: 50,
	min: 0,
	max: 100,
	slide: function(event, ui) {
	}
});

// hide slider if we click anywhere else
$('body').on('focus click', function(e) {
	if ($('#slider').css('visibility') == 'visible') {
		if ($(e.target).closest("#slider").length === 0) { 
			$('#slider').css('visibility', 'hidden'); 
		}; 
	}
});


});
