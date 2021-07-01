
// open mask
function openMask(layer, color, type) {
    $('body').append('<div class="hrp-mask"></div>').css("overflow", "hidden");
    $('.hrp-mask').fadeIn(200);
    if (layer) {
        $('.hrp-mask').css('z-index', layer);
    }
    if (color) {
        $('.hrp-mask').css('background-color', color);
    }
    if (type) {
        $('.hrp-mask').click(function () {
            closeMask()
        })
    }
};

// close mask
function closeMask() {
    $('body').css("overflow", "");
    $('.hrp-mask').fadeOut(200, function () {
        $('.hrp-mask').remove();
    });
};

// menu up/down, el=可收缩子菜单, tar=class的指向元素, cl=class
function menuUpDown(el, tar, cl) {
    var menuHas = tar.hasClass(cl);
    var menuUp;
    el.stop();
    if (el.length > 0) {
        if (menuHas == 1) {
            el.slideUp(200);
            tar.removeClass(cl);
            menuUp = 1;
        } else {
            el.slideDown(200);
            tar.addClass(cl);
            menuUp = 0;
        }
    }
    return menuUp;
};

// change class when click 
function classChange(add, remove, cl) {
    remove.removeClass(cl);
    add.addClass(cl);
};


// 菜单 Menu
function initMenu($context) {
    $context = $context && $context.length ? $context : $(document);
    // menu up/down while download
    $('.hrp-menu-submenu', $context).each(function () {
        var hasClass = $(this).hasClass('opened');
        if (hasClass == 0) {
            $(this).children('ul.hrp-menu').css("display", "none");
        }
    });
    // menu up/down while click
    $('.hrp-menu-submenu-title', $context).unbind('click').click(function (e) {
        var menuUpDownul = $(this).siblings('ul.hrp-menu');
        var menuSubmenu = menuUpDownul.parent('.hrp-menu-submenu');

        menuUpDown(menuUpDownul, menuSubmenu, 'opened');
        menuSubmenu.siblings('.hrp-menu-submenu').children('.hrp-menu').slideUp(200);
        menuSubmenu.siblings('.hrp-menu-submenu').removeClass('opened')
        e.stopPropagation();
    });
    // toggle class 'active' while click menu-item
    $('.hrp-menu-vertical > .hrp-menu-submenu .hrp-menu-item', $context).unbind('click').click(function (e) {
        var menuItemClassAdd = $(this);
        var menuItemClassRemove = $(this).closest('.hrp-menu-vertical').find('.hrp-menu-item');

        classChange(menuItemClassAdd, menuItemClassRemove, 'active')
        e.stopPropagation();
    });
};


// 标签页 Tabs
function initTabs($context) {
    $context = $context && $context.length ? $context : $(document);
    // tabs set / change
    $('.hrp-tabs', $context).each(function () {
        var tabSelect = $(this).find('.hrp-tabs-item.active').index();
        $(this).find('.hrp-tabs-item-tabpane').eq(tabSelect).addClass('selected');
    });
    // toggle class 'active' while click tabs-item
    $('.hrp-tabs-item', $context).unbind('click').click(function () {
        var tabsItemAdd = $(this);
        var tabsItemRemove = $(this).siblings();
        classChange(tabsItemAdd, tabsItemRemove, 'active')

        var tabsNum = $(this).index();
        var tabsPane = $(this).parent().siblings().children('.hrp-tabs-item-tabpane').eq(tabsNum);
        var tabsOther = tabsPane.siblings();
        classChange(tabsPane, tabsOther, 'selected')
    })
};


// 分页 Page
function initPage($context) {
    $context = $context && $context.length ? $context : $(document);
    // change page resize
    pageSizeChange($context)
    // click to page
    clickItemPage($context)
    // click prev page
    clickPrevPage($context)
    // click next page
    clickNextPage($context)
    // keydown to page
    pageElevator($context)
};
// change page resize
function pageSizeChange($context) {
    $context = $context && $context.length ? $context : $(document);
    $('.hrp-page-options-sizer .hrp-select .hrp-select-selected-value', $context).change(function () {
        var pageParent = $(this).parents('.hrp-page');
        var max = $('#pageForm').find('input[name=pageMax]').val();
        var per = $(this).val();
        var page = Math.ceil(max / per);
        $('#pageForm').find('input[name=pageNum]').val(page);
        $('#pageForm').find('input[name=perNum]').val(per);

        pageParent.children('li').remove();

        if (max > 0) {
            pageParent.prepend('<li class="hrp-page-next" title="下一页"><a><i class="iconhrp icon-right"></i></a></li>');
            pageParent.prepend('<li class="hrp-page-prev" title="上一页"><a><i class="iconhrp icon-left"></i></a></li>');
        }
        for (var i = page; i > 0; i--) {
            pageParent.find('.hrp-page-prev').after("<li class='hrp-page-item' title='" + i + "'><a>" + i + "</a></li>");
        }
        if (page > 5) {
            for (var i = page - 1; i > 3; i--) {
                pageParent.find('.hrp-page-item[title=' + i + ']').css('display', 'none');
            }
            pageParent.find('.hrp-page-item[title=' + page + ']').before('<li class="hrp-page-item-elips"><a>...</a></li>');
        }

        pageParent.find('.hrp-page-item[title=1]').addClass('active');
        $('#pageForm').find('input[name=curNum]').val('1');

        clickItemPage($context)
        clickPrevPage($context)
        clickNextPage($context)
        pageElevator($context)
    })
};
// click to page
function clickItemPage($context) {
    $context = $context && $context.length ? $context : $(document);
    $('.hrp-page-item', $context).unbind('click').click(function () {
        var curPage = $(this).attr('title');
        var add = $(this);
        var remove = add.siblings('.hrp-page-item');
        var ele = $(this).parents('.hrp-page');
        $('#pageForm').find('input[name=curNum]').val(curPage);
        // console.log(curPage)

        classChange(add, remove, 'active')
        pageElips(ele)
    })
};
// click prev page
function clickPrevPage($context) {
    $context = $context && $context.length ? $context : $(document);
    $('.hrp-page-prev', $context).unbind('click').click(function () {
        var curPage = $(this).siblings('.active').attr('title');
        if (curPage > 1) {
            curPage--;
            var add = $(this).siblings('.hrp-page-item[title=' + curPage + ']');
            var remove = add.siblings('.hrp-page-item');
            var ele = $(this).parents('.hrp-page');
            $('#pageForm').find('input[name=curNum]').val(curPage);
            // console.log(curPage)

            classChange(add, remove, 'active')
            pageElips(ele)
        }
    })
};
// click next page
function clickNextPage($context) {
    $context = $context && $context.length ? $context : $(document);
    $('.hrp-page-next', $context).unbind('click').click(function () {
        var curPage = $(this).siblings('.active').attr('title');
        var sumPage = $(this).parents('.hrp-page').find(('.hrp-page-item')).length;
        if (curPage < sumPage) {
            curPage++;
            var add = $(this).siblings('.hrp-page-item[title=' + curPage + ']');
            var remove = add.siblings('.hrp-page-item');
            var ele = $(this).parents('.hrp-page');
            $('#pageForm').find('input[name=curNum]').val(curPage);
            // console.log(curPage)

            classChange(add, remove, 'active')
            pageElips(ele)
        }
    })
};
// keydown to page
function pageElevator($context) {
    $context = $context && $context.length ? $context : $(document);
    $('.hrp-page-options-elevator input', $context).keydown(function (ev) {
        ev = ev || window.event;
        if (ev.keyCode == '13') {
            var curPage = $(this).val();
            var sumPage = $(this).parents('.hrp-page').find(('.hrp-page-item')).length;
            var add = $(this).parents('.hrp-page').find('.hrp-page-item[title=' + curPage + ']');
            var remove = add.siblings('.hrp-page-item');
            var ele = $(this).parents('.hrp-page');
            console.log(curPage)
            if (curPage <= sumPage) {
                $('#pageForm').find('input[name=curNum]').val(curPage);
                classChange(add, remove, 'active')
                pageElips(ele)
            }
        }
    })
};
// add elipsis to pages
function pageElips(e) {
    var pre_1;
    var pre_2;
    var aft_1;
    var aft_2;

    var sum = $(e).find('input[name=pageNum]').val();
    var cur = $(e).find('input[name=curNum]').val();
    sum = parseInt(sum);
    cur = parseInt(cur);

    $(e).find('.hrp-page-item').css('display', '');
    $(e).find('.hrp-page-item-elips').remove();

    if (cur > 5) {
        pre_1 = 0;
        pre_2 = cur - 4;
        for (var i = pre_2; i > pre_1; i--) {
            $(e).find('.hrp-page-item').eq(i).css('display', 'none');
        }
        $(e).find('.hrp-page-item').eq(pre_2).after('<li class="hrp-page-item-elips"><a>...</a></li>');
    }
    if (cur + 4 < sum) {
        aft_1 = cur + 1;
        aft_2 = sum - 2;
        for (var i = aft_2; i > aft_1; i--) {
            $(e).find('.hrp-page-item').eq(i).css('display', 'none');
        }
        $(e).find('.hrp-page-item').eq(aft_2).after('<li class="hrp-page-item-elips"><a>...</a></li>');
    }
};
// creat pages
function setPage(e, max, per, cur) {
    max ? max : max = 0;
    per ? per : per = 10;
    cur ? cur : cur = 1;
    var pageNum = Math.ceil(max / per);

    $(e).children('li').remove();
    $(e).children('form').remove();

    if (max > 0) {
        $(e).prepend('<li class="hrp-page-next" title="下一页"><a><i class="iconhrp icon-right"></i></a></li>');
        $(e).prepend('<li class="hrp-page-prev" title="上一页"><a><i class="iconhrp icon-left"></i></a></li>');
    }
    for (var page = pageNum; page > 0; page--) {
        $(e).find('.hrp-page-prev').after("<li class='hrp-page-item' title='" + page + "'><a>" + page + "</a></li>");
    }
    $(e).find('.hrp-page-item[title=1]').addClass('active');

    if (pageNum > 5) {
        for (var page = pageNum - 1; page > 3; page--) {
            $(e).find('.hrp-page-item[title=' + page + ']').css('display', 'none');
        }
        $(e).find('.hrp-page-item[title=' + pageNum + ']').before('<li class="hrp-page-item-elips"><a>...</a></li>');
    }

    $(e).append('<form id="pageForm"><input type="hidden" name="pageMax"><input type="hidden" name="pageNum"><input type="hidden" name="perNum"><input type="hidden" name="curNum"></form>');
    $('#pageForm').children('input[name=pageMax]').val(max);
    $('#pageForm').children('input[name=pageNum]').val(pageNum);
    $('#pageForm').children('input[name=perNum]').val(per);
    $('#pageForm').children('input[name=curNum]').val(cur);

    clickItemPage()
    clickPrevPage()
    clickNextPage()
    pageElevator()
};


