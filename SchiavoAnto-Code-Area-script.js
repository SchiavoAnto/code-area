// From https://github.com/lrsjng/lolight and modified.
// The license file is included, taken from https://github.com/lrsjng/lolight/blob/73e5ef35a71f86f5f1c5146d5b0823eb0fc64547/README.md
let sa__editorContainer = null;
let sa__editorLineNumbers = null;
let sa__editor = null;
let sa__editorCode = null;
let sa__hasLineNumbers = true;

const COMMENT = 'com'; // Comments
const KEYWORD = 'key'; // Keyword
const IDENTIFIER = 'nam'; // Identifier (variable, name)
const NUMBER = 'num'; // Number
const PARENTHESIS = 'pct'; // Parenthesis, brackets, curly braces
const REGEX = 'rex'; // Regex
const FUNCALL = 'funcall'; // Function call
const SPACE = 'spc'; // Space
const NEWLINE = 'nln'; // Newline
const STRING = 'str'; // String
const UNKNOWN = 'unk'; // Unknown

TOKEN_RES = [
    [NUMBER, /#([0-9a-f]{6}|[0-9a-f]{3})\b/],
    [COMMENT, /(\/\/|#).*?(?=\n|$)/],
    [COMMENT, /\/\*[\s\S]*?\*\//],
    [COMMENT, /<!--[\s\S]*?-->/],
    [REGEX, /\/(\\\/|[^\n])*?\//],
    [STRING, /(['"`])(\\\1|[\s\S])*?\1/],
    [NUMBER, /[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?/],
    [FUNCALL, /([a-zA-Z_]\w*)\s*(?=\()/],
    [PARENTHESIS, /[\\.,:;+\-*\/=<>()[\]{}|?!&@~]/],
    [SPACE, /\s+/],
    [IDENTIFIER, /[\w$]+/],
    [UNKNOWN, /./]
];

function highlight(debug = false) {
    sa__editorCode.innerHTML = "";
    let tokens = tokenize(sa__editor.value);
    tokens.forEach((tokenArr) => {
        const token = tokenArr[1];
        let className = "";
        switch (tokenArr[0]) {
            case COMMENT:
                className = "code-comment";
                break;
            case KEYWORD:
                className = "code-keyword";
                break;
            case IDENTIFIER:
                className = "code-identifier";
                break;
            case NUMBER:
                className = "code-number";
                break;
            case PARENTHESIS:
                className = "code-brackets";
                break;
            case REGEX:
                className = "code-regex";
                break;
            case SPACE:
                className = "code-space";
                break;
            case STRING:
                className = "code-string";
                break;
            case FUNCALL:
                className = "code-function-call";
                break;
            case UNKNOWN:
            default:
                className = "code-unknown";
                break;
        }
        sa__editorCode.innerHTML += `<span class="${className}">${token}</span>`;
    });
    if (debug) {
        console.log(tokens);
    }
}

function highlightAndUpdateLines(debug = false) {
    highlight(debug);
    updateLineNumbers();
}

function tokenize(text) {
    if (typeof text !== 'string') {
        throw new Error('tok: no string');
    }

    let tokens = [];
    let len = TOKEN_RES.length;
    let prefer_div_over_re = false;

    while (text) {
        for (let i = 0; i < len; i += 1) {
            let m = TOKEN_RES[i][1].exec(text);
            if (!m || m.index !== 0) {
                continue;
            }

            let cls = TOKEN_RES[i][0];
            if (cls === REGEX && prefer_div_over_re) {
                continue;
            }

            let tok = m[0];


            if (cls === IDENTIFIER && typeof keywords !== "undefined" && keywords.includes(tok)) {
                cls = KEYWORD;
            }
            if (cls === SPACE) {
                if (tok.indexOf('\n') >= 0) {
                    prefer_div_over_re = false;
                }
            } else {
                prefer_div_over_re = cls === NUMBER || cls === IDENTIFIER;
            }

            text = text.slice(tok.length);
            tokens.push([cls, tok]);
            break;
        }
    }
    tokens.push([NEWLINE, "&nbsp;"]);
    return tokens;
}

function getLineCount() {
    return sa__editor.value.split("\n").length;
}

function updateLineNumbers() {
    if (!sa__hasLineNumbers) return;
    sa__editorLineNumbers.innerHTML = "";
    const lineCount = getLineCount();
    for (let i = 1; i <= lineCount; i++) {
        sa__editorLineNumbers.innerHTML += `
        <span class="sa__editor-line-number">${i}</span>
        `;
    }
}

function createCodeArea(parentCssSelector, defaultContent = "", additionalTextAreaAttributes = "", showLineNumbers = true) {
    sa__hasLineNumbers = showLineNumbers;
    const lineNumbersHtml = showLineNumbers ? `<div id="sa__editor-line-numbers"></div>` : "<div></div>"; // Empty div to keep grid structure

    const area =
    `<div id="sa__editor-container">
        ${lineNumbersHtml}
        <div id="sa__editor-area">
            <textarea id="sa__editor" spellcheck="false" autocapitalize="false" ${additionalTextAreaAttributes}>${defaultContent}</textarea>
            <pre id="sa__editor-code"></pre>
        </div>
    </div>`;

    const parent = document.querySelector(parentCssSelector);
    if (parent === null || parent === undefined) {
        throw new Error("createCodeArea: parent invalid.");
    }

    parent.innerHTML += area;
    sa__editorContainer = document.querySelector("#sa__editor-container");
    if (sa__hasLineNumbers) sa__editorLineNumbers = document.querySelector("#sa__editor-line-numbers");
    sa__editor = document.querySelector("#sa__editor");
    sa__editorCode = document.querySelector("#sa__editor-code");

    if ((sa__editor === null || sa__editor === undefined) || (sa__editorCode === null || sa__editorCode === undefined)) {
        throw new Error("createCodeArea: failed to create sa__editor and/or sa__editorCode.");
    }

    sa__editor.addEventListener('input', (e) => {
        if (typeof sa__onInputBefore === "function") {
            sa__onInputBefore(e);
        }
        highlightAndUpdateLines();
        if (typeof sa__onInputAfter === "function") {
            sa__onInputAfter(e);
        }
    });
    sa__editor.addEventListener('scroll', () => {
        sa__editorCode.scrollTop = sa__editor.scrollTop;
        sa__editorCode.scrollLeft = sa__editor.scrollLeft;
        if (sa__hasLineNumbers) sa__editorLineNumbers.scrollTop = sa__editor.scrollTop;
    });
}