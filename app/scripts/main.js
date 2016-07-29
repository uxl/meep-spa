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
    fps = 5,
    rangeLoop = false, //need to fix

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
    getAngle = function(pi){
      return pi * 360/Math.PI;
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

        renderArms();
        Sliders.updateSliders();
      }
    },
    updateLoop = function(){
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

      var p1 = $('#servo1value').val() * 100 / $('#servo1max').val() - $('#servo1min').val();
      var p2 = $('#servo2value').val() * 100 / $('#servo2max').val() - $('#servo2min').val();
      var p3 = $('#servo3value').val() * 100 / $('#servo3max').val() - $('#servo3min').val();
      // debugger;
      console.log(p1);

      var a1 = p1 * Math.PI / 100;
      var a2 = p2 * Math.PI / 100;
      var a3 = p3 * Math.PI / 100;

      //update arm angles and x and y
      arm0.angle = a1;
      arm1.angle = a2;
      arm2.angle = a3;

      arm1.x = arm0.getEndX();
      arm1.y = arm0.getEndY();
      arm2.x = arm1.getEndX();
      arm2.y = arm1.getEndY();

      context.clearRect(0, 0, width, height);

      arm0.render(context);
      arm1.render(context);
      arm2.render(context);
      //updateArms();

    },
    //update table and sliders if arm animating
    updateConfig = function() {
      return range * angle / Math.PI + Math.abs(orientation) / 2;
    },

    //update robot arms + send data?
    // updateArms = function() {
    //   console.log("updateArms");
    //   orientation = $('#orientation').val();
    //
    //   arm0.init(width / 2, height / 2, $('#servo1len').val(), $('#servo1min').val(), $('#servo1max').val(), orientation);
    //   arm1.init(arm0.getEndX(), arm0.getEndY(), $('#servo2len').val(), $('#servo2min').val(), $('#servo2max').val(), orientation);
    //   arm2.init(arm1.getEndX(), arm1.getEndY(), $('#servo3len').val(), $('#servo3min').val(), $('#servo3max').val(), orientation);
    // },

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

  //listeners
  $(".servos").change(function() {
    Sliders.updateSliders();
    console.log("change of servos");
    renderArms();
  });
  $(".sliders").change(function() {
    Sliders.updateSliders();
    console.log("change of servos");
    renderArms();
  });
  Sliders.create(6);
  Sliders.updateSliders();
  createArms();

  startAnimating(fps);

});