// 输入框 Input
function initInput($context) {
    $context = $context && $context.length ? $context : $(document);
    $('textarea.hrp-autotext', $context).each(function () {
        autoTextarea($(this)[0])
    });
};


// 开关 Switch
function initSwitch($context) {
    $context = $context && $context.length ? $context : $(document);
    // switch set / change
    $('.hrp-switch', $context).each(function () {
        var swtchVal = $(this).find('input[type=hidden]').val();
        if (swtchVal) {
            var onValue = $(this).find('.hrp-switch-inner.on').data('value');
            var offValue = $(this).find('.hrp-switch-inner.off').data('value');
            if (swtchVal == onValue) {
                $(this).addClass('checked');
            }
        }
    });
    // toggle switch when click
    $('.hrp-switch', $context).unbind('click').click(function () {
        var swdisabled = $(this).hasClass('disabled');
        if (!swdisabled) {
            var onelem = $(this).find('.hrp-switch-inner.on');
            var offelem = $(this).find('.hrp-switch-inner.off');
            if ($(this).hasClass('checked')) {
                $(this).removeClass('checked');
                $(this).find('input[type=hidden]').val(offelem.data('value'));
            } else {
                $(this).addClass('checked');
                $(this).find('input[type=hidden]').val(onelem.data('value'));
            }
        }
    })
};


// 选择器 Select
function initSelect($context) {
    $context = $context && $context.length ? $context : $(document);
    // select set while download
    $('.hrp-select', $context).each(function () {
        var isOpened = $(this).hasClass('opened');
        if (isOpened == 0) {
            $(this).find('.hrp-select-dropdown').css({ "display": "none" });
        }
        var selectValue = $(this).find('input.hrp-select-selected-value').val();
        if (!selectValue) {
            var oriValue = $(this).find('.hrp-select-item.selected').data('value');
            var oriText = $(this).find('.hrp-select-item.selected').text();
            $(this).find('input.hrp-select-selected-value').val(oriValue);
            $(this).find('input.hrp-select-placeholder').val(oriText);
        } else {
            var itemLength = $(this).find('.hrp-select-item').length;
            for (i = 0; i < itemLength; i++) {
                var itemValue = $(this).find('.hrp-select-item').eq(i).data('value');
                if (selectValue == itemValue) {
                    var selectText = $(this).find('.hrp-select-item').eq(i).text();
                    $(this).find('input.hrp-select-placeholder').val(selectText);
                }
            }
        }

        var selection = $(this).find('.hrp-select-selection');
        var isreadonly = $(this).hasClass('readonly');
        var isdisabled = $(this).hasClass('disabled');
        if (isreadonly) {
            $(this).find('input.hrp-select-selected-value').prop('readonly',true);
            selection.removeClass('dainput');
            selection.addClass('roinput');
        }
        if (isdisabled) {
            $(this).find('input.hrp-select-selected-value').prop('disabled', true);
            selection.removeClass('roinput');
            selection.addClass('dainput');
        }

        var isclearable = $(this).hasClass('clearable');
        var isselected = $(this).find('input.hrp-select-selected-value').not('[disabled],[readonly]').val();
        if (isclearable) {
            $(this).find('.hrp-select-selection .hrp-select-arrow').after('<i class="iconhrp icon-close-circle-fill hrp-select-clear"></i>');
        }
        if (isselected) {
            $(this).addClass('hasvalue');
        }
    });
    // toggle class 'opened' while click select
    $('.hrp-select .hrp-select-placeholder', $context).focus(function (e) {
        var select = $(this).closest('.hrp-select');
        var onlyread = $(this);
        var selectUpDown = select.find('.hrp-select-dropdown');
        var seldisabled = select.find('input.hrp-select-selected-value[disabled]');
        var selreadonly = select.find('input.hrp-select-selected-value[readonly]');
        if (onlyread && onlyread.length) {
            if ((!seldisabled || seldisabled.length == 0) && (!selreadonly || selreadonly.length == 0)) {
                setSelectedDropdown(selectUpDown)
                // menuUpDown(selectUpDown, select, 'opened')
                selectUpDown.slideDown(200);
                select.addClass('opened');
            }
        }
        // e.stopPropagation();
        onlyread.blur(function () {
            window.setTimeout(function () {
                selectUpDown.slideUp(100);
                select.removeClass('opened');
            }, 100)
        })
    });
    // change value while click selectItem
    $('.hrp-select-item', $context).unbind('click').click(function (e) {
        var selectText = $(this).text();
        var selectValue = $(this).data('value');
        var select = $(this).closest('.hrp-select');
        var selectUpDown = select.find('.hrp-select-dropdown');

        $(this).addClass('selected').siblings().removeClass('selected');
        select.find('input.hrp-select-placeholder').val(selectText).trigger('change');
        select.find('input.hrp-select-selected-value').val(selectValue).trigger('change');

        if (selectValue) {
            $(this).closest('.hrp-select').addClass('hasvalue');
        }
    });
    // clear value when click close btn
    $('.hrp-select .hrp-select-clear', $context).unbind('click').click(function (e) {
        var select = $(this).closest('.hrp-select');
        clearSelectVal(select)
        e.stopPropagation();
    })
};
// clear select val
function clearSelectVal(elem) {
  var select = elem;
  var valueInput = select.find('input.hrp-select-selected-value').not('[disabled],[readonly]');
  if (valueInput && valueInput.length) {
      select.find('.hrp-select-item').removeClass('selected');
      select.find('input.hrp-select-placeholder').val('').trigger('change');
      valueInput.val('').trigger('change');
      select.removeClass('hasvalue');
  }
};
// set property of dropdown list(select) 自动定位
function setSelectedDropdown(e) {
    var $winHeight = $(window).height();  // console.log("窗口高度"+$winHeight)
    var $myHeight = e.height();  // console.log("下拉高度"+$myHeight)
    var $select = e.closest('.hrp-select');
    var $selectWidth = $select.width();  // console.log("select宽度"+$selectWidth)
    var $selectTop = $select.offset().top - $(window).scrollTop();  // console.log("$selectTop"+$selectTop)
    e.css({ "width": $selectWidth, "left": 0 });
    if ($winHeight - $selectTop - 96 > $myHeight) {
        e.css({ "top": 34, "bottom": '' })
    } else {
        e.css({ "bottom": 34, "top": '' })
    }
};


