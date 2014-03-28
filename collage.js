(function($){

    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    }

    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    }

    Array.prototype.kmin = function () {
        return this.indexOf(this.min())
    }

    Array.prototype.sum = function () {
        if (!this.length) return 0
        return this.reduce(function (a, b) {
            return a + b;
        })
    }

    Array.prototype.average = function () {
        if (!this.length) return 0
        var iSum = this.reduce(function (a, b) {
            return a + b
        })
        return Math.ceil(iSum / this.length)
    }

    $.fn.collage = function(options){

    var settings = $.extend({}, {
        item: '.cell',
        container: $(this),
        count: null,
        gutter: 2,
        averFactor: 0.75,
        lazy: true
    }, options);

    return this.each(function() {
        $.extend(settings, {
            items: settings.container.find(settings.item)
        }, settings);


        settings.container.css('position', 'relative').css('overflow', 'hidden')
            .find(settings.item).css({position: 'absolute', display: 'inline-block', top: 0, left: 0}).css('overflow', 'hidden')
            .find('img').css('width', '100%').css('position', 'relative');

        if (settings.lazy) {
            settings.container.find('img').load(function () {
                settings.count += 1;
                if (settings.count == settings.container.find('img').size()) {
                    init();
                }
            });
        } else {
            settings.count = settings.container.find('img').size();
            init();
        }


        $(window).resize(function() {
            if (!settings.container.hasClass('load'))
                init();
        });
    });


    function init() {
        settings.items.sort(function (img1, img2) {
            return img1.clientHeight - img2.clientHeight
        })

        var iRowWidth = 0,
            containerWidth = settings.container.width(),
            iColsNum = 0,
            aColumnHeights = [],
            aColumnWidths = [],
            aLastRow = []
        iDiffWidth = 0,
            iGutter = settings.gutter,
            iItemsCount = settings.items.length,
            iRow = 0,
            iColPointer = 0,
            iColFirstRow = 0,
            bNoResize = false,
            iAverageHeight = 0


        for (iItem in settings.items) {

            if (iItem == 'length' && !bNoResize) {
                iAverageHeight = aColumnHeights.average();
                break
            }

            oItem = settings.items[iItem]

            if (oItem instanceof Object) {
                oItem.style.width = 'auto'
                oItem.style.height = 'auto'
                oItem.style.top = '0px'
                oItem.style.left = '0px'
                $(oItem).find('img').css('left', 0).css('top', 0).css('height', 'auto').css('width', '100%')
                iItemWidth = oItem.clientWidth + iGutter
            }
            iColsNum = aColumnWidths.length
            if (((iRowWidth + iItemWidth) < containerWidth || iColsNum == 0) && oItem instanceof Object && !iRow) {
                iRowWidth += iItemWidth
                aColumnWidths.push(oItem.clientWidth)
                aColumnHeights.push(oItem.clientHeight)
                if ((iColsNum + 1) == iItemsCount) bNoResize = true
            }
            else {
                if (iRow == 0) {
                    iDiffWidth = Math.ceil((containerWidth - iRowWidth) / iColsNum)
                    iRowWidth = 0
                    iRow++
                    for (iFirstRowItem in settings.items) {
                        if (iColFirstRow >= iColsNum || iFirstRowItem == 'length') break
                        oItemFirstRow = settings.items[iFirstRowItem]
                        if (!bNoResize) {
                            oItemFirstRow.style.width = iDiffWidth + aColumnWidths[iColFirstRow] + 'px'
                            aColumnWidths[iColFirstRow] = oItemFirstRow.clientWidth
                            aColumnHeights[iColFirstRow] = oItemFirstRow.clientHeight + iGutter
                            aLastRow[iFirstRowItem] = oItemFirstRow
                        }
                        if (iColFirstRow != 0) {
                            oItemFirstRow.style.left = (aColumnWidths.slice(0, iFirstRowItem).sum() + iGutter * iFirstRowItem) + 'px'
                        }
                        iColFirstRow++
                    }
                }
                if (bNoResize) break
                iColPointer = aColumnHeights.kmin()
                oItem.style.width = aColumnWidths[iColPointer] + 'px'
                oItem.style.top = aColumnHeights[iColPointer] + 'px'
                aLastRow[iColPointer] = oItem
                oItem.style.left = (aColumnWidths.slice(0, iColPointer).sum() + iGutter * iColPointer) + 'px'
                aColumnHeights[iColPointer] += oItem.clientHeight + iGutter
            }
        }

        for (iItem in aLastRow) {
            if (parseInt(iItem) != iItem) break
            oItem = aLastRow[iItem]

            if (aColumnHeights[iItem] >= iAverageHeight) { // Уменьшать
                iTargetHeight = Math.ceil(oItem.clientHeight - (aColumnHeights[iItem] - iAverageHeight) * settings.averFactor)
                $(oItem).find('img').css('top', -Math.ceil((oItem.clientHeight - iTargetHeight) / 2))
            } else {
                iTargetHeight = oItem.clientHeight + Math.ceil((iAverageHeight - oItem.offsetTop - oItem.clientHeight) * settings.averFactor)
                oImg = $(oItem).find('img')
                iPastImgWidth = oImg.width()
                iImgWidth = oImg.css('height', iTargetHeight).css('width', 'auto').width()
                oImg.css('left', -Math.ceil((iImgWidth - iPastImgWidth) / 2))
            }
            aColumnHeights[iItem] - oItem.clientHeight
            oItem.style.height = iTargetHeight + 'px'
            aColumnHeights[iItem] + oItem.clientHeight
        }
//        settings.container.stop().animate({ height: aColumnHeights.min() + Math.ceil((aColumnHeights.average() - aColumnHeights.min()) * 0.4) }, 400 )
        settings.container.stop().animate({ height: aColumnHeights.max() }, 400)
    };
    };
})(jQuery);