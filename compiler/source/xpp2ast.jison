%lex
digit                       [0-9]
id                          [a-zA-Z_][a-zA-Z0-9_]*
/*string                        ["][[a-zA-Z]*["]*/
string                        [@]*\"(\\.|[^"])*\"
string2                        \'(\\.|[^'])*\'
hexnumber                    "0x"[0-9a-f]*[u]*
utcdate                        [0-9][0-9][0-9][0-9]"-"[0-9][0-9]"-"[0-9][0-9]"T"[0-9][0-9]":"[0-9][0-9]":"[0-9][0-9]

%options case-insensitive
%options easy_keyword_rules

%%

"//".*                                /* IGNORE */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]   /* IGNORE */


"extends"                   return 'EXTENDS';
"if"                        return 'IF';
"else"                      return 'ELSE';
"for"                       return 'FOR';
"while"                     return 'WHILE';
"do"                        return 'DO';
"case"                      return 'CASE'
"switch"                    return 'SWITCH';
"break"                     return 'BREAK';
"default"                   return 'DEFAULT';
"printNat"                  return 'PRINTNAT';
"readNat"                   return 'READNAT';
"this"                      return 'THIS';
"new"                       return 'NEW';
"null"                      return 'NULL';
"void"                      return 'NATVOID'
"macrolib"                  return 'MACROLIB'
"define"                    return 'DEFINE';
"private"                   return 'METEXPOSUREPRIVATE'
"public"                    return 'METEXPOSUREPUBLIC'
"protected"                 return 'METEXPOSUREPROTECTED'
"static"                    return 'STATIC'
"display"                   return 'DISPLAY';
"edit"                      return 'EDIT';
"throw"                     return 'THROW';
"return"                    return 'RETURN';
"class"                     return 'CLASS';
"mod"                       return 'MOD';
"div"                       return 'DIV';
"client"                    return 'CLIENT'
"server"                    return 'SERVER'
"System"                    return 'SYSTEM'
"str"                       return 'STR'
"try"                       return 'TRY';
"catch"                     return 'CATCH';
"is"                        return 'IS';

"select"                    return 'SELECT';
"firstonly"                 return 'FIRSTONLY'
"from"                      return 'FROM';
"order"                     return 'ORDER'
"by"                        return 'BY'
"asc"                       return 'ASC'
"desc"                      return 'DESC'
"where"                     return 'WHERE'
"exists"                    return 'EXISTS'
"join"                      return 'JOIN'
"next"                      return 'NEXT';
"index"                     return 'INDEX'


{utcdate}                   return 'UTCDATE'
[0-9]+("."[0-9e]+)?\b       return 'NATLITERAL';
{hexnumber}                 return 'HEXNUMBER'
{id}                        return 'ID';
{string}                    return "STRING"
{string2}                   return "STRING2"
"=="                        return 'EQUALITY';
"="                         return 'ASSIGN';
"+="                        return 'PLUSASSIGN';
"-="                        return 'NEGASSIGN';
"+"                         return 'PLUS';
"-"                         return 'MINUS';
"*"                         return 'TIMES';
"/"                         return 'SLASH';
">="                        return 'GREATERTHAN';
"<="                        return 'LESSTHAN';
"!="                        return 'NOTEQUALS';
"&&"                        return 'AND';
"||"                        return 'OR';

"&"                         return 'BITAND';
"|"                         return 'BITOR';
"~"                         return 'UNARY';
"<<"                        return 'BITLEFT';
">>"                        return 'BITRIGHT';

">"                         return 'GREATER';
"<"                         return 'LESS';
"!"                         return 'NOT';
"#"                         return 'SQUARE'
"::"                        return 'DOUBLECOLON'
"."                         return 'DOT';
","                         return 'COMMA';
"{"                         return 'LBRACE';
"}"                         return 'RBRACE';
"("                         return 'LPAREN';
")"                         return 'RPAREN';
"["                         return 'LBRACKET';
"]"                         return 'RBRACKET';
":"                         return 'COLON';
";"                         return 'SEMICOLON';
"\\"                        return 'BACKSLASH';
"?"                         return 'QUESTIONMARK';
\s+                         /* skip whitespace */
"."                         throw 'Illegal character';
<<EOF>>                     return 'ENDOFFILE';



