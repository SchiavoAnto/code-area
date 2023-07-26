const keywords = ["abstract","as","base","bool","break","byte","case","catch","char","checked","class","const","continue","decimal","default","delegate","do","double","else","enum","event","explicit","extern","false","finally","fixed","float","for","foreach","goto","if","implicit","in","int","interface","internal","is","lock","long","namespace","new","null","object","operator","out","override","params","private","protected","public","readonly","ref","return","sbyte","sealed","short","sizeof","stackalloc","static","string","struct","switch","this","throw","true","try","typeof","uint","ulong","unchecked","unsafe","ushort","using","virtual","void","volatile","while"];
TOKEN_RES = [
    [NUMBER, /#([0-9a-f]{6}|[0-9a-f]{3})\b/],
    [COMMENT, /(\/\/|#).*?(?=\n|$)/],
    [COMMENT, /\/\*[\s\S]*?\*\//],
    [REGEX, /\/(\\\/|[^\n])*?\//],
    [STRING, /(['"`])(\\\1|[\s\S])*?\1/],
    [NUMBER, /[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?/],
    [FUNCALL, /([a-zA-Z_]\w*)\s*(?=\()/],
    [PARENTHESIS, /[\\.,:;+\-*\/=<>()[\]{}|?!&@~]/],
    [SPACE, /\s+/],
    [IDENTIFIER, /[\w$]+/],
    [UNKNOWN, /./],
];