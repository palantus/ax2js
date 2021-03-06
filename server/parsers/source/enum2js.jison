%lex
digit                       [0-9]
id                          [a-zA-Z_][a-zA-Z0-9_]*
/*string						["][[a-zA-Z]*["]*/
string						[@]*\"(\\.|[^"])*\"	
string2						\'(\\.|[^'])*\'	
hexnumber					"0x"[0-9a-f]*[u]*
utcdate						[0-9][0-9][0-9][0-9]"-"[0-9][0-9]"-"[0-9][0-9]"T"[0-9][0-9]":"[0-9][0-9]":"[0-9][0-9]

%options case-insensitive

%%

"/*"(.|\r|\n)*?"*/"                %{
                                        if (yytext.match(/\r|\n/)) {
                                            parser.newLine = true;
                                        }

                                        if (parser.restricted && parser.newLine) {
                                            this.unput(yytext);
                                            parser.restricted = false;
                                            return ";";
                                        }
                                   %}
"//".*($|\r\n|\r|\n)               %{
                                        if (yytext.match(/\r|\n/)) {
                                            parser.newLine = true;
                                        }

                                        if (parser.restricted && parser.newLine) {
                                            this.unput(yytext);
                                            parser.restricted = false;
                                            return ";";
                                        }
                                   %}


"extends"                   return 'EXTENDS';
"if"                        return 'IF';
"else"                      return 'ELSE';
"for"                       return 'FOR';
"while"						return 'WHILE';
"do"						return 'DO';
"case"						return 'CASE'
"switch"                    return 'SWITCH';
"break"						return 'BREAK';
"default"					return 'DEFAULT';
"printNat"                  return 'PRINTNAT';
"readNat"                   return 'READNAT';
"this"                      return 'THIS';
"new"                       return 'NEW';
"null"                      return 'NUL';
"void"						return 'NATVOID'
"macrolib"					return 'MACROLIB'
"define"					return 'DEFINE';
"private"					return 'METEXPOSUREPRIVATE'
"public"					return 'METEXPOSUREPUBLIC'
"protected"					return 'METEXPOSUREPROTECTED'
"static"					return 'STATIC'
"throw"						return 'THROW';
"return"					return 'RETURN';
"class"						return 'CLASS';
"mod"						return 'MOD';
"div"						return 'DIV';
"client"					return 'CLIENT'
"server"					return 'SERVER'
"System"					return 'SYSTEM'
"str"						return 'STR'
"try"						return 'TRY';
"catch"						return 'CATCH';

"select"					return 'SELECT';
"firstonly"					return 'FIRSTONLY'
"from"						return 'FROM';
"order"						return 'ORDER'
"by"						return 'BY'
"asc"						return 'ASC'
"desc"						return 'DESC'
"where"						return 'WHERE'
"exists"					return 'EXISTS'
"join"						return 'JOIN'
"next"						return 'NEXT';
"index"						return 'INDEX'
	

{utcdate}					return 'UTCDATE'
[0-9]+("."[0-9e]+)?\b       return 'NATLITERAL';
{hexnumber}					return 'HEXNUMBER'
{id}                        return 'ID';
{string}					return "STRING"
{string2}					return "STRING2"
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

"&"                        	return 'BITAND';
"|"                        	return 'BITOR';
"~"                         return 'UNARY';
"<<"						return 'BITLEFT';
">>"						return 'BITRIGHT';

">"                         return 'GREATER';
"<"                         return 'LESS';
"!"                         return 'NOT';
"#"							return 'SQUARE'
"::"						return 'DOUBLECOLON'
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


/* author: Anders Houbak Kristiansen: http://ahkpro.dk */

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
		{return $1;}
	| class
		{return $1;}
	| macrodefs mdl
		{return $2}
    ;

class
	: METEXPOSUREPUBLIC CLASS id classextends LBRACE el RBRACE
		{return 'var __classDeclaration__ = function(){' + $6 + ''}
	| CLASS id classextends LBRACE el RBRACE
		{return 'var __classDeclaration__ = function(){' + $5 + ''}
	;
	
classextends
	: EXTENDS id
	|
	;