/lex


/* author: Anders Houbak Kristiansen: https://github.com/palantus */

%right ASSIGN
%left OR
%nonassoc EQUALITY GREATER
%left PLUS MINUS
%left TIMES
%right NOT
%left DOT

%%

start
    : pgm ENDOFFILE
        {return $1;}
    ;

pgm
  : mdl
    {$$ = {type: "root", subtype: "method", child: $1};}
  | class
    {$$ = {type: "root", subtype: "class", child: $1};}
  | macrodefs mdl
    {$$ = {type: "root", subtype: "macro-method", macro: $1, method: $2}}
    ;

class
  : METEXPOSUREPUBLIC CLASS id classextends LBRACE el RBRACE
    {$$ = {type: "class", attributes: [], exposure: $1, name: $3, extends: $4, body: $6}}
  | CLASS id classextends LBRACE el RBRACE
    {$$ = {type: "class", attributes: [], name: $2, body: $5}}
  | attributes METEXPOSUREPUBLIC CLASS id classextends LBRACE el RBRACE
    {$$ = {type: "class", attributes: $1, exposure: $2, name: $4, extends: $5, body: $7}}
  | attributes CLASS id classextends LBRACE el RBRACE
    {$$ = {type: "class", attributes: $1, name: $3, body: $6}}
  ;

classextends
  : EXTENDS id
  |
  ;

attributes
  :  LBRACKET id RBRACKET
    {$$ = {type: "attributelist", list: $2}}
  |
  ;

vdl
  : id id ASSIGN e
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2, defval: $4}}
  | id id
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2}}
  | id id COMMA vdllist
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2, more: $4}}
  | t id ASSIGN e
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2, defval: $4}}
  | t id
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2}}
  | t id COMMA vdllist
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2, more: $4}}

  | STR id ASSIGN e
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2, defval: $4}}
  | STR NATLITERAL id ASSIGN e
    {$$ = {type: "variabledeclaration", vartype: $1, name: $3, defval: $5, length: $2}}
  | STR id
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2}}
  | STR NATLITERAL id
    {$$ = {type: "variabledeclaration", vartype: $1, name: $3, length: $2}}
  | STR id COMMA vdllist
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2, more: $4}}
  | STR NATLITERAL id COMMA vdllist
    {$$ = {type: "variabledeclaration", vartype: $1, name: $3, more: $5, length: $2}}

  | SQUARE id
    {$$ = {type: "macro", name: $2}}
  | SQUARE id vdl
    {$$ = [{type: "macro", name: $2}, $3]}
  | SQUARE MACROLIB DOT id
    {$$ = {type: "macro", name: $4}}
  | SQUARE DEFINE DOT id LPAREN e RPAREN
    {$$ = {type: "macrodefine", name: $4, val: $6}}
  | SQUARE DEFINE DOT id LPAREN e RPAREN vdl
    {$$ = [{type: "macrodefine", name: $4, val: $6}, $8]}
  ;

macrodefs
  : SQUARE id macrodefs
    {$$ = [{type: "macro", name: $2}, $3]}
  | SQUARE DEFINE DOT id LPAREN e RPAREN macrodefs
    {$$ = [{type: "macrodefine", name: $4, val: $6}, $8]}
  |
    {$$ = {type: "empty"}}
  ;

vdllist
  : id COMMA vdllist
    {$$ = {type: "variable", name: $1, more: $3}}
  | id ASSIGN e COMMA vdllist
    {$$ = {type: "variable", name: $1, defval: $3, more: $5}}
  | id ASSIGN e
    {$$ = {type: "variable", name: $1, defval: $3}}
  | id
    {$$ = {type: "variable", name: $1}}
  ;


mdl
  : methodmodifiers t methodname LPAREN methodvariables RPAREN LBRACE methodbody RBRACE
    {$$ = {type: "method", attributes: [], isStatic: $1 == 'static', name: $3, parms: $5, body: $8}}
  | attributes methodmodifiers t methodname LPAREN methodvariables RPAREN LBRACE methodbody RBRACE
    {$$ = {type: "method", attributes: $1, isStatic: $2 == 'static', name: $4, parms: $6, body: $9}}
  ;

