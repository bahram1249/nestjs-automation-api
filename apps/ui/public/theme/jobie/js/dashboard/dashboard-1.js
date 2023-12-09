(function($) {
    /* "use strict" */


 var dzChartlist = function(){
	let draw = Chart.controllers.line.__super__.draw; //draw shadow
	var screenWidth = $(window).width();
	
	var donutChart = function(){
		$("span.donut").peity("donut", {
			width: "75",
			height: "75"
		});
	}
	var lineChart = function(){
		//dual line chart
		if(jQuery('#lineChart').length > 0 ){
			const lineChart = document.getElementById("lineChart").getContext('2d');
			//generate gradient
			const lineChart_3gradientStroke1 = lineChart.createLinearGradient(500, 0, 100, 0);
			lineChart_3gradientStroke1.addColorStop(0, "rgba(100, 24, 195, 1)");
			lineChart_3gradientStroke1.addColorStop(1, "rgba(100, 24, 195, 0.5)");

			const lineChart_3gradientStroke2 = lineChart.createLinearGradient(500, 0, 100, 0);
			lineChart_3gradientStroke2.addColorStop(0, "rgba(27, 208, 132, 1)");
			lineChart_3gradientStroke2.addColorStop(1, "rgba(27, 208, 132, 1)");

			Chart.controllers.line = Chart.controllers.line.extend({
				draw: function () {
					draw.apply(this, arguments);
					let nk = this.chart.chart.ctx;
					let _stroke = nk.stroke;
					nk.stroke = function () {
						nk.save();
						nk.shadowColor = 'rgba(78, 54, 226, .5)';
						nk.shadowBlur = 10;
						nk.shadowOffsetX = 0;
						nk.shadowOffsetY = 0;
						_stroke.apply(this, arguments)
						nk.restore();
					}
				}
			});
			Chart.defaults.global.defaultFontFamily = "iransans-normal";
			lineChart.height = 20;
			new Chart(lineChart, {
				type: 'line',
				data: {
				// defaultFontFamily: 'iransans-normal',
					labels: ["هفته اول", "هفته دوم", "هفته سوم", "هفته چهارم", "هفته پنجم", "هفته ششم", "هقته هفتم", "هفته هشتم", "هفته نهم", "هفته دهم"],
					datasets: [
						{
							label: "اولین مجموعه داده من",
							data: [78, 80, 20, 40, 75, 75, 25, 40, 10, 30],
							borderColor: 'rgba(78, 54, 226, 1)',
							borderWidth: "5",
							pointHoverRadius:10,
							backgroundColor: 'transparent', 
							pointBackgroundColor: 'rgba(78, 54, 226, 1)',
						}, {
							label: "دومین مجموعه داده من",
							data: [30, 50, 30, 40, 30, 40, 20, 10, 10, 10],
							borderColor: lineChart_3gradientStroke2,
							borderWidth: "5",
							backgroundColor: 'transparent',
							pointHoverRadius:10,
							pointBorderWidth:5,
							pointBorderColor:'rgba(255, 255, 255, 1)',
							pointBackgroundColor: 'rgba(27, 208, 132, 1)'
						}
					]
				},
				options: {
					legend: false,
					tooltips: {
						mode: 'index',
						intersect: false,
						titleAlign: 'right',
					},
					hover: {
						mode: 'nearest',
						intersect: true
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true, 
								max: 100, 
								min: 0, 
								stepSize: 20, 
								padding: 10,
								fontFamily: 'iransans-normal'
							}
						}],
						xAxes: [{ 
							ticks: {
								padding: 5,
								fontFamily: 'iransans-normal'
							}
						}]
					},
					elements: {
						point: {
							radius: 0
						}
					}

				}
			});
		}
	}
	/* Function ============ */
		return {
			init:function(){
			},
			
			
			load:function(){
				donutChart();
				lineChart();
			},
			
			resize:function(){
				
			}
		}
	
	}();

	jQuery(document).ready(function(){
	});
		
	jQuery(window).on('load',function(){
		setTimeout(function(){
			dzChartlist.load();
		}, 1000); 
		
	});

	jQuery(window).on('resize',function(){
		
		
	});     

})(jQuery);