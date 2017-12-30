define("ace/mode/note_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var NoteHighlightRules = function() {
	this.$rules = {
		"start": [
			{
				regex: /^\s*#.*/,
				token: 'comment',
			},
			{
				regex: /^\s*x\s+.*/,
				token: 'variable',
			},
			{
				regex: /^\s*(\?|~)\s+.*/,
				token: 'support.function',
			},
			{
				regex: /^\s*%\s+.*/,
				token: 'string',
			},
			{
				regex: /^\s*-\s+.*/,
				token: 'variable.parameter',
			},
			{
				regex: /^\s*!\s+.*/,
				token: 'keyword',
			},
			{
				regex: /^\s*!!\s+.*/,
				token: 'invalid',
			},

			// TODO: sub-languages...
			{
				token: "comment", // TODO: decide if I'd rather this use: (comment/string/punctuation)
				regex: /:\w+[-+\d\s]*$/,
				onMatch: function(val, state, stack, line) {
					var indent = /^\s*/.exec(line)[0];
					if (stack.length < 1) {
						stack.push(this.next);
					} else {
						stack[0] = "mlString";
					}

					if (stack.length < 2) {
						stack.push(indent.length);
					}
					else {
						stack[1] = indent.length;
					}
					return this.token;
				},
				next: "mlString"
			},
		],
		"mlString": [
			{
				token: "indent",
				regex: /^\s*$/
			},
			{
				token: "indent",
				regex: /^\s*/,
				onMatch: function(val, state, stack) {
					var curIndent = stack[1];

					if (curIndent >= val.length) {
						this.next = "start";
						stack.splice(0);
					}
					else {
						this.next = "mlString";
					}
					return this.token;
				},
				next: "mlString"
			},
			{
				token: "punctuation",
				regex: '.+'
			}
		]};
	this.normalizeRules();

};

oop.inherits(NoteHighlightRules, TextHighlightRules);

exports.NoteHighlightRules = NoteHighlightRules;
});

define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;

var MatchingBraceOutdent = function() {};

(function() {

	this.checkOutdent = function(line, input) {
		if (! /^\s+$/.test(line))
			return false;

		return /^\s*\}/.test(input);
	};

	this.autoOutdent = function(doc, row) {
		var line = doc.getLine(row);
		var match = line.match(/^(\s*\})/);

		if (!match) return 0;

		var column = match[1].length;
		var openBracePos = doc.findMatchingBracket({row: row, column: column});

		if (!openBracePos || openBracePos.row == row) return 0;

		var indent = this.$getIndent(doc.getLine(openBracePos.row));
		doc.replace(new Range(row, 0, row, column-1), indent);
	};

	this.$getIndent = function(line) {
		return line.match(/^\s*/)[0];
	};

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var BaseFoldMode = require("./fold_mode").FoldMode;
var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, BaseFoldMode);

(function() {

	this.getFoldWidgetRange = function(session, foldStyle, row) {
		var range = this.indentationBlock(session, row);
		if (range)
			return range;

		var re = /\S/;
		var line = session.getLine(row);
		var startLevel = line.search(re);
		if (startLevel == -1 || line[startLevel] != "#")
			return;

		var startColumn = line.length;
		var maxRow = session.getLength();
		var startRow = row;
		var endRow = row;

		while (++row < maxRow) {
			line = session.getLine(row);
			var level = line.search(re);

			if (level == -1)
				continue;

			if (line[level] != "#")
				break;

			endRow = row;
		}

		if (endRow > startRow) {
			var endColumn = session.getLine(endRow).length;
			return new Range(startRow, startColumn, endRow, endColumn);
		}
	};
	this.getFoldWidget = function(session, foldStyle, row) {
		var line = session.getLine(row);
		var indent = line.search(/\S/);
		var next = session.getLine(row + 1);
		var prev = session.getLine(row - 1);
		var prevIndent = prev.search(/\S/);
		var nextIndent = next.search(/\S/);

		if (indent == -1) {
			session.foldWidgets[row - 1] = prevIndent!= -1 && prevIndent < nextIndent ? "start" : "";
			return "";
		}
		if (prevIndent == -1) {
			if (indent == nextIndent && line[indent] == "#" && next[indent] == "#") {
				session.foldWidgets[row - 1] = "";
				session.foldWidgets[row + 1] = "";
				return "start";
			}
		} else if (prevIndent == indent && line[indent] == "#" && prev[indent] == "#") {
			if (session.getLine(row - 2).search(/\S/) == -1) {
				session.foldWidgets[row - 1] = "start";
				session.foldWidgets[row + 1] = "";
				return "";
			}
		}

		if (prevIndent!= -1 && prevIndent < indent)
			session.foldWidgets[row - 1] = "start";
		else
			session.foldWidgets[row - 1] = "";

		if (indent < nextIndent)
			return "start";
		else
			return "";
	};

}).call(FoldMode.prototype);

});

define("ace/mode/note",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/note_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/folding/coffee"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var NoteHighlightRules = require("./note_highlight_rules").NoteHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var FoldMode = require("./folding/coffee").FoldMode;

var Mode = function() {
	this.HighlightRules = NoteHighlightRules;
	this.$outdent = new MatchingBraceOutdent();
	this.foldingRules = new FoldMode();
	this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

	this.lineCommentStart = "#";

	this.getNextLineIndent = function(state, line, tab) {
		var indent = this.$getIndent(line);

		if (state == "start") {
			var match = line.match(/^.*[\{\(\[]\s*$/);
			if (match) {
				indent += tab;
			}
		}

		return indent;
	};

	this.checkOutdent = function(state, line, input) {
		return this.$outdent.checkOutdent(line, input);
	};

	this.autoOutdent = function(state, doc, row) {
		this.$outdent.autoOutdent(doc, row);
	};


	this.$id = "ace/mode/note";
}).call(Mode.prototype);

exports.Mode = Mode;

});
