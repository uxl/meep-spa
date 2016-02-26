//touch click helper
(function ($) {
    $.fn.tclick = function (onclick) {
        this.bind("touchstart", function (e) { onclick.call(this, e); e.stopPropagation(); e.preventDefault(); });
        this.bind("click", function (e) { onclick.call(this, e); });   //substitute mousedown event for exact same result as touchstart
        return this;
    };
})(jQuery);
