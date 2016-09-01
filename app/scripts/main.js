//jquery function to check for dom ready
//TODO: add servos arms to property of an Object
//loop through those

$(function() {
  var dialVal = {},
  dialInt = null;

  //dial events
  $(".dial").knob({

    value: 0,
    angleOffset: 0,
    angleArc: 360,
    'release' : function(v){
      clearInterval(dialInt);
      dialInt = null;
    },
    'change': function(v) {
      if(dialInt === null){
        dialInt = setInterval(function(){
          Meep.sendMeep(dialVal);
        }, 1000/8); //200 for normal
      }
      dialVal = {
        "dial": Math.floor(v)
      };
      //send meep


    }
  });

  //set up canvas
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = $('#canvas_col').width(),
    height = canvas.height = $('#canvas_col').height(),

    arm0 = null,
    arm1 = null,
    arm2 = null,
    angle = 0,
    fps = 30,
    //rangeLoop = false, //need to fix
    payload = [],
    servos = [
      {id:0, val: 50, min: 5, max: 175, len: 0, orient: 0, direction: 1},         //base
      {id:1, val: 50, min: 5, max: 175, len: 60, orient: -180, direction: 1},     //seg1
      {id:2, val: 5, min: 5, max: 175, len: 30, orient: 0, direction: -1},        //seg2
      {id:3, val: 5, min: 5, max: 175, len: 10, orient: 0, direction: 1},         //seg3
      {id:4, val: 5, min: 5, max: 175, len: 0, orient: 0, direction: 1},          //wrist
      {id:5, val: 5, min: 5, max: 175, len: 0, orient: 0, direction: 1}           //grip
    ],

      //render varoiables
    stop = false,
    frameCount = 0,
    $results = $("#results"),
    fpsInterval, startTime, now, then, elapsed,

    // initialize the timer variables and start the animation
    startAnimating = function(fps) {
      fpsInterval = 1000 / fps;
      then = Date.now();
      startTime = then;
      renderFrame();
    },

    //translate min max to % of Math.PI (13.1)
    getRange = function(min, max) {
      var range = max - min;
      return range * Math.PI / 360;
    },
    getAngle = function(pi) {
      return pi * 360 / Math.PI;
    },
    //renderFrame animation frame of animation
    renderFrame = function() {

      // the animation loop calculates time elapsed since the last loop
      // and only draws if your specified fps interval is achieved
      // request another frame
      requestAnimationFrame(renderFrame);
      // calc elapsed time since last loop
      now = Date.now();
      elapsed = now - then;
      // if enough time has elapsed, draw the next frame
      if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        //sendpayload - object looks like this [{id:1, deg:90},{id:3, 10}]
        if(payload.length > 0){
          //remove cmds that don't have
          Meep.sendMeep({'servo': payload});
          payload = [];
        }

        renderArms();
        Sliders.updateSliders();
      }
    },
    renderArms = function() {
      var p = []; //percent of servo range ie. 0 - 100
      var a = []; //servo angle value ie. 0 - 3.14
      var d = []; //servo angle in degrees ie. 0 - 360
      for (var i = 0; i < Sliders.servos.length; i++) {
        var min = Number($('#servo' + i + 'min').val());
        var max = Number($('#servo' + i + 'max').val());
        var val = Number($('#servo' + i + 'value').val());
        var orient = Number($('#servo' + i + 'orient').val());
        var range = max - min;

        p[i] = val;//Math.floor((val - min) * 100 / range); //percent of total range
        a[i] = p[i] * Math.PI / 100; //angle
        d[i] = (p[i] * range / 100) + min;

        //console.log(d[0]);
        //console.log('percent: ' + (p[5] * range / 100));
      }


      //update arm angles and x and y
      //TODO: make dynamic

      arm0.angle = a[1];
      arm1.angle = a[2];
      arm2.angle = a[3];

      arm1.x = arm0.getEndX();
      arm1.y = arm0.getEndY();
      arm2.x = arm1.getEndX();
      arm2.y = arm1.getEndY();

      context.clearRect(0, 0, width, height);

      arm0.render(context);
      arm1.render(context);
      arm2.render(context);

      //check if new servo data

      for (var k = 0; k < Sliders.angle.length; k++) {
        if (Sliders.angle[k] != d[k]) {
          Sliders.angle[k] = d[k];
          var tempObj = {id: k, deg: d[k]};
          //remove id from previous payload
          payload = $.grep(payload, function(e){
               return e.id != k;
          });
          payload.push(tempObj);
          // console.log(payload);
        }
      }
    },
    //initialize values of gui from params at the tooltip
    initGui = function(){
      //set orientation
      for(var i = 0; i < servos.length; i++){
        //update input fields
        $('#servo'+ i +'len').val(servos[i].len);
        $('#servo'+ i +'min').val(servos[i].min);
        $('#servo'+ i +'max').val(servos[i].max);
        $('#servo'+ i +'value').val(servos[i].val);
        $('#servo'+ i +'orient').val(servos[i].orient);
        $('#servo'+ i +'direction').val(servos[i].direction);
        //update sliders
        //Sliders.updateSliders();
      }
    },
    //define arms
    createArms = function() {
      console.log("createArms");

      arm0 = Arm.create(width / 2, height / 2, $('#servo1len').val(), $('#servo1min').val(), $('#servo1max').val(), $('#servo0orient').val());
      arm1 = Arm.create(arm0.getEndX(), arm0.getEndY(), $('#servo2len').val(), $('#servo2min').val(), $('#servo2max').val(), $('#servo1orient').val());
      arm2 = Arm.create(arm1.getEndX(), arm1.getEndY(), $('#servo3len').val(), $('#servo3min').val(), $('#servo3max').val(), $('#servo2orient').val());
      //parent arms inside eachother
      arm1.parent = arm0;
      arm2.parent = arm1;
    };

  //detect changes in table and update arm
  $(".servos").change(function() {
    Sliders.updateSliders();
    renderArms();
  });
  // //detect changes in slider and update table (only table change updates arm)
  // $(".sliders").change(function() {
  //   //Sliders.updateSliders();
  // });
  // Sliders.updateSliders();
  initGui();
  createArms();
  startAnimating(fps);
  Sliders.create(6);
});
