document.addEventListener('DOMContentLoaded', function() {
	function fresh() {
		var editor = ace.edit('editor');
		init_editor(editor);

		var session = editor.getSession();
		init_session(session);

		// focus
		editor.focus();

		// TODO: debug only
		set_contents(editor, 
			'$(function() {\n' +
			'	function init_editor(editor) {\n' +
			'		editor.setTheme("ace/theme/monokaiba");\n' +
			'		editor.getSession().setMode("ace/mode/javascript");\n' +
			'\n' +
			'		editor.setOption("showLineNumbers", false);\n' +
			'		editor.setOption("fixedWidthGutter", false);\n' +
			'	}\n' +
			'\n' +
			'	var editor = ace.edit("editor");\n' +
			'	init_editor(editor);\n' +
			'});\n'
		);
	}

	function init_editor(editor) {
		editor.$blockScrolling = Infinity;

		editor.setOptions({
			theme: 'ace/theme/monokaiba',
			fontFamily: '"Roboto Mono", monospace',
			fontSize: '75%',
			cursorStyle: 'slim',
			displayIndentGuides: false,
			showPrintMargin: false,
			showLineNumbers: false,
		});

		// change active line highlighting
		editor.on('changeCursor', function() {
			update_line_highlighting(editor);
		});
		editor.on('changeSelection', function() {
			update_line_highlighting(editor);
		});
	}

	function init_session(session) {
		session.setOptions({
			mode: 'ace/mode/javascript',
			tabSize: 4,
			useSoftTabs: false,
		});
	}

	function set_contents(editor, text) {
		editor.setValue(text);
		editor.navigateFileStart();
	}

	function update_line_highlighting(editor) {
		var session = editor.getSession();

		var line = session.getLine(editor.getCursorPosition().row);
		line = line.replace(/^\t+/g, '');
		var shouldHighlight = line.length > 0;

		editor.setHighlightActiveLine(shouldHighlight);
		// TODO: decide if I like this on at all... let alone have it match the active line
		editor.setHighlightGutterLine(shouldHighlight);
	}

	fresh();

	// docs
	// ace api reference: https://ace.c9.io/#nav=api&api=ace
	// ace options: https://github.com/ajaxorg/ace/wiki/Configuring-Ace
	// ace custom modes: https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode
});
