$('#file').change(function () {
  var fd = new FormData();
  var files = $('#file')[0].files;
  if (files.length > 0) {
    fd.append('file', files[0]);
    $.ajax({
      url: '/v1/api/core/user/profile/photo',
      type: 'post',
      beforeSend: beforeSendAjax,
      data: fd,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response) {
          $('#img').attr(
            'src',
            '/v1/api/core/user/profile/photo/' +
              response.result.profileAttachment.fileName,
          );
        } else {
          alert('file not uploaded');
        }
      },
    });
  }
});
