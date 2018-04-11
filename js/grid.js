let grid_matrix;
let update_grid;
$( document ).ready(function() {

	const canvas = $('.grid-canvas');

	let arr_dims  = 20;

	const grid_sq_dims = canvas.width() / arr_dims;
	grid_matrix = (new Array(arr_dims)).fill().map(function(){return new Array(arr_dims).fill(false);});
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
					let x_cord = (x * grid_sq_dims) + grid_sq_dims * .2;
					let y_cord = (y * (grid_sq_dims)) - grid_sq_dims * .2;
					let char = grid_matrix[x][y]["char"];
					ctx.fillStyle  = grid_matrix[x][y]["color"];
					ctx.font = (grid_sq_dims * 1)+"px Georgia";
					ctx.fillText(char,x_cord,y_cord);
				}
			}
		}
	}

	update_grid = function(){
		ctx.clearRect(0,0,canvas.width(),canvas.width());
		draw_grid_lines();
        render_grid_squares();
	}

	canvas.on("click",function(event){
		let self = $(this)[0];
		let x = event.pageX - self.offsetLeft;
        let y = event.pageY - self.offsetTop;
        let cords = get_matrix_coords(x,y);
        let color = $('.grid-square-color-picker').spectrum("get").toRgbString();
		let char = $('.sq-character').val()[0];
        update_matrix(cords,color,char);
		ctx.clearRect(0,0,canvas.width(),canvas.width());
		update_grid();
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
		grid_matrix[x][y] = {"char":char,"color":color};
		if(room_name){
			let update_grid = {};
        	update_grid["rooms/"+room_name+"/"+room_pass+"/data/grid/"] = JSON.stringify(grid_matrix);
        	fdb.ref().update(update_grid);
    	}
	}

});