// 检索框 Autocomplete
function initAutocomplete($context) {
    $context = $context && $context.length ? $context : $(document);
    // autocomplete set while download
    $('.hrp-autocomplete', $context).each(function () {
        var isOpened = $(this).hasClass('opened');
        if (isOpened == 0) {
            $(this).find('.hrp-autocomplete-dropdown').css({ "display": "none" });
        }
        var autocompleteValue = $(this).find('input.hrp-autocomplete-selected-value').val();
        if (!autocompleteValue) {
            var oriValue = $(this).find('.hrp-autocomplete-item.selected').data('value');
            var oriText = $(this).find('.hrp-autocomplete-item.selected').text();
            $(this).find('input.hrp-autocomplete-selected-value').val(oriValue);
            $(this).find('input.hrp-autocomplete-placeholder').val(oriText);
        } else {
            var itemLength = $(this).find('.hrp-autocomplete-item').length;
            for (i = 0; i < itemLength; i++) {
                var itemValue = $(this).find('.hrp-autocomplete-item').eq(i).data('value');
                if (autocompleteValue == itemValue) {
                    var autocompleteText = $(this).find('.hrp-autocomplete-item').eq(i).text();
                    $(this).find('input.hrp-autocomplete-placeholder').val(autocompleteText);
                }
            }
        }

        var autoselection = $(this).find('.hrp-autocomplete-selection');
        var isreadonly = $(this).hasClass('readonly');
        var isdisabled = $(this).hasClass('disabled');
        if (isreadonly) {
            $(this).find('input.hrp-autocomplete-placeholder').prop('readonly', true);
            $(this).find('input.hrp-autocomplete-selected-value').prop('readonly', true);
            autoselection.removeClass('dainput');
            autoselection.addClass('roinput');
        }
        if (isdisabled) {
            $(this).find('input.hrp-autocomplete-placeholder').prop('readonly', true);
            $(this).find('input.hrp-autocomplete-selected-value').prop('disabled', true);
            autoselection.removeClass('roinput');
            autoselection.addClass('dainput');
        }
    });
    // toggle class 'opened' while click autocomplete
    $('.hrp-autocomplete input.hrp-autocomplete-placeholder', $context).focus(function (e) {
        var autocomplete = $(this).closest('.hrp-autocomplete');
        var onlyread = $(this);
        var autocompleteUpDown = autocomplete.find('.hrp-autocomplete-dropdown');
        var autodisabled = autocomplete.find('input.hrp-autocomplete-selected-value[disabled]');
        var autoreadonly = autocomplete.find('input.hrp-autocomplete-selected-value[readonly]');
        if (onlyread && onlyread.length) {
            if ((!autodisabled || autodisabled.length == 0) && (!autoreadonly || autoreadonly.length == 0)) {
                setAutocompleteDropdown(autocompleteUpDown)
                // menuUpDown(autocompleteUpDown, autocomplete, 'opened')
                autocompleteUpDown.slideDown(200);
                autocomplete.addClass('opened');
            }
        }
        // e.stopPropagation();
        onlyread.blur(function () {
            autocompleteUpDown.slideUp(100);
            autocomplete.removeClass('opened');
        })
    })
};
// 参数分别为：当前输入框 下拉列表 显示值 真实值 是否前台过滤
function searchQueryAuto(tar, list, tarName, tarValue, isfilter) {
    var newlist = []
    tar.siblings('input.hrp-autocomplete-selected-value').val('');
    if (isfilter) {
        var autocompleteText = tar.val();
        for (let i = 0; i < list.length; i++) {
            if (list[i][tarName].toLowerCase().indexOf(autocompleteText.toLowerCase()) !== -1) {
                newlist.push(list[i])
            }
        }
    } else {
        newlist = [] // list
    }
    autoQuerySearch(tar, newlist, tarName, tarValue)
    $('.hrp-autocomplete-item').click(function () {
        clickAutocomplete($(this))
    })
    inputAutocomplete(tar, newlist, tarName)
};
// 动态渲染下拉列表
function autoQuerySearch(tar, searchList, tarName, tarValue) {
    var autolist = tar.closest('.hrp-autocomplete').find('.hrp-autocomplete-list');
    autolist.children('li').remove();
    if (searchList && searchList.length) {
        for (let i = 0; i < searchList.length; i++) {
            autolist.append('<li class="hrp-autocomplete-item" data-value="' + searchList[i][tarValue] + '">' + searchList[i][tarName] + '</li>');
        }
    }
};
// click Autocomplete Item
function clickAutocomplete(e) {
    var autocompleteText = e.text();
    var autocompleteValue = e.data('value');
    // console.log(autocompleteValue)
    e.addClass('selected').siblings().removeClass('selected');
    e.closest('.hrp-autocomplete').find('input.hrp-autocomplete-placeholder').val(autocompleteText).trigger('change');
    e.closest('.hrp-autocomplete').find('input.hrp-autocomplete-selected-value').val(autocompleteValue).trigger('change');
};
// input Autocomplete Item
function inputAutocomplete(tar, searchList, tarName) {
    if (searchList.length === 1 && tar.val() == searchList[0][tarName]) {
        var item = tar.closest('.hrp-autocomplete').find('.hrp-autocomplete-item')
        clickAutocomplete(item)
    }
};
// set property of dropdown list(autocomplete) 自动定位
function setAutocompleteDropdown(e) {
    var $winHeight = $(window).height();  // console.log("窗口高度", $winHeight)
    var $myHeight = e.height();  // console.log("下拉高度", $myHeight)
    var $autocomplete = e.closest('.hrp-autocomplete');
    var $autocompleteWidth = $autocomplete.width();  // console.log("autocomplete宽度", $autocompleteWidth)
    var $autocompleteTop = $autocomplete.offset().top - $(window).scrollTop();  // console.log("autocomplete距顶部高度", $autocompleteTop)
    e.css({ "width": $autocompleteWidth, "left": 0 });
    if ($winHeight - $autocompleteTop - 96 > $myHeight) {
        e.css({ "top": 34, "bottom": '' })
    } else {
        e.css({ "bottom": 34, "top": '' })
    }
};


