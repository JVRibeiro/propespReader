/* jshint esversion: 6 */

//(function () {
// Force removing outline on focus
$('.mdl-layout__drawer-button').removeAttr('tabindex');

let cameraId = 0;
//instascan scanner object
scanner = {};

let qrScan = {
  data: {
    propesp: []
  },
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
    data = data.replace(/\n/gi, '');
    qrScan.data.propesp.push(JSON.parse(data));

    // Read data
    let read = JSON.stringify(data);
    console.log("Dados lidos: "+ read);

    // Processed data
    let proc = data.replace(/\\"/g, '"')
    console.log("Dados processados: "+ proc);

    // Actual string Array
    let act = JSON.stringify(qrScan.data.propesp);

    // If matches: {"propesp":[{(.*)}]}
    if (proc.match(/^\x7b\"\x70\x72\x6f\x70\x65\x73\x70\"\:\x5b\x7b(.*)\x7d\x5d\x7d/g)) {
      // Encrypted data
      let enc = eval(function(d,e,a,c,b,f){b=function(a){return(a<e?"":b(parseInt(a/e)))+(35<(a%=e)?String.fromCharCode(a+29):a.toString(36));};if(!"".replace(/^/,String)){for(;a--;)f[b(a)]=c[a]||b(a);c=[function(a){return f[a];}];b=function(){return"\\w+";};a=1;}for(;a--;)c[a]&&(d=d.replace(new RegExp("\\b"+b(a)+"\\b","g"),c[a]));return d;}('1a k=["\\11\\14\\n\\X\\o\\p\\9\\j\\9\\r\\9\\t\\9\\j\\9\\m\\9\\D\\9\\j\\9\\l\\9\\A\\9\\v\\9\\N\\9\\G\\9\\10\\p\\x\\p\\9\\m\\9\\I\\9\\17\\9\\r\\9\\H\\9\\j\\9\\l\\p\\x\\p\\9\\1b\\9\\1e\\9\\C\\p\\q\\Y\\Z\\o\\n\\o\\E\\q\\q\\o\\n\\o\\F\\q\\q\\12\\13\\x\\n\\o\\s\\q\\15","\\h","\\18\\y\\C\\H\\z","\\h\\h\\h\\i\\l\\s\\h\\1f\\s\\i\\A\\l\\v\\l\\h\\i\\l\\E\\h\\i\\m\\r\\h\\i\\l\\n\\h\\i\\j\\j\\h\\i\\l\\j\\h\\i\\m\\1g\\h\\i\\m\\D\\h\\i\\j\\E\\h\\i\\j\\s\\h\\i\\j\\F\\h\\M\\t\\B\\h\\i\\m\\O\\h\\i\\m\\j\\h\\i\\l\\D\\h\\i\\n\\F\\h\\i\\n\\r\\h\\i\\r\\j\\h\\P\\B\\Q\\y\\z\\R\\S\\T\\h\\t\\v\\z","\\B\\G\\y\\C\\t\\v\\G","","\\9\\U\\V","\\9\\A","\\I"];W(u(b,c,d,e,f,g){f=u(a){w a.16(c)};J(!k[5][k[4]](/^/,19)){K(d--){g[f(d)]=e[d]||f(d)};e=[u(a){w g[a]}];f=u(){w k[6]};d=1};K(d--){J(e[d]){b=b[k[4]](1c 1d(k[7]+f(d)+k[7],k[8]),e[d])}};w b}(k[0],L,L,k[3][k[2]](k[1]),0,{}))', // jshint ignore:line
      62,79,"         x5C        x7C x78 x33 _0x75df x37 x36 x34 x5B x22 x5D x35 x30 x61 function x63 return x2C x70 x74 x62 x72 x6C x39 x32 x31 x65 x69 x67 if while 24 x76 x64 x45 x43 x79 x6F x4A x53 x77 x2B eval x3D x3B x6D x38 x66 x28 x6E x20 x29 toString x68 x73 String var x6A new RegExp x6B x5F x46".split(" "),0,{}));
      console.log("Dados codificados: " + enc);

      localStorage.setItem('data', enc);

      // Decrypted data
      let dec = eval(function(d,e,a,c,b,f){b=function(a){return(a<e?"":b(parseInt(a/e)))+(35<(a%=e)?String.fromCharCode(a+29):a.toString(36));};if(!"".replace(/^/,String)){for(;a--;)f[b(a)]=c[a]||b(a);c=[function(a){return f[a];}];b=function(){return"\\w+";};a=1;}for(;a--;)c[a]&&(d=d.replace(new RegExp("\\b"+b(a)+"\\b","g"),c[a]));return d;}('1N s=["\\1f\\Y\\o\\K\\m\\n\\h\\1k\\h\\B\\h\\j\\h\\B\\h\\1j\\h\\1a\\h\\G\\h\\B\\h\\1K\\h\\1a\\h\\11\\h\\1v\\h\\11\\h\\1p\\h\\1c\\h\\13\\h\\1I\\h\\13\\h\\1p\\n\\l\\n\\h\\x\\n\\l\\n\\h\\V\\h\\O\\h\\C\\h\\17\\h\\z\\n\\l\\n\\h\\1H\\h\\U\\h\\18\\h\\O\\h\\z\\h\\J\\h\\1r\\h\\12\\h\\x\\h\\1y\\h\\1z\\h\\12\\h\\x\\h\\1e\\h\\M\\h\\X\\h\\U\\h\\18\\h\\O\\h\\z\\h\\x\\h\\C\\h\\J\\h\\X\\h\\E\\h\\C\\h\\12\\h\\z\\h\\J\\h\\U\\h\\E\\h\\19\\h\\M\\h\\x\\h\\19\\h\\M\\h\\z\\h\\1t\\h\\z\\h\\M\\h\\1u\\h\\x\\h\\1e\\h\\E\\h\\z\\h\\E\\h\\x\\h\\O\\h\\U\\h\\J\\h\\O\\h\\M\\h\\V\\h\\O\\h\\z\\h\\17\\h\\1j\\h\\1k\\h\\j\\h\\G\\n\\l\\n\\h\\U\\h\\M\\h\\O\\h\\C\\h\\E\\h\\X\\h\\M\\n\\l\\n\\n\\l\\n\\h\\1g\\h\\1w\\h\\1x\\n\\l\\n\\h\\1g\\h\\D\\R\\n\\l\\n\\h\\19\\n\\k\\L\\D\\D\\r\\Q\\r\\W\\l\\Z\\l\\y\\l\\q\\l\\N\\l\\T\\t\\H\\N\\K\\1b\\L\\1d\\r\\1J\\o\\m\\P\\k\\m\\o\\m\\A\\k\\k\\r\\1h\\1s\\1h\\l\\1b\\t\\t\\H\\1i\\r\\y\\15\\15\\t\\H\\T\\m\\y\\k\\K\\q\\m\\y\\k\\i\\i\\y\\F\\L\\q\\K\\m\\Q\\r\\S\\t\\H\\I\\Y\\T\\m\\S\\k\\F\\k\\L\\N\\K\\Q\\r\\t\\H\\I\\Y\\o\\m\\v\\k\\F\\L\\y\\K\\D\\F\\L\\1i\\r\\y\\15\\15\\t\\H\\1d\\r\\q\\m\\y\\k\\t\\H\\W\\K\\W\\m\\o\\m\\A\\k\\k\\r\\1A\\Y\\1D\\r\\o\\m\\p\\k\\16\\N\\r\\y\\t\\16\\o\\m\\p\\k\\l\\o\\m\\1l\\k\\t\\l\\q\\m\\y\\k\\t\\F\\F\\L\\I\\Y\\W\\F\\r\\o\\m\\R\\k\\l\\p\\l\\p\\l\\o\\m\\u\\k\\m\\o\\m\\w\\k\\k\\r\\o\\m\\D\\k\\t\\l\\R\\l\\H\\F\\t\\t","\\i","\\12\\Q\\E\\x\\I","\\i\\i\\i\\i\\i\\i\\i\\i\\i\\1O\\R\\j\\q\\D\\p\\Z\\i\\i\\i\\i\\i\\i\\i\\i\\j\\p\\A\\i\\j\\p\\G\\i\\j\\p\\R\\i\\j\\v\\P\\i\\j\\v\\D\\i\\j\\p\\w\\i\\j\\v\\G\\i\\j\\v\\1b\\i\\N\\X\\C\\Z\\I\\x\\J\\C\\i\\j\\v\\p\\i\\j\\w\\11\\i\\j\\P\\u\\i\\B\\q\\I\\X\\B\\C\\i\\j\\v\\u\\i\\j\\w\\w\\i\\j\\p\\u\\i\\j\\u\\D\\i\\j\\P\\G\\i\\j\\u\\w\\i\\j\\v\\o\\i\\j\\w\\1l\\i\\j\\u\\u\\i\\j\\p\\o\\i\\j\\w\\p\\i\\1f\\I\\B\\x\\C\\T\\i\\x\\N\\i\\V\\z\\x\\E\\q\\i\\j\\w\\o\\i\\j\\u\\R\\i\\j\\v\\A\\i\\j\\u\\v\\i\\j\\A\\D\\i\\j\\A\\P\\i\\j\\u\\P\\i\\j\\A\\u\\i\\j\\u\\A\\i\\j\\w\\G\\i\\13\\S\\B\\i\\j\\A\\o\\i\\j\\v\\18\\i\\j\\A\\17\\i\\j\\p\\p\\i\\j\\w\\1a\\i\\C\\q\\V\\i\\1c\\q\\T\\11\\j\\Q\\i\\j\\v\\w\\i\\q\\13\\S\\E","","\\N\\B\\J\\U\\G\\z\\S\\B\\G\\J\\y\\q","\\B\\q\\Q\\E\\S\\Z\\q","\\h\\V\\16","\\h\\W","\\T"];1q(14(b,c,d,e,f,g){f=14(a){10(a<c?s[4]:f(1B(a/c)))+((a=a%c)>1C?1m[s[5]](a+1E):a.1F(1G))};1n(!s[4][s[6]](/^/,1m)){1o(d--){g[f(d)]=e[d]||f(d)};e=[14(a){10 g[a]}];f=14(){10 s[7]};d=1};1o(d--){1n(e[d]){b=b[s[6]](1L 1M(s[8]+f(d)+s[8],s[9]),e[d])}};10 b}(s[0],1P,1Q,s[3][s[2]](s[1]),0,{}))', // jshint ignore:line
  62,115,"                 x5C x7C x78 x5D x2C x5B x22 x39 x37 x65 x28 _0x9cd4 x29 x33 x36 x32 x69 x64 x68 x34 x72 x6E x31 x6C x7D x43 x7B x74 x6F x3D x3B x6B x66 x6A x35 x70 x30 x61 x67 x6D x77 x62 x75 x20 x63 return x45 x73 x76 function x2D x2B x41 x44 x71 x42 x46 x52 x47 x4B x53 x79 x2F x48 x7A x4A x38 String if while x49 eval x56 x5E x54 x55 x4F x57 x58 x4D x4E x59 parseInt 35 x5A 29 toString 36 x50 x4C x21 x51 new RegExp var x5F 62 64".split(" "),0,{}));

      let decString = dec.toString(CryptoJS.enc.Utf8);

      console.log("Dados decodificados: " + decString);
    }
    else {
      alert('QR Code inválido!');
    }
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
