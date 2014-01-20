(function($){

$.fn.collage = function(options){

    var settings = $.extend({}, {
        item: '.cell',
        container: $(this),
        count: null,
        gutter: 2,
        lazy: true,
        resize: true
    }, options);

    return this.each(function() {
        $.extend(settings, {
            items: settings.container.find(settings.item)
        }, settings);


        settings.container.css('position', 'relative')
            .find(settings.item).css({position: 'absolute', display: 'block', top: 0, left: 0})
            .find('img').css('width', '100%');

        if (settings.lazy) {
            settings.container.find('img').load(function () {
                settings.count += 1;
                if (settings.count == settings.container.find('img').size()) {
                    init();
                }
            });
        } else {
            init();
        }


        $(window).resize(function() {
            if (settings.resize)
                init();
        });
    });


    function init() {
        settings.noResize = false

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
                if(colsNum == settings.count)
                    settings.noResize = true
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
        maxColumn(cols)
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

        if(!settings.noResize) {
            var prop = containerWidth / row_width(rows[0]),
                item = null;
            for(var i = 0; row_width(rows[0]) < containerWidth; i++) {
                if(i >= cols.length) i = 0
                item = $(cols[i])
                item.css({ width: Math.ceil(item.width() * prop)})
            }
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

    function maxColumn(cols) {
        var maxColWidth = 0,
            tmp = 0;
        for(var c = 0; c < cols.length; c++) {
            tmp = col_height(cols[c])
            if(maxColWidth < tmp)
                maxColWidth = tmp
        }
        settings.container.css('height', maxColWidth)
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

    function col_height(items) {
        var height = 0,
            tmp;
        $(items).filter(function(i) {
            tmp = $(this).height()
            if(i != items.length-1)
                height += tmp + settings.gutter;
            else
                height += tmp
        });
        return height;
    }

};
})(jQuery);