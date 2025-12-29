
(function($){
    'use strict';
/*---canvas menu activation---*/
    $('.canvas_open').on('click', function(){
        $('.offcanvas_menu_wrapper,.off_canvars_overlay').addClass('active');
    });

    $('.canvas_close,.off_canvars_overlay').on('click', function(){
        $('.offcanvas_menu_wrapper,.off_canvars_overlay').removeClass('active');
    });

    // Keyboard support for canvas open/close
    $('.canvas_open').on('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $('.offcanvas_menu_wrapper,.off_canvars_overlay').addClass('active');
        }
    });

    $('.canvas_close').on('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $('.offcanvas_menu_wrapper,.off_canvars_overlay').removeClass('active');
        }
    });

    // Close menu on Escape key
    $(document).on('keydown', function(e){
        if (e.key === 'Escape' && $('.offcanvas_menu_wrapper').hasClass('active')) {
            $('.offcanvas_menu_wrapper,.off_canvars_overlay').removeClass('active');
        }
    });

	/*---Off Canvas Menu---*/
    var $offcanvasNav = $('.offcanvas_main_menu'),
        $offcanvasNavSubMenu = $offcanvasNav.find('.sub-menu');
    $offcanvasNavSubMenu.parent().prepend('<span class="menu-expand" tabindex="0" role="button" aria-expanded="false"><i class="fa fa-angle-down"></i></span>');

    $offcanvasNavSubMenu.slideUp();

    // Handle submenu toggle
    function toggleSubmenu($this, e) {
        e.preventDefault();
        var $parent = $this.parent();
        var parentClass = $parent.attr('class') || '';

        if (parentClass.match(/\b(menu-item-has-children|has-children|has-sub-menu)\b/) &&
            ($this.attr('href') === '#' || $this.hasClass('menu-expand'))) {
            if ($this.siblings('ul:visible').length){
                $this.siblings('ul').slideUp('slow');
                $this.attr('aria-expanded', 'false');
            } else {
                $this.closest('li').siblings('li').find('ul:visible').slideUp('slow');
                $this.siblings('ul').slideDown('slow');
                $this.attr('aria-expanded', 'true');
            }
        }

        var thisClass = $this.attr('class') || '';
        if ($this.is('a') || $this.is('span') || thisClass.match(/\b(menu-expand)\b/)) {
            $parent.toggleClass('menu-open');
        } else if ($this.is('li') && parentClass.match(/\b(menu-item-has-children)\b/)) {
            $this.toggleClass('menu-open');
        }
    }

    // Click handler
    $offcanvasNav.on('click', 'li a, li .menu-expand', function(e) {
        toggleSubmenu($(this), e);
    });

    // Keyboard handler for submenu toggles
    $offcanvasNav.on('keydown', 'li .menu-expand', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            toggleSubmenu($(this), e);
        }
    });
}(jQuery));