methodmodifiers
  : SERVER
    {$$ = 'static'}
  | SERVER STATIC
    {$$ = 'static'}
  | SERVER CLIENT STATIC
    {$$ = 'static'}
  | SERVER methodexposure STATIC
    {$$ = 'static'}

  | CLIENT STATIC
    {$$ = 'static'}
  | CLIENT SERVER STATIC
    {$$ = 'static'}

  | STATIC CLIENT
    {$$ = 'static'}
  | STATIC CLIENT SERVER
    {$$ = 'static'}
  | STATIC SERVER
    {$$ = 'static'}
  | STATIC SERVER CLIENT
    {$$ = 'static'}
  | STATIC methodexposure
    {$$ = 'static'}
  | STATIC methodexposure CLIENT SERVER
    {$$ = 'static'}
  | STATIC
    {$$ = 'static'}

  | methodexposure
    {$$ = ''}
  | methodexposure STATIC
    {$$ = 'static'}
  | methodexposure STATIC SERVER
    {$$ = 'static'}
  | methodexposure CLIENT SERVER STATIC
    {$$ = 'static'}
  | methodexposure CLIENT STATIC
    {$$ = 'static'}
  | methodexposure SERVER STATIC
    {$$ = 'static'}
  | methodexposure STATIC CLIENT SERVER
    {$$ = 'static'}

  | methodddisplay
    {$$ = ''}
  | methodexposure methodddisplay
    {$$ = ''}

  |
    {$$ = ''}
  ;

methodname
  : id
    {$$ = $1}
  | FROM
    {$$ = {type: "id", id: 'from'}}
  | EXISTS
    {$$ = {type: "id", id: 'exists'}}
  | NEXT
    {$$ = {type: "id", id: 'next'}}
  | NEW
    {$$ = {type: "id", id: 'new'}}
  | FIRSTONLY
    {$$ = {type: "id", id: 'firstonly'}}
    ;

methodvariables
  : methodvariables COMMA methodvariables
    {$$ = [$1, $3]}
  | id id ASSIGN e
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2, defval: $4}}
  | id id
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2}}
  | t id ASSIGN e
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2, defval: $4}}
  | t id
    {$$ = {type: "variabledeclaration", vartype: $1, name: $2}}
  |
    {$$ = {type: "empty"}}
  ;

methodcallparams
  : e COMMA methodcallparams
    {$$ = [$1, $3]}
  | e
    {$$ = $1}
  |
    {$$ = {type: "empty"}}
  ;

methodexposure
  : METEXPOSUREPRIVATE
    {$$ = ''}
  | METEXPOSUREPUBLIC
    {$$ = ''}
  | METEXPOSUREPROTECTED
    {$$ = ''}
  |
  ;
methodddisplay
  : DISPLAY
    {$$ = ''}
  | EDIT
    {$$ = ''}
  |
  ;

methodbody
  : el
    {$$ = $1}
  ;

selectstatement
  : SELECT selectstatementinner
    {$$ = {type: "select", inner: $2}}
  ;

whileselectstatement
  : WHILE SELECT selectstatementinner LBRACE el RBRACE
    {$$ = {type: "whileselect", inner: $2, body: $5}}
  | WHILE SELECT selectstatementinner e
    {$$ = {type: "whileselect", inner: $2, body: $4}}
  ;

selectstatementinner
  : selectmodifier selectlist FROM id selectindex selectorderby selectwhere
    {$$ = $4}
  | selectmodifier id selectindex selectorderby selectwhere
    {$$ = {modifier: $1, id: $2, index: $3, order: $4, where: $5}}
  | selectlist FROM id selectindex selectorderby selectwhere
    {$$ = $3}
  | id selectindex selectorderby selectwhere
    {$$ = $1}
  | selectstatementinner JOIN selectstatementinner
    {$$ = $1}
  | selectstatementinner EXISTS JOIN selectstatementinner
    {$$ = $1}
  ;

selectlist
  : e COMMA selectlist
    {$$ = $1 + $2}
  | e
    {$$ = $1}
  ;

selectwhere
  : WHERE selectwhereexp
    {$$ = {type: "where", e: $2}}
  |
    {$$ = ''}
  ;

