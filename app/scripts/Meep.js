/* global console, jQuery, $, TrackGA */
// communications script

(function() {
  'use strict';
  // this function is strict...
}());

var Meep = (function($) {
  //vars
  var username = null,
    channel = null,
    dialVal = {},
    dialInt = null,

    init = function() {
      //add touch slider
      $('.carousel').swipe({

        swipe: function(event, direction, distance, duration, fingerCount, fingerData) {

          if (direction == 'left') $(this).carousel('next');
          if (direction == 'right') $(this).carousel('prev');

        },
        allowPageScroll: 'vertical'

      });

      //listen for enter key
      enterListener();

      console.log('Meep.init');
      $('#meep').carousel('pause');

      $('#register').on('click', function() {
        if (checkName()) {
          $('#meep').carousel('next');
        } else {
          //error
          alert('name error');
        }
      });

      //disable veritcal scroll
      document.ontouchmove = function(event) {
        event.preventDefault();
      };
      //disable selection
      document.selectstart = function(event) {
        event.preventDefault();
      };

      //connect button events
      $('#connect').on('click', function() {
        startMeep();
      });
      startMeep();
    },
    enterListener = function() {
      document.onkeypress = function(e) {
        if (e.keyCode == 13) {
          $('#meep').carousel('next');
        }
      };
    },
    checkName = function() {
      var name = $('#myname').val();
      return /^[A-Za-z\s]+$/.test(name);
    },
    startMeep = function() {
      channel = new HydnaChannel('ulx.hydna.net/test', 'rw');
      // then register an event handler that alerts the data-part of messages
      // as they are received.
      channel.onmessage = function(botMsg) {
        var data = JSON.parse(botMsg.data);
        $('#data').fadeIn();
        if (data.status !== undefined) {
          //write channel data to the spa page
          $('#data').html(data.status);
          console.log('data - undefined: ' + data.status);
        } else {
          for (var prop in data) {
            //update dial
            // if(data.status)
            //TODO - Don't fire this if this is the user instance that made the change.
            // Or check that when we make changes to this it doesn't fire the release event.

            if (prop == 'dial') {
              $('.dial').val(data[prop]).trigger('change');
            }
            if (prop == 'servo') {
              console.log('servo: ' + data[prop][0].id + ' degrees: ' + data[prop][0].deg);

              $('#data').html('servo: ' + data[prop][0].id + ' degrees: ' + data[prop][0].deg);
            }
            //console.log('wooo: ' + data[prop] );

            // $('#data').html(prop + ' ' + data[prop].toString());
            //console.log(data);

          }
        }
        //if bot syn - acknowledge
        if (data.status == 'bot-syn') {
          sendMeep({
            'status': 'client-ack'
          });
          connectGUI();
        }
        //if bot ack - GUI update
        if (data.status == 'bot-ack') {
          connectGUI();
        }
      };
      channel.onopen = function() {
        var msg = {
          'status': 'client-syn'
        };
        sendMeep(msg);
      };
      channel.onclose = function(event) {
        $('#data').html('Channel closed: ' + event.reason);
        console.log('Channel closed: ' + event.reason);
        $('#connect').removeClass('btn-success').addClass('btn-danger');
        $('#connect').html('click to connect');
        return setTimeout(startMeep, 3000);
      };
      channel.onsignal = function(event) {
        $('#connect').html('signal received: ' + event.data);
      };
    },
    connectGUI = function() {
      console.log('connectGUI');
      $('#connect').removeClass('btn-danger').addClass('btn-success');
      $('#connect').html('connected');
    },
    disconnectGUI = function() {
      console.log('disconnectGUI');
      $('#connect').removeClass('btn-success').addClass('btn-danger');
      $('#led').removeClass('led-red-on');
      $('#connect').html('disconnected');
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
    init: init,
    sendMeep: sendMeep
  };
}(jQuery));

$(function() {
  Meep.init();
});
