//disable veritcal scroll
document.ontouchmove = function(event){
    event.preventDefault();
}
//disable selection
document.selectstart = function(event){
    event.preventDefault();
}

var channel;

//commands
var ledOn = {"led": true};
var ledOff = {"led": false};
var dialVal = {};

var startMeep = function() {
  channel = new HydnaChannel('ulx.hydna.net/test', 'rw');

  // then register an event handler that alerts the data-part of messages
  // as they are received.
  channel.onmessage = function(event) {
    $('#data').fadeIn();
    $('#data').html(event.data);
  };
  // finally we add an event handler that sends a message as soon as
  // the channel has been opened.
  channel.onopen = function() {
    //channel.send('Hello there!');
    console.log('channel open');
    sendMeep('client online');
    $('#connect').removeClass("btn-danger").addClass("btn-success");
    $('#connect').html("connected");
  };
  channel.onclose = function(event) {
    console.log("Channel closed: " + event.reason);
    $('#connect').removeClass("btn-success").addClass("btn-danger");
    $('#connect').html("click to connect");
  };
  channel.onsignal = function(event) {
    $('#connect').html('signal received: ' + event.data);
  }
}
var sendMeep = function(msg){
  var data = JSON.stringify(msg);
  try {
    channel.send(data);
  } catch (e) {
    console.log(e);
    //offline();
  }
}
var offline = function(){
  $('#connect').removeClass("btn-success").addClass("btn-danger");
  $('#led').removeClass("led-red-on");
  $('#data').html('disconnected');
}
$(function() {
  $(".dial").knob({
    value: 0,
    angleOffset : -125,
    angleArc : 250,
    'release' : function (v) {
      dialVal = {"dial": v};
      sendMeep(dialVal);
    }
  });

  $('#led').on('mousedown touchstart', function() {
      sendMeep(ledOn);
    $('#led').addClass("led-red-on");
  })
  $('#led').on('mouseup touchend', function() {
    sendMeep(ledOff);
    $('#led').removeClass("led-red-on");
  })

  $('#connect').on('click', function() {
    startMeep();
  })
});
