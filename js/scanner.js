/* jshint esversion: 6 */

(function() {
  // Force removing outline on focus
  $('.mdl-layout__drawer-button').removeAttr('tabindex');

  let cameraId = 0;
  //instascan scanner object
  scanner = {};

  let qrScan = {
    // HTML element
    initHtmlElement: function(id) { // qrScan.initHtmlElement(id);
      return document.getElementById(id);
    },

    //init video object options
    initVideoObjectOptions: function(id) { // qrScan.initVideoObjectOptions(id);
      scanner = {};

      return {
        // The HTML element to use for the camera's video preview. Must be a <video> element.
        video: qrScan.initHtmlElement(id),

        // Whether to scan continuously for QR codes. If false, use scanner.scan() to manually scan.
        continuous: true,

        // Whether to horizontally mirror the video preview.
        mirror: false,

        // Whether to include the scanned image data as part of the scan result.
        captureImage: false,

        // Only applies to continuous mode. Whether to actively scan when the tab is not active.
        backgroundScan: false,

        // The period, in milliseconds, before the same QR code will be recognized in succession.
        refractoryPeriod: 3000,

        // Only applies to continuous mode. The period, in rendered frames, between scans. A lower scan period
        // increases CPU usage but makes scan response faster. Default 1 (i.e. analyze every frame).
        scanPeriod: 1
      };
    },

    //init Avaliable Cameras of current device
    initAvaliableCameras: function(callBack) { // qrScan.initAvaliableCameras(callBack);
      Instascan.Camera.getCameras().then(function(cameras) {
        callBack();
      });
    },

    //Init camera
    initCamera: function(i) { // qrScan.initCamera(i);
      scanner.stop();

      Instascan.Camera.getCameras().then(function(cameras) {
        if (cameras.length > 0) {
          var selectedCam = cameras[0];
          $.each(cameras, (i, c) => {
            if (c.name.indexOf('back') != -1) {
              selectedCam = c;
              return false;
            }
          });

          console.log('Camera: ' + selectedCam);
          scanner.start(selectedCam);
        } else {
          alert('Nenhuma camera encontrada.');
        }
      });
    },

    scanStart: function(ondetect) { // qrScan.scanStart(ondetect);
      //Emitted when a QR code is scanned using the camera in continuous mode (see scanner.continuous).
      scanner.addListener('scan', function(content) {
        ondetect(content);
      });
    },

    //init QrCode scanner
    initScanner: function(options) { // qrScan.initScanner(options);
      scanner = new Instascan.Scanner(options);
    }
  };




  let options = {};
  //init options for scanner
  options = qrScan.initVideoObjectOptions("webcameraPreview");

  qrScan.initScanner(options);

  qrScan.initAvaliableCameras(function() {
    cameraId = 1; // 1 = rear camera
  });

  qrScan.initCamera(cameraId);

  qrScan.scanStart(function(data) {
    alert(data);
  });
})();