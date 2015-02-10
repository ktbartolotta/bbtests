(function (window) {
    var 
        document = window.document,
        _bbdbtest = window.bbdbtest,

        bbdbtest = function (selector) {
            return new bbdbtest_(selector);
        };

    bbdbtest_ = function (selector) {
        this.selector = selector;
        this.html = function (text) {
            document.getElementById(this.selector).innerHTML = text;
        };
    };

    window.bbdbtest = bbdbtest;

})(window);