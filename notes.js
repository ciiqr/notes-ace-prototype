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
            '   x things that I\'ve done already\n' +
            '       details\n' +
            '   - things that I need to do soon\n' +
            '   ? things that I\'ve considered but am not sure about yet\n' +
            '   ~ things that are partially done but likely await some external force before being completed\n' +
            '   ! things that are important\n' +
            '   !! things that are very important\n' +
            '\n' +
            '% sub modes\n' +
            '   :javascript\n' +
            '       $(function() {\n' +
            '           function init_editor(editor) {\n' +
            '               editor.setTheme("ace/theme/monokaiba");\n' +
            '               editor.getSession().setMode("ace/mode/javascript");\n' +
            '\n' +
            '               editor.setOption("showLineNumbers", false);\n' +
            '               editor.setOption("fixedWidthGutter", false);\n' +
            '           }\n' +
            '\n' +
            '           var editor = ace.edit("editor");\n' +
            '           init_editor(editor);\n' +
            '       });\n' +
        //  '   :css\n' +
        //  '\
        // .text-layer {\n\
        //     font: 12px Monaco, "Courier New", monospace;\n\
        //     cursor: text;\n\
        // }\n\
        // \n\
        // .blinker {\n\
        //     animation: blink 1s linear infinite alternate;\n\
        // }\n\
        // \n\
        // @keyframes blink {\n\
        //     0%, 40% {\n\
        //         opacity: 0; /*\n\
        //         */\n\
        //         opacity: 1\n\
        //     }\n\
        // \n\
        //     40.5%, 100% {\n\
        //         opacity: 1\n\
        //     }\n\
        // }\n\
        // \n\
        // @document url(http://c9.io/), url-prefix(http://ace.c9.io/build/),\n\
        //    domain(c9.io), regexp("https:.*") /**/\n\
        // {\n\
        //     /**/\n\
        //     img[title]:before \n\
        //     {\n\
        //         content: attr(title) "\AImage \\\n\
        //             retrieved from"\n\
        //             attr(src); /*\n\
        //             */\n\
        //         white-space: pre;\n\
        //         display: block;\n\
        //         background: url(asdasd); "err\n\
        //     }\n\
        // }\n\
        // \n' +
'\n\
    :c_cpp\n\
        using namespace std;\n\
        \n\
        //\n\
        int main ()\n\
        {\n\
            int a, b=3; /* foobar */\n\
            a = b; // single line comment\\\n\
                continued\n\
            a+=2; // equivalent to a=a+2\n\
            cout << a;\n\
            #if VERBOSE >= 2\n\
                prints("trace message\\n");\n\
            #endif\n\
            return 0;\n\
        }\n\
' +
'\
    :yaml\n\
        invoice: 34843\n\
        date   : 2001-01-23\n\
        bill-to: &id001\n\
            given  : Chris\n\
            family : Dumars\n\
            address:\n\
                lines: |\n\
                    458 Walkman Dr.\n\
                    Suite #292\n\
                city    : Royal Oak\n\
                state   : MI\n\
                postal  : 48046\n\
        ship-to: *id001\n\
        product:\n\
            - sku         : BL394D\n\
              quantity    : 4\n\
              description : Basketball\n\
              price       : 450.00\n\
            - sku         : BL4438H\n\
              quantity    : 1\n\
              description : Super Hoop\n\
              price       : 2392.00\n\
        tax  : 251.42\n\
        total: 4443.52\n\
' +
'\n\
    :c_cpp\n\
        using namespace std;\n\
        \n\
        //\n\
        int main ()\n\
        {\n\
            int a, b=3; /* foobar */\n\
            a = b; // single line comment\\\n\
                continued\n\
            a+=2; // equivalent to a=a+2\n\
            cout << a;\n\
            #if VERBOSE >= 2\n\
                prints("trace message\\n");\n\
            #endif\n\
            return 0;\n\
        }\n\
' +

            '   :php\n' +
            '       <?php\n' +
            '\n' +
            '       function nfact($n) {\n' +
            '           if ($n == 0) {\n' +
            '               return 1;\n' +
            '           }\n' +
            '           else {\n' +
            '               return $n * nfact($n - 1);\n' +
            '           }\n' +
            '       }\n' +
            '\n' +
            '       echo "\\n\\nPlease enter a whole number ... ";\n' +
            '       $num = trim(fgets(STDIN));\n' +
            '\n' +
            '       // ===== PROCESS - Determing the factorial of the input number =====\n' +
            '       $output = "\\n\\nFactorial " . $num . " = " . nfact($num) . "\\n\\n";\n' +
            '       echo $output;\n' +
            '\n' +
            '       ?>\n'
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
