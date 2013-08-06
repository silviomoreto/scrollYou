!function($) {
    var ScrollYou = function(element, options, e) {
        if(e) {
            e.stopPropagation();
            e.preventDefault();
        }

        this.$element = $(element);
        this.options = options;
        this.init();
        this.height = undefined;
        this.elementHeight = undefined;
    }

    ScrollYou.prototype = {
        contructor: ScrollYou,

        init: function(e) {
            this.resetHeight();
            if(this.getHeight() > this.getElementHeight() && this.getHeight() > 0) {
                this.$element.addClass('scrollyou')
                this.render();
                this.scrollListener();
                this.initialTop = parseInt(this.$scroll.css('top'), 10);
            }
        },

        render: function() {
            var scroll = this.options.scroll || '<div/>';
            this.$scroll = $(scroll);
            this.$scroll.addClass('scrollyou-bar');
            this.$scroll.height(Math.pow(this.getElementHeight(), 2) / this.getHeight());

            this.$element.append(this.$scroll);
        },

        scrollListener: function() {
            var acell = 3,
                height = this.getHeight();
                
            if(this.options.acell == undefined){
                // check if is windows, need a higher scroll value
                if(navigator.platform.toUpperCase().indexOf('WIN') != -1) {
                    acell = 100;
                }
            }
            else {
                acell = this.options.acell;
            }

            this.$element.on('mousewheel', $.proxy(function(event, delta, deltaX, deltaY) {
                var topf;

                event.preventDefault();
                event.currentTarget.scrollTop -= (delta * acell);

                topf = event.currentTarget.scrollTop + this.initialTop +
                       event.currentTarget.scrollTop * (this.getElementHeight() - this.$scroll.height() - 2 * this.initialTop) / 
                       (this.$element.prop('scrollHeight') - this.getElementHeight());

                this.$scroll.css({
                    'top': topf
                });
            }, this));
        },

        getHeight: function() {
            if(!this.height) {
                if(this.options.height) {
                    this.height = this.options.height;
                    return this.options.height;
                }

                if(!this.$element.children().length) {
                    console.error('Your element must have babies (children)');
                }

                var height;

                if(!this.$element.is(':visible')) {
                    var $clone = this.$element.clone().appendTo('body');
                    $clone.css('display', 'block');

                    height = $clone.children().outerHeight(true) * $clone.children().length;

                    $clone.remove();
                }
                else {
                    height = this.$element.children().outerHeight(true) * this.$element.children().length;
                }

                this.height = height;
            }
            return this.height;
        },

        getElementHeight: function() {
            if(!this.elementHeight) {
                if(this.options.elementHeight) {
                    this.elementHeight = this.options.elementHeight;
                    return this.elementHeight;
                }

                var height;

                if(!this.$element.is(':visible')) {
                    var $clone = this.$element.clone().appendTo('body');
                    $clone.css('display', 'block');

                    height = $clone.height();

                    $clone.remove();
                }
                else {
                    height = this.$element.height();
                }

                this.elementHeight = height;
            }

            return this.elementHeight;
        },

        resetHeight: function() {
            this.height = undefined;
            this.elementHeight = undefined;
        }
    },

    $.fn.scrollyou = function(option, event) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('scrollyou'),
                options = typeof option == 'object' && option;
            if (!data) {
                $this.data('scrollyou', (data = new ScrollYou(this, options, event)));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

}(window.jQuery);
