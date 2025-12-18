(function($){
	'use script';
	$(window).on('load', function(event) {
        $('#preloader').delay(500).fadeOut(500);
    });
	// WOW JS
	new WOW().init();
	// Scroll Area
	$(document).ready(function(){
	    $('.scroll-area').click(function(){
	      	$('html').animate({
	        	'scrollTop' : 0,
	      	},700);
	      	return false;
	    });
	    $(window).on('scroll',function(){
	      	var a = $(window).scrollTop();
	      	if(a>400){
	            $('.scroll-area').slideDown(300);
	        }else{
	            $('.scroll-area').slideUp(200);
	        }
	    });
	});
	// Counter
    var $CounterUp = $('.counter');
    if($CounterUp.length > 0){
		$('.counter').counterUp({
	        delay: 10,
	        time: 2000
	    });
	}
	$('a[data-rel^=lightcase]').lightcase({
        transition: 'elastic', /* none, fade, fadeInline, elastic, scrollTop, scrollRight, scrollBottom, scrollLeft, scrollHorizontal and scrollVertical */
        swipe: true,
        maxWidth: 1170,
        maxHeight: 600,
    });
	/*---Testimonial---*/
    var $testimonialSlider = $('.testimonial-full');
        if($testimonialSlider.length > 0){
        $('.testimonial-full').owlCarousel({
            autoplay: true,
            loop: true,
            nav: false,
            autoplay: false,
            autoplayTimeout: 8000,
            items: 2,
            dots:true,
            responsiveClass:true,
            responsive:{
                    0:{
                    items:1,
                },
                400:{
                    items:1,
                },
                767:{
                    items:2,
                },
                991:{
                    items:2,
                },

            }
        });
     } 
	/*---Client Logo---*/
    var $ClientLogo = $('.client_logo_slider');
        if($ClientLogo.length > 0){
        $('.client_logo_slider').owlCarousel({
            autoplay: true,
            loop: true,
            nav: false,
            autoplay: false,
            autoplayTimeout: 8000,
            smartSpeed:500,
            items: 6,
            dots:false,
            responsiveClass:true,
            responsive:{
                    0:{
                    items:2,
                },
                400:{
                    items:3,
                },
                676:{
                    items:4,
                },
                767:{
                    items:5,
                },
                991:{
                    items:6,
                },

            }
        });
     } 
	// Counter
    var $PortfolioMixIT = $('.portfolio-full');
    if($PortfolioMixIT.length > 0){
    	var mixer = mixitup('.portfolio-full');
    	var mixer = mixitup('.portF');
    	var mixer = mixitup('.portF', {
    		selectors: {
    			target: '.blog-item'
    		},
    		animation: {
    			duration: 100
    		}
    	});
    }

}(jQuery));