vdl
	: id id ASSIGN e
		{$$ = 'var ' + $2.substring(0, $2.indexOf("[")>0 ? $2.indexOf("[") : undefined) + ' = ' + $4}
    | id id
		{$$ = 'var ' + $2.substring(0, $2.indexOf("[")>0 ? $2.indexOf("[") : undefined) + ' = Type_' + $1 + '._new()'}
	| id id COMMA vdllist
		{$$ = 'var ' + $2.substring(0, $2.indexOf("[")>0 ? $2.indexOf("[") : undefined) + ';' + $4}
		
    | t id ASSIGN e
		{$$ = 'var ' + $2.substring(0, $2.indexOf("[")>0 ? $2.indexOf("[") : undefined) + ' = ' + $4}
    | t id
		{$$ = 'var ' + $2.substring(0, $2.indexOf("[")>0 ? $2.indexOf("[") : undefined)}
    | t id COMMA vdllist
		{$$ = 'var ' + $2.substring(0, $2.indexOf("[")>0 ? $2.indexOf("[") : undefined) + '; var ' + $4}
		
    | STR id ASSIGN e
		{$$ = 'var ' + $2.substring(0, $2.indexOf("[")>0 ? $2.indexOf("[") : undefined) + ' = ' + $4}
    | STR NATLITERAL id ASSIGN e
		{$$ = 'var ' + $3.substring(0, $3.indexOf("[")>0 ? $3.indexOf("[") : undefined) + ' = ' + $5}
    | STR id
		{$$ = 'var ' + $2.substring(0, $2.indexOf("[")>0 ? $2.indexOf("[") : undefined)}
    | STR NATLITERAL id
		{$$ = 'var ' + $3.substring(0, $3.indexOf("[")>0 ? $3.indexOf("[") : undefined)}
    | STR id COMMA vdllist
		{$$ = 'var ' + $2 + '; var ' + $4}
    | STR NATLITERAL id COMMA vdllist
		{$$ = 'var ' + $3.substring(0, $3.indexOf("[")>0 ? $3.indexOf("[") : undefined) + '; var ' + $5}
		
	| SQUARE id
		{$$ = 'eval(macros.' + $2 + ')'}
	| SQUARE id vdl
		{$$ = 'eval(macros.' + $2 + ');' + $3}
	| SQUARE MACROLIB DOT id
		{$$ = 'eval(macros.' + $4 + ')'}
	| SQUARE DEFINE DOT id LPAREN e RPAREN
		{$$ = 'macros.' + $4 + ' = ' + $6 + ";"}
	| SQUARE DEFINE DOT id LPAREN e RPAREN vdl
		{$$ = 'macros.' + $4 + ' = ' + $6 + ";" + $8}
	;
	
macrodefs
	: SQUARE id macrodefs
		{$$ = 'eval(macros.' + $2 + ');' + $3}
	| SQUARE DEFINE DOT id LPAREN e RPAREN macrodefs
		{$$ = 'macros.' + $4 + ' = ' + $6 + ";" + $8}
	|
		{$$ = ''}
	;
	
vdllist
	: id COMMA vdllist
		{$$ = $1.substring(0, $1.indexOf("[")>0 ? $1.indexOf("[") : undefined) + '; var ' + $3}
	| id ASSIGN e COMMA vdllist
		{$$ = $1.substring(0, $1.indexOf("[")>0 ? $1.indexOf("[") : undefined) + ' = ' + $3 + '; var ' + $5}
	| id ASSIGN e
		{$$ = $1.substring(0, $1.indexOf("[")>0 ? $1.indexOf("[") : undefined) + ' = ' + $3}
	| id
		{$$ = $1.substring(0, $1.indexOf("[")>0 ? $1.indexOf("[") : undefined)}
	;
	
	
mdl
    : methodmodifiers t methodname LPAREN methodvariables RPAREN LBRACE methodbody RBRACE
		{$$ = ($1 == 'static' 
				? '__static____classDeclaration__.'
				: 'this.'
					) + $3 + ' = function(' + ($5?$5:'') + '){' + $8 + '}'}
    ;
	
