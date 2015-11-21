/*!
 *  mobilenavigation jQuery plugin
 *
 *  Plugin for a sliding mobilenavigation
 *
 *  author: alexfruehwirth
 *  repo: https://github.com/alexfruewhwirth/mobilenavigation
 *  version: 0.2
 */


// Uses CommonJS, AMD or browser globals to create a jQuery plugin.
// see: https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}
(function ($) {

    // TODO: Add callback functions
    $.fn.mobilenavigation = function (options) {

        var constants = {
            rootClass: 'mobilenavigation',
            listclassPrefix: 'mobilenavigation__level--',
            dataPrefix: 'mobilenavigation',
            eventPrefix: 'mobilenavigation',
        }

        var defaults = {
            breakpoint: null,
            back: 'Zurück',
            cssAnimation: true,
        }

        var $plugin = this;
        $plugin.settings = {};
        $plugin.initialized = false;

        // Initializes whole plugin
        var init = function () {
            $plugin.settings = $.extend({}, defaults, options);

            //If breakpoint is set in options, initialize on resize for set breakpoint
            if ($plugin.settings.breakpoint != null) {
                Setup.resize();
                $(window).resize(Setup.resize);
            } else {
                Setup.init();
            }
        }

        //Sets up menu structure
        var Setup = {
            init: function () {
                if ($plugin.initialized === false) {
                    $plugin.addClass(constants.rootClass);
                    if ($plugin.settings.cssAnimation === true) {
                        $plugin.addClass("mobilenavigation--css3-enabled");
                    }
                    var $rootList = $plugin.find('ul').first();
                    this.iterateListElements($rootList, 0);
                    Listeners.add();
                    $plugin.initialized = true;
                }

            },
            iterateListElements: function ($list, level) {
                if (level > 0) {
                    $list.closest('li').addClass('mobilenavigation__has-children');
                    var $link = $list.prev('a').length ? $list.prev('a') : $list.next('a');
                    var $orginList = $('<li class="mobilenavigation__origin" ></li>').prependTo($list);
                    $link.clone().prependTo($orginList);
                    $('<li><a href="#" class="mobilenavigation__back">' + $plugin.settings.back + '</a></li>').prependTo($list);
                }

                $list.addClass('mobilenavigation__level ' + constants.listclassPrefix + level);
                $list.data(constants.dataPrefix + '-level', level);

                level++;
                var that = this;
                $list.children('li').each(function () {
                    that.iterateListElements($(this).find('ul').first(), level);
                });
            },
            destroy: function () {
                if ($plugin.initialized === true) {
                    Listeners.remove();
                    $('.mobilenavigation__level').css('left', '');
                    $('.mobilenavigation__back').remove();
                    $('.mobilenavigation__origin').remove();
                    $("[class*='mobilenavigation']").removeClass(function (index, css) {
                        return (css.match(/mobilenavigation([^\s]*)/g) || []).join(' ');
                    });
                    $plugin.initialized = false;
                }
            },
            resize: function () {
                if ($(window).width() < $plugin.settings.breakpoint) {
                    Setup.init();
                } else {
                    Setup.destroy();
                }
            }
        }

        var Listeners = {
            add: function () {
                $('.' + constants.rootClass).on('click.' + constants.eventPrefix + '-forward', '.mobilenavigation__has-children > a, .mobilenavigation__has-children > span', function (e) {
                    e.preventDefault();
                    Animation.forward($(this));
                    console.log("forward");
                });
                $('.' + constants.rootClass).on('click.' + constants.eventPrefix + '-back', '.mobilenavigation__back', function (e) {
                    e.preventDefault();
                    Animation.back($(this));
                    console.log("back");
                });
            },

            remove: function () {
                $('.' + constants.rootClass).off('click.' + constants.eventPrefix + '-forward');
                $('.' + constants.rootClass).off('click.' + constants.eventPrefix + '-back');

            }
        }

        var Animation = {
            forward: function ($link) {
                var $list = $link.prev('ul').length ? $link.prev('ul') : $link.next('ul');
                var level = $list.data(constants.dataPrefix + '-level');
                if (level > 0) {
                    $list.addClass('mobilenavigation__level--active');
                    var $parent = $list.parent().closest('.mobilenavigation__level');

                    if ($plugin.settings.cssAnimation === true) {
                        $parent.addClass('mobilenavigation__level--left');
                    } else {
                        if (level > 1) {
                            $parent.animate({left: 0});
                        } else {
                            $parent.animate({left: '-100%'});
                        }
                    }
                }
            },
            back: function ($link) {
                var $list = $link.closest('ul');
                var level = $list.data(constants.dataPrefix + '-level');
                var $parent = $list.parent().closest('.mobilenavigation__level');

                if ($plugin.settings.cssAnimation === true) {
                    $parent.removeClass('mobilenavigation__level--left');
                    setTimeout(function () {
                        $list.removeClass('mobilenavigation__level--active');
                    }, 200);

                } else {
                    if (level > 1) {
                        $parent.animate({left: '100%'},
                            function () {
                                $list.removeClass('mobilenavigation__level--active');

                            });
                    } else {
                        $parent.animate({left: 0}, function () {
                            $list.removeClass('mobilenavigation__level--active');
                        });
                    }
                }
            }
        }

        $plugin.destroy = function () {
            Setup.destroy();
        }

        $plugin.reinit = function () {
            init();
        }

        // initialize plugin
        init();

        return $plugin;
    };


}));