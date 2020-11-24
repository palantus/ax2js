function request(data, success, onFailure){
	//data.username = username;
	//data.password = password;

	$.post("/request", data, function(response) {
		success("hej");
		/*
		if(response.error !== undefined){
			console.log(response);

			if(typeof(onFailure) === "function")
				onFailure(response);
			else if(typeof(Notifier) === "function")
				new Notifier().show("Der opstod en fejl i din forespørgsel");

		} else if(typeof(success) === "function"){
			success(response);
		}
		*/
	}, 'json');
}

async function testFunc(data){
		var test = await requestSync({type: "test"});
		return test;
}

function requestSync(data){
	var res = new Promise(function(resolve, reject){
			request(data, function(response){
				resolve(response);
			}, function(){
				resolve(response);
			});
	});

	return res;
}

var test = testFunc({type: "test"});
console.log(test);
