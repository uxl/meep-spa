var indexClosure = (function(i, id, value) {

  console.log('id', id);
   var i = i;
  // var id = id;
  // var value = value;

  return function(i,id,value) {
    var j = i;
    console.log('j', j);

    Sliders.updateValue(j, $('#' + id), value);
  };
})();

$(function() {



  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = $('#canvas_col').width(),
    height = canvas.height = $('#canvas_col').height(),
    orientation = -180, //up
    arm1 = null,
    arm2 = null,
    arm3 = null,
		angle = 0,

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

        // Put your drawing code here



      context.clearRect(0, 0, width, height);

      var a1 = Math.sin(angle) * getRange(arm1.min, arm1.max);
      var a2 = Math.sin(angle) * getRange(arm1.min, arm2.max);
      var a3 = Math.sin(angle) * getRange(arm1.min, arm2.max);

      $('#servo4value').val(Math.floor((arm1.max - arm2.min)*a3/Math.PI + Math.abs(orientation)/2));
      // $('#servo3value').val(Math.PI + a2 - Math.PI);
      // $('#servo4value').val(a3 - Math.PI);
			//animate back and forth
      arm1.angle = a1;
      arm2.angle = a2;
      arm3.angle = a3;

      arm2.x = arm1.getEndX();
      arm2.y = arm1.getEndY();
      arm3.x = arm2.getEndX();
      arm3.y = arm2.getEndY();

      //angle += 0.05;

      arm1.render(context);
      arm2.render(context);
      arm3.render(context);

      //updateSliders
      //Sliders.updateSliders();
}

    },

  	updateArms = function() {
      console.log("updateArms");
			orientation = $('#orientation').val();

      arm1.init(width / 2, height / 2, $('#servo2len').val(), $('#servo2min').val(), $('#servo2max').val(), orientation);
      arm2.init(arm1.getEndX(), arm1.getEndY(), $('#servo3len').val(), $('#servo3min').val(), $('#servo3max').val(), orientation);
      arm3.init(arm2.getEndX(), arm2.getEndY(), $('#servo4len').val(), $('#servo4min').val(), $('#servo4max').val(), orientation);


    },
    //update frontend
    //update gui
    updateGui = function(){

    },

    //define arms
    createArms = function() {
			console.log("createArms");
			orientation = $('#orientation').val();

      arm1 = Arm.create(width / 2, height / 2, $('#servo2len').val(), $('#servo2min').val(), $('#servo2max').val(), orientation);
			arm2 = Arm.create(arm1.getEndX(), arm1.getEndY(), $('#servo3len').val(), $('#servo3min').val(), $('#servo3max').val(), orientation);
			arm3 = Arm.create(arm2.getEndX(), arm2.getEndY(), $('#servo4len').val(), $('#servo4min').val(), $('#servo4max').val(), orientation);
      //parent arms inside eachother
			arm2.parent = arm1;
		  arm3.parent = arm2;
    };

    //listeners
    $(".servos").change(function() {
      Sliders.updateSliders();
      updateArms();
		});
    Sliders.create(6);
    Sliders.updateSliders();
    createArms();


    startAnimating(5);

});
