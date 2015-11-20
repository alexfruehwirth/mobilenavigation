(function( $ ) {

    $.fn.mobilenavigation = function(options) {

        var defaults = {
            rootClass: 'mobilenavigation',
            listclassPrefix: 'mobilenavigation__level--',
            dataPrefix: 'mobilenavigation',
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
            },
            iterateClasses: function($list, level){
                $list.addClass('mobilenavigation__level '+$plugin.settings.listclassPrefix+level);
                $list.data($plugin.settings.dataPrefix+'-level', level);
                level++;
                var that = this;
                $list.children('li').each(function(){
                    that.iterateClasses($(this).find('ul').first(), level);
                });
            }
        }


        // initialize plugin
        init();
    };



}( jQuery ));