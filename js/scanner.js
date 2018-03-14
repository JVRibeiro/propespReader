/* jshint esversion: 6 */

// instascan scanner object
scanner = {};

//(function () {
// Force removing outline on focus
(function () {
  let drawer = document.querySelectorAll('.mdl-layout__drawer-button');
  for (let i = 0; i < drawer.length; i++) {
    drawer[i].removeAttribute('tabindex');
  }
})();

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
    console.log('Iniciando verificação...');
    var read, proc, qrPretest, act, enc, dec, isQRValid, isMaybeValid, isMaybeEncoded, isEncoded;

    if (data.match(/\n/g) !== null ||
        data.match(/\\\"/g) !== null ||
        data.match(/\s/g) !== null) {
      // console.log('QR have line breaks!');
      // Processed data
      proc = data.replace(/\n/gi, '');
      // console.log('QR have escaped double quotes!');
      // Processed data
      proc = proc.replace(/\\\"/g, '"');
      // console.log('QR have white spaces!');
      // Processed data
      proc = proc.replace(/\"\: \"/g, '":"').replace(/\", \"/g, '","').replace(/\"\: \{\"/g, '":{"');
    }
    //
    else {
      proc = data;
    }

    console.log('QR Code content: ' + data);
    console.log('QR Code processed: ' + proc);

    // Read data
    // read = data.replace(/\n/gi, '<br>');
    // console.log("Dados lidos: " + data);
    // qrScan.log("Dados lidos: " + read);

    if (proc.match(/^\x7b\"\x70\x72\x6f\x70\x65\x73\x70\"\:\x7b(.*)\x7d\x7d/g) !== null) {
      isMaybeValid = true;
      isEncoded = false;

      data = proc;
    }
    //
    else if (proc.match(/^\{(.*)\}/g) === null && proc.match(/\s/g) === null) {
      isMaybeValid = true;
      isMaybeEncoded = true;
    }

    qrPretest = (isMaybeValid) ? 'maybe valid' : 'invalid';
    console.log("isQRValid (pretest): " + qrPretest);


    // Actual string Array
    act = proc;

    if (isMaybeEncoded && isMaybeValid) {
      console.log('QR Code is maybe encoded. Validating...');

      dec = CryptoJS.AES.decrypt(act, "propespti2013");
      full_dec = dec.toString(CryptoJS.enc.Utf8);

      isEncoded = (full_dec.match(/^\{(.*)\}/g) !== null) ? true : false;
    }

    // Is encoded
    if (isEncoded && isMaybeValid) {
      console.log("QR Code is maybe valid!");
      // QR is encoded
      console.log('QR Code is encoded!');

      console.log('Checking authencity...');

      // Decrypt data
      // CryptoJS.AES.decrypt(enc, "key");
      dec = CryptoJS.AES.decrypt(act, "propespti2013");

      // Decrypt data to string
      data = dec.toString(CryptoJS.enc.Utf8);

      // console.log('QR Code [data] updated: ' + data);
    }
    // Is not encoded
    else if (!isEncoded && isMaybeValid) {
      console.log("QR Code is maybe valid!");
      // QR is not encoded
      console.log('QR Code is not encoded!');
      console.log('Checking authencity...');

      data = act;
    }

    // console.log('Decoded QR: ' + data);
    // console.log('Type of [data]: ' + typeof data);

    // Check QR authencity
    if (data.match(/^\x7b\"\x70\x72\x6f\x70\x65\x73\x70\"\:\x7b(.*)\x7d\x7d/g) !== null) {
      isQRValid = true;

      console.log("QR Code is valid!");
    } else {
      isQRValid = false;

      console.log("QR Code is invalid!");
    }


    // console.log("data (updated): " + data);
    // console.log("isQRValid: " + isQRValid);

    // Check QR Code authencity
    // Is valid
    if (isQRValid) {
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
      enc =  CryptoJS.AES.encrypt(act, 'propespti2013');
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
      // console.log('QR Code inválido! Escaneie um QR Code pertencente à PROPESP.');
      // qrScan.log('QR Code inválido! Escaneie um QR Code pertencente à PROPESP.');

      // Animation
      qrScan.animate._snap();
      qrScan.animate._error();

      if (data.match(/^\{(.*)\}/g) !== null) {
        qrScan.rejected.push(JSON.parse(data));
      } else {
        qrScan.rejected.push(data);
      }

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
      // CryptoJS.AES.decrypt(localStorage.getItem('data'), "key");
      let decData = CryptoJS.AES.decrypt(localStorage.getItem('data'), "propespti2013");

      let decString = decData.toString(CryptoJS.enc.Utf8);

      qrScan.data = localStorage.getItem('data') === null ? qrScan.data : JSON.parse(decString);
    }

    if (string === 'rejected' || string === undefined) {
      // Decrypted data
      // CryptoJS.AES.decrypt(localStorage.getItem('rejected'), "key");
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
            '<span class="mdl-list__item-sub-title">RG: ' + qrScan.data[i].propesp.rg + '</span>' +
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
  },

  sync: function () {
    document.getElementById('mdl-syncing-icon').classList.add('syncing');

    $.ajax({
      url: "./classes/retrieve_scholarship_holders.php",
      success: function (result) {

        console.log(result);

        // Check cpf
        for (let i = 0; i < qrScan.data.length; i++) {

          for (let j = 0; j < result.length; j++) {
            if (qrScan.data[i].propesp.rg === result[j].rg) {
              console.log('CPF de ' + JSON.stringify(qrScan.data[i].propesp) + ' encontrado em: ' + JSON.stringify(result[j]));
              break;
            } else {
              console.log('CPF não encontrado!');
            }
          }

        }

        document.getElementById('mdl-syncing-icon').classList.remove('syncing');
      },
      error: function () {
        document.getElementById('mdl-syncing-icon').classList.remove('syncing');
        console.log('Erro ao sincronizar');
      }
    });
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
    navLinks[i].addEventListener('click', function() { // jshint ignore:line
      for (let j = 0; j < layout.length; j++) {
        layout[j].MaterialLayout.toggleDrawer();
      }
    });

    // Clear rejected list
    navLinks[1].addEventListener('click', function() { // jshint ignore:line
      qrScan.sync();
    });

    // Clear rejected list
    navLinks[2].addEventListener('click', function() { // jshint ignore:line
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
