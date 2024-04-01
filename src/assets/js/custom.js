(function($){
	"use strict";
	
	// Header Sticky
	$(window).on('scroll',function() {
		if ($(this).scrollTop() > 30){  
			$('.top-navbar').addClass("is-sticky");
		}
		else{
			$('.top-navbar').removeClass("is-sticky");
		}
	});

	// Burger Menu JS
	$('.burger-menu').on('click', function() {
		$('.main-content').toggleClass('hide-sidemenu-area');
		$('.sidemenu-area').toggleClass('toggle-sidemenu-area');
		$('.top-navbar').toggleClass('toggle-navbar-area');
	});
	$('.burger-menu.active').on('click', function() {
		$('.main-content').toggleClass('hide-sidemenu-area');
		$('.sidemenu-area').toggleClass('toggle-sidemenu-area');
		$('.top-navbar').toggleClass('toggle-navbar-area');
	});
	$('.responsive-burger-menu').on('click', function() {
		$('.responsive-burger-menu').toggleClass('active');
		$('.sidemenu-area').toggleClass('active-sidemenu-area');
	});
	$('.responsive-burger-menu.active').on('click', function() {
		$('.responsive-burger-menu').toggleClass('active');
		$('.sidemenu-area').toggleClass('active-sidemenu-area');
	});

	// Tooltip JS
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});

	// Popovers JS
	$(function () {
		$('[data-toggle="popover"]').popover()
	});

	// Metis Menu JS
	$(function () {
		$('#sidemenu-nav').metisMenu();
	});
	
	// Summernote JS
	$('.summernote').summernote({
		height: 230,                 // Set editor height
		minHeight: null,             // Set minimum height of editor
		maxHeight: null,             // Set maximum height of editor
		focus: false                 // Set focus to editable area after initializing summernote
	});

	// Progress Bar
	if($('.progress-line').length){
		$('.progress-line').appear(function(){
			var el = $(this);
			var percent = el.data('width');
			$(el).css('width',percent+'%');
		},{accY: 0});
	}
	if($('.count-box').length){
		$('.count-box').appear(function(){
			var $t = $(this),
				n = $t.find(".count-text").attr("data-stop"),
				r = parseInt($t.find(".count-text").attr("data-speed"), 10);

			if (!$t.hasClass("counted")) {
				$t.addClass("counted");
				$({
					countNum: $t.find(".count-text").text()
				}).animate({
					countNum: n
				}, {
					duration: r,
					easing: "linear",
					step: function() {
						$t.find(".count-text").text(Math.floor(this.countNum));
					},
					complete: function() {
						$t.find(".count-text").text(this.countNum);
					}
				});
			}
			
		},{accY: 0});
	}

	// Nice Select JS
	// $('select').niceSelect();

	// initialize clipboard plugin
	if ($('.btn-clipboard').length) {
		var clipboard = new ClipboardJS('.btn-clipboard');

		// Enabling tooltip to all clipboard buttons
		$('.btn-clipboard').attr('data-toggle', 'tooltip').attr('title', 'Copy to clipboard');

		// initializing bootstrap tooltip
		$('[data-toggle="tooltip"]').tooltip();

		// initially hide btn-clipboard and show after copy
		clipboard.on('success', function(e) {
			e.trigger.classList.value = 'btn btn-clipboard btn-current'
			$('.btn-current').tooltip('hide');
			e.trigger.dataset.originalTitle = 'Copied';
			$('.btn-current').tooltip('show');
			setTimeout(function(){
				$('.btn-current').tooltip('hide');
				e.trigger.dataset.originalTitle = 'Copy to clipboard';
				e.trigger.classList.value = 'btn btn-clipboard'
			}, 1000);
			e.clearSelection();
		});
	}

	// Feather Icon Js
	feather.replace();

	// App Email All JS
	$('.email-list-actions .favorite').on('click', function() {
		$(this).toggleClass('active');
	});
	$('.email-list-header .checkbox .cbx').on('click', function() {
		$('.email-list-actions .checkbox .cbx').toggleClass('active');
	});

	// App Todo All JS
	$('.todo-list-header .checkbox .cbx').on('click', function() {
		$('.todo-list-item .checkbox .cbx').toggleClass('active');
	});

	// App Read Email All JS
	$('.email-read-list-detail .email-information .favorite').on('click', function() {
		$(this).toggleClass('active');
	});

	// App Chat All JS
	$('.chat-list-header .header-right .favorite').on('click', function() {
		$(this).toggleClass('active');
	});
        
}(jQuery));