var tinymceLanguage = 'fa';
tinymce.init({
  selector: 'textarea#content',
  language: tinymceLanguage,
  plugins: 'advlist link lists autoresize autolink preview code', //image
  toolbar:
    'undo redo | link image | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | indent outdent | bullist numlist  | code | preview',
  max_height: 1500,
  min_height: 500,
  //automatic_uploads: true,
  //images_upload_url: 'postAcceptor.php',
  default_link_target: '_blank',
  //   file_picker_types: 'image',
  //   images_upload_handler: customize_image_upload_handler,

  //   file_picker_callback: function (cb, value, meta) {
  //     var input = document.createElement('input');
  //     input.setAttribute('type', 'file');
  //     input.setAttribute('accept', '.pdf|.docx|.doc');

  //     /*
  //           Note: In modern browsers input[type="file"] is functional without
  //           even adding it to the DOM, but that might not be the case in some older
  //           or quirky browsers like IE, so you might want to add it to the DOM
  //           just in case, and visually hide it. And do not forget do remove it
  //           once you do not need it anymore.
  //         */

  //     input.onchange = function () {
  //       var file = this.files[0];

  //       var data = new FormData();
  //       data.append('file', file);
  //       data.append('attachmentTypeId', 9);

  //       $.ajax({
  //         url: '/api/core/admin/uploads/single',
  //         type: 'POST',
  //         data: data,
  //         enctype: 'multipart/form-data',
  //         dataType: 'json',
  //         processData: false, // Don't process the files
  //         contentType: false, // Set content type to false as jQuery will tell the server its a query string request
  //         beforeSend: beforeSendAjax,
  //         success: function (data, textStatus, jqXHR) {
  //           console.log(data);
  //           cb('/core/image/' + data.result.fileName, {
  //             title: data.result.fileName,
  //           });
  //           //editor.insertContent('<img class="content-img" src="${pageContext.request.contextPath}' + data.location + '" data-mce-src="${pageContext.request.contextPath}' + data.location + '" />');
  //         },
  //         error: function (jqXHR, textStatus, errorThrown) {
  //           // if(jqXHR.responseText) {
  //           //   errors = JSON.parse(jqXHR.responseText).errors
  //           //   alert('Error uploading image: ' + errors.join(", ") + '. Make sure the file is an image and has extension jpg/jpeg/png.');
  //           // }
  //         },
  //       });

  //       var reader = new FileReader();
  //       // reader.onload = function () {
  //       //   /*
  //       //     Note: Now we need to register the blob in TinyMCEs image blob
  //       //     registry. In the next release this part hopefully won't be
  //       //     necessary, as we are looking to handle it internally.
  //       //   */
  //       //   var id = 'blobid' + (new Date()).getTime();
  //       //   var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
  //       //   var base64 = reader.result.split(',')[1];
  //       //   var blobInfo = blobCache.create(id, file, base64);
  //       //   blobCache.add(blobInfo);

  //       //   /* call the callback and populate the Title field with the file name */
  //       //   cb(blobInfo.blobUri(), { title: file.name });
  //       // };
  //       //reader.readAsDataURL(file);
  //     };

  //     input.click();
  //   },
});
