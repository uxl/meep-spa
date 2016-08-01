$(function() {



  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = $('#canvas_col').width(),
    height = canvas.height = $('#canvas_col').height(),
    orientation = -180, //up
    arm0 = null,
    arm1 = null,
    arm2 = null,
    angle = 0,
    fps = 15,
    rangeLoop = false, //need to fix
    payload = [],

    //render varoiables
    stop = false,
    frameCount = 0,
    $results = $("#results"),
    fps, fpsInterval, startTime, now, then, elapsed,

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


        if (rangeLoop) {
          updateLoop();
        }

        //sendpayload
        if(payload.length > 0){
          //remove cmds that don't have
          MEEP.sendMeep({'servo': payload});
          payload = [];
        }

        renderArms();
        Sliders.updateSliders();
      }
    },
    updateLoop = function() {
      console.log("updateLoop");

      context.clearRect(0, 0, width, height);

      var a1 = Math.sin(angle) * getRange(arm1.min, arm1.max);
      var a2 = Math.sin(angle) * getRange(arm1.min, arm2.max);
      var a3 = Math.sin(angle) * getRange(arm1.min, arm2.max);

      //animate back and forth
      arm1.angle = a1;
      arm2.angle = a2;
      arm3.angle = a3;

      arm2.x = arm1.getEndX();
      arm2.y = arm1.getEndY();
      arm3.x = arm2.getEndX();
      arm3.y = arm2.getEndY();

      angle += 0.05;

      arm1.render(context);
      arm2.render(context);
      arm3.render(context);
    },
    renderArms = function() {
      var p = []; //percent of servo range
      var a = []; //servo angle value ie. 0 - 3.14
      var d = []; //servo angle in degrees ie. 0 - 360

      for (var i = 0; i < Sliders.servos.length; i++) {
        p[i] = Math.floor(Number($('#servo' + i + 'value').val() * 100 / $('#servo' + i + 'max').val() - $('#servo' + i + 'min').val()));
        a[i] = p[i] * Math.PI / 100;
        d[i] = p[i] * $('#servo' + i + 'max').val() / 100;
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
        }
      }
    },
    //update table and sliders if arm animating
    updateConfig = function() {
      return range * angle / Math.PI + Math.abs(orientation) / 2;
    },
    //define arms
    createArms = function() {
      console.log("createArms");
      orientation = $('#orientation').val();

      arm0 = Arm.create(width / 2, height / 2, $('#servo1len').val(), $('#servo1min').val(), $('#servo1max').val(), orientation);
      arm1 = Arm.create(arm0.getEndX(), arm0.getEndY(), $('#servo2len').val(), $('#servo2min').val(), $('#servo2max').val(), orientation);
      arm2 = Arm.create(arm1.getEndX(), arm1.getEndY(), $('#servo3len').val(), $('#servo3min').val(), $('#servo3max').val(), orientation);
      //parent arms inside eachother
      arm1.parent = arm0;
      arm2.parent = arm1;
    };

  //detect changes in table and update arm
  $(".servos").change(function() {
    Sliders.updateSliders();
    renderArms();


  });
  //detect changes in slider and update arm
  $(".sliders").change(function() {
    Sliders.updateSliders();
    renderArms();
  });
  Sliders.create(6);
  Sliders.updateSliders();
  createArms();

  startAnimating(fps);

});
