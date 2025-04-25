import colors from "../tailwindColors";

/**
 * https://microsoft.github.io/monaco-editor/monarch.html
 * https://github.com/microsoft/vscode/blob/main/src/vs/editor/standalone/common/themes.ts
 * https://github.com/microsoft/vscode/blob/main/src/vs/platform/theme/common/colorRegistry.ts
 */
export default {
	base: "vs-dark",
	inherit: true,
	rules: [
		{
			token: "method",
			foreground: colors.blue[300],
		},
		{
			token: "number",
			foreground: colors.blue[300],
		},
		{
			token: "comment",
			foreground: colors.zinc[500],
		},
		{
			token: "type",
			foreground: colors.blue[300],
		},
		{
			token: "constant",
			foreground: colors.purple[300],
		},
		{
			token: "keyword",
			foreground: colors.yellow[300],
		},
		{
			token: "string",
			foreground: colors.orange[300],
		},
		{
			token: "regexp",
			foreground: colors.orange[300],
		},
		{
			token: "operator",
			foreground: colors.yellow[300],
		},
	],
	colors: {
		"editor.background": colors.zinc[900],
		"editor.foreground": colors.zinc[50],
		"editorLineNumber.foreground": colors.zinc[400],
		"editorLineNumber.activeForeground": colors.zinc[50],
		"editor.selectionBackground": colors.zinc[700],
		"editor.selectionHighlightBackground": colors.zinc[800],
		"editorSuggestWidget.background": colors.zinc[800],
		"editorSuggestWidget.border": colors.zinc[700],
		"editorSuggestWidget.foreground": colors.zinc[50],
		"editorSuggestWidget.highlightForeground": colors.zinc[50],
		"editorSuggestWidget.selectedBackground": colors.zinc[700],
		"editorHoverWidget.background": colors.zinc[800],
		"editorHoverWidget.border": colors.zinc[700],
		"editorHoverWidget.foreground": colors.zinc[50],
		"editorHoverWidget.highlightForeground": colors.zinc[50],
		"editor.lineHighlightBackground": colors.zinc[800],
		"editorBracketMatch.background": colors.zinc[700],
		"editorBracketMatch.border": colors.zinc[700],
		"editorCursor.foreground": colors.purple[300],
		"editor.findMatchBackground": colors.purple[900],
		"editor.findMatchHighlightBackground": colors.purple[900],
		"editor.findRangeHighlightBackground": colors.purple[900],
		"editor.inactiveSelectionBackground": colors.zinc[700],
		"editor.selectionHighlightBorder": colors.zinc[700],
		"editor.wordHighlightBackground": colors.zinc[700],
		"editor.wordHighlightStrongBackground": colors.zinc[700],
		"editorGroupHeader.tabsBackground": colors.zinc[900],
		"editorGroup.border": colors.zinc[700],
		"tab.activeBackground": colors.zinc[800],
		"tab.activeForeground": colors.zinc[50],
		"tab.inactiveBackground": colors.zinc[900],
		"tab.inactiveForeground": colors.zinc[400],
		"tab.border": colors.zinc[700],
	},
};
