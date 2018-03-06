/* jshint esversion: 6 */

//(function () {
// Force removing outline on focus
$('.mdl-layout__drawer-button').removeAttr('tabindex');

let cameraId = 0;
//instascan scanner object
scanner = {};

let qrScan = {
  data: [],
  // HTML element
  initHtmlElement: function (id) { // qrScan.initHtmlElement(id);
    return document.getElementById(id);
  },

  //init video object options
  initVideoObjectOptions: function (id) { // qrScan.initVideoObjectOptions(id);
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
  initAvaliableCameras: function (callBack) { // qrScan.initAvaliableCameras(callBack);
    Instascan.Camera.getCameras().then(function (cameras) {
      callBack();
    });
  },

  //Init camera
  initCamera: function (i) { // qrScan.initCamera(i);
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

        console.log('Camera:');
        console.log(selectedCam);
        scanner.start(selectedCam);
      } else {
        alert('Nenhuma camera encontrada.');
      }
    });
  },

  scanStart: function (ondetect) { // qrScan.scanStart(ondetect);
    //Emitted when a QR code is scanned using the camera in continuous mode (see scanner.continuous).
    scanner.addListener('scan', function (content) {
      ondetect(content);
    });
  },

  //init QrCode scanner
  initScanner: function (options) { // qrScan.initScanner(options);
    scanner = new Instascan.Scanner(options);
  },

  saveScannedData: function (data) { // qrScan.saveScannedData(data);
    //alert(data);
    data = data.replace(/\n/gi, '');
    qrScan.data.push(JSON.parse(data));
    //console.log(JSON.stringify(data));

    let act = JSON.stringify(qrScan.data);

    let enc = eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('1a k=["\\11\\14\\n\\X\\o\\p\\9\\j\\9\\r\\9\\t\\9\\j\\9\\m\\9\\D\\9\\j\\9\\l\\9\\A\\9\\v\\9\\N\\9\\G\\9\\10\\p\\x\\p\\9\\m\\9\\I\\9\\17\\9\\r\\9\\H\\9\\j\\9\\l\\p\\x\\p\\9\\1b\\9\\1e\\9\\C\\p\\q\\Y\\Z\\o\\n\\o\\E\\q\\q\\o\\n\\o\\F\\q\\q\\12\\13\\x\\n\\o\\s\\q\\15","\\h","\\18\\y\\C\\H\\z","\\h\\h\\h\\i\\l\\s\\h\\1f\\s\\i\\A\\l\\v\\l\\h\\i\\l\\E\\h\\i\\m\\r\\h\\i\\l\\n\\h\\i\\j\\j\\h\\i\\l\\j\\h\\i\\m\\1g\\h\\i\\m\\D\\h\\i\\j\\E\\h\\i\\j\\s\\h\\i\\j\\F\\h\\M\\t\\B\\h\\i\\m\\O\\h\\i\\m\\j\\h\\i\\l\\D\\h\\i\\n\\F\\h\\i\\n\\r\\h\\i\\r\\j\\h\\P\\B\\Q\\y\\z\\R\\S\\T\\h\\t\\v\\z","\\B\\G\\y\\C\\t\\v\\G","","\\9\\U\\V","\\9\\A","\\I"];W(u(b,c,d,e,f,g){f=u(a){w a.16(c)};J(!k[5][k[4]](/^/,19)){K(d--){g[f(d)]=e[d]||f(d)};e=[u(a){w g[a]}];f=u(){w k[6]};d=1};K(d--){J(e[d]){b=b[k[4]](1c 1d(k[7]+f(d)+k[7],k[8]),e[d])}};w b}(k[0],L,L,k[3][k[2]](k[1]),0,{}))',62,79,'|||||||||x5C||||||||x7C|x78|x33|_0x75df|x37|x36|x34|x5B|x22|x5D|x35|x30|x61|function|x63|return|x2C|x70|x74|x62|x72|x6C|x39|x32|x31|x65|x69|x67|if|while|24|x76|x64|x45|x43|x79|x6F|x4A|x53|x77|x2B|eval|x3D|x3B|x6D|x38|x66|x28|x6E|x20|x29|toString|x68|x73|String|var|x6A|new|RegExp|x6B|x5F|x46'.split('|'),0,{}));

    let dec = CryptoJS.AES.decrypt(localStorage.getItem('data'), "propespti2013");
    dec.toString(CryptoJS.enc.Utf8);

    localStorage.setItem('data', enc);
  }
};




let options = {};
//init options for scanner
options = qrScan.initVideoObjectOptions("webcameraPreview");

qrScan.initScanner(options);

qrScan.initAvaliableCameras(function () {
  cameraId = 1; // 1 = rear camera
});

qrScan.initCamera(cameraId);

qrScan.scanStart(function (data) {
  qrScan.saveScannedData(data);
});
//})();
