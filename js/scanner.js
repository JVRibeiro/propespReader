/* jshint esversion: 6 */

// instascan scanner object
scanner = {};

//(function () {
// Force removing outline on focus
$('.mdl-layout__drawer-button').removeAttr('tabindex');

let logIsEnabled, snapTimeout, toastTimeout, cameraGlobal, actualLiArr, actualScrollEl, actualContentEl;

let isCameraTabActive = true;

let saved_li_arr = [];
let rejected_li_arr = [];

let qrScan = {
  data: [], // qrScan.data
  rejected: [], // qrScan.rejected

  // HTML element
  initHtmlElement: function (id) { // qrScan.initHtmlElement(id);
    return document.getElementById(id);
  },
/*
  enableLog: function (bool) { // qrScan.enableLog(bool);
    localStorage.setItem('enableLog', JSON.stringify(bool));
    logIsEnabled = bool;

    if (bool) {
      $('.mdl-layout__tab.log, #scroll-tab-3').show();
    } else {
      $('.mdl-layout__tab.log, #scroll-tab-3').hide();
    }
  },
*/
/*
  log: function (string) { // qrScan.log(string);
    // console.log(string);
    // console.log(typeof string);
    if (logIsEnabled) {
      if (typeof string != 'string') {
        string = JSON.stringify(string);

        // console.log(typeof string);
      }

      string = string.replace(/\x22(.*?)\x22/gi, '<span class=\'red\'>"$1"</span>');
      string = string.replace(/(null|true|false|undefined)/gi, '<span class=\'purple\'>$1</span>');
      string = string.replace(/(\{|\}|\[|\]|:|,|\.)/gi, '<span class=\'grey\'>$1</span>');

      document.getElementById('log').innerHTML += string + '<hr>';
    }
  },
*/
  // init video object options
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
      refractoryPeriod: 4000,

      // Only applies to continuous mode. The period, in rendered frames, between scans. A lower scan period
      // increases CPU usage but makes scan response faster. Default 1 (i.e. analyze every frame).
      scanPeriod: 1
    };
  },

  // init Avaliable Cameras of current device
  initAvaliableCameras: function (callBack) { // qrScan.initAvaliableCameras(callBack);
    Instascan.Camera.getCameras().then(function (cameras) {
      callBack();
    });
  },

  // Init camera
  initCamera: function (i) { // qrScan.initCamera(i);
    scanner.stop();

    Instascan.Camera.getCameras().then(function (cameras) {
      if (cameras.length > 0) {
        let selectedCam = cameras[0];
        $.each(cameras, (i, c) => {
          if (c.name.indexOf('back') != -1) {
            selectedCam = c;
            return false;
          }
        });

        // console.log(selectedCam);
        // qrScan.log('Camera: ' + JSON.stringify(selectedCam));

        scanner.start(selectedCam);
        cameraGlobal = selectedCam;
      } else {
        alert('Nenhuma camera encontrada.');
      }
    });
  },

  scanStart: function (ondetect) { // qrScan.scanStart(ondetect);
    // Emitted when a QR code is scanned using the camera in continuous mode (see scanner.continuous).
    scanner.addListener('scan', function (content) {
      ondetect(content);
    });
  },

  saveScannedData: function (data) { // qrScan.saveScannedData(data);
    let read, proc, act, enc, dec, isQRValid;

    if (data.match(/\n/g) !== null || data.match(/\"/g) !== null || data.match(/\s/g) !== null) {
      // console.log('QR have line breaks!');
      // Processed data
      proc = data.replace(/\n/gi, '');
      proc = proc.replace(/\\"/g, '"');
      proc = proc.replace(/\s/g, '');
    } else {
      proc = data;
    }

    // Read data
    // read = data.replace(/\n/gi, '<br>');
    // console.log("Dados lidos: " + data);
    // qrScan.log("Dados lidos: " + read);

    if (proc.match(/^\{(.*)\}/g) !== null &&
        proc.match(/^\x7b\"\x70\x72\x6f\x70\x65\x73\x70\"\:\x7b(.*)\x7d\x7d/g) !== null) {
      console.log('QR is not encoded!');
      console.log('QR content: ' + data);
      console.log('Checking authencity...');
    }
    //
    else if (proc.match(/^\{(.*)\}/g) !== null &&
               proc.match(/^\x7b\"\x70\x72\x6f\x70\x65\x73\x70\"\:\x7b(.*)\x7d\x7d/g) === null) {
    console.log('QR possibly encoded. Validating...');

    // QR is encoded
      console.log('QR is already encoded!');
      console.log('QR content: ' + data);
      console.log('Checking authencity...');

      // Decode QR
      // Actual string Array
      act = proc;
      enc = act;


      // Decrypted data
      // CryptoJS.AES.decrypt(enc, "key");
      dec = CryptoJS.AES.decrypt(enc, "propespti2013");
      // Decrypted data to string
      data = dec.toString(CryptoJS.enc.Utf8);

      // console.log('Decoded QR: ' + data);

      // Check QR authencity
      if (data.match(/^\x7b\"\x70\x72\x6f\x70\x65\x73\x70\"\:\x7b(.*)\x7d\x7d/g) !== null) {
        isQRValid = true;
      } else {
        isQRValid = false;
      }
    }

    // Check QR Code authencity
    // Is valid
    if (isQRValid) {
      console.log("QR Code is valid!");

      // Animation
      qrScan.animate._snap();
      qrScan.animate._success();

      qrScan.data.push(JSON.parse(data));

      // Actual string Array
      act = JSON.stringify(qrScan.data);
      // console.log("Dados salvos em RAM: " + act);
      // qrScan.log("Dados salvos em RAM: " + act);

      // Encrypted data
      // CryptoJS.AES.encrypt(act, "key");
      enc = eval(function(d,e,a,c,b,f){b=function(a){return(a<e?"":b(parseInt(a/e)))+(35<(a%=e)?String.fromCharCode(a+29):a.toString(36));};if(!"".replace(/^/,String)){for(;a--;)f[b(a)]=c[a]||b(a);c=[function(a){return f[a];}];b=function(){return"\\w+";};a=1;}for(;a--;)c[a]&&(d=d.replace(new RegExp("\\b"+b(a)+"\\b","g"),c[a]));return d;}('1a k=["\\11\\14\\n\\X\\o\\p\\9\\j\\9\\r\\9\\t\\9\\j\\9\\m\\9\\D\\9\\j\\9\\l\\9\\A\\9\\v\\9\\N\\9\\G\\9\\10\\p\\x\\p\\9\\m\\9\\I\\9\\17\\9\\r\\9\\H\\9\\j\\9\\l\\p\\x\\p\\9\\1b\\9\\1e\\9\\C\\p\\q\\Y\\Z\\o\\n\\o\\E\\q\\q\\o\\n\\o\\F\\q\\q\\12\\13\\x\\n\\o\\s\\q\\15","\\h","\\18\\y\\C\\H\\z","\\h\\h\\h\\i\\l\\s\\h\\1f\\s\\i\\A\\l\\v\\l\\h\\i\\l\\E\\h\\i\\m\\r\\h\\i\\l\\n\\h\\i\\j\\j\\h\\i\\l\\j\\h\\i\\m\\1g\\h\\i\\m\\D\\h\\i\\j\\E\\h\\i\\j\\s\\h\\i\\j\\F\\h\\M\\t\\B\\h\\i\\m\\O\\h\\i\\m\\j\\h\\i\\l\\D\\h\\i\\n\\F\\h\\i\\n\\r\\h\\i\\r\\j\\h\\P\\B\\Q\\y\\z\\R\\S\\T\\h\\t\\v\\z","\\B\\G\\y\\C\\t\\v\\G","","\\9\\U\\V","\\9\\A","\\I"];W(u(b,c,d,e,f,g){f=u(a){w a.16(c)};J(!k[5][k[4]](/^/,19)){K(d--){g[f(d)]=e[d]||f(d)};e=[u(a){w g[a]}];f=u(){w k[6]};d=1};K(d--){J(e[d]){b=b[k[4]](1c 1d(k[7]+f(d)+k[7],k[8]),e[d])}};w b}(k[0],L,L,k[3][k[2]](k[1]),0,{}))', // jshint ignore:line
      62,79,"         x5C        x7C x78 x33 _0x75df x37 x36 x34 x5B x22 x5D x35 x30 x61 function x63 return x2C x70 x74 x62 x72 x6C x39 x32 x31 x65 x69 x67 if while 24 x76 x64 x45 x43 x79 x6F x4A x53 x77 x2B eval x3D x3B x6D x38 x66 x28 x6E x20 x29 toString x68 x73 String var x6A new RegExp x6B x5F x46".split(" "),0,{}));
      // console.log("Dados codificados: " + enc);
      // qrScan.log("Dados codificados: " + enc);

      localStorage.setItem('data', enc);
      qrScan.animate._showToast('Dados salvos!');

      qrScan.updateHTMLArray('data');

      clusterize.update(saved_li_arr);
      // console.log(qrScan.data.length);
    }
    // Is invalid
    else {
      console.log("QR Code inválido!");

      // console.log('QR Code inválido! Escaneie um QR Code pertencente à PROPESP.');
      // qrScan.log('QR Code inválido! Escaneie um QR Code pertencente à PROPESP.');

      // Animation
      qrScan.animate._snap();
      qrScan.animate._error();

      qrScan.rejected.push(JSON.parse(data));

      console.log("Dados rejeitados: " + data);

      // Actual string Array
      act = JSON.stringify(qrScan.rejected);
      // console.log("Dados rejeitados salvos em RAM: " + act);
      // qrScan.log("Dados rejeitados salvos em RAM: " + act);

      // Encrypted data
      enc = CryptoJS.AES.encrypt(act, "propespti2013");
      // console.log("Dados rejeitados codificados: " + enc);
      // qrScan.log("Dados rejeitados codificados: " + enc);

      localStorage.setItem('rejected', enc);

      qrScan.animate._showToast('QR Code inválido!');

      qrScan.updateHTMLArray('rejected');

      clusterize.update(rejected_li_arr);
      // console.log(qrScan.data.length);
    }
  },

  loadFromLS: function (string) {
    if (string === 'data' || string === undefined) {
      // Decrypted data
      // CryptoJS.AES.decrypt(localStorage.getItem('rejected'), "key");
      let dec = eval(function(d,e,a,c,b,f){b=function(a){return(a<e?"":b(parseInt(a/e)))+(35<(a%=e)?String.fromCharCode(a+29):a.toString(36));};if(!"".replace(/^/,String)){for(;a--;)f[b(a)]=c[a]||b(a);c=[function(a){return f[a];}];b=function(){return"\\w+";};a=1;}for(;a--;)c[a]&&(d=d.replace(new RegExp("\\b"+b(a)+"\\b","g"),c[a]));return d;}('1N s=["\\1f\\Y\\o\\K\\m\\n\\h\\1k\\h\\B\\h\\j\\h\\B\\h\\1j\\h\\1a\\h\\G\\h\\B\\h\\1K\\h\\1a\\h\\11\\h\\1v\\h\\11\\h\\1p\\h\\1c\\h\\13\\h\\1I\\h\\13\\h\\1p\\n\\l\\n\\h\\x\\n\\l\\n\\h\\V\\h\\O\\h\\C\\h\\17\\h\\z\\n\\l\\n\\h\\1H\\h\\U\\h\\18\\h\\O\\h\\z\\h\\J\\h\\1r\\h\\12\\h\\x\\h\\1y\\h\\1z\\h\\12\\h\\x\\h\\1e\\h\\M\\h\\X\\h\\U\\h\\18\\h\\O\\h\\z\\h\\x\\h\\C\\h\\J\\h\\X\\h\\E\\h\\C\\h\\12\\h\\z\\h\\J\\h\\U\\h\\E\\h\\19\\h\\M\\h\\x\\h\\19\\h\\M\\h\\z\\h\\1t\\h\\z\\h\\M\\h\\1u\\h\\x\\h\\1e\\h\\E\\h\\z\\h\\E\\h\\x\\h\\O\\h\\U\\h\\J\\h\\O\\h\\M\\h\\V\\h\\O\\h\\z\\h\\17\\h\\1j\\h\\1k\\h\\j\\h\\G\\n\\l\\n\\h\\U\\h\\M\\h\\O\\h\\C\\h\\E\\h\\X\\h\\M\\n\\l\\n\\n\\l\\n\\h\\1g\\h\\1w\\h\\1x\\n\\l\\n\\h\\1g\\h\\D\\R\\n\\l\\n\\h\\19\\n\\k\\L\\D\\D\\r\\Q\\r\\W\\l\\Z\\l\\y\\l\\q\\l\\N\\l\\T\\t\\H\\N\\K\\1b\\L\\1d\\r\\1J\\o\\m\\P\\k\\m\\o\\m\\A\\k\\k\\r\\1h\\1s\\1h\\l\\1b\\t\\t\\H\\1i\\r\\y\\15\\15\\t\\H\\T\\m\\y\\k\\K\\q\\m\\y\\k\\i\\i\\y\\F\\L\\q\\K\\m\\Q\\r\\S\\t\\H\\I\\Y\\T\\m\\S\\k\\F\\k\\L\\N\\K\\Q\\r\\t\\H\\I\\Y\\o\\m\\v\\k\\F\\L\\y\\K\\D\\F\\L\\1i\\r\\y\\15\\15\\t\\H\\1d\\r\\q\\m\\y\\k\\t\\H\\W\\K\\W\\m\\o\\m\\A\\k\\k\\r\\1A\\Y\\1D\\r\\o\\m\\p\\k\\16\\N\\r\\y\\t\\16\\o\\m\\p\\k\\l\\o\\m\\1l\\k\\t\\l\\q\\m\\y\\k\\t\\F\\F\\L\\I\\Y\\W\\F\\r\\o\\m\\R\\k\\l\\p\\l\\p\\l\\o\\m\\u\\k\\m\\o\\m\\w\\k\\k\\r\\o\\m\\D\\k\\t\\l\\R\\l\\H\\F\\t\\t","\\i","\\12\\Q\\E\\x\\I","\\i\\i\\i\\i\\i\\i\\i\\i\\i\\1O\\R\\j\\q\\D\\p\\Z\\i\\i\\i\\i\\i\\i\\i\\i\\j\\p\\A\\i\\j\\p\\G\\i\\j\\p\\R\\i\\j\\v\\P\\i\\j\\v\\D\\i\\j\\p\\w\\i\\j\\v\\G\\i\\j\\v\\1b\\i\\N\\X\\C\\Z\\I\\x\\J\\C\\i\\j\\v\\p\\i\\j\\w\\11\\i\\j\\P\\u\\i\\B\\q\\I\\X\\B\\C\\i\\j\\v\\u\\i\\j\\w\\w\\i\\j\\p\\u\\i\\j\\u\\D\\i\\j\\P\\G\\i\\j\\u\\w\\i\\j\\v\\o\\i\\j\\w\\1l\\i\\j\\u\\u\\i\\j\\p\\o\\i\\j\\w\\p\\i\\1f\\I\\B\\x\\C\\T\\i\\x\\N\\i\\V\\z\\x\\E\\q\\i\\j\\w\\o\\i\\j\\u\\R\\i\\j\\v\\A\\i\\j\\u\\v\\i\\j\\A\\D\\i\\j\\A\\P\\i\\j\\u\\P\\i\\j\\A\\u\\i\\j\\u\\A\\i\\j\\w\\G\\i\\13\\S\\B\\i\\j\\A\\o\\i\\j\\v\\18\\i\\j\\A\\17\\i\\j\\p\\p\\i\\j\\w\\1a\\i\\C\\q\\V\\i\\1c\\q\\T\\11\\j\\Q\\i\\j\\v\\w\\i\\q\\13\\S\\E","","\\N\\B\\J\\U\\G\\z\\S\\B\\G\\J\\y\\q","\\B\\q\\Q\\E\\S\\Z\\q","\\h\\V\\16","\\h\\W","\\T"];1q(14(b,c,d,e,f,g){f=14(a){10(a<c?s[4]:f(1B(a/c)))+((a=a%c)>1C?1m[s[5]](a+1E):a.1F(1G))};1n(!s[4][s[6]](/^/,1m)){1o(d--){g[f(d)]=e[d]||f(d)};e=[14(a){10 g[a]}];f=14(){10 s[7]};d=1};1o(d--){1n(e[d]){b=b[s[6]](1L 1M(s[8]+f(d)+s[8],s[9]),e[d])}};10 b}(s[0],1P,1Q,s[3][s[2]](s[1]),0,{}))', // jshint ignore:line
  62,115,"                 x5C x7C x78 x5D x2C x5B x22 x39 x37 x65 x28 _0x9cd4 x29 x33 x36 x32 x69 x64 x68 x34 x72 x6E x31 x6C x7D x43 x7B x74 x6F x3D x3B x6B x66 x6A x35 x70 x30 x61 x67 x6D x77 x62 x75 x20 x63 return x45 x73 x76 function x2D x2B x41 x44 x71 x42 x46 x52 x47 x4B x53 x79 x2F x48 x7A x4A x38 String if while x49 eval x56 x5E x54 x55 x4F x57 x58 x4D x4E x59 parseInt 35 x5A 29 toString 36 x50 x4C x21 x51 new RegExp var x5F 62 64".split(" "),0,{}));

      let decString = dec.toString(CryptoJS.enc.Utf8);

      qrScan.data = localStorage.getItem('data') === null ? qrScan.data : JSON.parse(decString);
    }

    if (string === 'rejected' || string === undefined) {

      let decRej = CryptoJS.AES.decrypt(localStorage.getItem('rejected'), "propespti2013");

      let decRejString = decRej.toString(CryptoJS.enc.Utf8);

      // console.log("Dados decodificados: " + decString);
      // qrScan.log("Dados decodificados: " + decString);

      qrScan.rejected = localStorage.getItem('rejected') === null ? qrScan.rejected : JSON.parse(decRejString);
    }
  },

  updateHTMLArray: function (string) { // qrScan.updateHTMLArray('data'|'rejected'|undefined);
    if (string === 'data' || string === undefined) {
      saved_li_arr = [];

      let data_arr_len = qrScan.data.length;

      for (let i = 0; i < data_arr_len; i++) {
        saved_li_arr.push(
          '<li class="mdl-list__item mdl-list__item--two-line">' +
            '<span class="mdl-list__item-primary-content">' +
              '<span>' + qrScan.data[i].propesp.nome + '</span>' +
            '<span class="mdl-list__item-sub-title">Matrícula: ' + qrScan.data[i].propesp.matricula + '</span>' +
            '</span>' +
          '</li>'
        );
      }

    }

    if (string === 'rejected' || string === undefined) {
      rejected_li_arr = [];

      let rejected_arr_len = qrScan.rejected.length;

      for (let i = 0; i < rejected_arr_len; i++) {
        rejected_li_arr.push(
          '<li class="mdl-list__item mdl-list__item--two-line">' +
            '<span class="mdl-list__item-primary-content">' +
              '<span>' + JSON.stringify(qrScan.rejected[i]) + '</span>' +
            '</span>' +
          '</li>'
        );
      }
    }
  },

  clearRejected: function () { // qrScan.clearRejected();
    localStorage.removeItem('rejected');
    qrScan.rejected = [];
    rejected_li_arr = [];

    qrScan.updateHTMLArray('rejected');
    clusterize.update(rejected_li_arr);

    qrScan.animate._showToast('Lista de rejeitados apagada!');
  },

  // create an instance of Instascan QrCode scanner
  initScanner: function (options) { // qrScan.initScanner(options);
    scanner = new Instascan.Scanner(options);
  },

  /* Animations */
  animate: {
    _snap: function () { // qrScan.animate._snap();
      $('#cameraCanvas .snap').removeClass('snap-anim');

      $('#cameraCanvas .snap')
        .addClass('snap-anim')
        .one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
          function(e) {
          // code to execute after animation ends
          $('#cameraCanvas .snap').removeClass('snap-anim');
      });
    },

    _showToast: function (message) { // qrScan.animate._showToast(message);
      let notification = document.querySelector('.mdl-js-snackbar');

      if (toastTimeout !== undefined) clearTimeout(toastTimeout);
      $('.mdl-js-snackbar').removeClass('mdl-snackbar--active');

      toastTimeout = setTimeout(function () {
        notification.MaterialSnackbar.showSnackbar({message: message});
      }, 1100);
    },

    _success: function () { // qrScan.animate._success();
      $('.error').removeClass('snap-status-in snap-status-out');
      if (snapTimeout !== undefined) clearTimeout(snapTimeout);

      $('.success')
          .removeClass('snap-status-in snap-status-out')
          .addClass('snap-status-in');

      snapTimeout = setTimeout(function() {
        // code to execute after animation ends
        $('.success')
          .removeClass('snap-status-in')
          .addClass('snap-status-out')
          .one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
            function(e) {
            // code to execute after animation ends
            $('.success').removeClass('snap-status-out');
        });
      }, 3000);
    },

    _error: function () { // qrScan.animate._error();
      $('.success').removeClass('snap-status-in snap-status-out');
      if (snapTimeout !== undefined) clearTimeout(snapTimeout);

      $('.error')
        .removeClass('snap-status-in snap-status-out')
        .addClass('snap-status-in');

        snapTimeout = setTimeout(function() {
          // code to execute after animation ends
          $('.error')
            .removeClass('snap-status-in')
            .addClass('snap-status-out')
            .one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
              function(e) {
              // code to execute after animation ends
              $('.error').removeClass('snap-status-out');
          });
        },3000);
    },

    _loading: function (boolean) { // qrScan.animate._loading(boolean);
      if (!boolean) {
        $('.loading').css('opacity', 0);
      } else {
        $('.loading').css('opacity', 1);
      }
    },

    _pageLoaded: function () { // qrScan.animate._pageLoaded();
      document.getElementById('pageLoader').style.display = 'none';
    },

    _changeTab: function (tabNum) { // qrScan.animate._changeTab(tabNum);

      if (tabNum === 3) {
        actualScrollId = 'scrollAreaRejected';
        actualContentId = 'contentAreaRejected';
        actualLiArr = rejected_li_arr;

        qrScan.newClusterize();
      }

      // remove all is-active classes from tabs
      $('a.mdl-layout__tab').removeClass('is-active');
      // activate desired tab
      $('a[href="#scroll-tab-' + tabNum + '"]').addClass('is-active');
      // remove all is-active classes from panels
      $('.mdl-layout__tab-panel').removeClass('is-active');
      // activate desired tab panel
      $('#scroll-tab-' + tabNum).addClass('is-active');
    }
  },

  // Verify current tab selected
  checkTab: function (target) { // qrScan.checkTab(target);
    if (target.href.match("#scroll-tab-1")) {
      actualScrollId = undefined;
      actualContentId = undefined;
      actualLiArr = undefined;
    } else if (target.href.match("#scroll-tab-2")) {
      actualScrollId = 'scrollAreaSaved';
      actualContentId = 'contentAreaSaved';
      actualLiArr = saved_li_arr;

      qrScan.newClusterize();
    } else if (target.href.match("#scroll-tab-3")) {
      actualScrollId = 'scrollAreaRejected';
      actualContentId = 'contentAreaRejected';
      actualLiArr = rejected_li_arr;

      qrScan.newClusterize();
    }
  },

  // Creates a new instance of Clusterize
  newClusterize: function () { // qrScan.newClusterize();
    clusterize = new Clusterize({
      rows: actualLiArr,
      tag: 'ul',
      scrollId: actualScrollId,
      contentId: actualContentId,
      no_data_text: 'Nenhum bolsista',
      callbacks: {
        clusterChanged: function() {
          // console.log('cluster changed!');
        }
      }
    });
  },

  clearHTML: function (elemId) { // qrScan.clearHTML(elemId);
    document.getElementById(elemId).innerHTML = '';
  }
};



var clusterize = new Clusterize({
  rows: saved_li_arr,
  tag: 'ul',
  scrollId: 'scrollAreaSaved',
  contentId: 'contentAreaSaved',
  no_data_text: 'Nenhum bolsista',
  callbacks: {
    clusterChanged: function() {
      // console.log('cluster changed!');
    }
  }
});


/*
if (localStorage.getItem('enableLog') === null || localStorage.getItem('enableLog') === 'false') {
  qrScan.enableLog(false);
} else if (localStorage.getItem('enableLog') === 'true') {
  qrScan.enableLog(true);
}
*/


// Load saved data from localStorage if it exists
if (localStorage.getItem('data') !== null) {
  qrScan.loadFromLS('data');
  qrScan.updateHTMLArray('data');
  // console.log(qrScan.data.length);
}

// Load rejected data from localStorage if it exists
if (localStorage.getItem('rejected') !== null) {
  qrScan.loadFromLS('rejected');
  qrScan.updateHTMLArray('rejected');
  // console.log(qrScan.data.length);
}






let options = {};
// init options for scanner
options = qrScan.initVideoObjectOptions("webcameraPreview");

let cameraId = 0;

qrScan.initScanner(options);

qrScan.initAvaliableCameras(function () {
  cameraId = 1; // 1 = rear camera
});

qrScan.initCamera(cameraId);

qrScan.scanStart(function (data) {
  qrScan.saveScannedData(data);
});






// Camera Event Listeners
scanner.addListener('active', function () {
  qrScan.animate._loading(false);
});

scanner.addListener('inactive', function () {
  qrScan.animate._loading(true);
});




// MDL Event Listeners
(function () {
  /* Drawer */
  let navLinks = document.querySelectorAll('.mdl-navigation__link');
  let layout = document.querySelectorAll('.mdl-layout');

  for (let i = 0; i < navLinks.length; i++) {
    // Close drawer on link click
    navLinks[i].addEventListener('click', function() {
      for (let j = 0; j < layout.length; j++) {
        layout[j].MaterialLayout.toggleDrawer();
      }
    });

    // Clear rejected list
    navLinks[1].addEventListener('click', function() {
      qrScan.clearRejected();

      setTimeout(function () {
        // Go to Rejecteds tab
        qrScan.animate._changeTab(3);
      }, 500);
    });
  }

  /* Tabs */
  $('.mdl-layout__tab')
  .on('mousedown', function () {
    // console.log('mousedown');
    qrScan.checkTab(this);
  })
  .on('touchstart', function () {
    // console.log('touchstart');
    qrScan.checkTab(this);
  })
  .on('click', function() {
    if (this.href.match("#scroll-tab-1") && !isCameraTabActive) {
      // console.log('Camera activated.');
      isCameraTabActive = true;

      qrScan.clearHTML('contentAreaSaved');
      qrScan.clearHTML('contentAreaRejected');

      scanner.start(cameraGlobal);
    } else if (!this.href.match("#scroll-tab-1") && isCameraTabActive) {
      // console.log('Camera deactivated.');
      isCameraTabActive = false;

      setTimeout(function () {
        scanner.stop();
      }, 500);
    }

    if (this.href.match("#scroll-tab-2")) {
      qrScan.clearHTML('contentAreaRejected');
    } else if (this.href.match("#scroll-tab-3")) {
      qrScan.clearHTML('contentAreaSaved');
    }
  });
})();



//})();
