//Based on codepen.io: https://codepen.io/FabioG/pen/PbVaOw
function Properties(){
    this.numberOfDots = 2,
    this.dotSpeed = 0,
    this.dotRadius = 0,
    this.lineWidth = 2,
    this.rayPieces = 15,
    this.rayRandomise = 50,
    this.speed = 30
}

var dots = [],
    dotLengthThreshold,
    properties = new Properties(),
    canvas,
    ctx;

$(document).ready(function() {
    var gui = new dat.GUI();
    gui.add(properties, 'rayPieces', 1, 20).step(1);
    gui.add(properties, 'rayRandomise', 1, 100);
    gui.add(properties, 'speed', 1, 100);
    canvas = document.getElementById("myCanvas");
    canvas.width = $( window ).width();
    canvas.height = $( window ).height();
    ctx = canvas.getContext("2d");
    dotLengthThreshold = Math.min(canvas.width, canvas.height) / 2;
    init();

    $(window).resize(function(){
      canvas.width = $( window ).width();
      canvas.height = $( window ).height();
      dotLengthThreshold = Math.min(canvas.width, canvas.height) / 2;
    });

});

function init(){
  iterate();
}

function iterate(){
  clearCanvas();
  drawLightning(canvas.width/2, canvas.height * 0.25, canvas.width/2, canvas.height * 0.75);
  //change to requestAnimationFrame(iterate) to see it's performance
  setTimeout(function() {iterate()}, properties.speed);
}

function clearCanvas(){
  ctx.save();
  ctx.fillStyle="#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawLightning(x1,y1, x2,y2){
  var pointDistance = distance(x1,y1, x2,y2);
  var coord = findThirdPoint(x1,y1,x2,y2);
  var xDistance = -(x1 - x2) / properties.rayPieces;
  var yDistance = -(y1 - y2) / properties.rayPieces;
  var opacity = 0;
  ctx.save();
  ctx.shadowColor = '#FFF';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  for(var i = 1; i <= properties.rayPieces; i ++){
    if(i <= properties.rayPieces-1){
      var relDistance = distance(x1,y1,x1 + (xDistance * i), y1 + (yDistance * i));
      var offsetMultiplyer = relDistance/pointDistance < 0.5 ? relDistance/pointDistance/0.5 : 1 - (relDistance/pointDistance);
      var offset = (Math.random() * properties.rayRandomise) * offsetMultiplyer;
      var relCoords = {
        x : x1 + (xDistance * i) + (coord.x * offset),
        y : y1 + (yDistance * i) + (coord.y * offset)
      };
      ctx.lineTo(relCoords.x, relCoords.y);
    }else{
      ctx.lineTo(x2, y2);
    }

  }
  ctx.strokeStyle = "rgb(255, 0, 127)";
  ctx.lineWidth = properties.lineWidth;
  ctx.lineCap="round";
  ctx.stroke();
  ctx.restore();
}


function findThirdPoint(ax, ay, bx, by){
	var c = {x:0, y:0};
	var slope =  (ax - bx) / (by - ay);
  var sign = Math.random() < 0.5 ? -1 : 1;
	c.x = (1 / (Math.sqrt((1 + (slope * slope))))) * sign;
	c.y = (slope / (Math.sqrt((1 + (slope * slope))))) * sign;
	return c;
}

function distance(x1, y1, x2, y2){
  return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
}
