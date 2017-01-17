var plotz = null;
(function ($) {
    $.widget("ui.plotz", {
        options: {
            'containerID': 'canvases',
            'width': "400",
            'height': "300",        
            'XAxis': {'min': -10, 'max': 10, 'color': 'gray'},
            'YAxis': {'min': -5, 'max': 5, 'color': 'gray'},
            'onlyPoints': false,
            'showConfig': true
        },
 
        _plotz: null,
        
        _create: function () {
            this._plotz = new PLOTZ(this.options);
//            $("#canvases").attr("width", this.options.width);
//            $("#canvases").attr("height", this.options.height);
        },
 
        addFuncao: function(_expression, _color) {
             this._plotz.plot(_expression, _color);
        },

        destroy: function () {
            $.Widget.prototype.destroy.call(this, arguments);
            this.element.children("#_helloWorldMessage").remove();
        },
 
        disable: function () {
            $.Widget.prototype.disable.call(this, arguments);
        },
 
        enable: function () {
            $.Widget.prototype.enable.call(this, arguments);
        }
    });
})(jQuery);