methodmodifiers
	: SERVER STATIC
		{$$ = 'static'}
	| SERVER CLIENT STATIC
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
	| methodexposure CLIENT SERVER STATIC
		{$$ = 'static'}
	| methodexposure CLIENT STATIC
		{$$ = 'static'}
	| methodexposure STATIC CLIENT SERVER
		{$$ = 'static'}
	|
		{$$ = ''}
	;
	
methodname
    : id
		{$$ = $1}
	| FROM
		{$$ = 'from'}
	| EXISTS
		{$$ = 'exists'}
	| NEXT
		{$$ = 'next'}
	| NEW
		{$$ = 'new'}
    ;
	
methodvariables
	: methodvariables COMMA methodvariables
		{$$ = $1 + ', ' + $3}
	| t e
		{$$ = $2}
	| 
		{$$ = ''}
	;
	
methodcallparams
	: e COMMA methodcallparams
		{$$ = $1 + ', ' + $3}
	| e
		{$$ = $1 ? $1 : ''}
	| 
		{$$ = ''}
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

methodbody
	: el
		{$$ = $1}
	;
	
selectstatement
	: SELECT selectstatementinner
		{$$ = 'select()' + $2}
	;

whileselectstatement
	: WHILE SELECT selectstatementinner LBRACE el RBRACE
		{$$ = ''}
		/*{$$ = 'while(select()' + $3 + ')' + $5}*/
	;
	
selectstatementinner
	: selectmodifier selectlist FROM id selectindex selectorderby selectwhere
		{$$ = ''}
	| selectmodifier id selectindex selectorderby selectwhere
		{$$ = ''}
	| selectlist FROM id selectindex selectorderby selectwhere
		{$$ = ''}
	| id selectindex selectorderby selectwhere
		{$$ = ''}
	| selectstatementinner JOIN selectstatementinner
		{$$ = ''}
	| selectstatementinner EXISTS JOIN selectstatementinner
		{$$ = ''}
	;
	
selectlist
	: e COMMA selectlist
		{$$ = $1 + $2}
	| e
		{$$ = $1}
	;
	
selectwhere
	: WHERE e
		{$$ = '.where(' + $2 + ')'}
	| 
		{$$ = ''}
	;

selectindex
	: INDEX id
		{$$ = '.index(' + $2 + ')'}
	| 
		{$$ = ''}
	;
	
selectmodifier
	: FIRSTONLY
		{$$ = '.firstonly()'}
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
		{$$ = '[' + $2 + ']'}
	;
	
containercontent
	: e COMMA containercontent
		{$$ = $1 + ',' + $3}
	| e
		{$$ = $1}
	|
	;
	
ifstatement
	: IF LPAREN e RPAREN statementbody ifstatementelse
		{$$ = 'if(' + $3 + ')' + $5 + $6}
	| IF LPAREN e RPAREN statementbody
		{$$ = 'if(' + $3 + ')' + $5}
	;
	
ifstatementelse
	: ELSE IF LPAREN e RPAREN statementbody ifstatementelse
		{$$ = ' else if(' + 4 + ')' + $6 + $7}
	| ELSE statementbody
		{$$ = ' else ' + $2}
	|
		{$$ = ''}
	;
	
forstatement
    : FOR LPAREN e SEMICOLON e SEMICOLON e RPAREN statementbody
		{$$ = 'for(var ' + $3 + '; ' + $5 + '; ' + $7 + ')' + $9}
	;

whilestatement
    : WHILE LPAREN e RPAREN statementbody
		{$$ = 'while(' + $3 + ')' + $5}
	;

dowhilestatement
    : DO statementbody WHILE LPAREN e RPAREN 
		{$$ = 'do ' + $2 + ' while(' + $5 + ')'}
	;
	
switchstatement
	: SWITCH LPAREN e RPAREN LBRACE switchbody RBRACE
		{$$ = 'switch(' + $3 + '){' + $6 + '}'}
	;
	
switchbody
	: CASE switchcaselist COLON el switchbody
		{$$ = 'case ' + $2 + ': ' + $4 + $5}
	| DEFAULT COLON el
		{$$ = 'default: ' + $3}
	|
		{$$ = ''}
	;
	
switchcaselist
	: e COMMA switchcaselist
		{$$ = $1 + ',' + $3}
	| e
		{$$ = $1}
	;
	
