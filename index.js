
// setup required modules
const express = require('express') //webserver for restful apis
const bodyParser = require('body-parser')//make it possible to read incoming post request
const fs = require("fs")  // file system 

// create the app as an express server
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// set reference for current user
let currentUser = null;



// load data from json files

// users
let users = [];
if (fs.existsSync("users.json")) {
  let userdata = fs.readFileSync("users.json", "utf-8");
  users = JSON.parse(userdata);
}

// properties
let properties = [];
if (fs.existsSync("properties.json")) {
  let propertydata = fs.readFileSync("properties.json", "utf-8");
  properties = JSON.parse(propertydata);
}

// workspaces
let workspaces = [];
if (fs.existsSync("workspaces.json")) {
  let workspacedata = fs.readFileSync("workspaces.json", "utf-8");
  workspaces = JSON.parse(workspacedata);
}



// page routing

//default page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

//login page
app.get('/signin', (req, res) => {
  res.sendFile(__dirname + '/login.html')
})

// registration page
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html')
})

app.get('/property', (req, res) => {
  res.sendFile(__dirname + '/property.html')
})

// app requests

app.post('/register', (req, res) => {
	const data = req.body;
  users.push(data);
  fs.writeFileSync("users.json", JSON.stringify(users));
  
  // display a thank you message confirming the registration was successful
  res.send("Thank you for registering, " + data.username);

})

// login user
app.post('/login', (req, res) => {
	const data = req.body;
	
	// see if user exists
	let password = data.password;
	let found = users.find(item => item.email == data.email && item.password == data.password);
	
	// user exists and 
	if(found){
		currentUser = found;
		res.redirect('/property')
	}else{
		res.send("User not found");
	}

})

// logout user
app.get('/logout', (req, res) => {
	currentUser = null;
	res.redirect('/signin')
})

//get current user
app.get('/getuser', (req, res) => {
	res.send(currentUser);
})

//display registered users on page
app.get('/users', (req, res) => {
	//update users list from file
	
	if (fs.existsSync("users.json")) {
		let data = fs.readFileSync("users.json", "utf-8");
		users = JSON.parse(data);
	}
	
	// loop through users array and display the data to the page
	let data = "<h1>List of Registered Users:</h1><br>"
	for(let i = 0; i < users.length; i++){
		data += `
			<h1>${users[i].username}</h1>
			<h3>Email: ${users[i].email}</h3>
			<h3>Password: ${users[i].password}</h3>
			<h3>User Type: ${users[i].type}</h3>
		`;
		
	}
	res.send(data);
})

// get list of properties
app.get('/getproperties', (req, res) => {
	if(fs.existsSync("properties.json")) {
  let propertydata = fs.readFileSync("properties.json", "utf-8");
  properties = JSON.parse(propertydata);
	res.send(properties);
	//console.log("Sent property data");
	}
})

// get list of workspaces
app.get('/getworkspaces', (req, res) => {
if (fs.existsSync("workspaces.json")) {
  let workspacedata = fs.readFileSync("workspaces.json", "utf-8");
  workspaces = JSON.parse(workspacedata);
	res.send(workspaces);
	//console.log("Sent workspace data");
	}
})

// adding and deleting workspaces/properties

//add new property
app.post('/addproperty', (req, res) => {
	const data = req.body;
	let found = properties.filter(p => p.owner == currentUser.username && p.id == data.id);
	if(found.length < 1){
		data.owner = currentUser.username;
		properties.push(data);
		fs.writeFileSync("properties.json", JSON.stringify(properties));
		console.log("Added new property");
	}
	
	res.redirect('/property')
})

//add new workspace
app.post('/addworkspace', (req, res) => {
	const data = req.body;
	
	let found = properties.find(p => p.owner == currentUser.username && p.id == data.propertyid);
	let found2 = workspaces.filter(w => w.id == data.id);
	if(found && found2.length < 1){
		data.owner = currentUser.username;
		data.contact = currentUser.email;
		workspaces.push(data);
		fs.writeFileSync("workspaces.json", JSON.stringify(workspaces));
		console.log("Added new workspace");
	}
	
	res.redirect('/property');
})

// delete property
app.post('/deleteproperty/:id', (req, res) => {
	
	// loop through array and delete property with specified ID
	for(let i = 0; i < properties.length; i++){
		if(properties[i].id == req.params.id){
			properties.splice(i, 1);
			console.log("Deleted property from array");
			break;
		}
	}
	fs.writeFileSync("properties.json", JSON.stringify(properties));
	
	// also delete any workspaces assigned to the deleted property
	for(let i = 0; i < workspaces.length; i++){
		if(workspaces[i].propertyid == req.params.id){
			workspaces.splice(i, 1);
			console.log("Deleted workspace from array");
		}
	}
	fs.writeFileSync("workspaces.json", JSON.stringify(workspaces));
	
	res.redirect('/property');
})

// delete workspace
app.post('/deleteworkspace/:id', (req, res) => {
	
	// loop through array and delete workspace with specified ID
	for(let i = 0; i < workspaces.length; i++){
		if(workspaces[i].id == req.params.id){
			workspaces.splice(i, 1);
			console.log("Deleted workspace from array");
			break;
		}
	}
	fs.writeFileSync("workspaces.json", JSON.stringify(workspaces));
	
	res.redirect('/property');
})



app.listen(8080, () => {
  console.log('App running on port 8080')
})