$(document).ready(function () {
	$(window).scroll(function () {
		var scroll = $(window).scrollTop();
		if (scroll > 100) {
			$('#navbar').css('background', '#fefefe');
			$('#navbar').addClass('uk-box-shadow-small');
		} else {
			$('#navbar').css('background', 'transparent');
			$('#navbar').removeClass('uk-box-shadow-small');
		}
	});

	$('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: (target.offset().top - 56)
				}, 1000, "easeInOutExpo");
				return false;
			}
		}
	});

	$('.js-scroll-trigger').click(function () {
		UIkit.offcanvas($('#offcanvas-slide')).hide();
	});
});

$(window).bind('scroll', function () {
	var currentTop = $(window).scrollTop();
	var elems = $('.scrollspy');
	elems.each(function (index) {
		var elemTop = $(this).offset().top - 150;
		var elemBottom = elemTop + $(this).height();
		if (currentTop > elemTop && currentTop <= elemBottom) {
			var id = $(this).attr('id');
			var navElem = $('a[href="#' + id + '"]');
			navElem.parent().addClass('uk-active').siblings().removeClass('uk-active');
		}
	})
});
