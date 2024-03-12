$(document).ready(function () {
  $('select').select2();
});

$('#showReport').on('click', function (event) {
  var buffetId = $('#buffetSelect').find(':selected').val();
  var url = `/v1/api/discountcoffe/admin/allFactorReports?buffetId=${buffetId}`;
  $.ajax({
    url: url,
    type: 'GET',
    beforeSend: function (request) {
      beforeSendAjax(request);
    },
    success: function (data) {
      $('#allFactorReport tbody').text('');
      const html = [];
      data.result.forEach((item) => {
        html.push('<tr>');
        html.push(`<td>${item.id}</td>`);
        html.push(`<td>${item.title}</td>`);
        html.push(`<td>${item.YearNumber}</td>`);
        html.push(`<td>${item.PersianMonthName}</td>`);
        html.push(`<td>${item.totalCnt}</td>`);
        html.push(`<td>${item.onlineCnt}</td>`);
        html.push(`<td>${item.onlineScanCnt}</td>`);
        html.push(`<td>${item.offlineCnt}</td>`);
        html.push(`<td>${item.offlineScanCnt}</td>`);
        html.push(`<td>${item.onlineSumPrice}</td>`);
        html.push(`<td>${item.onlineSumPriceScaned}</td>`);
        html.push(`<td>${item.offlineSumPrice}</td>`);
        html.push(`<td>${item.offlineSumPriceScaned}</td>`);
        html.push('</tr>');
      });
      $('#allFactorReport tbody').html(html.join(''));
    },
    error: errorJson,
  });
});
