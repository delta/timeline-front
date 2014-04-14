var canvas = document.createElement("canvas");
canvas.id = "gol";

document.body.appendChild(canvas);



		(function(){
	var canvas = document.getElementById('gol');
	var ctx = canvas.getContext('2d');

	(function(){
		canvas.width = window.innerWidth;
		canvas.height= window.innerHeight;

		ctx.fillStyle = "white";
		ctx.fillRect(0,0, canvas.width, canvas.height);
	})();

	function randrgb(){
		var a  = Math.random;
		var b = Math.floor;

		return "rgb("+b(a()*255)+","+b(a()*255)+","+b(a()*255)+")";
	}
	var px = 20;
	var py = 20;
	var no = Math.floor(canvas.width/px);
	var cells = new Array(no);

	for(var i=0;i<cells.length; i++){
		cells[i] = new Array(no);
		for(var j=0;j<cells[i].length;j++){
			if(j*i % 3 == 0 && Math.random() > 0.5 )	cells[i][j] = 1;
			//cells[i][j] = (Math.random() > 0.2) ? 1 : 0;
		}
	}
	color = randrgb();
	bcolor = randrgb();
	function draw(){
		for(var i=0;i<cells.length;i++){
			for(var j=0;j<cells[i].length;j++){
				if(cells[i][j] == 1){
					ctx.fillStyle = color;
					ctx.fillRect(i*px, j*py, px, px);
					ctx.fill();
				}else{
					ctx.fillStyle = bcolor;
					ctx.fillRect(i*px, j*py, px, px);
					ctx.fill();
				}
			}
		}

		update();
	}

	function update(){
		var cp = new Array(no);
		for(var i=0;i<cp.length;i++){
			cp[i] = new Array(no);
			for(var j=0;j<cp[i].length;j++){
				cp[i][j] = 0;
			}
		}

		for(var i=0;i<cells.length;i++){
			for(var j=0;j<cells[i].length;j++){
				if(i+1 < no){
					if(cells[i+1][j] == 1 ) cp[i][j] +=1;
				}

				if(i-1 >= 0) {
					if(cells[i-1][j] == 1) cp[i][j]++;
				}

				if(j+1 < no)
				{
					if(cells[i][j+1] == 1) cp[i][j]++;
				}

				if(j-1 >= 0)
				{
					if(cells[i][j-1] == 1) cp[i][j]++;
				}

				if(i+1 < no && j+1 <= no)
				{
					if(cells[i+1][j+1] == 1) cp[i][j]++;
				}

				if(i+1 < no && j-1 >= 0)
				{
					if(cells[i+1][j-1] == 1) cp[i][j]++;
				}

				if(i-1 >= 0 && j+1 <= no)
				{
					if(cells[i-1][j+1] == 1) cp[i][j]++;
				}

				if(i-1 >= 0 && j-1 >= 0)
				{
					if(cells[i-1][j-1] == 1) cp[i][j]++;
				}
			}
		}

		for(var i=0;i<cells.length;i++){
			for(var j=0;j<cells[i].length;j++){
				if(cp[i][j] < 2 || cp[i][j] > 3) cells[i][j] = 0;
				if(cells[i][j] == 1 && (cp[i][j] == 2 || cp[i][j] == 3)) cells[i][j] = 1;
				if(cells[i][j] == 0 && cp[i][j] == 3) cells[i][j] = 1;
			}
		}
	}

	setInterval(function(){
		draw();
	}, 1000/60);

})();