selectwhereexp
  : id DOT id EQUALITY e
    {$$ = {type: "whereexpequals", buffer: $1, field: $3, e: $5}}
  |
  ;

selectindex
  : INDEX id
    {$$ = '.index(' + $2 + ')'}
  |
    {$$ = ''}
  ;

selectmodifier
  : FIRSTONLY
    {$$ = {type: "firstonly"}}
  |
    {$$ = ''}
  ;

selectorderby
  : ORDER BY selectorderbyfields
    {$$ = '.orderby("' + $3 + '")'}
  |
    {$$ = ''}
  ;

selectorderbyfields
  : id sortorder COMMA selectorderbyfields
  | id sortorder
  ;

sortorder
  : ASC
  | DESC
  |
  ;

container
  : LBRACKET containercontent RBRACKET
    {$$ = {type: "container", content: $2}}
  ;

containercontent
  : e COMMA containercontent
    {$$ = [$1, $3]}
  | e
    {$$ = $1}
  |
  ;

ifstatement
  : IF LPAREN e RPAREN statementbody ifstatementelse
    {$$ = {type: "if", condition: $3, body: $5, else: $6}}
  | IF LPAREN e RPAREN statementbody
  {$$ = {type: "if", condition: $3, body: $5}}
  ;

ifstatementelse
  : ELSE IF LPAREN e RPAREN statementbody ifstatementelse
    {$$ = {type: "elseif", condition: $4, body: $6, else: $7}}
  | ELSE statementbody
  {$$ = {type: "else", body: $2}}
  |
    {$$ = ''}
  ;

forstatement
    : FOR LPAREN e SEMICOLON e SEMICOLON e RPAREN statementbody
    {$$ = {type: "for", vardeclaration: $3, condition: $5, counter: $7, body: $9}}
  ;

whilestatement
    : WHILE LPAREN e RPAREN statementbody
    {$$ = {type: "while", condition: $3, body: $5}}
  ;

dowhilestatement
    : DO statementbody WHILE LPAREN e RPAREN
    {$$ = {type: "dowhile", condition: $5, body: $2}}
  ;

switchstatement
  : SWITCH LPAREN e RPAREN LBRACE switchbody RBRACE
    {$$ = {type: "switch", on: $3, body: $6}}
  ;

switchbody
  : CASE switchcaselist COLON el switchbody
    {$$ = [{type: "switchcase", caselist: $2, body: $4}, $5]}
  | DEFAULT COLON el
    {$$ = {type: "switchdefault", body: $3}}
  |
    {$$ = {type: "empty"}}
  ;

switchcaselist
  : e COMMA switchcaselist
    {$$ = [$1, $3]}
  | e
    {$$ = $1}
  | 
    {$$ = {type: "empty"}}
  ;

statementbody
  : LBRACE el RBRACE
    {$$ = $2}
  | e SEMICOLON
    {$$ = $1}
  | ifstatement
    {$$ = $1}
  ;

trycatch
  : TRY statementbody
    {$$ = {type: "try", trybody: $2}}
  | TRY statementbody CATCH statementbody
    {$$ = {type: "try", trybody: $2, catchbody: $4}}
  | TRY statementbody CATCH LPAREN e RPAREN statementbody
    {$$ = {type: "try", trybody: $2, catchcondition: $5, catchbody: $7}}
  ;

t
  : id
  | NATVOID
  | SYSTEM DOT t
  | SYSTEM DOT id DOT t
  | STR NATLITERAL
  | STR
    ;

systemref
  : ID
  | ID DOT systemref
  ;

enumstr
  : id
    {$$ = $1}
  | DO id
    {$$ = $1 + $2} /*TODO: remove*/
  | CLIENT
    {$$ = $1}
  | SERVER
    {$$ = $1}
  | NATVOID
    {$$ = $1}
  | CLASS
    {$$ = $1}
  | DISPLAY
    {$$ = $1}
  | EDIT
    {$$ = $1}
  ;

id
    : ID
    {$$ = {type: "id", id: $1}}
  | SYSTEM DOT systemref
    {$$ = {type: "dotnetsystemcall", ref: $3}}
  | ID LBRACKET e RBRACKET
    {$$ = {type: "arrayref", id: $1, index: $3}}
  | THIS
    {$$ = {type: "literal", val: "this"}}
  | NEXT
    {$$ = {type: "literal", val: "next"}}
    ;

