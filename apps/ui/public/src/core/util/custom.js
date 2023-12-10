function sweetErrorMessage(title, text) {
  Swal.fire({
    title: title,
    text: text,
    type: 'error',
    confirmButtonText: 'باشه',
  });
}

function sweetSuccessMessage(title, text) {
  Swal.fire(title, text, 'success');
}

function errorJson(XMLHttpRequest, textStatus, error) {
  if (XMLHttpRequest.readyState == 4) {
    var err = JSON.parse(XMLHttpRequest.responseText);
    try {
      sweetErrorMessage('خطا', err.errors.join('<br>'));
    } catch (e) {
      sweetErrorMessage('خطا', 'خطای ناشناخته');
    }
    sweetErrorMessage('خطا', err.error.join);
    // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
  } else if (XMLHttpRequest.readyState == 0) {
    // Network error (i.e. connection refused, access denied due to CORS, etc.)
    sweetErrorMessage('خطا', 'خطا در برقراری ارتباط');
  } else {
    // something weird is happening
    sweetErrorMessage('خطا', 'خطای ناشناخته');
  }
}

function htmlError(XMLHttpRequest, textStatus, error, selector) {
  if (XMLHttpRequest.readyState == 4) {
    var err = XMLHttpRequest.responseText;
    selector.html(err);
    // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
  } else if (XMLHttpRequest.readyState == 0) {
    // Network error (i.e. connection refused, access denied due to CORS, etc.)
    sweetErrorMessage('خطا', 'خطا در برقراری ارتباط');
  } else {
    // something weird is happening
    sweetErrorMessage('خطا', 'خطای ناشناخته');
  }
}
window.getCookie = function (name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
};
function getAuthorization() {
  return getCookie('token');
}
function beforeSendAjax(request) {
  request.setRequestHeader('authorization', 'Bearer ' + getCookie('token'));
}
window.ajaxOptions = {
  beforeSend: beforeSendAjax,
};
$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};
