$(document).ready(function(){
   var $nav = $('.menu').mobilenavigation({
      breakpoint: 768,
   });

   $('.menu').resize(function(){
      console.lof("resize");
      console.lof("----");
   });

   $('.menu__toggle').click(function(){
      $('.list--level-1').toggleClass('list--open');
   });
});