el
  : ifstatement el
    {$$ = [$1, $2]}
  | switchstatement el
    {$$ = [$1, $2]}
  | forstatement el
    {$$ = [$1, $2]}
  | whilestatement el
    {$$ = [$1, $2]}
  | dowhilestatement el
    {$$ = [$1, $2]}
  | selectstatement SEMICOLON el
    {$$ = [$1, $3]}
  | whileselectstatement el
    {$$ = [$1, $2]}
  | trycatch el
    {$$ = [$1, $2]}
  | SQUARE id el
    {$$ = [{type: "macroref", id: $2}, $3]}
  | SQUARE MACROLIB DOT id el
    {$$ = [{type: "macroref", id: $3}, $5]}
  | SQUARE DEFINE DOT id LPAREN e RPAREN el
    {$$ = [{type: "macrodef", id: $4, val: $6}, $8]}
  | id methodname LPAREN methodvariables RPAREN LBRACE methodbody RBRACE el
    {$$ = [{type: "methodinner", name: $2, returns: $1, parms: $4, body: $7}, $9]}
  | NATVOID methodname LPAREN methodvariables RPAREN LBRACE methodbody RBRACE el
    {$$ = [{type: "methodinner", name: $2, returns: $1, parms: $4, body: $7}, $9]}
  | STR methodname LPAREN methodvariables RPAREN LBRACE methodbody RBRACE el
    {$$ = [{type: "methodinner", name: $2, returns: $1, parms: $4, body: $7}, $9]}
  | STR NATLITERAL methodname LPAREN methodvariables RPAREN LBRACE methodbody RBRACE el
    {$$ = [{type: "methodinner", name: $3, returns: $1, strlen: $2, parms: $5, body: $8}, $10]}
  | LBRACE el RBRACE el
    {$$ = [{type: "scope", body: $2}, $4]}
  | e SEMICOLON el
    {$$ = [$1, $3]}
  | SEMICOLON el
    {$$ = $2}
  |
    {$$ = {type: "empty"}}
  ;

literalvalue
  : NATLITERAL
    {$$ = {type: "literal", val: $1}}
  | HEXNUMBER
    {$$ = {type: "literal", val: $1.replace("u", "")}}
  | UTCDATE
    {$$ = {type: "literal", val: 'new Date("' + $1 + '")'}}
  | STRING
    {$$ = {type: "literal", val: $1.substring(0, 1) == "@" ? $1.substring(1) : $1}}
  | STRING2
    {$$ = {type: "literal", val: $1.substring(0, 1) == "@" ? $1.substring(1) : $1}}
  | NULL
    {$$ = {type: "literal", val: "null"}}
  ;

