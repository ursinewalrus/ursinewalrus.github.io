$( document ).ready(function() {


	const canvas = $('.grid-canvas');

	let arr_dims  = 20;
	let grid_matrix = (new Array(arr_dims)).fill().map(function(){return new Array(arr_dims).fill(false);});

	const grid_sq_dims = canvas.width() / arr_dims;

	const c = document.getElementsByClassName('grid-canvas')[0];
	const ctx = c.getContext("2d");

	$('.grid-square-color-picker').spectrum({
		showInput: true,
		showPalette: true,
		hideAfterPaletteSelect:true,

	});


	function draw_grid_lines(){
		let W = canvas.width();
		for(var i=grid_sq_dims;i<=canvas.width(); i+=grid_sq_dims){
			ctx.moveTo(0,i);
			ctx.lineTo(W,i)
			ctx.lineWidth = 1;
			ctx.stroke();

			ctx.moveTo(i,0);
			ctx.lineTo(i,W)
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}
	draw_grid_lines();


	
	function render_grid_squares(){
		for(var x=0;x<=arr_dims;x++){
			for(var y=0;y<=arr_dims;y++){
				if(grid_matrix[x][y]){ //tosses an error but no issue so...
					let x_cord = x * grid_sq_dims;
					let y_cord = y * (grid_sq_dims);
					let char = grid_matrix[x][y]["char"];
					ctx.fillStyle  = grid_matrix[x][y]["color"];
					ctx.font = (grid_sq_dims * 1.4)+"px Georgia";
					ctx.fillText(char,x_cord,y_cord);

				}


			}
		}
	}

	canvas.on("click",function(event){
		let self = $(this)[0];
		let x = event.pageX - self.offsetLeft;
        let y = event.pageY - self.offsetTop;
        let cords = get_matrix_coords(x,y);
        let color = $('.grid-square-color-picker').spectrum("get").toRgbString();
		let char = $('.sq-character').val()[0];
        update_matrix(cords,color,char);
        render_grid_squares();

	});

	function get_matrix_coords(x,y){
		let x_cord = Math.floor(x / grid_sq_dims);
		let y_cord = Math.min(Math.ceil(y / grid_sq_dims),arr_dims);//+1 it or ciel it for render
		return {"x":x_cord, "y": y_cord};		
	}

	function update_matrix(cords,color,char){
		console.log("update");
		let x = cords["x"];
		let y = cords["y"];
		console.log(x);
		console.log(y);
		grid_matrix[x][y] = {"char":char,"color":color};
	}

});