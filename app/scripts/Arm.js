var Arm = Arm || {
  x: 0,
  y: 0,
  length: 100,
  angle: 0,
  orientation: 0,
  parent: null,
  min: 0,
  max: 180,
  //translate min max to % of Math.PI (13.1)
  getRange: function(min, max) {
    var range = max - min;
    return range * Math.PI / 360;
  },
  create: function(x, y, length, min, max, orientation, direction) {
    // console.log('x:' + x, 'y:' + y, 'length:' + length, 'min:' + min, 'max:' + max, 'orientation:' + orientation, 'direction:' + direction);
    var obj = Object.create(this);
    obj.init(x, y, length, min, max, orientation, direction);
    return obj;
  },
  //set pivot point
  init: function(x, y, len, min, max, orientation, direction) {
    console.log('x:' + x, 'y:' + y, 'length:' + length, 'min:' + min, 'max:' + max, 'orientation:' + orientation, 'direction:' + direction);
    this.x = x;
    this.y = y;
    this.length = len;
    this.min = min;
    this.max = max;
    this.angle = this.getRange(min, max);
    this.orientation = orientation;
    this.direction = direction;
  },
  //get end point of segment x and y
  getEndX: function() {
    var angle = this.angle,
    parent = this.parent;
    while(parent){
      angle += parent.angle;
      parent = parent.parent;
    }
    return this.x + Math.cos(angle + this.orientation*Math.PI/360 + this.min*Math.PI/360) * this.length;
  },
  getEndY: function() {
    var angle = this.angle,
    parent = this.parent;
    while(parent){
      angle += parent.angle;
      parent = parent.parent;
    }
    return this.y + Math.sin(angle + this.orientation*Math.PI/360 + this.min*Math.PI/360) * this.length;
  },

  render: function(context) {
    context.strokeStyle = "#777";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.getEndX(), this.getEndY());
    context.stroke();
  }
};