e
  : literalvalue
    {$$ = $1}
  | id
    {$$ = {type: "id", id: $1}}
  | MINUS e
    {$$ = {type: "negative", e: $2}}
  | PLUS e
    {$$ = {type: "positive", e: $2}}
  | NOT e
    {$$ = {type: "negation", e: $2}}
  | UNARY e
    {$$ = {type: "unary", e: $2}}
  | e GREATERTHAN e
    {$$ = {type: "greaterequals", left: $1, right: $3}}
  | e LESSTHAN e
    {$$ = {type: "lessequals", left: $1, right: $3}}
  | e PLUS e
    {$$ = {type: "plus", left: $1, right: $3}}
  | e MINUS e
    {$$ = {type: "minus", left: $1, right: $3}}
  | e TIMES e
    {$$ = {type: "times", left: $1, right: $3}}
  | e SLASH e
    {$$ = {type: "divide", left: $1, right: $3}}
  | e MOD e
    {$$ = {type: "mod", left: $1, right: $3}}
  | e DIV e
    {$$ = {type: "div", left: $1, right: $3}}
  | e EQUALITY e
    {$$ = {type: "equals", left: $1, right: $3}}
  | e NOTEQUALS e
    {$$ = {type: "notequals", left: $1, right: $3}}
  | e GREATER e
    {$$ = {type: "greater", left: $1, right: $3}}
  | e LESS e
    {$$ = {type: "less", left: $1, right: $3}}
  | e BITAND e
    {$$ = {type: "bitand", left: $1, right: $3}}
  | e BITOR e
    {$$ = {type: "bitor", left: $1, right: $3}}
  | e BITLEFT e
    {$$ = {type: "bitleft", left: $1, right: $3}}
  | e BITRIGHT e
    {$$ = {type: "bitright", left: $1, right: $3}}
  | e PLUS PLUS
    {$$ = {type: "plusplus", e: $1}}
  | e MINUS MINUS
    {$$ = {type: "minusminus", e: $1}}
  | e OR e
    {$$ = {type: "or", left: $1, right: $3}}
  | e AND e
    {$$ = {type: "and", left: $1, right: $3}}
  | e DOT id
    {$$ = {type: "memberref", element: $1, ref: $3}}
  | id DOT id
    {$$ = {type: "memberref", element: $1, ref: $3}}
  | NEW id LPAREN methodcallparams RPAREN
    {$$ = {type: "new", id: $2, parameters: $4}}
  | id DOUBLECOLON enumstr
    {$$ = {type: "enumval", enum: $1, val: $3}}
  | id DOUBLECOLON id LPAREN methodcallparams RPAREN
    {$$ = {type: "methodcall", method: $3, isStaticCall: true, element: $1, parameters: $5}}
  | id LPAREN methodcallparams RPAREN
    {$$ = {type: "methodcall", method: $1, parameters: $3}}
  | e DOT id LPAREN methodcallparams RPAREN
    {$$ = {type: "methodcall", element: $1, method: $3, parameters: $5}}
  | container
    {$$ = $1}
  | e QUESTIONMARK e COLON e
    {$$ = {type: "onelineif", condition: $1, trueval: $3, falseval: $5}}
  | LPAREN e RPAREN
    {$$ = {type: "paran", content: $2}}
  | id DOT LPAREN methodcallparams RPAREN
    {$$ = {type: "fieldrefbyid", element: $1, idexpression: $4}}
  | e DOT id LPAREN methodcallparams RPAREN
    {$$ = {type: "methodcall", element: $1, method: $3, parameters: $5}}
  | id DOT id LPAREN methodcallparams RPAREN
    {$$ = {type: "methodcall", element: $1, method: $3, parameters: $5}}
  | LBRACKET e RBRACKET
    {$$ = {type: "container", content: $2}}
  
  | NEW id LPAREN methodcallparams RPAREN
    {$$ = {type: "new", id: $2, parameters: $4}}
  | READNAT LPAREN RPAREN
  | PRINTNAT LPAREN e RPAREN
  | NEXT id
    {$$ = {type: "selectnext", element: $2}}
  | THROW e
    {$$ = {type: "throw", e: $2}}
  | RETURN e
    {$$ = {type: "return", e: $2}}
  | RETURN
    {$$ = {type: "return"}}
  | BREAK
    {$$ = {type: "literal", val: "break"}}
  | id ASSIGN e
    {$$ = {type: "assign", left: $1, right: $3}}
  | container ASSIGN e
    {$$ = {type: "assign", left: $1, right: $3}}
  | id PLUSASSIGN e
    {$$ = {type: "plusassign", left: $1, right: $3}}
  | id NEGASSIGN e
    {$$ = {type: "negassign", left: $1, right: $3}}
  | id DOT id ASSIGN e
    {$$ = {type: "assign", leftelement: $1, left: $3, right: $5}}
  | id DOT LPAREN methodcallparams RPAREN ASSIGN e
    {$$ = {type: "fieldrefbyidassign", element: $1, idexpression: $4, assign: $7}}
  | NATLITERAL BACKSLASH NATLITERAL BACKSLASH NATLITERAL
    {$$ = {type: "literal", val: 'new Date(' + parseInt($5) + ',' + parseInt($3) + ',' + parseInt($1) + ')'}}
  | SQUARE id
    {$$ = {type: "macroref", id: $2}}
  | e PLUS PLUS
    {$$ = {type: "plusplus", e: $1}}
  | e MINUS MINUS
    {$$ = {type: "minusminus", e: $1}}
  | id IS id
    {$$ = {type: "is", e1: $1, e2: $3}}
  | vdl
    {$$= $1}
  ;