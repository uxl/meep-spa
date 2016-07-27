/* jshint loopfunc:true */
//requires jquery
var Sliders = Sliders || {
  num: 0,
  initialized: false,
  servos: [],

  //translate min max to % of Math.PI (13.1)
  getRange: function(min, max) {
    var range = max - min;
    return range * Math.PI / 360;
  },
  create: function(number) {
    console.log('Sliders.create');
    this.num = 6;
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
    console.log('Sliders.updateSliders');
    for (var i = 1; i < (this.num + 1); i++) {
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
    this.num = num;
    if (!this.initalized) {
      for (var i = 1; i < (6 + 1); i++) {
        (function(i, t){
          t.servos[i] = $("#servo" + i).slider().on("change", function(e) {
            Sliders.updateValue(i, this.id, e.value.newValue);
          });
        })(i, this);
      }
    }
    this.initalized = true;
  }
};
