var Ball = function(startX,startY){
	var ballready=false;
	var ballimage=new Image();
	ballimage.onload=function(){
		ballready=true;
	};
	ballimage.src="images/ball.png";
	var x = startX,y=startY,moveAmount=10;
	//getters and setters
	
	var reset = function(xset,yset){
		x=xset;
		y=yset;
	};
	var getX = function(){
		return x;	
	};
	var getY = function(){
		return y;
	};
	var setX = function(newX){
		x=newX;
	};
	var setY = function(newY){
		y=newY;
	};
	// Update Ball position
	var update = function(px,py){
		var prevX=x,prevY=y;
		if( Math.abs(px-x)<=20 && Math.abs(py-y)<=20)
		{
			var power = 5;
			var dx = x-px;
			var dy = y-py;
			if(dx<3 && dx>-3)dx=0;
			if(dy<3 && dy>-3)dy=0;
			//x+=(dx*power);
			//y+=(dy*power);
			x+=(dx*power);
			y+=(dy*power);
			console.log("m in");
		}
		return (prevX!=x || prevY!=y)? true : false;
	};
	var draw = function(ctx){
		if(ballready){
			ctx.drawImage(ballimage,x-5,y-5);
		}	
	};	
	return{
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		reset: reset,
		draw: draw
	}
};