// 日期选择器 DatePicker
function initDatePicker($context) {
    $context = $context && $context.length ? $context : $(document);
    // datepicker set while download
    $('.hrp-datepicker', $context).each(function () {
        setDateCell(this)
        var isOpened = $(this).hasClass('opened');
        if (isOpened == 0) {
            $(this).find('.hrp-date-dropdown').css({ 'display': 'none' });
        }

        var isclearable = $(this).hasClass('clearable');
        var isselected = $(this).find('input').not('[disabled],[readonly]').val();
        var isreadonly = $(this).hasClass('readonly');
        if (isclearable) {
            $(this).children('.hrp-date-section').append('<i class="iconhrp icon-close-circle-fill hrp-date-clear"></i>');
        }
        if (isselected) {
            $(this).addClass('hasvalue');
        }
        if (isreadonly) {
            $(this).find('input').attr('readOnly', 'true');
        }
    });
    // toggle class 'opened' while click datepicker
    $('.hrp-datepicker', $context).unbind('click').click(function (e) {
        var datepicker = $(this);
        var dateUpDown = datepicker.find('.hrp-date-dropdown');
        var dateValue = datepicker.find('input').val() || getNewdate().value;
        var pickedValue = datepicker.find('input').val();
        var datedisabled = $(this).find('input[disabled]');
        var datereadonly = $(this).find('input[readonly]');
        if ((!datedisabled || datedisabled.length == 0) && (!datereadonly || datereadonly.length == 0)) {
            setDatePickerDropdown(dateUpDown)
            // menuUpDown(dateUpDown, $(this), 'opened')
            dateUpDown.slideDown(200);
            datepicker.addClass('opened');
        } else if (datereadonly && datepicker.hasClass('readonly')) {
            setDatePickerDropdown(dateUpDown)
            // menuUpDown(dateUpDown, $(this), 'opened')
            dateUpDown.slideDown(200);
            datepicker.addClass('opened');
        }
        var DATE_FORMAT = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/;
        if (pickedValue && DATE_FORMAT.test(pickedValue)) {
            setDatePickerCells(datepicker, pickedValue, pickedValue)
        }
        e.stopPropagation();
        $(document).click(function () {
            dateUpDown.slideUp(100);
            datepicker.removeClass('opened');
            datepicker.find('input').trigger('change');
            window.setTimeout(function () {
                setDatePickerCells(datepicker, dateValue, dateValue)
                openDatePanel(datepicker)
            }, 100)
        })
    });
    // change value while click cell
    $('.hrp-date-picker-cells-cell', $context).unbind('click').click(function (e) {
        e.stopPropagation();
        var datepicker = $(this).closest('.hrp-datepicker');
        var dateUpDown = datepicker.find('.hrp-date-dropdown');
        var yearText = datepicker.find('.hrp-date-picker-header-label .year').text();
        var monthText = datepicker.find('.hrp-date-picker-header-label .month').text();
        var yy, mm, dd, dateValue
        yy = Number(yearText.substr(0, yearText.length - 1));
        mm = Number(monthText.substr(0, monthText.length - 1));
        dd = $(this).children('em').text().padStart(2, '0');
        
        var isPrevMonth = $(this).hasClass('prev-month');
        var isNextMonth = $(this).hasClass('next-month');
        if (isPrevMonth) {
            if (mm == '01') {
                mm = '12'
                yy--
                
                dateValue = yy + '-' + mm + '-' + dd;
                window.setTimeout(function () {
                    setYearPickerCells(datepicker, dateValue, dateValue)
                }, 100)
            } else {
                mm--;
                mm = mm.toString().padStart(2, '0')

                dateValue = yy + '-' + mm + '-' + dd;
                window.setTimeout(function () {
                    setDatePickerCells(datepicker, dateValue, dateValue)
                }, 100)
            }
            datepicker.find('input').val(dateValue).trigger('change');
            datepicker.addClass('hasvalue');
        } else if (isNextMonth) {
            if (mm == '12') {
                mm = '01'
                yy++

                dateValue = yy + '-' + mm + '-' + dd;
                window.setTimeout(function () {
                    setYearPickerCells(datepicker, dateValue, dateValue)
                }, 100)
            } else {
                mm++
                mm = mm.toString().padStart(2, '0')

                dateValue = yy + '-' + mm + '-' + dd;
                window.setTimeout(function () {
                    setDatePickerCells(datepicker, dateValue, dateValue)
                }, 100)
            }
            datepicker.find('input').val(dateValue).trigger('change');
            datepicker.addClass('hasvalue');
        } else {
            mm = mm.toString().padStart(2, '0')
            dateValue = yy + '-' + mm + '-' + dd;
            
            datepicker.find('input').val(dateValue).trigger('change');
            datepicker.addClass('hasvalue');
        }
        
        $(this).addClass('selected').siblings().removeClass('selected');
        dateUpDown.slideUp(100);
        datepicker.removeClass('opened');
    });
    // click prev year or month
    $('.hrp-date-picker-icon.prev', $context).unbind('click').click(function (e) {
        e.stopPropagation();
        var isdouble = $(this).hasClass('double')
        var datepicker = $(this).closest('.hrp-datepicker');
        var isYearPanel = datepicker.hasClass('yearpicker') // 选择年份面板
        var isMonthPanel = datepicker.hasClass('monthpicker') // 选择月份面板
        var yearText = datepicker.find('.hrp-date-picker-header-label .year').text();
        var monthText = datepicker.find('.hrp-date-picker-header-label .month').text();
        var selectedVal = datepicker.find('input').val() || getNewdate().value;
        var yy, mm, dd, dateValue
        yy = Number(yearText.substr(0, yearText.length - 1));
        mm = Number(monthText.substr(0, monthText.length - 1));
        dd = '01';
        
        if (isdouble) { // 年份减1/10
            if (isYearPanel || isMonthPanel) {
                yy = yy - 12
            } else {
                yy--
            }
            mm = mm.toString().padStart(2, '0')

            dateValue = yy + '-' + mm + '-' + dd;
            setYearPickerCells(datepicker, dateValue, selectedVal)
        } else { // 月份减1
            if (mm == '01') {
                mm = '12'
                yy--

                dateValue = yy + '-' + mm + '-' + dd;
                setYearPickerCells(datepicker, dateValue, selectedVal)
            } else {
                mm--
                mm = mm.toString().padStart(2, '0')

                dateValue = yy + '-' + mm + '-' + dd;
                setDatePickerCells(datepicker, dateValue, selectedVal)
            }
        }
    });
    // click next year or month
    $('.hrp-date-picker-icon.next', $context).unbind('click').click(function (e) {
        e.stopPropagation();
        var isdouble = $(this).hasClass('double')
        var datepicker = $(this).closest('.hrp-datepicker');
        var isYearPanel = datepicker.hasClass('yearpicker') // 选择年份面板
        var isMonthPanel = datepicker.hasClass('monthpicker') // 选择月份面板
        var yearText = datepicker.find('.hrp-date-picker-header-label .year').text();
        var monthText = datepicker.find('.hrp-date-picker-header-label .month').text();
        var selectedVal = datepicker.find('input').val() || getNewdate().value;
        var yy, mm, dd, dateValue
        yy = Number(yearText.substr(0, yearText.length - 1));
        mm = Number(monthText.substr(0, monthText.length - 1));
        dd = '01';
        
        if (isdouble) { // 年份加1/10
            if (isYearPanel || isMonthPanel) {
                yy = yy + 12
            } else {
                yy++
            }
            mm = mm.toString().padStart(2, '0')

            dateValue = yy + '-' + mm + '-' + dd;
            setYearPickerCells(datepicker, dateValue, selectedVal)
        } else { // 月份加1
            if (mm == '12') {
                mm = '01'
                yy++

                dateValue = yy + '-' + mm + '-' + dd;
                setYearPickerCells(datepicker, dateValue, selectedVal)
            } else {
                mm++
                mm = mm.toString().padStart(2, '0')

                dateValue = yy + '-' + mm + '-' + dd;
                setDatePickerCells(datepicker, dateValue, selectedVal)
            }
        }
    });
    // start choose year
    $('.hrp-date-picker-header-label .year', $context).unbind('click').click(function (e) {
        e.stopPropagation();
        var datepicker = $(this).closest('.hrp-datepicker');
        $(this).next('.month').css({ 'display': 'none' });
        openYearPanel(datepicker)
    });
    // click year cell
    $('.hrp-year-picker-cells-cell', $context).unbind('click').click(function (e) {
        e.stopPropagation();
        var datepicker = $(this).closest('.hrp-datepicker');
        var monthText = datepicker.find('.hrp-date-picker-header-label .month').text();
        var selectedVal = datepicker.find('input').val() || getNewdate().value;
        var yy, mm, dd, dateValue
        yy = $(this).children('em').text();
        mm = monthText.substr(0, monthText.length - 1).padStart(2, '0');
        dd = '01';
        dateValue = yy + '-' + mm + '-' + dd;

        setYearPickerCells(datepicker, dateValue, selectedVal)
        openDatePanel(datepicker)
    });
    // start choose month
    $('.hrp-date-picker-header-label .month', $context).unbind('click').click(function (e) {
        e.stopPropagation();
        var datepicker = $(this).closest('.hrp-datepicker');
        $(this).css({ 'display': 'none' });
        openMonthPanel(datepicker)
    });
    // click month cell
    $('.hrp-month-picker-cells-cell', $context).unbind('click').click(function (e) {
        e.stopPropagation();
        var datepicker = $(this).closest('.hrp-datepicker');
        var yearText = datepicker.find('.hrp-date-picker-header-label .year').text();
        var selectedVal = datepicker.find('input').val();
        var yy, mm, dd, dateValue
        yy = yearText.substr(0, yearText.length - 1);
        mm = $(this).children('em').text();
        mm = mm.substr(0, mm.length - 1).padStart(2, '0');
        dd = '01';
        dateValue = yy + '-' + mm + '-' + dd;

        setDatePickerCells(datepicker, dateValue, selectedVal)
        openDatePanel(datepicker)
    });
    // clear value when click close btn
    $('.hrp-datepicker .hrp-date-clear', $context).unbind('click').click(function (e) {
        var datepicker = $(this).closest(".hrp-datepicker");
        clearDateVal(datepicker)
        e.stopPropagation();

        var today = new Date()
        var yy = today.getFullYear().toString();
        var mm = (today.getMonth() + 1).toString().padStart(2, '0');
        var dd = today.getDate().toString().padStart(2, '0');
        var dateValue = yy + '-' + mm + '-' + dd;
        setDatePickerCells(datepicker, dateValue)
    })
};
// clear datepicker val
function clearDateVal(elem) {
  var datepicker = elem;
  var valueInput = datepicker.find('input').not('[disabled],[readonly]');
  if (datepicker.find('input[readonly]') && datepicker.hasClass('readonly')) {
      valueInput = datepicker.find('input')
  }
  if (valueInput && valueInput.length) {
      datepicker.find('.hrp-date-picker-cells-cell').removeClass('selected');
      valueInput.val('').trigger('change');
      datepicker.removeClass('hasvalue');
  }
};
function setDateCell(e) {
    // 初始化年月日
    $(e).children('input').unwrap('.hrp-date-section');
    $(e).find('.hrp-date-dropdown').remove();
    $(e).wrapInner('<div class="hrp-date-section"></div>');
    var currentVal = $(e).find('input').val();
    var today, currentYear, currentMonth, lastYear, lastMonth
    currentVal ? today = new Date(currentVal) : today = new Date()

    currentYear = today.getFullYear();
    currentMonth = today.getMonth() + 1;
    currentDate = today.getDate();
    if (currentMonth == 1) {
        lastYear = currentYear - 1
        lastMonth = 12
    } else {
        lastYear = currentYear
        lastMonth = currentMonth - 1
    }
    
    $(e).append('<div class="hrp-date-dropdown"><div class="hrp-date-panel-body">\
                    <div class="hrp-date-picker-header">\
                        <span class="hrp-date-picker-icon prev double"><i class="iconhrp icon-doubleleft"></i></span>\
                        <span class="hrp-date-picker-icon prev"><i class="iconhrp icon-left"></i></span>\
                        <span class="hrp-date-picker-header-label"><span class="year">' + currentYear + '年</span><span class="month">' + currentMonth + '月</span></span>\
                        <span class="hrp-date-picker-icon next"><i class="iconhrp icon-right"></i></span>\
                        <span class="hrp-date-picker-icon next double"><i class="iconhrp icon-doubleright"></i></span>\
                    </div>\
                    <div class="hrp-date-picker-content">\
                        <div class="hrp-date-picker-cells">\
                            <div class="hrp-date-picker-cells-header"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>\
                        </div>\
                        <div class="hrp-year-picker-cells" style="display: none;"></div>\
                        <div class="hrp-month-picker-cells" style="display: none;"></div>\
                    </div>\
                </div></div>')
    
    // 创建上一个月的日期格子
    var lastListNum = getDuration(lastYear, lastMonth) // 上个月总天数
    var lastListDay = getFirstDay(lastYear, lastMonth) // 上个月最后一天的星期数
    for (let index = lastListDay; index >= 0; index--) {
        var date = lastListNum - index
        $(e).find('.hrp-date-picker-cells').append('<span class="hrp-date-picker-cells-cell prev-month"><em>' + date + '</em></span>')
    }
    // 创建当前月的日期格子
    var currentListNum = getDuration(currentYear, currentMonth) // 本月总天数
    for (let index = 1; index <= currentListNum; index++) {
        if (index == currentDate && !currentVal) {
            $(e).find('.hrp-date-picker-cells').append('<span class="hrp-date-picker-cells-cell today"><em>' + index + '</em></span>')
        } else if (index == currentDate && currentVal) {
            $(e).find('.hrp-date-picker-cells').append('<span class="hrp-date-picker-cells-cell selected"><em>' + index + '</em></span>')
        } else {
            $(e).find('.hrp-date-picker-cells').append('<span class="hrp-date-picker-cells-cell"><em>' + index + '</em></span>')
        }
    }
    // 创建下一个月的日期格子
    var nextListNum = 41 - lastListDay - currentListNum // 下个月补齐天数
    for (let index = 1; index <= nextListNum; index++) {
        $(e).find('.hrp-date-picker-cells').append('<span class="hrp-date-picker-cells-cell next-month"><em>' + index + '</em></span>')
    }

    // 创建年格子
    for (let index = 0; index < 12; index++) {
        var year = currentYear - 2 + index
        if (year == currentYear) {
            $(e).find('.hrp-year-picker-cells').append('<span class="hrp-year-picker-cells-cell selected"><em>' + year + '</em></span>')
        } else {
            $(e).find('.hrp-year-picker-cells').append('<span class="hrp-year-picker-cells-cell"><em>' + year + '</em></span>')
        }
    }

    // 创建月格子
    for (let index = 0; index < 12; index++) {
        var month = index + 1
        if (month == currentMonth) {
            $(e).find('.hrp-month-picker-cells').append('<span class="hrp-month-picker-cells-cell selected"><em>' + month + '月</em></span>')
        } else {
            $(e).find('.hrp-month-picker-cells').append('<span class="hrp-month-picker-cells-cell"><em>' + month + '月</em></span>')
        }
    }
}
// get date of now 获取当前日期
function getNewdate() {
    var newdate = new Date()
    var yy, mm, dd, val, object
    yy = newdate.getFullYear().toString();
    mm = (newdate.getMonth() + 1).toString().padStart(2, '0');
    dd = newdate.getDate().toString().padStart(2, '0');
    val = yy + '-' + mm + '-' + dd;
    object = { year: yy, month: mm, date: dd, value: val }

    return object
};
// how many days of this month
function getDuration(year, month) { 
    var dt = new Date(year, month, 0);

    return dt.getDate()
};
// What day is the first of this month
function getFirstDay(year, month) {
    var dt = new Date(year, month, 0);

    return dt.getDay()
};
// set year picker cells 生成年份
function setYearPickerCells(e, val, sele) {
    var currentYear = val.substr(0, 4)
    var selectYear
    if (sele) {
        selectYear = sele.substr(0, 4)
    }

    $(e).find('.hrp-year-picker-cells-cell').removeClass('selected')
    for (let index = 0; index < 12; index++) {
        var year = Number(currentYear) - 2 + index
        var cell = $(e).find('.hrp-year-picker-cells-cell').eq(index);
        cell.children('em').text(year);
        if (selectYear == year) {
            cell.addClass('selected')
        }
    }

    // 生成日期
    setDatePickerCells(e, val, sele)
};
// set date picker cells 生成日期
function setDatePickerCells(e, val, sele) {
    var currentTime = new Date(val)
    var currentYear = currentTime.getFullYear();
    var currentMonth = currentTime.getMonth() + 1;
    var today = new Date()
    var todayYear = today.getFullYear();
    var todayMonth = today.getMonth() + 1;
    var todayDate
    var selectedVal
    if (currentYear == todayYear && currentMonth == todayMonth) {
        todayDate = today.getDate();
    }
    var inputVal = $(e).find('input').val();
    if (sele && val.substr(0, 7) == sele.substr(0, 7) && inputVal == sele) {
        selectedVal = Number(sele.substr(8, 2));
    }
    // console.log('sele', sele)
    // console.log('val', val)

    var lastYear, lastMonth
    if (currentMonth == 1) {
        lastYear = currentYear - 1
        lastMonth = 12
    } else {
        lastYear = currentYear
        lastMonth = currentMonth - 1
    }

    $(e).find('.hrp-date-picker-cells-cell').removeClass('prev-month').removeClass('next-month').removeClass('today').removeClass('selected')
    // 设置上一个月的日期格子
    var lastListNum = getDuration(lastYear, lastMonth) // 上个月总天数
    var lastListDay = getFirstDay(lastYear, lastMonth) // 上个月最后一天的星期数
    // console.log('上个月总天数', lastListNum)
    for (let index = lastListDay; index >= 0; index--) {
        var date = lastListNum - index
        var eq = lastListDay - index
        $(e).find('.hrp-date-picker-cells-cell').eq(eq).addClass('prev-month').children('em').text(date + '');
    }
    // 设置当前月的日期格子
    var currentListNum = getDuration(currentYear, currentMonth) // 本月总天数
    // console.log('本月总天数', currentListNum)
    for (let index = 1; index <= currentListNum; index++) {
        var eq = lastListDay + index
        var cell = $(e).find('.hrp-date-picker-cells-cell').eq(eq);
        cell.children('em').text(index + '')
        if (todayDate && todayDate == index) {
            cell.addClass('today')
        }
        if (selectedVal && selectedVal == index) {
            cell.addClass('selected')
        }
    }
    // 设置下一个月的日期格子
    var nextListNum = 41 - lastListDay - currentListNum // 下个月补齐天数
    for (let index = 1; index <= nextListNum; index++) {
        var eq = lastListDay + currentListNum + index
        $(e).find('.hrp-date-picker-cells-cell').eq(eq).addClass('next-month').children('em').text(index + '');
    }

    // 设置年月
    $(e).find('.hrp-date-picker-header-label .year').text(currentYear + '年');
    $(e).find('.hrp-date-picker-header-label .month').text(currentMonth + '月');
};
// while choose date
function openDatePanel(elem) {
    elem.removeClass('yearpicker').removeClass('monthpicker')
    elem.find('.hrp-date-picker-header-label .month').css({ 'display': '' });
    elem.find('.hrp-date-picker-cells').css({ 'display': '' });
    elem.find('.hrp-year-picker-cells').css({ 'display': 'none' });
    elem.find('.hrp-month-picker-cells').css({ 'display': 'none' });
    elem.find('.hrp-date-picker-icon.prev:not(.double)').css({ 'display': '' });
    elem.find('.hrp-date-picker-icon.next:not(.double)').css({ 'display': '' });
};
// while choose year
function openYearPanel(elem) {
    elem.removeClass('monthpicker')
    elem.addClass('yearpicker');
    elem.find('.hrp-date-picker-cells').css({ 'display': 'none' });
    elem.find('.hrp-year-picker-cells').css({ 'display': '' });
    elem.find('.hrp-month-picker-cells').css({ 'display': 'none' });
    elem.find('.hrp-date-picker-icon.prev:not(.double)').css({ 'display': 'none' });
    elem.find('.hrp-date-picker-icon.next:not(.double)').css({ 'display': 'none' });
};
// while choose month
function openMonthPanel(elem) {
    elem.removeClass('yearpicker')
    elem.addClass('monthpicker');
    elem.find('.hrp-date-picker-cells').css({ 'display': 'none' });
    elem.find('.hrp-year-picker-cells').css({ 'display': 'none' });
    elem.find('.hrp-month-picker-cells').css({ 'display': '' });
    elem.find('.hrp-date-picker-icon.prev:not(.double)').css({ 'display': 'none' });
    elem.find('.hrp-date-picker-icon.next:not(.double)').css({ 'display': 'none' });
};
// set property of dropdown list(datepicker) 自动定位
function setDatePickerDropdown(e) {
    var $winHeight = $(window).height();  // console.log("窗口高度"+$winHeight)
    var $myHeight = e.height();  // console.log("下拉高度"+$myHeight)
    var $datepicker = e.closest('.hrp-datepicker');
    var $datepickerTop = $datepicker.offset().top - $(window).scrollTop();  // console.log("$datepickerTop"+$datepickerTop)
    e.css({ "left": 0 });
    if ($winHeight - $datepickerTop - 96 > $myHeight) {
        e.css({ "top": 34, "bottom": '' })
    } else {
        e.css({ "bottom": 34, "top": '' })
    }
};


