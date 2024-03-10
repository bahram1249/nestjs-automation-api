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