statementbody
	: LBRACE el RBRACE
		{$$ = '{' + $2 + '}'}
	| e SEMICOLON
		{$$ = $1 + ';'}
	| ifstatement
		{$$ = $1}
	;

trycatch
	: TRY statementbody
		{$$ = 'try ' + $2}
	| TRY statementbody CATCH statementbody
		{$$ = 'try ' + $2 + ' catch ' + $4}
	| TRY statementbody CATCH LPAREN e RPAREN statementbody
		{$$ = 'try ' + $2 + ' catch (err) ' + $7}
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
	| CLIENT
		{$$ = $1}
	| SERVER
		{$$ = $1}
	| NATVOID
		{$$ = $1}
	| CLASS
		{$$ = $1}
	;
	
id
    : ID
		{$$ = 
			  $1 == "enum" ? '_enum' 
			/*: $1 == "construct" ? '_construct' */
			: $1}
	| SYSTEM DOT systemref
		{$$ = $1 + '_' + $3}
	| ID LBRACKET e RBRACKET
		{$$ = $1 + '[' + $3 + ']'}
    ;

idvar
    : ID
		{$$ = $1}
	| SYSTEM DOT systemref
		{$$ = $1 + '_' + $3}
    ;
	
el
    : ifstatement el
		{$$ = $1 + $2}
    | switchstatement el
		{$$ = $1 + $2}
    | forstatement el
		{$$ = $1 + $2}
    | whilestatement el
		{$$ = $1 + $2}
    | dowhilestatement el
		{$$ = $1 + $2}
	| selectstatement SEMICOLON el
		{$$ = $1 + ';' + $3}
	| whileselectstatement el
		{$$ = $1 + $2}
	| trycatch el
		{$$ = $1 + $2}
	| SQUARE id el
		{$$ = 'eval(macros.' + $2 + ');' + $3}
	| SQUARE MACROLIB DOT id el
		{$$ = 'eval(macros.' + $4 + ');' + $5}
	| SQUARE DEFINE DOT id LPAREN e RPAREN el
		{$$ = 'macros.' + $4 + ' = ' + $6 + ";" + $8}
    | id methodname LPAREN methodvariables RPAREN LBRACE methodbody RBRACE el
		{$$ = 'var ' + $2 + ' = function(' + ($4?$4:'') + '){' + $7 + '};' + $9}
    | NATVOID methodname LPAREN methodvariables RPAREN LBRACE methodbody RBRACE el
		{$$ = 'var ' + $2 + ' = function(' + ($4?$4:'') + '){' + $7 + '};' + $9}
    | STR methodname LPAREN methodvariables RPAREN LBRACE methodbody RBRACE el
		{$$ = 'var ' + $2 + ' = function(' + ($4?$4:'') + '){' + $7 + '};' + $9}
    | STR NATLITERAL methodname LPAREN methodvariables RPAREN LBRACE methodbody RBRACE el
		{$$ = 'var ' + $3 + ' = function(' + ($5?$5:'') + '){' + $8 + '};' + $10}
    | LBRACE el RBRACE el
		{$$ = '{' + $2 + '}'}
    | e SEMICOLON el
		{$$ = ($1 ?  $1 + ';' : '') + $3}
    | e SEMICOLON el
		{$$ = ($1 ?  $1 + ';' : '') + $4}
	| e
		{$$ = $1 ?  $1 : ''}
	| SEMICOLON el
		{$$ = $2}
	| vdl SEMICOLON el
		{$$ = $1 + ';' + $3}
	| vdl
		{$$ = $1}
	|
		{$$ = ''}
    ;

