(function( $ ) {

    $.fn.mobilenavigation = function(options) {

        var defaults = {
            rootClass: 'mobilenavigation',
            listclassPrefix: 'mobilenavigation__level--',
            dataPrefix: 'mobilenavigation',
            eventPrefix: 'mobilenavigation',
        }

        var $plugin = this;

        $plugin.settings = {};

        var init = function(){
            $plugin.settings = $.extend({}, defaults, options);
            Setup.init();
        }

        var Setup = {
            init: function(){
                $plugin.addClass($plugin.settings.rootClass);
                var $rootList = $plugin.find('ul').first();
                this.iterateClasses($rootList, 0);
                Listeners.add();
            },
            iterateClasses: function($list, level){
                if(level > 0){
                    $list.closest('li').addClass('mobilenavigation__has-children');
                    var $link = $list.prev('a').length ? $list.prev('a') : $list.next('a');
                    var $orginList = $('<li class="mobilenavigation__origin" ></li>').prependTo($list);
                    $link.clone().prependTo($orginList);
                    $('<li><a href="#" class="mobilenavigation__back">Zurück</a></li>').prependTo($list);
                }

                $list.addClass('mobilenavigation__level '+$plugin.settings.listclassPrefix+level);
                $list.data($plugin.settings.dataPrefix+'-level', level);

                level++;
                var that = this;
                $list.children('li').each(function(){
                    that.iterateClasses($(this).find('ul').first(), level);
                });
            },
            destroy: function(){
                Listeners.remove();
                $('.mobilenavigation__level').css('left', '');
            }
        }

        var Listeners = {
            add: function(){
                $('.'+$plugin.settings.rootClass).on('click.'+$plugin.settings.eventPrefix+'-forward','.mobilenavigation__has-children > a, .mobilenavigation__has-children > span', function(e){
                    e.preventDefault();
                    Animation.forward($(this));
                    console.log("forward");
                });
                $('.'+$plugin.settings.rootClass).on('click.'+$plugin.settings.eventPrefix+'-back','.mobilenavigation__back', function(e){
                    e.preventDefault();
                    Animation.back($(this));
                    console.log("back");
                });
            },

            remove: function(){
                $('.'+$plugin.settings.rootClass).off('click.'+$plugin.settings.eventPrefix+'-forward');
                $('.'+$plugin.settings.rootClass).off('click.'+$plugin.settings.eventPrefix+'-back');

            }
        }

        var Animation = {
            forward: function($link){
                var $list = $link.prev('ul').length ? $link.prev('ul') : $link.next('ul');
                var level = $list.data($plugin.settings.dataPrefix+'-level');
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
                var level = $list.data($plugin.settings.dataPrefix+'-level');
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


        // initialize plugin
        init();
    };



}( jQuery ));