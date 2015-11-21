(function( $ ) {


    //Todo: Add AMD (requireJs) support
    //Todo: Add velocity support
    //Todo: Add CSS3 animation support
    $.fn.mobilenavigation = function(options) {

        var constants = {
            rootClass: 'mobilenavigation',
            listclassPrefix: 'mobilenavigation__level--',
            dataPrefix: 'mobilenavigation',
            eventPrefix: 'mobilenavigation',
            back: 'Zurück'
        }

        var defaults = {
            viewport: null,
            back: 'Zurück'
        }

        var $plugin = this;
        $plugin.settings = {};

        $plugin.initialized = false;

        var init = function(){
            $plugin.settings = $.extend({}, defaults, options);

            if($plugin.settings.viewport != null){
                Setup.resize();
                $(window).resize(Setup.resize);
            }else{
                Setup.init();
            }
        }

        var Setup = {
            init: function(){
                if($plugin.initialized === false){
                    $plugin.addClass(constants.rootClass);
                    var $rootList = $plugin.find('ul').first();
                    this.iterateClasses($rootList, 0);
                    Listeners.add();
                    $plugin.initialized = true;
                }

            },
            iterateClasses: function($list, level){
                if(level > 0){
                    $list.closest('li').addClass('mobilenavigation__has-children');
                    var $link = $list.prev('a').length ? $list.prev('a') : $list.next('a');
                    var $orginList = $('<li class="mobilenavigation__origin" ></li>').prependTo($list);
                    $link.clone().prependTo($orginList);
                    $('<li><a href="#" class="mobilenavigation__back">'+$plugin.settings.back+'</a></li>').prependTo($list);
                }

                $list.addClass('mobilenavigation__level '+constants.listclassPrefix+level);
                $list.data(constants.dataPrefix+'-level', level);

                level++;
                var that = this;
                $list.children('li').each(function(){
                    that.iterateClasses($(this).find('ul').first(), level);
                });
            },
            destroy: function(){
                if($plugin.initialized === true){
                    Listeners.remove();
                    $('.mobilenavigation__level').css('left', '');
                    $('.mobilenavigation__back').remove();
                    $('.mobilenavigation__origin').remove();
                    $("[class*='mobilenavigation']").removeClass(function(index, css){
                        return (css.match(/mobilenavigation([^\s]*)/g) || []).join(' ');
                    });
                    $plugin.initialized = false;
                }
            },
            resize: function(){
                if($(window).width() < $plugin.settings.viewport){
                    Setup.init();
                }else{
                    Setup.destroy();
                }
            }
        }

        var Listeners = {
            add: function(){
                $('.'+constants.rootClass).on('click.'+constants.eventPrefix+'-forward','.mobilenavigation__has-children > a, .mobilenavigation__has-children > span', function(e){
                    e.preventDefault();
                    Animation.forward($(this));
                    console.log("forward");
                });
                $('.'+constants.rootClass).on('click.'+constants.eventPrefix+'-back','.mobilenavigation__back', function(e){
                    e.preventDefault();
                    Animation.back($(this));
                    console.log("back");
                });
            },

            remove: function(){
                $('.'+constants.rootClass).off('click.'+constants.eventPrefix+'-forward');
                $('.'+constants.rootClass).off('click.'+constants.eventPrefix+'-back');

            }
        }

        var Animation = {
            forward: function($link){
                var $list = $link.prev('ul').length ? $link.prev('ul') : $link.next('ul');
                var level = $list.data(constants.dataPrefix+'-level');
                if(level > 0){
                    $list.addClass('mobilenavigation__level--active');
                    var $parent = $list.parent().closest('.mobilenavigation__level');
                    var left = $parent.css('left');
                    if(level > 1){
                        $parent.animate({left: 0});
                    }else{
                        $parent.animate({left: '-100%'});
                    }
                }
            },
            back: function($link){
                var $list = $link.closest('ul');
                var level = $list.data(constants.dataPrefix+'-level');
                var $parent = $list.parent().closest('.mobilenavigation__level');

                if(level > 1){
                    $parent.animate({left: '100%'},
                        function(){
                            $list.removeClass('mobilenavigation__level--active');

                        });
                }else{
                    $parent.animate({left: 0},function(){
                        $list.removeClass('mobilenavigation__level--active');
                    });
                }

            }
        }

        $plugin.destroy = function(){
            Setup.destroy();
        }

        $plugin.reinit = function(){
            init();
        }

        // initialize plugin
        init();

        return $plugin;
    };



}( jQuery ));