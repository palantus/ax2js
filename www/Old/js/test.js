"use strict";

var test = LessorSum.construct()
					.empl('hej')
					.type(LessorJobDateType.LessorJobStartDate)
					.paytype('00003')
					.sum();
console.log(test);

/*
function testasync(){
	var promise = new Promise(function(resolve, reject){
		setTimeout(function(){
			resolve("hej");
		}, 5000);
	});

	return promise;
}

var res = (await testasync());
console.log(res);
*/

function testasync() {
	var promise = new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve("hej");
		}, 5000);
	});

	return promise;
}

function main() {
	var res;
	return regeneratorRuntime.async(function main$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return regeneratorRuntime.awrap(testasync());

			case 2:
				res = context$1$0.sent;

				console.log(res);

			case 4:
			case "end":
				return context$1$0.stop();
		}
	}, null, this);
}

main();


/*
var p1 = new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {
            log.insertAdjacentHTML('beforeend', thisPromiseCount +
                ') Promise started (<small>Async code started</small>)<br/>');
            // This is only an example to create asynchronism
            window.setTimeout(
                function() {
                    // We fulfill the promise !
                    resolve(thisPromiseCount);
                }, Math.random() * 2000 + 1000);
        });

    // We define what to do when the promise is resolved/fulfilled with the then() call,
    // and the catch() method defines what to do if the promise is rejected.
    p1.then(
        // Log the fulfillment value
        function(val) {
            log.insertAdjacentHTML('beforeend', val +
                ') Promise fulfilled (<small>Async code terminated</small>)<br/>');
        })
*/
