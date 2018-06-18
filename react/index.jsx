import React from 'react';
import ReactDOM from 'react-dom';
import './css/sheet.css';

class GridChart extends React.Component {
	constructor(props){
		super(props);
		this.dims = 600;
		this.sqDims = 20;
	}

	componentDidMount(){
		this.updateCanvas();
	}
 	
 	componentDidUpdate() {
        this.updateCanvas();
    }

	updateCanvas(){
		const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(0,0,600,600);
		ctx.beginPath();
		ctx.lineWidth = 1;
		for(var i=this.sqDims;i<=this.dims; i+=this.sqDims){
			ctx.moveTo(0,i);
			ctx.lineTo(this.dims,i)
			ctx.stroke();

			ctx.moveTo(i,0);
			ctx.lineTo(i,this.dims)
		}
	}

	render() {
		return (
			<canvas ref="canvas" width={this.dims} height={this.dims} />
			)
	}

}

// class GridSquare extends React.Component {

// }

ReactDOM.render(<GridChart/>, document.getElementById('react-grid-area'));