// 表单 Form
function initForm($context) {
    $context = $context && $context.length ? $context : $(document);
    // form error while required ele is empty
    // requireText
    $('.hrp-form-item-required > .hrp-input-content > input, .hrp-form-item-required > .hrp-input-content > textarea', $context).focus(function () {
        var that = $(this);
        that.removeClass('error');
        that.siblings('.hrp-form-item-tip').remove();
        that.blur(function () {
            if (that.val() == '') {
                var name = that.parents('.hrp-form-item').children('label').text();
                var msg = name + '不能为空';
                formError(that, msg)
            }
        })
    });
    $('.hrp-form-item-required > .hrp-input-content > input, .hrp-form-item-required > .hrp-input-content > textarea', $context).change(function () {
        var that = $(this);
        that.removeClass('error');
        that.siblings('.hrp-form-item-tip').remove();
        if (that.val() == '') {
            var name = that.parents('.hrp-form-item').children('label').text();
            var msg = name + '不能为空';
            formError(that, msg)
        }
    });
    // requireSelect
    $('.hrp-form-item-required .hrp-select', $context).click(function () {
        var that = $(this);
        that.removeClass('error');
        that.siblings('.hrp-form-item-tip').remove();
        var holder = $(this).find('.hrp-select-placeholder');
        var select = $(this).find('.hrp-select-selected-value');
        holder.blur(function () {
            if (select.val() == '') {
                var name = that.parents('.hrp-form-item').children('label').text();
                var msg = '请选择' + name;
                formError(that, msg)
            }
        })
    });
    $('.hrp-form-item-required .hrp-select .hrp-select-selected-value', $context).change(function () {
        var that = $(this).closest('.hrp-select');
        var select = $(this);
        if (select.val() == '') {
            var name = that.parents('.hrp-form-item').children('label').text();
            var msg = '请选择' + name;
            formError(that, msg)
        }
    });
    // requireAutocomplete
    $('.hrp-form-item-required .hrp-autocomplete', $context).click(function () {
        var that = $(this);
        that.removeClass('error');
        that.siblings('.hrp-form-item-tip').remove();
        var holder = $(this).find('.hrp-autocomplete-placeholder');
        var autocomplete = $(this).find('.hrp-autocomplete-selected-value');
        holder.blur(function () {
            if (autocomplete.val() == '') {
                var name = that.parents('.hrp-form-item').children('label').text();
                var msg = '请选择' + name;
                formError(that, msg)
            }
        })
    });
    $('.hrp-form-item-required .hrp-autocomplete .hrp-autocomplete-selected-value', $context).change(function () {
        var that = $(this).closest('.hrp-autocomplete');
        var autocomplete = $(this);
        if (autocomplete.val() == '') {
            var name = that.parents('.hrp-form-item').children('label').text();
            var msg = '请选择' + name;
            formError(that, msg)
        }
    });
    // requireRadio
    $('.hrp-form-item-required .hrp-radio', $context).click(function () {
        var that = $(this);
        that.removeClass('error');
        that.siblings('.hrp-form-item-tip').remove();
    });
    // requireCheckbox
    $('.hrp-form-item-required .hrp-checkbox', $context).click(function () {
        var that = $(this).parent('.hrp-checkbox-group');
        that.removeClass('error');
        that.siblings('.hrp-form-item-tip').remove();
        if (that.find('input:checked').length == 0) {
            var name = that.parents('.hrp-form-item').children('label').text();
            var msg = '请选择' + name;
            formError(that, msg)
        }
    })
    // requireDatepicker
    $('.hrp-form-item-required .hrp-datepicker', $context).change(function () {
        var that = $(this);
        that.removeClass('error');
        that.siblings('.hrp-form-item-tip').remove();
        var select = $(this).find('input');
        if (select.val() == '') {
            var name = that.parents('.hrp-form-item').children('label').text();
            var msg = '请选择' + name;
            formError(that, msg)
        }
    });
};
// some form action
function formError(e, msg) {
    e.siblings('.hrp-form-item-tip').remove();
    e.after('<span class="hrp-form-item-tip">' + msg + '</span>');
    e.siblings('.hrp-form-item-tip').fadeIn(200);
    e.addClass('error');
};
function formRequire(e) {
    var $target = $(e);
    var reqThat = $target.children('.hrp-form-item-required');
    var reqNum = $target.children('.hrp-form-item-required').length;

    for (var i = 0; i < reqNum; i++) {
        var re = reqThat.eq(i).children('.hrp-input-content');
        var istext = re.find('input,textarea').val() == '';
        var isselect = re.find('.hrp-select-selected-value').val() == '';
        var isautocomplete = re.find('.hrp-autocomplete-selected-value').val() == '';
        var ischoice = re.find('input[type=radio],input[type=checkbox]').length > 0 && re.find('input[type=radio]:checked,input[type=checkbox]:checked').length == 0;
        var name = re.siblings('label').text();
        var msg = name;

        if (istext || isselect || isautocomplete || ischoice) {
            if (istext) {
                msg = msg + '不能为空';
            } else if (isselect || ischoice) {
                msg = '请选择' + msg;
            }
            formError(re.children(), msg)
        } else {
            re.children().removeClass('error');
            re.children('.hrp-form-item-tip').remove();
        }
    }
};
function formReset(e) {
    var $target = $(e);
    var reqThat = $target.children('.hrp-form-item');

    reqThat.find('input,textarea').val('');
    reqThat.find('input[type=radio],input[type=checkbox]').attr('checked', false);
    reqThat.children('.hrp-input-content').children().removeClass('error');
    reqThat.find('.hrp-form-item-tip').remove();
    reqThat.find('.hasvalue').removeClass('hasvalue');
};


