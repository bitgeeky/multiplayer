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
		/*if(px<x&&py<y){
			if(Math.abs(px-x)<3||Math.abs(py-y)<3){
			x+=moveAmount;
			y+=moveAmount;
			}
		}	
		else if(px>x&&py<y){
			if(Math.abs(px-x)<3||Math.abs(py-y)<3){
			x-=moveAmount;
			y+=moveAmount;
			}
		}	
		else if(px<x&&py>y){
			if(Math.abs(px-x)<3||Math.abs(py-y)<3){
			x+=moveAmount;
			y-=moveAmount;
			}
		}	
		else if(px>x&&py>y){
			if(Math.abs(px-x)<3||Math.abs(py-y)<3){
			x-=moveAmount;
			y-=moveAmount;
			}
		}	*/
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
		}
	};
	var draw = function(ctx){
		if(ballready){
			ctx.drawImage(ballimage,x,y);
		}	
	};	
	return{
		getX: getX,
		getY: getY,
		setX: setY,
		update: update,
		reset: reset,
		draw: draw
	}
};
