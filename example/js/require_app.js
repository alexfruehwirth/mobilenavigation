requirejs.config({

   paths: {
      // the left side is the module ID,
      // the right side is the path to
      // the jQuery file, relative to baseUrl.
      // Also, the path should NOT include
      // the '.js' file extension. This example
      // is using jQuery 1.9.0 located at
      // js/lib/jquery-1.9.0.js, relative to
      // the HTML page.
      jquery: '//code.jquery.com/jquery-2.1.4',
      mobilenavigation: '../../src/js/jquery.mobilenavigation'
   }
});

requirejs(['jquery','mobilenavigation'], function($){
   var $nav = $('.menu').mobilenavigation({
      breakpoint: 768,
   });
})
