var selectedLocale = 'fa-IR';
if (document.getElementsByClassName('locale').length > 0) {
  selectedLocale = $('.locale').first().text();
}

$.extend(
  $.fn.bootstrapTable.defaults,
  $.fn.bootstrapTable.locales[selectedLocale],
);
function roleActionFormatter(value, row) {
  var html = [];
  html.push('<div class="text-center d-flex justify-content-center">');
  html.push('<a onclick="onEditClick(' + row.id + ')">');
  html.push('<button class="btn btn-success">');
  html.push('<i class="flaticon-381-edit"></i>');

  if (selectedLocale == 'fa-IR') {
    html.push(' ویرایش');
  } else {
    html.push(' Edit');
  }

  html.push('</button>');
  html.push('</a>');
  html.push('<a onclick="onDeleteClick(' + row.id + ')">');
  html.push('<button class="btn btn-danger ml-1">');
  html.push('<i class="la la-trash"></i>');

  if (selectedLocale == 'fa-IR') {
    html.push(' حذف');
  } else {
    html.push(' Delete');
  }

  html.push('</button>');
  html.push('</a>');
  html.push('</div>');
  return html.join('');
}
function getRolesAjaxRequest(params) {
  var url = '/v1/api/core/admin/roles';
  $.ajax({
    method: 'GET',
    url: url + '?' + $.param(params.data),
    beforeSend: beforeSendAjax,
    success: function (res) {
      var result = {
        total: res.total,
        totalNotFiltered: res.totalNotFiltered,
        rows: res.result,
      };
      params.success(result);
    },
  });
}

function onEditClick(id) {
  $('#roleId').attr('role-id', id);
  $('#defaultModal').modal('show');
  $.ajax({
    url: '/core/admin/role/' + id,
    type: 'GET',
    success: function (data) {
      $('#defaultModalBody').html(data);
    },
    error: function (XMLHttpRequest, textStatus, error) {
      htmlError(XMLHttpRequest, textStatus, error, $('#defaultModalBody'));
    },
  });
}

function onAddClick() {
  $('#addModal').modal('show');
  $.ajax({
    url: '/core/admin/newRole/',
    type: 'GET',
    success: function (data) {
      $('#addModalBody').html(data);
    },
    error: function (XMLHttpRequest, textStatus, error) {
      htmlError(XMLHttpRequest, textStatus, error, $('#addModalBody'));
    },
  });
}

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
        url: '/api/core/admin/roles/' + id,
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
$('#roleTable').bootstrapTable({
  locale: locale,
});

function refreshTable() {
  $('#roleTable').bootstrapTable('refresh');
}

$('#submitRoleEdit').on('click', function () {
  var permissions = [];
  var inputPermissions = $('input.permission-select:checked');
  var roleName = $('#roleNameId').val();
  inputPermissions.each(function () {
    permissions.push($(this).attr('permission-id'));
  });

  var roleId = $('#roleId').attr('role-id');
  $.ajax({
    url: '/api/core/admin/roles/' + roleId,
    type: 'PUT',
    data: {
      permissions:
        permissions.length === 0 ? permissions.toString() : permissions,
      roleName: roleName,
    },
    beforeSend: beforeSendAjax,
    success: function (data) {
      $('#defaultModal').modal('hide');
      refreshTable();
    },
    error: errorJson,
  });
});

$('#submitRoleAdd').on('click', function () {
  var permissions = [];
  var inputPermissions = $('input.permission-select:checked');
  var roleName = $('#roleNameId').val();
  inputPermissions.each(function () {
    permissions.push($(this).attr('permission-id'));
  });

  var roleId = $('#roleId').attr('role-id');
  $.ajax({
    url: '/api/core/admin/roles',
    type: 'POST',
    data: {
      permissions:
        permissions.length === 0 ? permissions.toString() : permissions,
      roleName: roleName,
    },
    beforeSend: beforeSendAjax,
    success: function (data) {
      $('#addModal').modal('hide');
      refreshTable();
    },
    error: errorJson,
  });
});

$('#addRoleBtn').on('click', function () {
  onAddClick();
});

$('.modal').on('hidden.bs.modal', function () {
  $('.modal-body').html('');
});

$('.modal').on('show.bs.modal', function () {
  var loadingText = '';
  if (selectedLocale == 'fa-IR') {
    loadingText = '<h1>در حال بارگزاری ...</h1>';
  } else {
    loadingText = '<h1>Loading ...</h1>';
  }
  $('.modal-body').html(loadingText);
});
