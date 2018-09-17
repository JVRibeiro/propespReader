/* jshint esversion: 6 */
$('.dropdown-trigger').dropdown({
  constrainWidth: false
});

$('.tabs').tabs({
  swipeable: true,
  duration: 200,
  onShow: () => {
    if ($('a[href="#scroll-tab-1"]').hasClass('active') && !isCameraTabActive) {
      console.log('Camera activated.');
      actualScrollId = undefined;
      actualContentId = undefined;
      actualLiArr = undefined;

      isCameraTabActive = true;

      qrScan.clearHTML('contentAreaSaved');
      qrScan.clearHTML('contentAreaRejected');

      scanner.start(cameraGlobal);
    }
    else if (!$('a[href="#scroll-tab-1"]').hasClass('active') && isCameraTabActive) {
      console.log('Camera deactivated.');

      isCameraTabActive = false;

      setTimeout(function () {
        scanner.stop();
      }, 500);
    }

    if ($('a[href="#scroll-tab-2"]').hasClass('active')) {
      actualScrollId = 'scrollAreaSaved';
      actualContentId = 'contentAreaSaved';
      actualLiArr = saved_li_arr;

      qrScan.newClusterize();
      qrScan.clearHTML('contentAreaRejected');
      qrScan.animate._changeSyncStatus();
    }
    else if ($('a[href="#scroll-tab-3"]').hasClass('active')) {
      actualScrollId = 'scrollAreaRejected';
      actualContentId = 'contentAreaRejected';
      actualLiArr = rejected_li_arr;

      qrScan.newClusterize();
      qrScan.clearHTML('contentAreaSaved');
    }
  }
});