// 表格 Table
function initTable($context) {
    $context = $context && $context.length ? $context : $(document);
    // 用来存储当前更改宽度的Table Cell,避免快速移动鼠标的问题
    var tTD
    var th = $('table.hrp-table.hrp-resizable.fixed th', $context);
    var td = $('table.hrp-table td', $context);
    th.mousedown(function (ev) {
        // 记录单元格
        ev = ev || window.event;
        tTD = $(this)
        var currentIndex = $(this).index(); // 当前列索引
        var oldColWidth = $(this).closest('table').find('col').eq(currentIndex).attr('width'); // 当前列width值
        var oldNexWidth // 下一列width值
        var nextCol = $(this).closest('table').find('col').eq(currentIndex + 1);
        if (nextCol) {
            oldNexWidth = nextCol.attr('width');
        }
        var clientX = ev.clientX;
        var offsetX = ev.offsetX;
        var offsetW = $(this).outerWidth();
        // 获取关联宽度的table
        var relatedTable = $(this).closest('table').next().find('table.hrp-table.fixed');

        if (offsetX > offsetW - 10 && currentIndex < th.length - 1) {
            tTD.mouseDown = true;
            tTD.currentIndex = currentIndex; // 当前列索引
            tTD.oldX = clientX; // 鼠标开始位置
            tTD.oldWidth = offsetW; // 当前列原宽度 像素值
            tTD.oldNextWidth = $(this).next().outerWidth(); // 下一列原宽度 像素值
            tTD.oldColWidth = oldColWidth; // 当前列原宽度 col
            tTD.oldNexWidth = oldNexWidth; // 下一列原宽度 col
            tTD.newColWidth = oldColWidth; // 当前列新宽度 col
            tTD.newNexWidth = oldNexWidth; // 下一列新宽度 col
            tTD.relatedTable = relatedTable;
        }
    })
    th.mouseup(function () {
        // 结束宽度调整
        if (tTD == undefined) {
            tTD = $(this);
        }
        tTD.mouseDown = false;

        $(this).closest('table').find('col').eq(tTD.currentIndex).attr('width', tTD.newColWidth);
        $(this).closest('table').find('col').eq(tTD.currentIndex + 1).attr('width', tTD.newNexWidth);
        if (tTD.relatedTable) {
            if (tTD.relatedTable) {
                tTD.relatedTable.find('col').eq(tTD.currentIndex).attr('width', tTD.newColWidth);
                tTD.relatedTable.find('col').eq(tTD.currentIndex + 1).attr('width', tTD.newNexWidth);
            }
        }
    })
    th.mousemove(function (ev) {
        ev = ev || window.event;
        var clientX = ev.clientX;
        //鼠标移动时，不选中文字 
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        // 取出暂存的Table Cell
        if (tTD == undefined) {
            tTD = $(this);
        }
        // 调整宽度
        if (tTD.mouseDown != null && tTD.mouseDown == true) {
            var diffX = Number(clientX - tTD.oldX)
            var colLast = tTD.oldColWidth.charAt(tTD.oldColWidth.length - 1)
            var nexLast = tTD.oldNexWidth.charAt(tTD.oldNexWidth.length - 1)

            if (colLast == '%' && nexLast == '%') {
                // 前后列宽均为百分比
                // 当前列宽度为百分比 tTD.oldWidth/(clientX - tTD.oldX) = tTD.oldColWidth/x
                var perx = Number(tTD.oldColWidth.substr(0, tTD.oldColWidth.length - 1))
                var x = perx / tTD.oldWidth * diffX
                tTD.newColWidth = Math.round((perx + Number(x)) * 100) / 100 + '%'

                // 下一列宽度为百分比 tTD.oldNextWidth/(clientX - tTD.oldX) = tTD.oldNexWidth/y
                var pery = Number(tTD.oldNexWidth.substr(0, tTD.oldNexWidth.length - 1))
                var y = pery / tTD.oldNextWidth * diffX
                tTD.newNexWidth = Math.round((pery - Number(y)) * 100) / 100 + '%'

            } else if (colLast != '%' && nexLast != '%') {
                // 前后列宽均为像素
                tTD.newColWidth = Math.round(tTD.oldWidth + diffX)
                tTD.newNexWidth = Math.round(tTD.oldNextWidth - diffX)

            } else if (colLast == '%' && nexLast != '%') {
                // 当前列宽度为百分比，下一列宽度为像素
                tTD.newNexWidth = Math.round(tTD.oldNextWidth - diffX)

            } else if (colLast == '%' && nexLast != '%') {
                // 当前列宽度为像素，下一列宽度为百分比
                tTD.newColWidth = Math.round(tTD.oldWidth + diffX)

            }

            $(this).closest('table').find('col').eq(tTD.currentIndex).attr('width', tTD.newColWidth);
            $(this).closest('table').find('col').eq(tTD.currentIndex + 1).attr('width', tTD.newNexWidth);
            if (tTD.relatedTable) {
                tTD.relatedTable.find('col').eq(tTD.currentIndex).attr('width', tTD.newColWidth);
                tTD.relatedTable.find('col').eq(tTD.currentIndex + 1).attr('width', tTD.newNexWidth);
            }
        }
    })
    th.mouseover(function (ev) {
        // 更改鼠标样式
        ev = ev || window.event;
        var offsetX = ev.offsetX;
        var offsetW = $(this).outerWidth();
        if (offsetX > offsetW - 10 && $(this).index() < th.length - 1) {
            $(this).css("cursor", "col-resize");
        }
    })
    th.mouseout(function (ev) {
        // 更改鼠标样式
        ev = ev || window.event;
        $(this).css("cursor", "");
    })

    td.mouseover(function () {
        var wordText = $(this).html();
        var wordWidth = $(this)[0].scrollWidth;
        var outWidth = $(this).outerWidth();
        if (wordWidth > outWidth) {
            // 文字宽度大于总宽度（显示省略号），用 Tooltip 组件显示完整内容
            var tipPlace = ''
            var winWidth = $(window).width();  // console.log("窗口宽度"+$winHeight)
            var winHeight = $(window).height();  // console.log("窗口高度"+$winHeight)
            var tdLeft = $(this).offset().left - $(window).scrollLeft(); // td到左边窗口距离
            var tdTop = $(this).offset().top - $(window).scrollTop(); // td距顶部高度
            // css
            var tipTop = ''
            var tipLeft = ''
            var tipRight = ''
            var tipBottom = ''
            if (tdTop > 240) {
                tipBottom = winHeight - tdTop - 5 + 'px'
                if (winWidth - tdLeft > 240) {
                    tipPlace = 'top-start'
                    tipLeft = tdLeft + 'px'
                } else {
                    tipPlace = 'top-end'
                    tipRight = winWidth - tdLeft - outWidth + 'px'
                }
            } else {
                tipTop = tdTop + $(this).height() - 5 + 'px'
                if (winWidth - tdLeft > 240) {
                    tipPlace = 'bottom-start'
                    tipLeft = tdLeft + 'px'
                } else {
                    tipPlace = 'bottom-end'
                    tipRight = winWidth - tdLeft - $(this).outerWidth() + 'px'
                }
            }

            openTooltip($(this), wordText, tipPlace)
            var $tooltippop = $(this).children('.hrp-tooltip-pop');
            $tooltippop.css({ 'position': 'fixed', 'top': tipTop, 'left': tipLeft, 'right': tipRight, 'bottom': tipBottom })
        }
    })
    td.mouseout(function () {
        closeTooltip($(this))
    })
};
// table expand toggle
function tableExpand(e, target, accordion) {
    var $tr = $(e).closest('tr')
    var childCount = $tr[0].childElementCount
    var $expand = $tr.next('tr.expandRow')
    if ($expand && $expand.length) {
        $expand.remove()
    } else {
        if (accordion) {
            $tr.siblings('tr.expandRow').remove() // 开启手风琴模式，只展开一行
        }
        var cont = $(target)[0].outerHTML
        $tr.after('<tr class="expandRow"><td colspan="' + childCount + '"><div style="padding:16px">' + cont + '</div></td></tr>')
    }
};


