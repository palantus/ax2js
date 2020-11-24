
# TODO

## Generelt for projektet
  - Læg på Github
  - Skal nok kompilere al AX kode ind i EN .js fil.
    - Alternativt skal jeg bruge ES6 import funktionalitet, hvor hver klasse, edt osv. har sine egne dependencies.


## Database/server kald
Jeg skal vælge mellem at køre X++ koden på serveren eller klienten/browseren. Er ekstremt vigtigt i forhold til databasen. 
  - Hvis jeg vælger at køre den fra serveren, kan alle selects oversættes direkte til entitystorage kode. 
  - Hvis jeg vælger klienten, gør det det hele meget nemmere at debugge. Specielt i forhold til når jeg skal have kode editoren op at køre.
  - Hvis det her engang skal blive til et produkt, SKAL det være på serveren af sikkerhedshensyn.
  - Hvis jeg skal køre det på serveren, bliver GUI absurd kompleks med alle de kald der skal laves frem og tilbage. Det SKAL i hvert fald være med socket.io, for at alle init, active osv. kald kan laves hurtigt nok til at GUI ikke føles langsom.
  - Måske skal jeg bare indse at det ikke bliver et produkt og vælge dem simple løsning med klienten.
  - Kan jeg måske lave en browserversion af entitystorage? Den kan så få data-filen fra serveren og håndtere den lokalt.
  - Eller bare manuelt søge direkte i ld2 filen med inspectfile?!?!



## Gammel todo:
//TODO: Styr på case. Overvej at løbe alle typer/klasser/tabeller igennem og erstatte navnet i source med i rigtig case (søg med regexp case-insensitive).

Sync SQL calls:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/yield

Valg af database:
Kode: Det bliver nok: https://github.com/louischatriot/nedb
Data: Formentlig MySQL - men skal nok også understøtte read-only MSSQL, så man kan forbinde til en eksisterende

Kør async kode sync:
Den optimale løsning er async/await, som desværre først kommer med i Javascript ES7 (Node 7, som formentlig kommer til oktober 2016, eller Chrome 53)
Det skulle dog være understøttet i MS Edge!
Chrome issue: https://bugs.chromium.org/p/v8/issues/detail?id=4483
Firefox issue: https://bugzilla.mozilla.org/show_bug.cgi?id=1185106
Men måske løser det sig selv helt, da det jo ikke er browseren som skal foretage SQL kald - men serveren! Dvs. browseren laver et SYNC http callback til serveren,
som så vha async kald får et svar fra databasen og sender det tilbage.




TODO:
- Global skal kunne loades (fjern den som exception i CodeLoader når den kan!)
- Man skal kunne debugge koden, så den skal ikke loades med eval - men med <script>
- if(!tabelbuffer) vil ikke fungere is javascript. Skal oversættes til if(!tabelbuffer._hasValues())
