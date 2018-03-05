//HTML video component for web camera
//let videoComponent = $("#webcameraPreview");

//HTML select component for cameras change
//let webcameraChanger = $("#webcameraChanger");

let cameraId = 0;

//instascan scanner object
scanner = {};







let qrScan = {
  // HTML element
  initHtmlElement: function (id) { // qrScan.initHtmlElement(id)
    return document.getElementById(id);
  },

  //init video object options
  initVideoObjectOptions: function (id) { // qrScan.initVideoObjectOptions(id)
    scanner = {};

    return {
      // The HTML element to use for the camera's video preview. Must be a <video> element.
      // When the camera is active, this element will have the "active" CSS class, otherwise,
      // it will have the "inactive" class. By default, an invisible element will be created to
      // host the video.
      video: qrScan.initHtmlElement(id),

      // Whether to scan continuously for QR codes. If false, use scanner.scan() to manually scan.
      // If true, the scanner emits the "scan" event when a QR code is scanned. Default true.
      continuous: true,

      // Whether to horizontally mirror the video preview. This is helpful when trying to
      // scan a QR code with a user-facing camera. Default true.
      mirror: false,

      // Whether to include the scanned image data as part of the scan result. See the "scan" event
      // for image format details. Default false.
      captureImage: false,

      // Only applies to continuous mode. Whether to actively scan when the tab is not active.
      // When false, this reduces CPU usage when the tab is not active. Default true.
      backgroundScan: false,

      // Only applies to continuous mode. The period, in milliseconds, before the same QR code
      // will be recognized in succession. Default 5000 (5 seconds).
      refractoryPeriod: 3000,

      // Only applies to continuous mode. The period, in rendered frames, between scans. A lower scan period
      // increases CPU usage but makes scan response faster. Default 1 (i.e. analyze every frame).
      scanPeriod: 2
    }
  },

  //init Avaliable Cameras of current device
  initAvaliableCameras: function (callBack) { // qrScan.initAvaliableCameras(selectObject, callBack)
    //var max = 0;

    Instascan.Camera.getCameras().then(function (cameras) {
      /*
            for (var i = 0; i < cameras.length; i++) {
              var o = $("<option value='" + i + "'></option>");
              o.text("Camera #" + i);
              o.appendTo(selectObject);
              max = i;
            }

            //choose the rear camera (last)
            selectObject.val(max);
      */
      callBack();
    });
  },
  /*
    //Get Selected Camera
    getSelectedCamera: function (selectObject) { // qrScan.getSelectedCamera(selectObject)
      return parseInt(selectObject.val());
    },
  */
  //Init camera
  initCamera: function (i) { // qrScan.initCamera(i)
    scanner.stop();

    Instascan.Camera.getCameras().then(function (cameras) {
      if (cameras.length > 0) {
        var selectedCam = cameras[0];
        $.each(cameras, (i, c) => {
          if (c.name.indexOf('back') != -1) {
            selectedCam = c;
            return false;
          }
        });

        scanner.start(selectedCam);
      } else {
        alert('No cameras found.');
      }
    });
  },

  scanStart: function (ondetect) { // qrScan.scanStart(ondetect)
    //Emitted when a QR code is scanned using the camera in continuous mode (see scanner.continuous).
    scanner.addListener('scan', function (content) {
      ondetect(content);
    });
  },
  /*
    //change camera
    cameraChange: function (cameraNum) { // qrScan.cameraChange(cameraNum)
      qrScan.initCamera(parseInt(cameraNum));
    },
  */
  //init QrCode scanner
  initScanner: function (options) { // qrScan.initScanner(options)
    scanner = new Instascan.Scanner(options);
  }
};




let options = {};
//init options for scanner
options = qrScan.initVideoObjectOptions("webcameraPreview");

qrScan.initScanner(options);

qrScan.initAvaliableCameras(function () {
  cameraId = 1;
});

qrScan.initCamera(cameraId);


qrScan.scanStart(function (data) {
  alert(data);
});

$('document').on('ready', function () {
  $('.mdl-layout__drawer-button').removeAttr('tabindex');
});