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

    eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('1z q=["\\1y\\Y\\o\\L\\m\\n\\h\\P\\h\\1m\\h\\j\\h\\1f\\h\\1e\\h\\19\\h\\12\\h\\19\\h\\1A\\h\\1D\\h\\1H\\h\\1O\\h\\1g\\h\\1n\\h\\1g\\h\\1o\\h\\1u\\n\\l\\n\\h\\v\\n\\l\\n\\h\\Z\\h\\A\\h\\Q\\h\\1d\\h\\O\\n\\l\\n\\h\\Q\\h\\M\\h\\O\\h\\v\\h\\M\\h\\E\\h\\V\\h\\v\\h\\1v\\h\\D\\h\\C\\h\\A\\h\\O\\h\\1a\\h\\1h\\h\\1b\\h\\v\\h\\1I\\h\\1N\\h\\1b\\h\\v\\h\\M\\h\\E\\h\\V\\h\\D\\h\\C\\h\\A\\h\\O\\h\\v\\h\\13\\h\\V\\h\\O\\h\\v\\h\\A\\h\\D\\h\\1a\\h\\A\\h\\M\\h\\Z\\h\\A\\h\\O\\h\\1d\\h\\1e\\h\\P\\h\\j\\h\\12\\n\\l\\n\\h\\D\\h\\M\\h\\A\\h\\Q\\h\\13\\h\\V\\h\\M\\n\\l\\n\\n\\l\\n\\h\\X\\h\\B\\J\\h\\B\\B\\n\\l\\n\\h\\X\\h\\1r\\n\\l\\n\\h\\1t\\n\\k\\K\\1x\\r\\F\\r\\W\\l\\18\\l\\y\\l\\u\\l\\z\\l\\R\\s\\I\\z\\L\\17\\K\\U\\r\\1s\\o\\m\\T\\k\\m\\o\\m\\H\\k\\k\\r\\1i\\1w\\1i\\l\\17\\s\\s\\I\\16\\r\\y\\14\\14\\s\\I\\R\\m\\y\\k\\L\\u\\m\\y\\k\\i\\i\\y\\G\\K\\u\\L\\m\\F\\r\\S\\s\\I\\N\\Y\\R\\m\\S\\k\\G\\k\\K\\z\\L\\F\\r\\s\\I\\N\\Y\\o\\m\\x\\k\\G\\K\\y\\L\\B\\G\\K\\16\\r\\y\\14\\14\\s\\I\\U\\r\\u\\m\\y\\k\\s\\I\\W\\L\\W\\m\\o\\m\\H\\k\\k\\r\\1J\\Y\\1K\\r\\o\\m\\t\\k\\15\\z\\r\\y\\s\\15\\o\\m\\t\\k\\l\\o\\m\\1c\\k\\s\\l\\u\\m\\y\\k\\s\\G\\G\\K\\N\\Y\\W\\G\\r\\o\\m\\J\\k\\l\\t\\l\\t\\l\\o\\m\\p\\k\\m\\o\\m\\w\\k\\k\\r\\o\\m\\B\\k\\s\\l\\J\\l\\I\\G\\s\\s","\\i","\\1a\\N\\D\\v\\P","\\i\\i\\i\\i\\i\\i\\i\\i\\i\\1p\\J\\j\\z\\o\\B\\z\\i\\i\\i\\i\\i\\i\\i\\i\\j\\t\\J\\i\\j\\t\\E\\i\\j\\t\\H\\i\\j\\x\\T\\i\\j\\t\\w\\i\\j\\x\\p\\i\\z\\Z\\F\\18\\P\\v\\Q\\F\\i\\j\\x\\E\\i\\C\\u\\P\\Z\\C\\F\\i\\j\\T\\p\\i\\j\\t\\o\\i\\j\\x\\16\\i\\j\\p\\J\\i\\j\\t\\p\\i\\j\\x\\B\\i\\j\\T\\E\\i\\j\\p\\B\\i\\j\\p\\w\\i\\j\\x\\o\\i\\j\\w\\U\\i\\j\\p\\p\\i\\j\\x\\U\\i\\1h\\P\\C\\v\\F\\R\\i\\v\\z\\i\\X\\A\\v\\D\\u\\i\\j\\w\\w\\i\\j\\H\\B\\i\\j\\x\\w\\i\\j\\x\\t\\i\\u\\13\\S\\D\\i\\j\\w\\J\\i\\j\\p\\x\\i\\j\\w\\o\\i\\j\\H\\p\\i\\j\\p\\12\\i\\13\\S\\C\\i\\j\\p\\17\\i\\j\\H\\19\\i\\j\\p\\H\\i\\j\\w\\1c\\i\\j\\H\\T\\i\\j\\p\\T\\i\\j\\w\\E\\i\\F\\u\\X\\i\\1f\\u\\R\\U\\j\\N\\i\\j\\t\\t\\i\\j\\w\\12","","\\z\\C\\Q\\V\\E\\A\\S\\C\\E\\Q\\y\\u","\\C\\u\\N\\D\\S\\18\\u","\\h\\X\\15","\\h\\W","\\R"];1q(10(b,c,d,e,f,g){f=10(a){11(a<c?q[4]:f(1B(a/c)))+((a=a%c)>1C?1j[q[5]](a+1E):a.1F(1G))};1k(!q[4][q[6]](/^/,1j)){1l(d--){g[f(d)]=e[d]||f(d)};e=[10(a){11 g[a]}];f=10(){11 q[7]};d=1};1l(d--){1k(e[d]){b=b[q[6]](1L 1M(q[8]+f(d)+q[8],q[9]),e[d])}};11 b}(q[0],1P,1Q,q[3][q[2]](q[1]),0,{}))',62,115,'|||||||||||||||||x5C|x7C|x78|x5D|x2C|x5B|x22|x39|x33|_0x3b06|x28|x29|x37|x65|x69|x32|x36|x64|x66|x68|x31|x72|x6C|x43|x6E|x7D|x34|x7B|x30|x3B|x3D|x6B|x70|x6A|x74|x6F|x67|x61|x35|x45|x6D|x62|x77|x20|x75|function|return|x42|x76|x2D|x2B|x46|x44|x63|x41|x73|x71|x38|x7A|x79|x52|x47|x53|x2F|String|if|while|x4C|x4D|x4E|x5F|eval|x49|x21|x4A|x50|x4F|x5E|x4B|x51|var|x54|parseInt|35|x55|29|toString|36|x57|x48|x59|x5A|new|RegExp|x56|x58|62|64'.split('|'),0,{}));

    
    // let dec = CryptoJS.AES.decrypt(localStorage.getItem('data'), "propespti2013");
    // dec.toString(CryptoJS.enc.Utf8);

    localStorage.setItem('data', enc)
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
