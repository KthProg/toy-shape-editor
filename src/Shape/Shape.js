
class Shape {
    static SHAPE_TYPES = {
        MULTIPLE: 'multiple',
        CIRCLE: 'circle',
        RECTANGLE: 'rectangle'
    }

    constructor(type, position, size, color){
        if(arguments.length === 1){
            var shapeData = type;
            this.type = shapeData.type;
            this.position = shapeData.position;
            this.size = shapeData.size;
            this.color = shapeData.color;
            this.isHighlighted = shapeData.isHighlighted;
            this.isSelected = shapeData.isSelected;
            return;
        }
        this.type = type;
        this.position = position;
        this.size = size;
        this.color = color;
        this.isHighlighted = false;
        this.isSelected = false;
    }

    get left(){
        if(this.type == Shape.SHAPE_TYPES.RECTANGLE){
            return this.position.x - (this.size.width / 2);
        }
        return this.position.x - this.size;
    }

    get top(){
        if(this.type == Shape.SHAPE_TYPES.RECTANGLE){
            return this.position.y - (this.size.height / 2);
        }
        return this.position.y - this.size;
    }

    get right(){
        if(this.type == Shape.SHAPE_TYPES.RECTANGLE){
            return this.position.x + (this.size.width / 2);
        }
        return this.position.x + this.size;
    }

    get bottom(){
        if(this.type == Shape.SHAPE_TYPES.RECTANGLE){
            return this.position.y + (this.size.height / 2);
        }
        return this.position.y + this.size;
    }
}

export default Shape