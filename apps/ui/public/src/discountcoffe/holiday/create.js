var today = $('#currentDate').text();
var endDate = $('#endDate').text();
var selectedDate = today;
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
  formatDate: 'YYYY/0M/0D',
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
