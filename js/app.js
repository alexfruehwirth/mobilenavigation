$(document).ready(function(){
   var $nav = $('.menu').mobilenavigation({
      breakpoint: 768,
   });

   $('.menu__toggle').click(function(){
      $('.list--level-1').toggleClass('list--open');
   });
});