let grid_matrix;
let update_grid;
$( document ).ready(function() {

	const canvas = $('.grid-canvas');

	let arr_dims  = 20;

	let edit_status = $('input[name=edit-radio]:checked', "#radio-grid-edit-form").val();

	let plural_status = $('input[name=edit-radio-plural]:checked', "#radio-grid-edit-form").val();

	let dragging = false;
	canvas.on('mousedown',function(){
		if(edit_status == 2){
			dragging = true;
		}
	});

	let bulk_editing = false;
	let bulk_start_x = null;
	let bulk_start_y = null;
	let bulk_element = null;
	canvas.on('mousedown',function(){
		if(plural_status == 2){
			bulk_editing = true;
		}
	});


	let moving_element;

	$('.edit-type').on('click',function(){
 		edit_status = $('input[name=edit-radio]:checked', "#radio-grid-edit-form").val();
 		$('.edit-type-plural').prop('checked',false)
	});

	$('.edit-type-plural').on('click',function(){
 		plural_status = $('input[name=edit-radio-plural]:checked', "#radio-grid-edit-form").val();
	});

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
		ctx.beginPath();
		let W = canvas.width();
		ctx.lineWidth = 1;
		for(var i=grid_sq_dims;i<=canvas.width(); i+=grid_sq_dims){
			ctx.moveTo(0,i);
			ctx.lineTo(W,i)
			ctx.stroke();

			ctx.moveTo(i,0);
			ctx.lineTo(i,W)
		}
	}
	ctx.stroke();

	draw_grid_lines();


	
	function render_grid_squares(){
		for(var x=0;x<arr_dims;x++){
			for(var y=0;y<arr_dims;y++){
				if(grid_matrix[x][y]){ 
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
	/* export
		for(var i=0;i<grid_matrix.length;i++){
			var row="";
			for(var j=0;j<grid_matrix[i].length;j++){
				try{
					row+=(grid_matrix[j][i]? grid_matrix[j][i].char: " ") + " ";
		        }
				catch(e){
					//
		        }
			}
			console.log(row);
		}
	*/

	update_grid = function(){
		ctx.clearRect(0,0,canvas.width(),canvas.width());
		draw_grid_lines();
        render_grid_squares();
	}

	canvas.on("mousedown",function(event){
		let self = $(this)[0];
		let x = event.pageX - self.offsetLeft;
	    let y = event.pageY - self.offsetTop;
	    let cords = get_matrix_coords(x,y);
		//dragging is seperate, check for this first
		if(edit_status == 2){//drag
	        moving_element = grid_matrix[cords["x"]][cords["y"]];
	        if(!moving_element){
	        	moving_element = " ";
	        }
			update_matrix(cords,'filler','filler',true);
			ctx.clearRect(0,0,canvas.width(),canvas.width());
			update_grid();
		}
		else if(plural_status == 1){
			singleEvent(cords);
		} 
		else if(plural_status == 2){
			bulkEvents(cords);
		}

	});
	function bulkEvents(cords){
		bulk_start_x = cords["x"];
		bulk_start_y = cords["y"];
		bulk_element = grid_matrix[cords["x"]][cords["y"]];
		if(!bulk_element){
			let color = $('.grid-square-color-picker').spectrum("get").toRgbString();
			let char = $('.sq-character').val()[0];
			bulk_element = {"char":char,"color":color};
		}
		
	}
	function singleEvent(cords){
		if(edit_status == 1){//add
	        let color = $('.grid-square-color-picker').spectrum("get").toRgbString();
			let char = $('.sq-character').val()[0];
	        update_matrix(cords,color,char,false);
			ctx.clearRect(0,0,canvas.width(),canvas.width());
			update_grid();
		}
		else if(edit_status == 3){//delete
			update_matrix(cords,'filler','filler',true);
			ctx.clearRect(0,0,canvas.width(),canvas.width());
			update_grid();
		}
	}

	document.addEventListener("keyup",function(e){
		setTimeout(function(){
			if(overCanvas){
				let keyCode = e.keyCode;
				if(keyCode >= 65 && keyCode<=90){
					let char = String.fromCharCode(keyCode);
					$('.sq-character').val(char);
				}
			}
		},20);
	});
	let ex_time = 0;
	let sum = 0;
	canvas.on('mousemove',function(event){
		if(dragging){
			let moment = Date.now();
			let self = $(this)[0];
			let x = event.pageX - self.offsetLeft;
		    let y = event.pageY - self.offsetTop;
		    update_grid();
		    ctx.fillStyle = moving_element["color"];
			ctx.font = (grid_sq_dims * 1)+"px Georgia";
			ctx.fillText(moving_element["char"],x,y);
			ex_time += Date.now() - moment;
			sum++;
			if(sum!=0 && sum%50==0){
				console.log(ex_time/50);
				sum=0;
				ex_time = 0;
			}

		}
	});

	let overCanvas = false;
	canvas.mouseenter(function(){overCanvas=true;});
	canvas.mouseleave(function(){overCanvas=false;});

	canvas.on('mouseup',function(event){
		let self = $(this)[0];
		let x = event.pageX - self.offsetLeft;
	    let y = event.pageY - self.offsetTop;
		if(dragging){
		    let cords = get_matrix_coords(x,y);
			ctx.clearRect(0,0,canvas.width(),canvas.width());
	        update_matrix(cords,moving_element["color"],moving_element["char"],false);
			update_grid();
			dragging = false;
		}
		if(bulk_editing){
			bulk_element;
			let end_cords = get_matrix_coords(x,y);
			let top_corner_x = Math.min(end_cords['x'],bulk_start_x),
				top_corner_y = Math.min(end_cords['y'],bulk_start_y),
				bottom_corner_x = Math.max(end_cords['x'],bulk_start_x),
				bottom_corner_y = Math.max(end_cords['y'],bulk_start_y);
			for(top_corner_x; top_corner_x <= bottom_corner_x; top_corner_x++){

				for(let inner_y = top_corner_y; inner_y <= bottom_corner_y; inner_y++){
			        // refactor singleEvent so we dont need to replicate the below
			        let del = false;
			        if(edit_status == 3){//delete
			        	del = true;
			        }	
			        update_matrix({'x':top_corner_x,'y':inner_y},bulk_element['color'],bulk_element['char'],del);
					ctx.clearRect(0,0,canvas.width(),canvas.width());
					update_grid()
				}
			}

			bulk_editing = false;
		}
	});

	function get_matrix_coords(x,y){
		let x_cord = Math.floor(x / grid_sq_dims);
		let y_cord = Math.min(Math.ceil(y / grid_sq_dims),arr_dims);//+1 it or ciel it for render
		return {"x":x_cord, "y": y_cord};		
	}

	function update_matrix(cords,color,char,clear){
		let x = cords["x"];
		let y = cords["y"];
		let update_canvas = {};
		if(!char){
			char = " ";
		}
		if(clear){
			grid_matrix[x][y] = 0;
			update_canvas["rooms/"+room_name+"/"+room_pass+"/data/grid/"] = JSON.stringify(grid_matrix);
        	fdb.ref().update(update_canvas);
        	return;
		}
		grid_matrix[x][y] = {"char":char,"color":color};
		if(room_name){
        	update_canvas["rooms/"+room_name+"/"+room_pass+"/data/grid/"] = JSON.stringify(grid_matrix);
        	fdb.ref().update(update_canvas);
    	}
	}

	$('.clear-grid').on("click",function(){
		let confirmed = confirm("Clear the grid?");
		if(confirmed){
			grid_matrix = (new Array(arr_dims)).fill().map(function(){return new Array(arr_dims).fill(false);});
			update_canvas = {};
			update_canvas["rooms/"+room_name+"/"+room_pass+"/data/grid/"] = JSON.stringify(grid_matrix);
        	fdb.ref().update(update_canvas);
		}
	});

});