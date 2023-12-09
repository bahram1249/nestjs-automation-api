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
	

	/* Function ============ */
		return {
			init:function(){
			},
			
			
			load:function(){
				donutChart();
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