var page = 1;
var limit = 15;

$(document).ready(async function () {
  await filterProducts();
});

$(document).on('input keypress', '.filters', onChnageFilterProducts);
$(document).on('click', '.order a', onChnageFilterProducts);

async function requestData(queryString) {
  $.each(queryString, function (key, value) {
    if (value === '' || value === null) {
      delete queryString[key];
    }
  });

  const response = await fetch(
    '/v1/api/discountcoffe/user/buffets?' + $.param(queryString),
  );
  var json = await response.json();
  return {
    result: json.result,
    resultCount: json.resultCount,
  };
}

function outputCount(p, limit, resultCount) {
  $('#pagination').pagination({
    // Total number of items present
    // in wrapper class
    items: resultCount,
    prevText: 'قبلی',
    nextText: 'بعدی',
    currentPage: p,
    // Items allowed on a single page
    itemsOnPage: limit,
    onPageClick: async function (noofele) {
      page = noofele;
      await filterProducts();
      // $(".wrapper .item")
      //   .hide()
      //   .slice(limit * (noofele - 1), limit + limit * (noofele - 1))
      //   .show();
    },
  });
}

function outputProducts(products) {
  document.getElementById('products').innerHTML = products
    .map((n) => {
      var text = `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6">
        <div class="productItem">
          <img class="w-100" src="/v1/api/discountcoffe/admin/buffets/photo/${
            n.coverAttachment ? n.coverAttachment.fileName : 'unknown.jpg'
          }" alt="" />
          <div class="productData">`;
      text += `<h3>${n.title}</h3>`;

      text += `<div class="features">`;

      let optionCount = n.coffeOptions.length;
      if (optionCount > 3) optionCount = 3;
      for (let index = 0; index < optionCount; index++) {
        const option = n.coffeOptions[index];
        text += `<div class="item">`;
        text += `<i class="${option.iconClass}"></i>`;
        text += `<p>${option.title}</p>`;
        text += `</div>`;
      }

      text += `</div>`;

      text += `<div class="more">
              <h5>تا ${n.percentDiscount}% تخفیف!</h5>
              <a href="/buffet/${n.urlAddress}" tabindex="0">
                اطلاعات و رزرو
              </a>
            </div>`;
      text += `</div>
        </div>
      </div>`;
      return text;
    })
    .join('');
}

async function filterProducts() {
  // const country = filters.querySelector("#country").value,
  //   sizes = [...filters.querySelectorAll("#size input:checked")].map(
  //     (n) => n.value
  //   ),
  //   priceMin = document.querySelector("#price-min").value,
  //   priceMax = document.querySelector("#price-max").value;

  // sort order
  var sortItem = document.querySelector('.order a.active');
  var orderBy = sortItem.getAttribute('field-id');
  var order = sortItem.getAttribute('field-order');

  var filters = document.querySelector('.filters');

  var search = filters.querySelector('#searchInput').value;

  var buffetTypeId = filters.querySelector('#buffetTypeId').value;
  if (buffetTypeId == 0) {
    buffetTypeId = null;
  }
  var buffetCityId = filters.querySelector('#buffetCityId').value;
  var longitude = null;
  var latitude = null;
  if (buffetCityId == 0) {
    if ($('#latitude').attr('position') != '') {
      latitude = $('#latitude').attr('position');
    }

    if ($('#longitude').attr('position') != '') {
      longitude = $('#longitude').attr('position');
    }
    buffetCityId = null;
  } else {
    $('#latitude').attr('position', '');
    $('#longitude').attr('position', '');
  }
  var buffetCostId = filters.querySelector('#buffetCostId').value;
  if (buffetCostId == 0) {
    buffetCostId = null;
  }

  var coffeOptions = filters.querySelectorAll('.coffeOptionItem input:checked');
  var coffeOptionIds = [];
  for (let index = 0; index < coffeOptions.length; index++) {
    const coffeOptionInput = coffeOptions[index];
    coffeOptionIds.push(
      parseInt(coffeOptionInput.getAttribute('coffe-option-id')),
    );
  }

  var queryString = {
    page,
    limit,
    orderBy: orderBy || 'id',
    order: order || 'desc',
    buffetTypeId,
    buffetCityId,
    buffetCostId,
    latitude,
    longitude,
    search,
    coffeOptionIds: coffeOptionIds.length > 0 ? coffeOptionIds : null,
  };

  var res = await requestData(queryString);
  outputProducts(res.result);
  outputCount(page, limit, res.resultCount);
}

async function onChnageFilterProducts() {
  page = 1;
  limit = 15;
  await filterProducts();
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}

function showPosition(position) {
  $('#longitude').attr('position', position.coords.longitude);
  $('#latitude').attr('position', position.coords.latitude);
  $('select#buffetCityId').val('0').change();
  filterProducts();
  // console.log('Latitude:', position.coords.latitude);
  // console.log('Longitude:', position.coords.longitude);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log('User denied the request for Geolocation.');
      break;
    case error.POSITION_UNAVAILABLE:
      console.log('Location information is unavailable.');
      break;
    case error.TIMEOUT:
      console.log('The request to get user location timed out.');
      break;
    default:
      console.log('An unknown error occurred.');
  }
}
$('#btnBehindCurrentLocation').on('click', function () {
  getLocation();
});
