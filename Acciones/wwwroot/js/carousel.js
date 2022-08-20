/////*
////   Carousel
////   */
////$(document).ready(function () {
////    /*window.addEventListener('load', () => {*/
////    $('#carousel-example').on('slide.bs.carousel', function (e) {

////        /*
////        CC 2.0 License Iatek LLC 2018
////        Attribution required
////        */
////        var $e = $(e.relatedTarget);
////        var idx = $e.index();
////        var itemsPerSlide = 3;
////        var totalItems = $('.carousel-item').length;
////        console.log("  NÚMERO DE ITEMS: " + totalItems);
////        if (idx >= totalItems - (itemsPerSlide - 1)) {
////            var it = itemsPerSlide - (totalItems - idx);
////            for (var i = 0; i < it; i++) {
////                // append slides to end
////                if (e.direction == "left") {
////                    $('.carousel-item').eq(i).appendTo('.carousel-inner');
////                }
////                else {
////                    $('.carousel-item').eq(0).appendTo('.carousel-inner');
////                }
////            }
////        }
////    });
////});


/********************************************************************************************/

//function scroll_to(clicked_link, nav_height) {
//    var element_class = clicked_link.attr('href').replace('#', '.');
//    var scroll_to = 0;
//    if (element_class != '.top-content') {
//        element_class += '-container';
//        scroll_to = $(element_class).offset().top - nav_height;
//    }
//    if ($(window).scrollTop() != scroll_to) {
//        $('html, body').stop().animate({ scrollTop: scroll_to }, 1000);
//    }
//}


$(document).ready(function () {

    /*
        Navigation
    */
    //$('a.scroll-link').on('click', function (e) {
    //    e.preventDefault();
    //    scroll_to($(this), $('nav').outerHeight());
    //});

    /*
        Background
    */
    //$('.section-4-container').backstretch("assets/img/backgrounds/bg.jpg");

    /*
        Wow
    */
    //new WOW().init();

    /*
        Carousel
    */

    $('#carousel-example').on('slide.bs.carousel', function (e) {

        /*
            CC 2.0 License Iatek LLC 2018
            Attribution required
        */
        var $e = $(e.relatedTarget);
        var idx = $e.index();
        var itemsPerSlide = 3;
        var totalItems = $('.carousel-item').length;
        //if (itemsPerSlide < totalItems+1) {
        //    itemsPerSlide = totalItems;
        //}
        console.log("  NÚMERO DE ITEMS: " + totalItems);
        if (idx >= totalItems - (itemsPerSlide - 1)) {
            var it = itemsPerSlide - (totalItems - idx);
            for (var i = 0; i < it; i++) {
                // append slides to end
                //$("#modalMuestraDatosPublicidad").appendTo("body");
                if (e.direction == "left") {
                    $('.carousel-item').eq(i).appendTo('.carousel-inner');
                }
                else {
                    $('.carousel-item').eq(0).appendTo('.carousel-inner');
                }
            }
        }
    });

});