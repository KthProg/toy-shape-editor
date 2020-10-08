import React, { Component } from 'react'

import { Col, Container, Row, Button, FormGroup } from 'react-bootstrap'
import Shape from '../Shape/Shape';

import Utils from '../Utils';

class ShapeEditor extends Component {
    constructor(){
        super()
        this.state = {
            activelyEditingShape: null,
            activelyMovingShape: null,
            canvasSize: 500
        }

        this.shapes = [];

        var shapesJson = localStorage.getItem('shapes');

        if(shapesJson){
            var savedShapes = JSON.parse(shapesJson);
            this.shapes = savedShapes.map(shapeData => new Shape(shapeData));
        }

        this.canvas = React.createRef();
        this.imageDownloadLink = React.createRef();

        this.areMouseEventsEnabled = false;
        this.isMouseDown = false;

        this.activeShapeSizeChanged = this.activelyEditingShapeSizeChanged.bind(this);
    }

    saveToImage(){
        var imgUrl = this.canvas.current.toDataURL('image/png');
        this.imageDownloadLink.current.href = imgUrl;
        this.imageDownloadLink.current.download = 'toy-shape-editor-image-' + new Date().toISOString() + '.png';
        this.imageDownloadLink.current.click();
    }

    activelyEditingShapeWidthChanged(value){
        if(this.state.activelyEditingShape.type == Shape.SHAPE_TYPES.MULTIPLE){ return; }
        this.setState(state => {
            state.activelyEditingShape.size.width = Number(value);
            this.renderShapes();
            return state;
        });
    }

    activelyEditingShapeHeightChanged(value){
        if(this.state.activelyEditingShape.type == Shape.SHAPE_TYPES.MULTIPLE){ return; }
        this.setState(state => {
            state.activelyEditingShape.size.height = Number(value);
            this.renderShapes();
            return state;
        });
    }

    activelyEditingShapeSizeChanged(value){
        if(this.state.activelyEditingShape.type == Shape.SHAPE_TYPES.MULTIPLE){ return; }
        this.setState(state => {
            state.activelyEditingShape.size = Number(value);
            this.renderShapes();
            return state;
        });
    }

    activelyEditingShapeColorChanged(value){
        if(this.state.activelyEditingShape.type == Shape.SHAPE_TYPES.MULTIPLE){ return; }
        this.setState(state => {
            state.activelyEditingShape.color = value;
            this.renderShapes();
            return state;
        });
    }

    addShape(shapeType){
        if(shapeType === Shape.SHAPE_TYPES.CIRCLE){
            this.shapes.push(new Shape(shapeType, { x: this.state.canvasSize / 2, y: this.state.canvasSize / 2 }, 25, Utils.randomColor));
        }else if(shapeType === Shape.SHAPE_TYPES.RECTANGLE){
            this.shapes.push(new Shape(shapeType, { x: this.state.canvasSize / 2, y: this.state.canvasSize / 2 }, { width: 50, height: 50 }, Utils.randomColor));
        }

        this.renderShapes();
    }

    componentDidMount(){
        this.renderShapes();
    }

    deleteActivelyEditingShape(){
        if(this.state.activelyEditingShape.type == Shape.SHAPE_TYPES.MULTIPLE){ return; }
        this.shapes = this.shapes.filter(shape => shape != this.state.activelyEditingShape);
        this.setState({ activelyEditingShape: null });
        this.renderShapes();
    }

    renderShapes(){
        localStorage.setItem('shapes', JSON.stringify(this.shapes));

        var ctx = this.canvas.current.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);

