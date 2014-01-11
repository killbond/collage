(function($){

$.fn.collage = function(options){

    var settings = $.extend({}, {
        item: '.cell',
        container: $(this),
        count: null,
        gutter: 2
    }, options);

    return this.each(function() {
        $.extend(settings, {
            items: settings.container.find(settings.item)
        }, settings);


        settings.container.css('position', 'relative')
            .find(settings.item).css({position: 'absolute', display: 'block', top: 0, left: 0})
            .find('img').css('width', '100%');

        settings.container.find('img').load(function() {
            settings.count += 1;
            if(settings.count ==  settings.container.find('img').size()) {
                init();
            }
        });

        $(window).resize(function() {
            init();
        });
    });


    function init() {
        var firstRowWidth = 0,
            containerWidth = settings.container.width(),
            cols = [],
            rows = [],
            rowsCount = 0,
            colsNum = 0;

        settings.items.css('width', 'initial').css('top', 0).css('left', 0).filter(function(i) {
            var itemWidth = $(this).width() + settings.gutter;
            if((firstRowWidth + itemWidth) < containerWidth) {
                firstRowWidth += itemWidth;
                colsNum++;
            }
            else {
                return false;
            }
        });

        rowsNum = Math.ceil(settings.items.length / colsNum);

        while(rowsNum > rowsCount) {
            rows.push(settings.items.slice(rowsCount * colsNum, colsNum * (rowsCount + 1)))
            rowsCount++
        }

        for(var c = 0; c < rows[0].length; c++) {
            cols[c] = [];
            for(var r = 0; r < rows.length; r++) {
                if(rows[r][c])
                    cols[c][r] = rows[r][c]
                else
                    break
            }
        }

        rewindRows(rows, cols)
        rewindCols(cols)
    };

    function rewindCols(cols) {
        var colHeight = 0;

        for(var c = 0; c < cols.length; c++) {
            colHeight = 0;
            for(var r = 1; r < cols[c].length; r++) {
                colHeight += $(cols[c][r - 1]).height() + settings.gutter
                $(cols[c][r]).css('top', colHeight)
            }
        }
    }

    function rewindRows(rows, cols) {
        var rowWidth = 0,
            itemWidth = 0,
            containerWidth = settings.container.width();

        for(var i = 0; row_width(rows[0]) < containerWidth; i++) {
            if(i >= cols.length) i = 0
            $(cols[i]).css({ width: '+=' + 1})
        }

        for(var r = 0; r < rows.length; r++) {
            rowWidth = 0
            for(var c = 0; c < rows[r].length; c++) {
                itemWidth = $(rows[0][c]).width()
                $(rows[r][c]).css('left', rowWidth).css('width', itemWidth)
                rowWidth += itemWidth + settings.gutter
            }
        }
    }

    function row_width(items) {
        var width = 0,
            tmp;
        $(items).filter(function(i) {
            tmp = $(this).width()
            if(i != items.length-1)
                width += tmp + settings.gutter;
            else
                width += tmp
        });
        return width;
    }

};
})(jQuery);