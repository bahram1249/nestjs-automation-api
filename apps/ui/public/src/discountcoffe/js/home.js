const searchButton = document.querySelector('.searchFilter');

$('.searchFilter').on('click', () => {
  var json = {};

  var buffetTypesId = $('input[name="buffetTypesId"]:checked').val();
  var buffetCostId = $('input[name="buffetCostId"]:checked').val();
  var locationItem = $('#location').find(':selected').attr('value');

  if (locationItem != '') {
    json.buffetCityId = locationItem;
  }

  if (buffetCostId != '') {
    json.buffetCostId = buffetCostId;
  }

  if (buffetTypesId != '') {
    json.buffetTypesId = buffetTypesId;
  }

  var params = $.param(json);

  window.location.href = '/buffet/list?' + params;
});

$(document).ready(function () {
  $('select').select2();
});
