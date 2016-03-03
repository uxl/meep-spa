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
        if(data["status"] !== undefined){
          $('#data').html(data["status"]);
          console.log('data: ' + data["status"]);
        }else{
          for( var prop in data ) {
          $('#data').html(data[prop].toString());
          console.log(data);
        }
      }
        //if bot syn - acknowledge
        if(data["status"] == "bot-syn"){
          sendMeep({
                "status": "client-ack"
              });
          connectGUI();
        };
        //if bot ack - GUI update
        if(data["status"] == "bot-ack"){
          connectGUI();
        };
      };
      channel.onopen = function() {
        var msg = {"status":"client-syn"};
        sendMeep(msg);
      };
      channel.onclose = function(event) {
        $('#data').html("Channel closed: " + event.reason);
        console.log("Channel closed: " + event.reason);
        $('#connect').removeClass("btn-success").addClass("btn-danger");
        $('#connect').html("click to connect");
        return setTimeout(startMeep, 3000);
      };
      channel.onsignal = function(event) {
        $('#connect').html('signal received: ' + event.data);
      }
    },
    connectGUI = function(){
      console.log("connectGUI");
      $('#connect').removeClass("btn-danger").addClass("btn-success");
      $('#connect').html("connected");
    },
    disconnectGUI = function(){
      console.log("disconnectGUI");
      $('#connect').removeClass("btn-success").addClass("btn-danger");
      $('#led').removeClass("led-red-on");
      $('#connect').html("disconnected");
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
      disconnectGUI();
    };
  return {
    init: init
  };
}(jQuery));

$(function() {
  MEEP.init();
});
