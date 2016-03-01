/* global console, jQuery, $, TrackGA */
// meep robot
// Mullen - Wilkinson 2016

'use strict';

var MEEP = (function($) {
  //vars
  var channel,
    ledOn = {
      "led": true
    },
    ledOff = {
      "led": false
    },
    dialVal = {},

    init = function() {
      console.log('MEEP.init');
      //disable veritcal scroll
      document.ontouchmove = function(event) {
          event.preventDefault();
        }
        //disable selection
      document.selectstart = function(event) {
          event.preventDefault();
        }
        //dial events
      $(".dial").knob({
        value: 0,
        angleOffset: -125,
        angleArc: 250,
        'release': function(v) {
          dialVal = {
            "dial": v
          };
          sendMeep(dialVal);
        }
      });
      //led button events
      $('#led').on('mousedown touchstart', function() {
        sendMeep(ledOn);
        $('#led').addClass("led-red-on");
      })
      $('#led').on('mouseup touchend', function() {
          sendMeep(ledOff);
          $('#led').removeClass("led-red-on");
        })
        //connect button events
      $('#connect').on('click', function() {
        startMeep();
      });
      startMeep();
    },
    startMeep = function() {
      channel = new HydnaChannel('ulx.hydna.net/test', 'rw');
      // then register an event handler that alerts the data-part of messages
      // as they are received.
      channel.onmessage = function(botMsg) {
        var data = JSON.parse(botMsg.data);
        $('#data').fadeIn();
        debugger;
        console.log('data[status]: ' + data["status"]);
        console.log('data: ' + data);
        $('#data').html(data);

        if(data["status"] == "hi"){
          $('#connect').removeClass("btn-danger").addClass("btn-success");
          $('#connect').html("connected");
        }

      };
      channel.onopen = function() {
        var msg = {"status":"client-online"};
        sendMeep(msg);
      };
      channel.onclose = function(event) {
        console.log("Channel closed: " + event.reason);
        $('#connect').removeClass("btn-success").addClass("btn-danger");
        $('#connect').html("click to connect");
      };
      channel.onsignal = function(event) {
        $('#connect').html('signal received: ' + event.data);
      }
    },
    sendMeep = function(msg) {
      var data = JSON.stringify(msg);
      try {
        channel.send(data);
      } catch (e) {
        console.log(e);
      }
    },
    offline = function() {
      $('#connect').removeClass("btn-success").addClass("btn-danger");
      $('#led').removeClass("led-red-on");
      $('#data').html('disconnected');
    };
  return {
    init: init
  };
}(jQuery));

$(function() {
  MEEP.init();
});
