
/* description: ClassyLang grammar. Very classy. */
/* 
  To build parser:

    $ ./bin/jison examples/classy.jison examples/classy.jisonlex 

*/

%lex
digit                       [0-9]
id                          [a-zA-Z][a-zA-Z0-9]*
string						["][[a-zA-Z]*["]

%%
"//".*                      /* single line comment */
"/*"(.|\n|\r)*"*/"          /* multi line comment */
"extends"                   return 'EXTENDS';
"nat"                       return 'NATTYPE';
"if"                        return 'IF';
"else"                      return 'ELSE';
"for"                       return 'FOR';
"printNat"                  return 'PRINTNAT';
"readNat"                   return 'READNAT';
"this"                      return 'THIS';
"new"                       return 'NEW';
"var"                       return 'VAR';
"null"                      return 'NUL';
"void"						return 'NATVOID'
"private"					return 'METEXPOSUREPRIVATE'
"public"					return 'METEXPOSUREPUBLIC'
"protected"					return 'METEXPOSUREPROTECTED'
{digit}+                    return 'NATLITERAL';
{id}                        return 'ID';
{string}					return "STRING"
"=="                        return 'EQUALITY';
"="                         return 'ASSIGN';
"+"                         return 'PLUS';
"-"                         return 'MINUS';
"*"                         return 'TIMES';
">"                         return 'GREATER';
"||"                        return 'OR';
"!"                         return 'NOT';
"."                         return 'DOT';
"{"                         return 'LBRACE';
"}"                         return 'RBRACE';
"("                         return 'LPAREN';
")"                         return 'RPAREN';
";"                         return 'SEMICOLON';
\s+                         /* skip whitespace */
"."                         throw 'Illegal character';
<<EOF>>                     return 'ENDOFFILE';



/lex


/* author: Zach Carter */

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
	/*
	{$$ = {
            type: 'multiplication',
            arguments: [
              $1,
              $3
            ]
          };
        }*/
    ;

vdl
    : VAR t id SEMICOLON vdl
		{$$ = {
            type: 'variabel_declaration',
            arguments: [
              $1,
			  $2,
			  $3,
            ]
          };
        }
    | 
    ;

mdl
    : methodexposure t id LPAREN methodvariables RPAREN LBRACE methodbody RBRACE mdl
		{$$ = {
            type: 'method',
            arguments: [
              $1,
			  $2,
              $3,
			  $5,
			  $8,
			  $10
            ]
          };
        }
    | 
    ;
	
methodvariables
	: t id methodvariables
	| 
	;
	
methodexposure
	: METEXPOSUREPRIVATE
	| METEXPOSUREPUBLIC
	| METEXPOSUREPROTECTED
	;

methodbody
	: el
		{$$ = {
            type: 'methodbody_novar',
            arguments: [
              $1
            ]
          };
        }
	| vdl SEMICOLON el
		{$$ = {
            type: 'methodbody',
            arguments: [
              $1,
			  $3
            ]
          };
        }
	;
	
t
    : NATTYPE
	| NATVOID
    | id
    ;

id
    : ID
    ;

el
    : e SEMICOLON el
		{$$ = {
            type: 'expression',
            arguments: [
              $1
            ]
          };
        }
    | e SEMICOLON
		{$$ = {
            type: 'expression',
            arguments: [
              $1
            ]
          };
        }
    ;

e
    : NATLITERAL
	| STRING
    | NUL
    | id
    | NEW id
    | THIS
    | IF LPAREN e RPAREN LBRACE el RBRACE ELSE LBRACE el RBRACE
    | FOR LPAREN e SEMICOLON e SEMICOLON e RPAREN LBRACE el RBRACE
    | READNAT LPAREN RPAREN
    | PRINTNAT LPAREN e RPAREN
    | e PLUS e
    | e MINUS e
    | e TIMES e
    | e EQUALITY e
    | e GREATER e
    | NOT e
    | e OR e
    | e DOT id
    | id ASSIGN e
    | e DOT id ASSIGN e
    | id LPAREN e RPAREN
		{$$ = {
            type: 'function_call',
            arguments: [
              $1,
			  $3
            ]
          };
        }
    | e DOT id LPAREN e RPAREN
    | LPAREN e RPAREN
    ;

