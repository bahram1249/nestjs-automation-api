var today = $('#currentDate').text();
var endDate = $('#endDate').text();
var selectedDate = today;
const items = [];
new WOW().init();
$('#date-picker').persianDatepicker({
  alwaysShow: true,
  months: [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ],
  dowTitle: [
    'شنبه',
    'یکشنبه',
    'دوشنبه',
    'سه شنبه',
    'چهارشنبه',
    'پنج شنبه',
    'جمعه',
  ],
  shortDowTitle: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
  showGregorianDate: !1,
  persianNumbers: !0,
  formatDate: 'YYYY/MM/DD',
  selectedBefore: !1,
  selectedDate: today, //today,
  startDate: 'today', //Date.now(),
  endDate: endDate, //new Date().setDate(new Date.now().getDate() + 7),
  prevArrow: "<i class='icon-left'></i>",
  nextArrow: "<i class='icon-right'></i>",
  theme: 'default',
  selectableYears: null,
  selectableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  cellWidth: 45, // by px
  cellHeight: 45, // by px
  fontSize: 15, // by px
  isRTL: !1,
  ignoreDays: [],
  onShow: function () {},
  onHide: function () {},
  onSelect: function (data) {
    selectedDate = $('#date-picker').attr('data-jdate');
  },
  onRender: function () {},
});
$('.menu-category .item').click(function () {
  $('.menu-items .group').removeClass('active');
  $(`.menu-items .group[data-category="${$(this).data('category')}"]`).addClass(
    'active',
  );
});

$('.increase').click(function () {
  $(this)
    .closest('div')
    .find('.count')
    .text(+$(this).closest('div').find('.count').text() + 1);
  var productId = $(this).parent('div').parent().data('id');
  var price = $(this).parent('div').parent().data('price');
  var finded = items.filter((item) => item.id === productId);
  if (finded.length == 0) {
    items.push({ id: productId, count: 1, price: price });
  } else {
    var index = items.indexOf(finded[0]);
    items[index].count += 1;
  }

  // cartCalculator(
  //   $(this).closest("div").find(".price").text(),
  //   "increase"
  // );
  cartCalculator();
});

$('.decrease').click(function () {
  if (+$(this).closest('div').find('.count').text() !== 0) {
    $(this)
      .closest('div')
      .find('.count')
      .text(+$(this).closest('div').find('.count').text() - 1);
  }
  var productId = $(this).parent('div').parent().data('id');
  var price = $(this).parent('div').parent().data('price');
  var finded = items.filter((item) => item.id === productId);
  if (finded.length > 0) {
    var index = items.indexOf(finded[0]);

    items[index].count -= 1;
    if (items[index].count == 0) {
      items.splice(index, 1);
    }
  }
  cartCalculator();
});
$('.price').each(function (element, index) {
  console.log($(this).text(numeral($(this).text()).format()));
});

function cartCalculator(price, action) {
  // var converted = numeral(price).value();
  // var finalPrice = numeral($(".final span").text()).value();
  // console.log(converted, finalPrice);
  // if (action == "increase") {
  //   $(".final span").text(numeral(converted + finalPrice).format());
  // } else if (action == "decrease") {
  //   $(".final span").text(numeral(converted - finalPrice).format());
  // }

  $('.final span').text(numeral(items.reduce(getSum, 0)).format());
  function getSum(total, obj) {
    return total + obj.count * obj.price;
  }
}

$('.chooseType .item').click(function () {
  $('.chooseType .item').removeClass('active');

  $(this).addClass('active');

  if ($(this).data('type') === 'cafe') {
    $('.chooseCondition').removeClass('active');
  } else {
    $('.chooseCondition').addClass('active');
  }

  items.splice(0, items.length);
  cartCalculator();
});
$('.peopleIncrease').click(function () {
  $(this)
    .parent()
    .find('.peopleCounter')
    .text(+$(this).parent().find('.peopleCounter').text() + 1);
});
$('.peopleDecrease').click(function () {
  if (+$(this).parent().find('.peopleCounter').text() !== 1) {
    $(this)
      .parent()
      .find('.peopleCounter')
      .text(+$(this).parent().find('.peopleCounter').text() - 1);
  }
});

$(document).on('click', '#getReserveButton', function (event) {
  event.preventDefault();
  var reserveType = $('.chooseType .item.active').attr('reserve-type');
  if (reserveType == 1 && items.length == 0) {
    alert('میبایست حداقل یک مورد را انتخاب بفرمایید');
  }
  var personCount = $('#peopleCounter').text();
  var itemMaps = items.map((item) => {
    return {
      id: parseInt(item.id),
      count: parseInt(item.count),
    };
  });

  var requestData = {
    personCount: Number(personCount),
    reserveDate: selectedDate,
    buffetId: Number($('#buffetId').text()),
    reserveType: Number(reserveType),
    items: itemMaps,
  };

  $.ajax({
    url: '/buffet/reserve',
    type: 'POST',
    data: requestData,
    success: function (data) {
      window.location = '/buffet/completeReserve/' + data.result.uniqueCode;
    },
    error: function (data) {
      console.log(data);
    },
  });
});
