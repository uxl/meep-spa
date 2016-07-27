/* jshint loopfunc:true */
//requires jquery

var Sliders = Sliders || {
  num: 0,
  initialized: false,
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
  updateValue: function(elm,value){
    elm.slider('setValue', Number(value));
    $(elm.selector + "label").html(value);
    $(elm.selector + "value").val(value);
  },
  updateRange: function(elm,min,max){
    var min = Number(min);
    var max = Number(max);
    elm.slider('setAttribute', 'min', min);
    elm.slider('setAttribute', 'max', max);
    if(elm.slider('getAttribute', 'value') < min){
      this.updateValue(elm, min);
    }
    if(elm.slider('getAttribute', 'value') > max){
      this.updateValue(elm, max);
    }
  },
  updateSliders: function(){
    console.log('Sliders.updateSliders');
    for(var i = 1; i < (this.num + 1); i++){
      var elm = $('#servo' + i);
      var min = $('#servo' + i + 'min').val();
      var max = $('#servo' + i + 'max').val();
      var value = $('#servo' + i + 'value').val();

      this.updateRange(elm, min, max);
      this.updateValue(elm, value);
    }
  },
  //set pivot point
  init: function(num){
    this.num = num;
    if(!this.initalized){
    for(var i=1; i < (num + 1); i++){
      $("#servo" + i).slider();

      $("#servo" + i).on("change", function(e){
        var $elm = $('#' + this.id + 'label');
        Sliders.updateValue($('#' + this.id), e.value.newValue);
      });
    }
    }
  }
};