// 弹框 Message
// show message
function showMessage(type, cont) {
    var $messageBox = $('.hrp-message-box');
    var messagePrimary = $('<div class="hrp-message"><div class="hrp-message-content"><i class="iconhrp hrp-message-icon"></i><span></span></div></div>');
    // console.log(messagePrimary)
    $messageBox.append(messagePrimary);

    var $msg = $('.hrp-message');
    var msgLength = $msg.length - 1;
    if (msgLength >= 0) {
        var messageColor = 'hrp-color-' + type;
        var _this = $msg.eq(msgLength);
        _this.find('.hrp-message-content > span').html(cont);
        // 对应 message 对应类型的 icon
        if (type == 'primary') {
            _this.find('.hrp-message-icon').addClass('icon-info-circle-fill').addClass(messageColor);
        } else if (type == 'success') {
            _this.find('.hrp-message-icon').addClass('icon-check-circle-fill').addClass(messageColor);
        } else if (type == 'warning') {
            _this.find('.hrp-message-icon').addClass('icon-warning-circle-fill').addClass(messageColor);
        } else if (type == 'error') {
            _this.find('.hrp-message-icon').addClass('icon-close-circle-fill').addClass(messageColor);
        } else {
            _this.find('.hrp-message-icon').remove();
        }
        _this.animate({ "bottom": "0", "opacity": "1" }, 200);
        setTimeout(function messageRemove() {
            _this.animate({ "bottom": "77px", "opacity": "0", "margin-bottom": "-61px" }, 200, function () {
                _this.remove();
            });
        }, 2000);
    }
};


// 模态 Modal
// show modal
function showModal(e) {
    var modalTarget = $(e); // 获取模态元素
    openMask();
    modalTarget.stop();
    modalTarget.css("display", "block").animate({ "top": "16%", "opacity": "1" }, 200);

    var modalClose = modalTarget.find('.modal-close');
    $(modalClose).click(function () {
        modalTarget.stop();
        modalTarget.animate({ "top": "8%", "opacity": "0" }, 200, function () {
            modalTarget.css("display", "");
        });
        closeMask();
    });
};


// 抽屉 Drawer
// show drawer
function showDrawer(e, type) {
    var drawerTarget = $(e); // 获取抽屉元素
    var drawerType = type || 'view'; // 获取抽屉类型
    var drawerWidth = drawerTarget.width();

    openMask();
    drawerTarget.stop();
    drawerTarget.css({ "right": 0 - drawerWidth, "display": "block" }).animate({ "right": "0%", "opacity": "1" }, 200);

    var drawerClose;
    var drawerTitle = drawerTarget.find('.hrp-drawer-title');
    var drawerBody = drawerTarget.find('.hrp-drawer-body');
    if (drawerType == "create") {
        drawerTitle.append('<i class="iconhrp icon-close hrp-close drawer-close"></i>');
        var footHeight = drawerTarget.find('.hrp-drawer-footer').height();
        drawerBody.css('padding-bottom', footHeight + 20);
        drawerClose = drawerTarget.find('.drawer-close');
    } else {
        drawerClose = $('.hrp-mask');
    }
    $(drawerClose).click(function () {
        drawerTarget.stop();
        drawerTarget.animate({ "right": 0 - drawerWidth, "opacity": "0" }, 200, function () {
            drawerTarget.css("display", "");
            drawerTarget.find('.hrp-close').remove();
        });
        closeMask();
    });
};


// 树 Tree
function initTree($context) {
    $context = $context && $context.length ? $context : $(document);
    // click tree checkbox
    clickTreeCheck($context)
    // click tree arrow
    clickTreeArrow($context)
    // click tree title
    clickTreeTitle($context)
};
// click tree title
function clickTreeTitle($context) {
    $context = $context && $context.length ? $context : $(document);
    $('.hrp-tree-title', $context).unbind('click').click(function () {
        var _el = $(this).siblings('.hrp-tree-children');
        var _tar = $(this).parent('.hrp-tree-subtree');
        menuUpDown(_el, _tar, 'opened')
    })
};
// click tree arrow
function clickTreeArrow($context) {
    $context = $context && $context.length ? $context : $(document);
    $('.hrp-tree-arrow', $context).unbind('click').click(function () {
        var _el = $(this).siblings('.hrp-tree-children');
        var _tar = $(this).parent('.hrp-tree-subtree');
        menuUpDown(_el, _tar, 'opened')
    })
};
// click tree checkbox
function clickTreeCheck($context) {
    $context = $context && $context.length ? $context : $(document);
    $('.hrp-tree.show-checkbox input:checkbox', $context).unbind('click').click(function () {
        var $subtree = $(this).parent().parent('.hrp-tree-subtree');
        $subtree.addClass('opened').find('.hrp-tree-subtree').addClass('opened');
        $subtree.find('.hrp-tree-children').slideDown(200);
        treeToggleCheck($subtree)
    })
};
// toggle checked node: checkbox
function treeToggleCheck(subtree) {
    var check = subtree.find('input:checkbox').prop('checked');

    if (check == 1) {
        subtree.find('input:checkbox').prop('checked', true);
        subtree.find('.checkbox').removeClass('min');
        var nocheck = subtree.siblings('.hrp-tree-subtree').find('input:checkbox').is(':not(:checked)');
        // console.log('nocheck', nocheck)
        if (!nocheck) { // 不存在未选择的兄弟（全选）
            subtree.parents('.hrp-tree-subtree').children('.hrp-checkbox').find('.checkbox').removeClass('min');
            subtree.parents('.hrp-tree-subtree').children('.hrp-checkbox').find('input:checkbox').prop('checked', true);
        } else { // 存在未选择的兄弟
            subtree.parents('.hrp-tree-subtree').children('.hrp-checkbox').find('.checkbox').addClass('min');
        }
        check = 0;
    } else {
        subtree.find('input:checkbox').prop('checked', false);
        subtree.parents('.hrp-tree-subtree').children('.hrp-checkbox').find('input:checkbox').prop('checked', false);
        var hascheck = subtree.siblings('.hrp-tree-subtree').find('input:checkbox').is(':checked');
        // console.log('hascheck', hascheck)
        if (hascheck) { // 存在已选择的兄弟
            subtree.parents('.hrp-tree-subtree').children('.hrp-checkbox').find('.checkbox').addClass('min');
        } else { // 不存在已选择的兄弟（全不选）
            subtree.parents('.hrp-tree-subtree').children('.hrp-checkbox').find('.checkbox').removeClass('min');
        }
        check = 1;
    }
};
// set tree opened node
function setTreeOpenedNode(e, list, keyCode) {
    var $treeTitle = $(e).find('.hrp-tree-title');
    $.each(list, function (index, item) {
        for (var i = 0; i < $treeTitle.length; i++) {
            if ($treeTitle.eq(i).data()[keyCode] === item) {
                $treeTitle.eq(i).siblings('.hrp-tree-children').slideDown(200);
                $treeTitle.parent('.hrp-tree-subtree').addClass('opened');
            }
        }
    })
};
// set tree checked node
function setTreeCheckedNode(e, list, keyCode) {
    var $treeTitle = $(e).find('.hrp-tree-title');
    $.each(list, function (index, item) {
        for (var i = 0; i < $treeTitle.length; i++) {
            if ($treeTitle.eq(i).data()[keyCode] === item) {
                $treeTitle.eq(i).parent('.hrp-tree-subtree').find('label').find('input:checkbox').prop('checked', true);
                treeToggleCheck($treeTitle.eq(i).parent('.hrp-tree-subtree'))
            }
        }
    })
    var $subtree = $(e).children('.hrp-tree-children').children('.hrp-tree-subtree');
    for (var i = 0; i < $subtree.length; i++) {
        treeDown($subtree.eq(i))
    }
};
// open tree node
function treeDown(subtree) {
    let $check = subtree.children('label').find('input:checkbox').prop('checked');
    let $min = subtree.children('label').find('span').hasClass('min');
    if ($check || $min) {
        subtree.addClass('opened');
        subtree.children('.hrp-tree-children').slideDown(200);
        var $subtree = subtree.children('.hrp-tree-children').children('.hrp-tree-subtree');
        for (var i = 0; i < $subtree.length; i++) {
            treeDown($subtree.eq(i))
        }
    }
};
// get tree node
function getTreeNode(tit, keyCode) {
    let $tree = $(tit).closest('.hrp-tree');
    let $ul = $(tit).siblings('.hrp-tree-children');
    if (!$ul.length) {
        let selectNode = $(tit).data();
        $tree.data(selectNode);
    } else {
        $tree.removeData();
    }
    let node = $tree.data();
    if (node && keyCode) {
        node = node[keyCode];
    }
    return node
};
// get tree checked node
function getTreeCheckedList(tree, keyCode) {
    var $subtree = $(tree).children('.hrp-tree-children').children('.hrp-tree-subtree');
    var checkList = []
    checkList = getTreeCheckedListEach($subtree, checkList, keyCode)
    // console.log('checkList',checkList)
    return checkList
};
// get tree checked node in children
function getTreeCheckedListEach(subtree, checkList, keyCode) {
    subtree.each(function () {
        let $check = $(this).children('label').find('input:checkbox').prop('checked');
        let $min = $(this).children('label').find('span').hasClass('min');
        if ($check) {
            let object = $(this).children('.hrp-tree-title').data();
            if (keyCode) {
                checkList.push(object[keyCode]);
            } else {
                checkList.push(object);
            }
        } else if ($min) {
            let list = checkList
            let $subtree = $(this).children('.hrp-tree-children').children('.hrp-tree-subtree');
            getTreeCheckedListEach($subtree, list, keyCode)
        }
    })
    return checkList
};
// creat tree
function setTree(e, list, leafName) {
    $(e).children('ul').remove();
    $(e).children('form').remove();
    $(e).append('<ul class="hrp-tree-children"></ul>');
    if (!leafName) {
        var leafName = 'name'
    }

    $.each(list, function (index, item) {
        $(e).children('.hrp-tree-children').append('<li class="hrp-tree-subtree"><div class="hrp-tree-title">' + item[leafName] + '</div></li>');
        $(e).children('.hrp-tree-children').children('.hrp-tree-subtree').last().children('.hrp-tree-title').data(item);
        if (item.children && item.children.length) {
            let $subtree = $(e).children('.hrp-tree-children').children('.hrp-tree-subtree').eq(index);
            setTreeChildren($subtree, item.children, leafName);
        }
    });

    var $treeSubtree = $(e).find('.hrp-tree-subtree');
    // menu up/down while download
    for (var i = 0; i < $treeSubtree.length; i++) {
        var hasChildren = $treeSubtree.eq(i).children('.hrp-tree-children').length;
        if (hasChildren > 0) {
            $treeSubtree.eq(i).prepend('<i class="iconhrp icon-right hrp-tree-arrow"></i>');
        }
        var hasClass = $treeSubtree.eq(i).hasClass('opened');
        if (hasClass == 0) {
            $treeSubtree.eq(i).children('.hrp-tree-children').css("display", "none");
        }
    }

    if ($(e).hasClass('show-checkbox')) { // add checkbox
        $treeSubtree.prepend('<label class="hrp-checkbox"><input type="checkbox"><span class="checkbox"><i class="iconhrp icon-check"></i></span></label>');
    }

    clickTreeTitle()
    clickTreeArrow()
    clickTreeCheck()
};
// creat tree children
function setTreeChildren(e, list, leafName) {
    e.append('<ul class="hrp-tree-children"></ul>');
    $.each(list, function (index, item) {
        e.children('.hrp-tree-children').append('<li class="hrp-tree-subtree"><div class="hrp-tree-title">' + item[leafName] + '</div></li>');
        e.children('.hrp-tree-children').children('.hrp-tree-subtree').last().children('.hrp-tree-title').data(item);
        if (item.children && item.children.length) {
            let $subtree = e.children('.hrp-tree-children').children('.hrp-tree-subtree').eq(index);
            setTreeChildren($subtree, item.children, leafName);
        }
    });
};


