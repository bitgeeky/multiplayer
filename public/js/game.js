/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,	// Local player
	remotePlayers,	// Remote players
	socket,localball;			// Socket connection
var leftscr=0,rightscr=0;
var timestr;
// set the date we're counting down to
var target_date = new Date(new Date().getTime()+5*60000).getTime();
 
// variables for time units
var days, hours, minutes, seconds;
 
// get tag element
var countdown = document.getElementById("countdown");
 
// update the tag with id "countdown" every 1 second
setInterval(function () {
 
    // find the amount of "seconds" between now and target
    var current_date = new Date().getTime();
    var seconds_left = (target_date - current_date) / 1000;
 
    // do some time calculations
    days = parseInt(seconds_left / 86400);
    seconds_left = seconds_left % 86400;
     
    hours = parseInt(seconds_left / 3600);
    seconds_left = seconds_left % 3600;
     
    minutes = parseInt(seconds_left / 60);
    seconds = parseInt(seconds_left % 60);
     
    // format countdown string + set tag value
    timestr = minutes + " m : " + seconds+" s" ;  
 
}, 1000);

/**************************************************
** GAME INITIALISATION
**************************************************/
var bgready=false;
var bgimage= new Image();
bgimage.onload = function(){
	bgready=true;		
};
bgimage.src = "images/field.svg";
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width-5)),
		startY = Math.round(Math.random()*(canvas.height-5));
	/********************************/
	var ballX=window.innerWidth/2;
	var ballY=window.innerHeight/2;
	/********************************/
	
	// Initialise the local player
	localPlayer = new Player(startX, startY);
	/********************************/
	localball= new Ball(ballX,ballY);
	/********************************/


	// Initialise socket connection
	socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});

	// Initialise remote players array
	remotePlayers = [];

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");

	// Send local player data to the game server
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);

	// Initialise the new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = data.id;

	// Add new player to the remote players array
	remotePlayers.push(newPlayer);
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	localball.update(movePlayer.getX(),movePlayer.getY());
	localball.draw(ctx);
};

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};


/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	// Update local player and check for change
	if (localPlayer.update(keys)) {
		// Send local player data to the game server
		localball.update(localPlayer.getX(),localPlayer.getY());
		localball.draw(ctx);
		socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	};
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.fillStyle = "rgb(124,252,0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgb(200,0,0)";
	ctx.fillRect(0,canvas.height/4,40,canvas.height/2);
	ctx.fillStyle = "rgb(200,0,0)";
	ctx.fillRect(canvas.width-40,canvas.height/4,40,canvas.height/2);

	ctx.fillStyle = "rgb(0,255,255)";
	ctx.fillRect(0,0,canvas.width,15);
	ctx.fillStyle = "rgb(0,255,255)";
	ctx.fillRect(0,canvas.height-15,canvas.width,15);
	ctx.fillStyle = "blue";
	ctx.font = 'italic 30pt Calibri';
      	ctx.fillText(leftscr.toString()+" | "+rightscr.toString(), canvas.width/2-20, 60);
	ctx.fillStyle = "blue";
	ctx.font = '30pt Calibri';
      	ctx.fillText(timestr,canvas.width/2-20, canvas.height-30);
	// Draw the local player
	if(localball.getX()<25&&((canvas.height/4)<=localball.getY()<=(3*(canvas.height/4)))){
		localball.reset(canvas.width/2,canvas.height/2);
	//	alert("Right Team Scored A GOAL");
		rightscr+=1;
	}
	else if((localball.getX()>(canvas.width-25))&&((canvas.height/4)<=localball.getY()<=(3*(canvas.height/4)))){
		localball.reset(canvas.width/2,canvas.height/2);
	//	alert("Left Team Scored A GOAL");
		leftscr+=1;
	}
	else if((localball.getX()<=0)||(localball.getX()>=canvas.width)||(localball.getY()<=0)||(localball.getY()>=canvas.height)){
		localball.reset(canvas.width/2,canvas.height/2);
		
	}
	localPlayer.draw(ctx);
	localball.update(localPlayer.getX(),localPlayer.getY())
	localball.draw(ctx);

	// Draw the remote players
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].draw(ctx);
	localball.update(remotePlayers[i].getX(),remotePlayers[i].getY());
	localball.draw(ctx);
	};
	localball.draw(ctx);
};


/**************************************************
** GAME HELPER FUNCTION
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};