        this.shapes.forEach(shape => {
            ctx.lineWidth = shape.isHighlighted ? 2 : 0;
            ctx.fillStyle = shape.color;
            ctx.beginPath();
            if(shape.type === Shape.SHAPE_TYPES.CIRCLE){
                ctx.arc(shape.position.x, shape.position.y, shape.size, 0, Math.PI * 2, true);
            }else if(shape.type === Shape.SHAPE_TYPES.RECTANGLE){
                ctx.rect(shape.position.x - shape.size.width / 2, shape.position.y - shape.size.height / 2, shape.size.width, shape.size.height);
            }
            ctx.fill();
            if(shape.isSelected){
                ctx.lineWidth = 4;
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.stroke();
            } else if(shape.isHighlighted){
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
                ctx.stroke();
            }
        });
    }

    onMouseDown(evt){
        this.isMouseDown = true;
    }

    onMouseUp(evt){
        this.isMouseDown = false;
    }

    onMouseClick(evt){
        if(this.state.activelyMovingShape) { return; }

        var canvasPosition = this.canvas.current.getBoundingClientRect();

        var mouseX = evt.clientX - canvasPosition.x;
        var mouseY = evt.clientY - canvasPosition.y;

        var shapeUnderCursor = this.getShapeAtPoint({ x: mouseX, y: mouseY });

        if(!shapeUnderCursor){
            this.shapes.forEach(shape => shape.isSelected = false);
            this.setState({ activelyEditingShape: null });
            this.renderShapes();
            return; 
        }

        if(!evt.shiftKey){
            // clear all other selections if the 
            // shift key is not being held down
            this.shapes.forEach(shape => {
                if(shape === shapeUnderCursor){ return; }
                shape.isSelected = false;
            });
        }

        // toggle selection of shape that was clicked
        shapeUnderCursor.isSelected = !shapeUnderCursor.isSelected;

        var selectedShapes = this.shapes.filter(shape => shape.isSelected);

        if(selectedShapes.length === 0){
            this.setState({ activelyEditingShape: null });
        }else if(selectedShapes.length === 1){
            if(selectedShapes[0] !== shapeUnderCursor){
                console.log('single selected shape did not match last shape clicked');
            }
            this.setState({ activelyEditingShape: selectedShapes[0] });
        }else{
            this.setState({
                activelyEditingShape: this.getCombinedGroupShape(selectedShapes)
            });
        }

        this.renderShapes();
    }

    getCombinedGroupShape(selectedShapes){
        var leftCoords = selectedShapes.map(shape => shape.left);
        var topCoords = selectedShapes.map(shape => shape.top);
        var rightCoords = selectedShapes.map(shape => shape.right);
        var bottomCoords = selectedShapes.map(shape => shape.bottom);
        return new Shape(
            Shape.SHAPE_TYPES.MULTIPLE, 
            {
                x: (Math.max.apply(this, rightCoords) + Math.min.apply(this, leftCoords)) / 2,
                y: (Math.max.apply(this, bottomCoords) + Math.min.apply(this, topCoords)) / 2,
            },{
                width: Math.max.apply(this, rightCoords) - Math.min.apply(this, leftCoords),
                height: Math.max.apply(this, bottomCoords) - Math.min.apply(this, topCoords)
            }, '#000000'
        );
    }

    onMouseMove(evt){
        var canvasPosition = this.canvas.current.getBoundingClientRect();

        var mouseX = evt.clientX - canvasPosition.x;
        var mouseY = evt.clientY - canvasPosition.y;

        var shapeUnderCursor = this.state.activelyMovingShape || this.getShapeAtPoint({ x: mouseX, y: mouseY });
        this.shapes.forEach(shape => shape.isHighlighted = (shape === shapeUnderCursor));

        if(!this.isMouseDown){
            this.setState({ activelyMovingShape: null });
        } else if(shapeUnderCursor){
            if(this.state.activelyMovingShape != shapeUnderCursor){
                this.setState({ activelyMovingShape: shapeUnderCursor });
            }
            this.shapes.forEach(shape => {
                if(!shape.isSelected && shape !== shapeUnderCursor){ return; }
                shape.position.x += evt.movementX;
                shape.position.y += evt.movementY;
            });
        }

        this.renderShapes();
    }

    getShapeAtPoint(point){
        for(var shapeIndex = 0; shapeIndex < this.shapes.length; ++shapeIndex){
            var shape = this.shapes[shapeIndex];
            if(shape.type === Shape.SHAPE_TYPES.CIRCLE){
                var distanceBetweenCursorAndShapeCenter = 
                    Math.sqrt(
                        Math.pow(shape.position.x - point.x, 2) +
                        Math.pow(shape.position.y - point.y, 2)
                    );
                if(distanceBetweenCursorAndShapeCenter <= shape.size){
                    return shape;
                }
            }else if(shape.type === Shape.SHAPE_TYPES.RECTANGLE){
                var rectLeft = shape.position.x - (shape.size.width / 2);
                var rectTop = shape.position.y - (shape.size.height / 2); 
                if(point.x >= rectLeft &&
                    point.y >= rectTop &&
                    point.x <= rectLeft + shape.size.width &&
                    point.y <= rectTop + shape.size.height){
                    return shape;
                }
            }
        }
        return null;
    }

    render(){
        return <Row className="shape-editor">
                <Col md="8">
                    <Row>
                        <Col lg="2">
                            <FormGroup>
                                <Button onClick={this.addShape.bind(this, Shape.SHAPE_TYPES.RECTANGLE)}>
                                    + Rectangle
                                </Button>
                                <Button onClick={this.addShape.bind(this, Shape.SHAPE_TYPES.CIRCLE)}>
                                    + Circle
                                </Button>
                                <Button onClick={this.saveToImage.bind(this)}>
                                    Download
                                </Button>
                            </FormGroup>
                        </Col>
                        <Col lg="10">
                            <canvas
                                className="editor-section"
                                onClick={this.onMouseClick.bind(this)}
                                onMouseDown={this.onMouseDown.bind(this)}
                                onMouseUp={this.onMouseUp.bind(this)}
                                onMouseMove={this.onMouseMove.bind(this)}
                                height={this.state.canvasSize} 
                                width={this.state.canvasSize}
                                ref={this.canvas} />
                        </Col>
                    </Row>
                </Col>
                <Col md="4">
                    <div className="editor-section shape-properties">
                        { !this.state.activelyEditingShape && <Row>
                                <Col lg="12">
                                    No shape selected
                                </Col>
                            </Row>
                        }
                        { this.state.activelyEditingShape && <Row>
                            <Col lg="12">
                                <Row>
                                    <Col lg="6">
                                        <Button disabled={this.state.activelyEditingShape.type == Shape.SHAPE_TYPES.MULTIPLE} onClick={this.deleteActivelyEditingShape.bind(this)}>
                                            Delete
                                        </Button>
                                    </Col>
                                    <Col lg="6">
                                        <span className="float-right">{this.state.activelyEditingShape.type}</span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="12">
                                <FormGroup>
                                    <label>Center</label>
                                    <output>{this.state.activelyEditingShape.position.x.toFixed(0)}, {this.state.activelyEditingShape.position.y.toFixed(0)}</output>
                                </FormGroup>
                            </Col>
                            {this.state.activelyEditingShape.type == Shape.SHAPE_TYPES.CIRCLE && <Col lg="12">
                                <FormGroup>
                                    <label>Radius</label>
                                    <input onChange={(evt) => this.activelyEditingShapeSizeChanged(evt.target.value)} type="range" min="3" max={this.state.canvasSize / 2} value={this.state.activelyEditingShape.size}/>
                                </FormGroup>
                            </Col>}
                            {(
                                this.state.activelyEditingShape.type == Shape.SHAPE_TYPES.RECTANGLE || 
                                this.state.activelyEditingShape.type == Shape.SHAPE_TYPES.MULTIPLE
                            ) && <Col lg="12">
                                <FormGroup>
                                    <label>Width</label>
                                    <input onChange={(evt) => this.activelyEditingShapeWidthChanged(evt.target.value)} type="range" min="5" max={this.state.canvasSize} value={this.state.activelyEditingShape.size.width} />
                                </FormGroup>
                                <FormGroup>
                                    <label>Height</label>
                                    <input onChange={(evt) => this.activelyEditingShapeHeightChanged(evt.target.value)} type="range" min="5" max={this.state.canvasSize} value={this.state.activelyEditingShape.size.height}/>
                                </FormGroup>
                            </Col>}
                            {this.state.activelyEditingShape.type != Shape.SHAPE_TYPES.MULTIPLE && <Col lg="12">
                                <FormGroup>
                                    <label>Color</label>
                                    <input onChange={(evt) => this.activelyEditingShapeColorChanged(evt.target.value)} type="color" value={this.state.activelyEditingShape.color} />
                                </FormGroup>
                            </Col>}
                        </Row>}
                    </div>
                </Col>
                <a ref={this.imageDownloadLink} />
            </Row>
    }
}

export default ShapeEditor