// 文字提示 Tooltip
function initTooltip($context) {
    $context = $context && $context.length ? $context : $(document);
    $('.hrp-tooltip', $context).mouseover(function () {
        var tipPlace = $(this).data('place');
        var tipCont = $(this).data('tip');
        openTooltip(this, tipCont, tipPlace)
        var $tooltippop = $(this).children('.hrp-tooltip-pop');
        // css
        var tipTop = ''
        var tipLeft = ''
        var tipRight = ''
        var tipBottom = ''
        if (tipPlace == 'top' || tipPlace == 'bottom') {
            var boxWidth = $(this).outerWidth();
            var tipWidth = $tooltippop.width();
            tipLeft = 0 - (tipWidth - boxWidth) / 2 + 'px'

        } else if (tipPlace == 'top-start' || tipPlace == 'bottom-start') {
            tipLeft = 0

        } else if (tipPlace == 'top-end' || tipPlace == 'bottom-end') {
            tipRight = 0

        } else if (tipPlace == 'left' || tipPlace == 'right') {
            var boxHeight = $(this).outerHeight();
            var tipHeight = $tooltippop.height();
            tipTop = 0 - (tipHeight - boxHeight) / 2 + 'px'

        } else if (tipPlace == 'left-start' || tipPlace == 'right-start') {
            tipTop = 0

        } else if (tipPlace == 'left-end' || tipPlace == 'right-end') {
            tipBottom = 0

        }
        $tooltippop.css({ 'top': tipTop, 'left': tipLeft, 'right': tipRight, 'bottom': tipBottom })

        var wordWidth = $tooltippop[0].scrollWidth;
        var outWidth = $tooltippop.outerWidth();
        if (wordWidth > outWidth) {
            $tooltippop.css({ 'width': outWidth + 'px', 'white-space': 'pre-wrap' });
        }
    })
    $('.hrp-tooltip', $context).mouseout(function () {
        closeTooltip($(this))
    })
};
// create tooltip
function openTooltip(e, cont, place) {
    $(e).append('<div class="hrp-tooltip-pop ' + place + '"><div class="hrp-tooltip-arrow"></div><div class="hrp-tooltip-inner">' + cont + '</div></div>')
};
// close tooltip
function closeTooltip(e) {
    $(e).children('.hrp-tooltip-pop').css('display', 'none')
    $(e).children('.hrp-tooltip-pop').remove()
};


// 滚动条 Scrollbar
function initScroll($context) {
    $context = $context && $context.length ? $context : $(document);
    $('.hrp-scroll', $context).each(function () {
        var oCon = $(this);
        var oBox = $(this).parent("div");
        if (oBox && oBox.height() < oCon.height()) {
            oCon.attr('id', 'hrp-scrollcon');
            oBox.attr('id', 'hrp-scrollbox');
            oBox.unwrap('#hrp-wrapall');
            $('#hrp-scroll').remove();
            oBox.wrapAll('<div id="hrp-wrapall"></div>')
            oBox.after('<div id="hrp-scroll"><div id="hrp-scrollbar"></div></div>');
        }
        var oScroll = oBox.next("#hrp-scroll");
        var oBar = oScroll.find("#hrp-scrollbar");

        //bar高度/scroll的高度 = box的高度/content的高度
        //bar高度 = box的高度*scroll的高度/content的高度
        var oBarHeight = parseInt(oBox.height() * oScroll.height() / oCon.height());
        oBar.height(oBarHeight);
        oScroll.height(oBox.height());
        // console.log("con:"+oCon.height()+",box:"+oBox.height()+",scroll:"+oScroll.height()+",bar:"+oBar.height())

        var maxBarScroll = parseInt(oScroll.height() - oBar.height());
        var maxConScroll = parseInt(oCon.height() - oBox.height());

        oBar.mousedown(function (e) {
            var cY = parseInt(e.clientY);
            var oH = parseInt($(this).css('top'));
            var spaceY = cY - oH;
            // console.log("clientY:"+cY+",top:"+oH)

            $(document).mousemove(function (e) {
                //鼠标移动时，不选中文字 
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                // var nowX = e.clientX;
                var nowY = parseInt(e.clientY);
                // var x = nowX - spaceX;
                var barScrollY = nowY - spaceY;
                // oBar.style.left = x + "px";
                //比例问题：bar的移动距离/bar的可以移动的距离 = content的移动距离 / content可以移动的距离
                //content的移动距离 = barScrollY/bar的可以移动的距离 * content可以移动的距离

                barScrollY = barScrollY < 0 ? barScrollY = 0 : barScrollY;
                barScrollY = barScrollY > maxBarScroll ? maxBarScroll : barScrollY;

                var conScrollY = barScrollY * maxConScroll / maxBarScroll;

                oBar.css('top', barScrollY);
                oBox.scrollTop(conScrollY);
            })

            $(document).mouseup(function () {
                $(document).unbind('mousemove');
            })
        })

        // box scroll
        oBox.scroll(function () {
            var sHeight = oBox.scrollTop();
            var sWidth = oBox.scrollLeft();

            sHeight = sHeight < 0 ? sHeight = 0 : sHeight;
            sHeight = sHeight > maxConScroll ? maxConScroll : sHeight;

            var bsHeight = sHeight * maxBarScroll / maxConScroll;

            oBar.css('top', bsHeight);
        })
    })
};



$(function () {

    // 菜单 Menu
    initMenu()


    // 标签页 Tabs
    initTabs()


    // 分页 Page
    initPage()


    // 输入框 Input
    initInput()


    // 开关 Switch
    initSwitch()


    // 选择器 Select
    initSelect()


    // 检索框 Autocomplete
    initAutocomplete()


    // 日期选择器 DatePicker
    initDatePicker()


    // 表单 Form
    initForm()


    // 表格 Table
    initTable()


    // 树 Tree
    initTree()


    // 文字提示 Tooltip
    initTooltip()


    // 滚动条 Scrollbar
    initScroll()

});

//回到顶部
$(function () {
    $(".totop").click(
        function () {
            $('body,html').animate({ scrollTop: 0 }, 500);
            return false;
        }
    )
});

/**
* 文本框根据输入内容自适应高度
* @param                {HTMLElement}        输入框元素
* @param                {Number}             设置光标与输入框保持的距离(默认0)
* @param                {Number}             设置最大高度(可选)
*/
function autoTextarea (elem, extra, maxHeight) {
    //判断elem是否为数组
    if (elem.length > 0) {
        for (var i = 0; i < elem.length; i++) {
            e(elem[i]);
        }
    }
    else {
        e(elem);
    }

    function e(elem) {
        extra = extra || 0;
        var addEvent = function (type, callback) {
                elem.addEventListener ?
                    elem.addEventListener(type, callback, false) :
                    elem.attachEvent('on' + type, callback);
            },
            getStyle = elem.currentStyle ? function (name) {
                var val = elem.currentStyle[name];

                if (name === 'height' && val.search(/px/i) !== 1) {
                    var rect = elem.getBoundingClientRect();
                    return rect.bottom - rect.top -
                        parseFloat(getStyle('paddingTop')) -
                        parseFloat(getStyle('paddingBottom')) + 'px';
                };

                return val;
            } : function (name) {
                return getComputedStyle(elem, null)[name];
            },
            minHeight = parseFloat(getStyle('height'));

        elem.style.resize = 'none';

        var change = function () {
            var height,
                padding = 0,
                style = elem.style;

            if (elem._length === elem.value.length) return;
            elem._length = elem.value.length;

            elem.style.height = minHeight + 'px';
            if (elem.scrollHeight > minHeight) {
                if (maxHeight && elem.scrollHeight > maxHeight) {
                    height = maxHeight - padding;
                    style.overflowY = 'auto';
                } else {
                    height = elem.scrollHeight - padding;
                    style.overflowY = 'hidden';
                };
                style.height = height + extra + 'px';
                elem.currHeight = parseInt(style.height);
            };
        };

        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        change();
    }
};
