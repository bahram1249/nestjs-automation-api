var selectedLocale = 'fa-IR';
if (document.getElementsByClassName('locale').length > 0) {
  selectedLocale = $('.locale').first().text();
}

$.extend(
  $.fn.bootstrapTable.defaults,
  $.fn.bootstrapTable.locales[selectedLocale],
);

$('#backButton').on('click', function () {
  $('#backButton').hide();
  $('#mainSection').show();
  $('#secondSection').hide();
});
function actionFormatter(value, row) {
  var html = [];
  html.push('<div class="text-center d-flex justify-content-center">');
  html.push(
    '<a class="btn btn-primary shadow btn-xs sharp mr-1" onclick="onEditClick(' +
      row.id +
      ')">',
  );
  html.push('<i class="fa fa-pencil"></i>');

  html.push('</a>');
  html.push(
    '<a class="btn btn-danger shadow btn-xs sharp mr-1" onclick="onDeleteClick(' +
      row.id +
      ')">',
  );
  html.push('<i class="fa fa-trash"></i>');

  html.push('</a>');
  html.push('</div>');
  return html.join('');
}
function getEntityAjaxRequest(params) {
  //params.data.ignorePaging = false;
  var url = '/v1/api/discountcoffe/admin/menucategories';
  $.ajax({
    method: 'GET',
    url: url + '?' + $.param(params.data),
    beforeSend: beforeSendAjax,
    success: function (res) {
      var result = {
        total: res.total,
        //totalNotFiltered: res.totalNotFiltered,
        rows: res.result,
      };
      params.success(result);
    },
  });
}

function onEditClick(id) {
  $('#mainSection').hide();
  $('#backButton').show();
  $('#secondSection').html('');
  $('#secondSection').show();
  $.ajax({
    url: '/discountcoffe/admin/menucategories/' + id,
    type: 'GET',
    success: function (data) {
      $('#secondSection').html(data);
    },
    error: function (XMLHttpRequest, textStatus, error) {
      htmlError(XMLHttpRequest, textStatus, error, $('#secondSection'));
    },
  });
}

function onAddClick() {
  $('#mainSection').hide();
  $('#backButton').show();
  $('#secondSection').html('');
  $('#secondSection').show();
  $.ajax({
    url: '/discountcoffe/admin/menucategories/create',
    type: 'GET',
    success: function (data) {
      $('#secondSection').html(data);
    },
    error: function (XMLHttpRequest, textStatus, error) {
      htmlError(XMLHttpRequest, textStatus, error, $('#secondSection'));
    },
  });
}

$('#onAddClick').on('click', function () {
  onAddClick();
});
function onDeleteClick(id) {
  var confirmDelete = '';
  var confirmDeleteText = '';
  var yesButton = '';
  var cancellButton = '';
  var successMessage = '';
  if (selectedLocale == 'fa-IR') {
    confirmDelete = 'آیا از حذف اطمینان دارید؟';
    confirmDeleteText = 'این عملیات غیر قابل بازگشت است';
    yesButton = 'بله';
    cancellButton = 'انصراف';
    successMessage = 'پیغام موفق';
  } else {
    confirmDelete = 'Confirm Delete?';
    confirmDeleteText = 'This Action Not Recoverable';
    yesButton = 'Yes';
    cancellButton = 'Cancell';
    successMessage = 'Success Message';
  }
  Swal.fire({
    title: confirmDelete,
    text: confirmDeleteText,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: cancellButton,
    confirmButtonText: yesButton,
  }).then((result) => {
    if (result.value == true) {
      $.ajax({
        url: '/v1/api/core/admin/menucategories/' + id,
        type: 'DELETE',
        beforeSend: beforeSendAjax,
        success: function (data) {
          Swal.fire(successMessage, data.message, 'success');
          refreshTable();
        },
        error: errorJson,
      });
    }
  });
}

var locale = selectedLocale || 'fa-IR';
$('#entityTable').bootstrapTable({
  locale: locale,
});

function refreshTable() {
  $('#entityTable').bootstrapTable('refresh');
}

function showMainSection() {
  $('#backButton').hide();
  $('#secondSection').hide();
  $('#mainSection').show();
}

$(document).on('submit', '#editEntityForm', function (event) {
  var entityId = $('#entityId').text();
  event.preventDefault();
  var requestData = JSON.parse(JSON.stringify($(this).serializeObject()));
  $.each(requestData, function (key, value) {
    if (key == 'buffetDescription') {
      requestData[key] = value.replace('../..', '');
    }
    // console.log(!isNaN(value));
    // if (!isNaN(value)) {
    //   requestData[key] = parseInt(value);
    // }
    if (value === '' || value === null) {
      delete requestData[key];
    }
  });

  var options = [];
  var inputOptions = $('input.option-select:checked');
  inputOptions.each(function () {
    options.push($(this).attr('option-id'));
  });

  var formData = new FormData();
  var file = $('#file')[0].files;
  var length = file.length;
  if (length > 0) {
    formData.append('file', file[0]);
  }

  options.forEach((option) => {
    formData.append('options[]', option);
  });

  Object.keys(requestData).forEach(function (k, v) {
    formData.append(k, requestData[k]);
  });

  $.ajax({
    url: '/v1/api/discountcoffe/admin/menucategories/' + entityId,
    type: 'PUT',
    data: formData,
    contentType: 'multipart/form-data',
    processData: false,
    contentType: false,
    beforeSend: function (request) {
      beforeSendAjax(request);
    },
    success: function (data) {
      showMainSection();
      refreshTable();
    },
    error: errorJson,
  });
});

$(document).on('submit', '#newEntityForm', function (event) {
  event.preventDefault();
  var requestData = JSON.parse(JSON.stringify($(this).serializeObject()));
  $.each(requestData, function (key, value) {
    if (key == 'buffetDescription') {
      requestData[key] = value.replace('../..', '');
    }
    // console.log(!isNaN(value));
    // if (!isNaN(value)) {
    //   requestData[key] = parseInt(value);
    // }
    if (value === '' || value === null) {
      delete requestData[key];
    }
  });

  var options = [];
  var inputOptions = $('input.option-select:checked');
  inputOptions.each(function () {
    options.push($(this).attr('option-id'));
  });

  var formData = new FormData();
  var file = $('#file')[0].files;
  var length = file.length;
  if (length > 0) {
    formData.append('file', file[0]);
  }

  options.forEach((option) => {
    formData.append('options[]', option);
  });

  Object.keys(requestData).forEach(function (k, v) {
    formData.append(k, requestData[k]);
  });

  $.ajax({
    url: '/v1/api/discountcoffe/admin/menucategories/',
    type: 'POST',
    data: formData,
    contentType: 'multipart/form-data',
    processData: false,
    contentType: false,
    beforeSend: function (request) {
      beforeSendAjax(request);
    },
    success: function (data) {
      showMainSection();
      refreshTable();
    },
    error: errorJson,
  });
});
