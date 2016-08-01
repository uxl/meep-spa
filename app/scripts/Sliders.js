/* jshint loopfunc:true */
//requires jquery
var Sliders = Sliders || {
  num: 0,
  initialized: false,
  servos: [],
  angle: [],

  //translate min max to % of Math.PI (3.14159...)
  getRange: function(min, max) {
    var range = max - min;
    return range * Math.PI / 360;
  },
  create: function(number) {
    console.log('Sliders.create');
    this.num = number;
    var obj = Object.create(this);
    obj.init(number);
    return obj;
  },
  //
  updateValue: function(id, elm, value, dragging) { //need to pass id number
    if(!dragging){
      this.servos[id].slider('setValue', Number(value));
    }
    $("#" + elm + "label").html(value);
    $("#" + elm + "value").val(value);
    //record angle in array
    //this.angle[id] = Number(value);
  },
  updateRange: function(id, elm, min, max) {
    var min = Number(min);
    var max = Number(max);
    this.servos[id].slider('setAttribute', 'min', min);
    this.servos[id].slider('setAttribute', 'max', max);
    if (this.servos[id].slider('getAttribute', 'value') < min) {
      this.updateValue(id, elm, min, false);
    }
    if (this.servos[id].slider('getAttribute', 'value') > max) {
      this.updateValue(id, elm, max, false);
    }
  },
  updateSliders: function() {
    // console.log('Sliders.updateSliders');
    for (var i = 0; i < this.num; i++) {
      var elm = 'servo' + i;
      var min = $('#servo' + i + 'min').val();
      var max = $('#servo' + i + 'max').val();
      var value = $('#servo' + i + 'value').val();
      this.updateRange(i, elm, min, max);
      this.updateValue(i, elm, value, false);
    }
  },
  //set pivot point
  init: function(num) {
    if (!this.initalized) {
      for (var i = 0; i < this.num; i++) {
        //closure nessessary for event parameters
        (function(i, t){
          t.servos[i] = $("#servo" + i).slider().on("change", function(e) {
            Sliders.updateValue(i, this.id, e.value.newValue);
          });
        })(i, this);
        //fill angle[] with default value: 0
        this.angle[i] = 0;
      }
    }
    this.initalized = true;
  }
};
