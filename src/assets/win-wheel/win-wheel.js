let theWheel;
function createWheel() {
  // $('#img_arrow')[0].style.left=((window.screen.width/2)-80)+'px'
  let color_violet = "#3D30A2";
  let color_green = "#3D30A2";
  let color_red = "#3D30A2";

  let text_color_red = "#fff";
  let text_color_violet = "#fff";
  let text_color_green = "#fff";
  let text_stroke = "#fff";
  let text_stroke_violet = "#fff";

  theWheel = new Winwheel({
    canvasId: "wheel_canvas",
    numSegments: 10,
    outerRadius: 212,
    textFontSize: 40,
    lineWidth: 3,
    // 'textOrientation': 'vertical',
    textFontFamily: "Comic Sans MS",
    innerRadius: 50,
    responsive: true,
    strokeStyle: "#ffc18c",
    fillStyle: "#ffc18c",
    // 'textOrientation': 'curved',
    segments: [
      {
        fillStyle: color_violet,
        text: "0",
        textLineWidth: 2,
        textStrokeStyle: text_stroke_violet,
        textFillStyle: text_color_violet,
        textFontSize: 68,
      },
      {
        fillStyle: color_green,
        text: "1",
        textLineWidth: 2,
        textStrokeStyle: text_stroke,
        textFillStyle: text_color_green,
        textFontSize: 68,
      },
      {
        fillStyle: color_red,
        text: "2",
        textLineWidth: 2,
        textStrokeStyle: text_stroke,
        textFillStyle: text_color_red,
        textFontSize: 68,
      },
      {
        fillStyle: color_green,
        text: "3",
        textLineWidth: 2,
        textStrokeStyle: text_stroke,
        textFillStyle: text_color_green,
        textFontSize: 68,
      },
      {
        fillStyle: color_red,
        text: "4",
        textLineWidth: 2,
        textStrokeStyle: text_stroke,
        textFillStyle: text_color_red,
        textFontSize: 68,
      },
      {
        fillStyle: color_violet,
        text: "5",
        textLineWidth: 2,
        textStrokeStyle: text_stroke_violet,
        textFillStyle: text_color_violet,
        textFontSize: 68,
      },
      {
        fillStyle: color_red,
        text: "6",
        textLineWidth: 2,
        textStrokeStyle: text_stroke,
        textFillStyle: text_color_red,
        textFontSize: 68,
      },
      {
        fillStyle: color_green,
        text: "7",
        textLineWidth: 2,
        textStrokeStyle: text_stroke,
        textFillStyle: text_color_green,
        textFontSize: 68,
      },
      {
        fillStyle: color_red,
        text: "8",
        textLineWidth: 2,
        textStrokeStyle: text_stroke,
        textFillStyle: text_color_red,
        textFontSize: 68,
      },
      {
        fillStyle: color_green,
        text: "9",
        textLineWidth: 2,
        textStrokeStyle: text_stroke,
        textFillStyle: text_color_green,
        textFontSize: 68,
      },
    ],
    animation: {
      type: "spinToStop",
      callbackSound: playSound,
      soundTrigger: "segment",
      callbackFinished: onSpinCompleted,
    },
    pins: {
      number: 10,
      fillStyle: "#ffc18c",
      outerRadius: 10,
      lineWidth: 6,
      strokeStyle: "#84240c",
      responsive: true,
    },
  });

  winwheelResize();

  let audio = new Audio("assets/win-wheel/tick.mp3");

  function playSound() {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }

  function onSpinCompleted(indicatedSegment) {
    window.spinWheelComponentReference.zone.run(() => {
      window.spinWheelComponentReference.onSpinCompleted();
    });
  }

  // Get canvas and span objects.
  let canvas = document.getElementById("wheel_canvas");

  // Specify click handler for canvas.
  canvas.onclick = function (e) {
    theWheel.segments.forEach((s) => {
      if (s) {
        s.lineWidth = 3;
        s.strokeStyle = "#ffc18c";
        s.textFontSize = 68;
        s.textLineWidth = 2;
        if (["0", "5"].includes(s.text)) {
          s.textFillStyle = text_color_violet;
          s.textStrokeStyle = text_stroke_violet;
        }

        if (["1", "3", "7", "9"].includes(s.text)) {
          s.textFillStyle = text_color_green;
          s.textStrokeStyle = text_stroke;
        }

        if (["2", "4", "6", "8"].includes(s.text)) {
          s.textFillStyle = text_color_red;
          s.textStrokeStyle = text_stroke;
        }
      }
    });
    // reset the segment colours.
    theWheel.segments[1].fillStyle = color_violet;
    theWheel.segments[6].fillStyle = color_violet;

    theWheel.segments[2].fillStyle = color_green;
    theWheel.segments[4].fillStyle = color_green;
    theWheel.segments[8].fillStyle = color_green;
    theWheel.segments[10].fillStyle = color_green;

    theWheel.segments[3].fillStyle = color_red;
    theWheel.segments[5].fillStyle = color_red;
    theWheel.segments[7].fillStyle = color_red;
    theWheel.segments[9].fillStyle = color_red;

    theWheel.draw();

    // Call the getSegmentAt function passing the mouse x and y from the event.
    let clickedSegment = theWheel.getSegmentAt(e.clientX, e.clientY);

    // A pointer to the segment clicked is returned if the user clicked inside the wheel.
    if (clickedSegment) {
      let selectedColor = "";
      if (clickedSegment.fillStyle == color_violet) {
        selectedColor = "violet";
      } else if (clickedSegment.fillStyle == color_green) {
        selectedColor = "green";
      } else if (clickedSegment.fillStyle == color_red) {
        selectedColor = "red";
      }

      let item = {
        number: parseInt(clickedSegment.text),
        color: selectedColor,
        fillStyle: clickedSegment.fillStyle,
      };
      window.spinWheelComponentReference.zone.run(() => {
        window.spinWheelComponentReference.onSelectItem(item);
      });

      // Change background colour of the segment and update the wheel.
      clickedSegment.fillStyle = "#e0ff0c";
      clickedSegment.lineWidth = 3;
      clickedSegment.strokeStyle = "#fff";

      clickedSegment.textFontSize = 80;
      clickedSegment.textLineWidth = 3;
      clickedSegment.textFillStyle = "#e0ff0c";
      clickedSegment.textStrokeStyle = "#333";

      theWheel.draw();
    }
  };
}

function startWheel(stopAngle) {
  createWheel();
  theWheel.reset;
  theWheel.animation.spins = 15;
  theWheel.animation.duration = 15;
  theWheel.animation.stopAngle = stopAngle;
  theWheel.startAnimation();
}
