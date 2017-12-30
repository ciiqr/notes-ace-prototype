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
			'# welcome to life\n' +
			'% things that I care\n' +
			'	x things that I\'ve done already\n' +
			'		details\n' +
			'	- things that I need to do soon\n' +
			'	? things that I\'ve considered but am not sure about yet\n' +
			'	~ things that are partially done but likely await some external force before being completed\n' +
			'	! things that are important\n' +
			'	!! things that are very important\n' +
			'\n' +
			'% sub modes\n' +
			'	:javascript\n' +
			'		$(function() {\n' +
			'			function init_editor(editor) {\n' +
			'				editor.setTheme("ace/theme/monokaiba");\n' +
			'				editor.getSession().setMode("ace/mode/javascript");\n' +
			'\n' +
			'				editor.setOption("showLineNumbers", false);\n' +
			'				editor.setOption("fixedWidthGutter", false);\n' +
			'			}\n' +
			'\n' +
			'			var editor = ace.edit("editor");\n' +
			'			init_editor(editor);\n' +
			'		});\n' +
			'	:php\n' +
			'		<?php\n' +
			'\n' +
			'		function nfact($n) {\n' +
			'		    if ($n == 0) {\n' +
			'		        return 1;\n' +
			'		    }\n' +
			'		    else {\n' +
			'		        return $n * nfact($n - 1);\n' +
			'		    }\n' +
			'		}\n' +
			'\n' +
			'		echo "\\n\\nPlease enter a whole number ... ";\n' +
			'		$num = trim(fgets(STDIN));\n' +
			'\n' +
			'		// ===== PROCESS - Determing the factorial of the input number =====\n' +
			'		$output = "\\n\\nFactorial " . $num . " = " . nfact($num) . "\\n\\n";\n' +
			'		echo $output;\n' +
			'\n' +
			'		?>\n'
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
			mode: 'ace/mode/note',
			tabSize: 4,
			useSoftTabs: false,
		});
	}

	function set_contents(editor, text, keep_history) {
		editor.setValue(text);
		editor.navigateFileStart();

		if (!keep_history) {
			// prevent undo
			editor.getSession().setUndoManager(new ace.UndoManager())
		}
	}

	function update_line_highlighting(editor) {
		var session = editor.getSession();

		var line = session.getLine(editor.getCursorPosition().row);
		line = line.replace(/^\t+/g, '');
		var shouldHighlight = line.length > 0;

		editor.setHighlightActiveLine(shouldHighlight);
		editor.setHighlightGutterLine(shouldHighlight);
	}

	fresh();

	// docs
	// ace api reference: https://ace.c9.io/#nav=api&api=ace
	// ace options: https://github.com/ajaxorg/ace/wiki/Configuring-Ace
	// ace custom modes: https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode
	// highlighting: https://cloud9-sdk.readme.io/docs/highlighting-rules
});
