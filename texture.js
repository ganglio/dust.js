(function(){
	(function(){
		document.addEventListener('DOMContentLoaded', start, false);
	})();
	
	var
		radius=40,
		turbulence=0;
	
	function start() {
		var canvas=document.getElementById("canvas"),
		    ctx=canvas.getContext("2d"),
		    imgData = ctx.createImageData(canvas.width, canvas.height),
		    index=0;

		for (var x=-canvas.width/2; x<canvas.width/2; x++)
			for (var y=-canvas.height/2; y<canvas.height/2; y++) {
				index = ((x+canvas.width/2) + (y+canvas.height/2) * imgData.width) * 4;
				
				var XX=x+(1-2*Math.random())*turbulence,
				    YY=y+(1-2*Math.random())*turbulence;
				
				var r=~~(((Math.sqrt(XX*XX+YY*YY))%radius)/radius*255);
				
				
				imgData.data[index + 0] = r; // red
				imgData.data[index + 1] = r; // green
				imgData.data[index + 2] = r; // blue
				imgData.data[index + 3] = 255; // alpha
			}
		ctx.putImageData(imgData, 0, 0);
	};
})();
