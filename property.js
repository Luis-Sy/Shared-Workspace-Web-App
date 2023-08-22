let properties = [];
let workspaces = [];

let currentUser = fetchAsync("http://localhost:8080/getuser");

$(document).ready(function(){
	setTimeout(function(){
	console.log(properties);
	console.log(workspaces);
}, 3000);
});

async function fetchAsync(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

// fetch data through express server get request
function getData(){
	properties = fetchAsync("http://localhost:8080/getproperties");
	workspaces = fetchAsync("http://localhost:8080/getworkspaces");
}


// page display based on logged in user type

// if user is an owner
function ownerDisplay(){
	
}

// if user is a coworker
function coworkerDisplay(){
	
}