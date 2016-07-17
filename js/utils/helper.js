
/**
 * 字符串辅助类
 */
function StringHelper() {}

StringHelper.isEmpty = function (str) {
    if (!str) return true;
    var re = new RegExp('^[ ]*$');    
    return re.test(str);
};

/**
 * 记录辅助类
 * @param a: a
 */
function LogHelper() {}

LogHelper.error = function (desc, error) {
    console.log('(' + desc + ')Error: ' + error.code + ', msg: ' + error.message);
};

/**
 * 错误辅助类
 */
function ErrorHelper() {}

ErrorHelper.translateError = function(error) {
    var result = '未知错误';
    if (!error.code) result = '错误码不存在，转换失败';

    switch (error.code) {
        case 101:
            result = '邮箱或密码错误';
            break;
        case 202:
            result = '该邮箱已被注册';
            break;
    }

    return result; 
};

/**
 * ajax请求辅助类
 */
function AjaxHelper() {}

AjaxHelper.isRequesting = function (promise) {
    if (promise) {
        return true;
    }
    return false;
};

/**
 * 数据提示框辅助类
 */
function DataTipHelper() {}

DataTipHelper.showLoadMore = function(jqEle) {
    jqEle.find('.load-more').removeClass('hide');
    jqEle.find('.no-more-data-tip').addClass('hide');
    jqEle.find('.spinner').addClass('hide');
};

DataTipHelper.showNoMoreData = function (jqEle) {
    jqEle.find('.load-more').addClass('hide');
    jqEle.find('.no-more-data-tip').removeClass('hide');
    jqEle.find('.spinner').addClass('hide');
};

DataTipHelper.showLoading = function (jqEle) {
    jqEle.find('.load-more').addClass('hide');
    jqEle.find('.no-more-data-tip').addClass('hide');
    jqEle.find('.spinner').removeClass('hide');
}

/**
 * 回复信息框辅助类
 */
function ReplyBoxHelper() {}

ReplyBoxHelper.show = function (jqEle, replyTo, publishBtnClick) {
    jqEle.removeClass('hide');        
    jqEle.find('#reply-text').attr('placeholder', '回复' + replyTo).focus();
    jqEle.find('#publish-btn').click(publishBtnClick)
};

ReplyBoxHelper.hide = function (jqEle) {
    jqEle.addClass('hide');
};

ReplyBoxHelper.getReplyText = function (jqEle) {
    return jqEle.find('#reply-text').val();
};

ReplyBoxHelper.getJQReplyText = function (jqEle) {
    return jqEle.find('#reply-text');
}

/** public function **/

/**
 * 判断是否有用户登录
 */
function isLogin() {
    var user = Bmob.User.current();
    if (user) {
        return true;
    } else {
        return false;
    }
}

/**
 * 检查登录状况，进行相应跳转
 */
function checkLogin() {
    if (!isLogin()) {
        location.href = 'login.html';
    }
}

/**
 * 判断是否可以自动登录
 */
function isAutoLogin() {
    // 有勾选自动登录，并且登录信息还有保存着，则可以自动登录
    if (localStorage.getItem('AutoLogin') === 'true' && isLogin()) {
        return true;
    }
    return false;
}

/**
 * 对一个jquery元素的内容进行滚动
 * 内容有滚动则返回true，
 * 内容无滚动则返回false
 */
function scrollContent(jqEle, step) {
    var last = jqEle.scrollLeft();
    jqEle.scrollLeft(jqEle.scrollLeft() + step);
    // 比较滚动之后，scrollLeft是否值相同，相同表示无滚动，不相同表示有滚动
    if (last == jqEle.scrollLeft()) {
        return false;
    } else {
        return true;
    }
}

/**
 * 获取两个时间点相差的月份数
 * start: Date或string
 *   end: Date或string
 * 附: string类型必须符合'yyyy-MM-dd'格式
 */
function getMonthBetween(start, end) {
    var startDate = start, 
        endDate = end;
    
    if (!(start instanceof Date)) {
        startDate = new Date(start);
    }
    if (!(end instanceof Date)) {
        endDate = new Date(end);
    }
    return endDate.getMonth() - startDate.getMonth();
}

function getYearBetween(start, end) {
    var startDate = start, 
        endDate = end;
    
    if (!(start instanceof Date)) {
        startDate = new Date(start);
    }
    if (!(end instanceof Date)) {
        endDate = new Date(end);
    }
    return endDate.getFullYear() - startDate.getFullYear();
}

// 获取日期的yyyy-MM-dd格式
function getDateString(date) {
    var result = '', year, month, day;
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    year = date.getFullYear();
    month = date.getMonth();
    day = date.getDate();
    if (month > 0 && month < 10) {
        month += 1;
        month = '0' + month;
    }
    if (day > 0 && day < 10) {
        day = '0' + day;
    }
    result = year + '-' + month + '-' + day;
    return result;
}

/**
 * 字符串格式化
 *    str: 字符串   要格式化的字符串
 * params: 数组     要代入的参数数组,params[0]替换字符串中的{0},依次类推
 */
function stringReplace(str, params) {
    var i, reg;
    
    for (i=0; i<params.length; i++) {        
        reg = new RegExp('\\{' + i + '\\}', 'g');
        str = str.replace(reg, params[i]);
    }
    return str;
}

/**
 * 产生指定范围内的一个随机整数
 * min: 随机数最小值
 * max: 随机数最大值
 */
function getRandomNum(min,max) {   
    var range = max - min;   
    var rand = Math.random();   
    return(min + Math.round(rand * range));   
} 

/**
 * 将本地图片地址转换为url
 */
function convertImagePath(file) {
    if(file.size > 1024 * 1024 * 2) {
        alert('图片大小不能超过 2MB!');
        return false;
    }
    var URL = window.URL || window.webkitURL;
    var imgURL = URL.createObjectURL(file);
    return imgURL;
}

/**
 * 获取文件名的后缀(包括'.')
 */
function getFileExtension(filename) {
    var lastDot = filename.lastIndexOf('.');
    return filename.slice(lastDot);
}

function compare(property) {
    return function (object1, object2) {
        var value1 = object1[property],
            value2 = object2[property];

        if (value1 > value2) {
            return -1;
        } else if (value1 < value2) {
            return 1;
        } else {
            return 0;
        }
    }
}