e
    : NATLITERAL
		{$$ = $1}
	| HEXNUMBER
		{$$ = $1.replace("u", "")}
	| UTCDATE
		{$$ = 'new Date("' + $1 + '")'}
	| STRING
		{$$ = $1.substring(0, 1) == "@" ? $1.substring(1) : $1}
	| STRING2
		{$$ = $1.substring(0, 1) == "@" ? $1.substring(1) : $1}
    | NUL
		{$$ = $1}
    | id
		{$$ = $1}
    | NEW e
		{$$ = 'new ' + $2}
    | THIS
		{$$ = 'this'}
    | THIS DOT e
		{$$ = 'this.' + $3}
    | READNAT LPAREN RPAREN
    | PRINTNAT LPAREN e RPAREN
    | MINUS e
		{$$ = '-' + $2}
    | PLUS e
		{$$ = '+' + $2}
    | NOT e
		{$$ = '!' + $2}
    | UNARY e
		{$$ = '~' + $2}
    | e GREATERTHAN e
		{$$ = $1 + ' >= ' + $3}
    | e LESSTHAN e
		{$$ = $1 + ' <= ' + $3}
    | e PLUS e
		{$$ = $1 + ' + ' + $3}
    | e MINUS e
		{$$ = $1 + ' - ' + $3}
    | e TIMES e
		{$$ = $1 + ' * ' + $3}
    | e SLASH e
		{$$ = $1 + ' / ' + $3}
    | e MOD e
		{$$ = $1 + ' % ' + $3}
    | e DIV e
		{$$ = 'parseInt(' + $1 + ') / parseInt(' + $3 + ')'}
    | e EQUALITY e
		{$$ = $1 + ' == ' + $3}
    | e NOTEQUALS e
		{$$ = $1 + ' != ' + $3}
    | e GREATER e
		{$$ = $1 + ' > ' + $3}
    | e LESS e
		{$$ = $1 + ' < ' + $3}
	| e BITAND e
		{$$ = $1 + ' & ' + $3}
	| e BITOR e
		{$$ = $1 + ' | ' + $3}
	| e BITLEFT e
		{$$ = $1 + ' << ' + $3}
	| e BITRIGHT e
		{$$ = $1 + ' >> ' + $3}
	| e PLUS PLUS
		{$$ = $1 + '++'}
	| e MINUS MINUS
		{$$ = $1 + '--'}
    | e OR e
		{$$ = $1 + '||' + $3}
    | e AND e
		{$$ = $1 + '&&' + $3}
    | e DOT id
		{$$ = $1 + '.' + $3}
	| NEXT id
		{$$ = $2 + '.getNext()'}
	| THROW e
		{$$ = 'throw ' + $2}
	| RETURN e
		{$$ = 'return ' + $2}
	| RETURN
		{$$ = 'return'}
	| BREAK
		{$$ = 'break'}
    | id ASSIGN e
		{$$ = $1 + ' = ' + ($3=='null' ? $1 + '._getNull()' : $3)}
    | container ASSIGN e
		{$$ = $1 + ' = ' + $3}
    | id PLUSASSIGN e
		{$$ = $1 + ' += ' + $3}
    | id NEGASSIGN e
		{$$ = $1 + ' -= ' + $3}
    | e DOT id ASSIGN e
		{$$ = $1 + '.' + $3 + ' = ' + $5}
    | id LPAREN methodcallparams RPAREN
		{$$ = $1 + '(' + $3 + ')'}
    | id DOUBLECOLON id LPAREN methodcallparams RPAREN
		{$$ = $1 + '.' + $3 + '(' + $5 + ')'}
    | id DOUBLECOLON enumstr
		{$$ = $1 + '.' + $3}
    | e DOT methodname LPAREN methodcallparams RPAREN
		{$$ = $1 + '.' + $3 + '(' + $5 + ')'}
    | e DOT LPAREN methodcallparams RPAREN ASSIGN e
		{$$ = $1 + '[' + $4 + '] = ' + $7}
    | e DOT LPAREN methodcallparams RPAREN
		{$$ = $1 + '[' + $4 + ']'}
    | LPAREN e RPAREN
		{$$ = '(' + $2 + ')'}
    | LBRACKET e RBRACKET
		{$$ = '[' + $2 + ']'}
	| container
		{$$ = $1}
    | e QUESTIONMARK e COLON e
		{$$ = $1 + ' ? ' + $3 + ' : ' + $5}
    | NATLITERAL BACKSLASH NATLITERAL BACKSLASH NATLITERAL
		{$$ = 'new Date(' + parseInt($5) + ',' + parseInt($3) + ',' + parseInt($1) + ')'}
	| SQUARE id
		{$$ = 'eval(macros.' + $2 + ')'}
	;
