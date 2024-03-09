var html5QrcodeScanner = new Html5QrcodeScanner('reader', {
  fps: 10,
  qrbox: 250,
});

function onScanSuccess(decodedText, decodedResult) {
  // Handle on success condition with the decoded text or result.

  // ...
  html5QrcodeScanner.clear();

  checkRequest(decodedText);
  // ^ this will stop the scanner (video feed) and clear the scan area.
}

function onScanError(errorMessage) {
  // handle on error condition, with error message
  //sweetErrorMessage('خطای اسکن', errorMessage);
}

function checkRequest(reserveId) {
  $.ajax({
    url: '/v1/api/discountcoffe/admin/qrscans',
    type: 'POST',
    data: {
      reserveId: reserveId,
    },
    beforeSend: beforeSendAjax,
    success: function (data) {
      // redirect
      window.location.href =
        '/discountcoffe/admin/coffereports?reserveId=' + data.result.id;
    },
    error: (XMLHttpRequest, textStatus, error) => {
      errorJson(XMLHttpRequest, textStatus, error);
      html5QrcodeScanner.render(onScanSuccess, onScanError);
    },
  });
}

html5QrcodeScanner.render(onScanSuccess, onScanError);
