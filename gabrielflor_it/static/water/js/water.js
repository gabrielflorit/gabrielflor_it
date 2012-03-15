$(function() {

var demo = "var data = ['one', 'two', 'three', 'cuatro', 'cinco', 'seis'];\n\n"
+ "d3.select('svg').selectAll('circle')\n"
+ "\t.data(data)\n"
+ "\t.enter()\n"
+ "\t.append('circle')\n"
+ "\t.attr('cx', function(d, i) {\n"
+ "\t\treturn (i * 40) + 40;\n"
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
var chosenRow, chosenColumn;
window.aceEditor.on("click", function(e) {

	var editor = e.editor;
	var pos = editor.getCursorPosition();
	var token = editor.session.getTokenAt(pos.row, pos.column);

	// did we click on a number?
	if (token && /\bconstant.numeric\b/.test(token.type)) {

		// position slider centered above the cursor
		var scrollerOffset = $('.ace_scroller').offset();
		var cursorOffset = editor.renderer.$cursorLayer.pixelPos;
		var sliderTop = scrollerOffset.top + cursorOffset.top - Number($('#editor').css('font-size').replace('px', ''))*0.8;
		var sliderLeft = scrollerOffset.left + cursorOffset.left - $('#slider').width()/2;

		// sync the slider size with the editor size
		$('#slider').css('font-size', $('#editor').css('font-size'));
		$('#slider').css('font-size', '-=4');
		$('#slider').offset({top: sliderTop, left: sliderLeft});

		// center slider handle
		$('#slider').slider('option', 'value', 50);

		// show the slider
		$('#slider').css('visibility', 'visible');

		chosenRow = pos.row;
		chosenColumn = token.start;

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

this.replace = function(replacement) {
	var range = this.getSelectionRange();
	if (range !== null) {
		this.$tryReplace(range, replacement);
		if (range !== null) {
			this.selection.setSelectionRange(range);
		}
	}
}

// from https://github.com/ajaxorg/ace/issues/305
// this replaces the current replace functionality
// replace just replaces the current selection with the replacement text,
// and highlights the replacement text
// it does not go to the next selection (which the default version does)
window.aceEditor.replace = function(replacement) {
	var range = this.getSelectionRange();
	if (range !== null) {
		this.$tryReplace(range, replacement);
		if (range !== null)
			this.selection.setSelectionRange(range);
	}
}

// create slider
$( "#slider" ).slider({
	value: 50,
	min: 0,
	max: 100,
	slide: function(event, ui) {

		// set the cursor to desired location
		var cursorPosition = window.aceEditor.getCursorPosition();
		if (!(cursorPosition.row == chosenRow && cursorPosition.column == chosenColumn)) {
			window.aceEditor.getSelection().moveCursorTo(chosenRow, chosenColumn);

			// clear selection
			window.aceEditor.clearSelection();
		}

		// get token
		var token = window.aceEditor.session.getTokenAt(chosenRow, chosenColumn + 1);

		// find and replace
		window.aceEditor.find(String(token.value));
		window.aceEditor.replace(String(ui.value));
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
