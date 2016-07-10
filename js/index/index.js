
(function () {

    var jqRecordDataTip;

    var step = 50,  //轨迹前进/后退速度
        bpCount = 0,  // big-point个数
        spCount = 0,  // small-point个数
        hrCount = 0,  // hr个数
        bpDis = 16, // big-point占的像素
        spDis = 10, // small-point占的像素
        hrDis = 78, // hr占的像素
        reDis = 80, // record占的像素
        bpHrDiff = 10, // big-point与hr直接相隔的距离
        nowLeft = 0, // timeline中新元素起始位置
        nowType = 0, // 当前选中的轨迹类别
        recordPage = 0,  // 当前轨迹记录的页数
        recordLimit = 10;  // 轨迹记录每页的条数

    // 枚举类型
    var RecordType = {
            Up: 0,
            Down: 1
        },
        ColorType = {
            Purple: 0,
            Blue: 1,
            Orange: 2,
            Green: 3,
            Cyan: 4
        },
        records = ['up', 'down'],
        colors = ['purple', 'blue', 'orange', 'green', 'cyan'],
        lastColors = [-1, -1];  //防止相邻三个颜色相同

    $(document).ready(function () {
        var i,
            diffMonth,
            records1 = [
            {
                time: '2016-01-01',
                title: '春之歌',
                description: '春之歌让我受益匪浅！春之歌让我受益匪浅！春之歌让我受益匪浅！春之歌让我受益匪浅！春之歌让我受益匪浅！'
            },
            {
                time: '2016-01-15',
                title: '夏之歌',
                description: '夏之歌让我受益匪浅！夏之歌让我受益匪浅！夏之歌让我受益匪浅！夏之歌让我受益匪浅！夏之歌让我受益匪浅！'
            },
            {
                time: '2016-03-15',
                title: '秋之歌',
                description: '秋之歌让我受益匪浅！秋之歌让我受益匪浅！秋之歌让我受益匪浅！秋之歌让我受益匪浅！秋之歌让我受益匪浅！'
            },
            {
                time: '2016-04-15',
                title: '冬之歌',
                description: '冬之歌让我受益匪浅！冬之歌让我受益匪浅！冬之歌让我受益匪浅！冬之歌让我受益匪浅！冬之歌让我受益匪浅！'
            }],
            records2 = [
            {
                time: '2016-03-01',
                title: '春之歌',
                description: '春之歌让我受益匪浅！春之歌让我受益匪浅！春之歌让我受益匪浅！春之歌让我受益匪浅！春之歌让我受益匪浅！'
            },
            {
                time: '2016-04-15',
                title: '夏之歌',
                description: '夏之歌让我受益匪浅！夏之歌让我受益匪浅！夏之歌让我受益匪浅！夏之歌让我受益匪浅！夏之歌让我受益匪浅！'
            },
            {
                time: '2016-04-15',
                title: '秋之歌',
                description: '秋之歌让我受益匪浅！秋之歌让我受益匪浅！秋之歌让我受益匪浅！秋之歌让我受益匪浅！秋之歌让我受益匪浅！'
            },
            {
                time: '2016-05-15',
                title: '冬之歌',
                description: '冬之歌让我受益匪浅！冬之歌让我受益匪浅！冬之歌让我受益匪浅！冬之歌让我受益匪浅！冬之歌让我受益匪浅！'
            }];

        BmobBase.init();
        init();
        initEvent();        
        // getMoreRecord(nowType);
        jqRecordDataTip.before(createItem(records1));
        jqRecordDataTip.before(createItem(records2));
    });

    function init() {
        jqRecordDataTip = $('#record-data-tip');        
    }

    function initEvent() {
        // 类别选择
        $('.category-list li').click(function (e) {
            e.preventDefault();
            nowType = $(this).val();
            recordPage = 0;
            getMoreRecord(nowType);
        });
    }

    function getMoreRecord(type) {
        var query;
        if (type == 1) {
            query = new Bmob.Query(BmobBase.Ability);
        } else if (type == 2) {
            query = new Bmob.Query(BmobBase.Social);
        } else if (type == 3) {
            query = new Bmob.Query(BmobBase.Work);
        } else {
            return;
        }

        query.limit(recordLimit);
        query.skip(recordPage * recordLimit);
        query.find().then(function (r) {
            if (r.length == 0) {
                DataTipHelper.showNoMoreData(jqRecordDataTip);
                return;
            }

            // 产生新的轨迹

        }, function (e) {
            LogHelper.error('login', error);
            alert(ErrorHelper.translateError(error));
        });
    }

    function createItem(records) {
        var e, jqEle;

        e = $('#tp-item').html();
        e = stringReplace(e, ['木子李']);
        jqEle = $(e);
        jqEle.find('.locus').append(createTimeline(records));

        // 轨迹前进/后退效果
        jqEle.find('.foreward-btn').click(function () {
            scrollElement($(this).siblings('.timeline'), step);
        });
        jqEle.find('.backward-btn').click(function () {
            scrollElement($(this).siblings('.timeline'), -step);
        });

        nowLeft = 0;

        return jqEle;
    }

    function createTimeline(records) {
        var e, jqEle, recordType;

        e = '<div class="timeline"></div>';
        jqEle = $(e);
        recordType = RecordType.Up;
        jqEle.append(createBigPoint());
        jqEle.append(createHr());
        jqEle.append(createRecord(records[0], recordType, getRandomColor()));
        for (i=1; i<records.length; i++) {
            diffMonth = getMonthBetween(records[i-1].time, records[i].time);
            if (diffMonth != 0) {
                jqEle.append(createHr());
                jqEle.append(createBigPoint());
                recordType = 1 - recordType;
            }
            jqEle.append(createHr());
            jqEle.append(createRecord(records[i], recordType, getRandomColor()));
        }
        jqEle.append(createHr());
        jqEle.append(createBigPoint());

        // 显示/隐藏轨迹记录摘要
        jqEle.find('.record-up .record-brief').mouseenter(function () {
            expandRecordDescription($(this), RecordType.Up);
        }).mouseleave(function () {
            foldRecordDescription($(this), RecordType.Up);
        });
        jqEle.find('.record-down .record-brief').mouseenter(function () {
            expandRecordDescription($(this), RecordType.Down);
        }).mouseleave(function () {
            foldRecordDescription($(this), RecordType.Down);
        });
        // 点击轨迹查看详细
        jqEle.find('.record-brief').click(function () {
            $('.pop-up-cover').show();
            $('.pop-up').animate({opacity: 'show', height: 'show'});
        });

        return jqEle;
    }

    function createBigPoint() {
        var e, jqEle;

        e = '<div class="big-point  v-center"></div>';
        jqEle = $(e);
        if (bpCount >= 1) {
            nowLeft += bpHrDiff;
        }
        jqEle.css('left', nowLeft);
        bpCount += 1;
        nowLeft += bpDis + bpHrDiff;
        return jqEle;
    }

    function createHr() {
        var e, jqEle;

        e = '<hr class="v-center" />';
        jqEle = $(e);
        jqEle.css('left', nowLeft);
        hrCount += 1;
        nowLeft += hrDis;
        return jqEle;
    }

    function createRecord(record, recordType, colorType) {
        var e, jqEle;

        e = '#tp-record-' + records[recordType];
        e = $(e).html();
        e = stringReplace(e, [record.title, record.description, record.time, colors[colorType]]);
        jqEle = $(e);
        jqEle.css('left', nowLeft - reDis / 2 + spDis / 2);
        spCount += 1;
        nowLeft += spDis;
        return jqEle;
    }

    /**
     * 滚动jquery元素的内容
     */
    function scrollElement(jqEle, step) {
        if (!scrollContent(jqEle, step)) {
            alert('已经到尽头啦');
        }
    }

    function expandRecordDescription(jqEle, recordType) {
        if (recordType == RecordType.Up) {
            jqEle.children('.record-description').animate({ width: 'show' });
            jqEle.width('400px');
        } else {
            jqEle.children('.record-description').animate({ width: 'show', left: 'show' });
        }
        jqEle.children('.record-title').addClass('hide');
        jqEle.children('.touch-img').removeClass('hide');
    }

    function foldRecordDescription(jqEle, recordType) {
        if (recordType == RecordType.Up) {
            jqEle.width('80px');
        }
        jqEle.children('.record-description').hide();
        jqEle.children('.record-title').removeClass('hide');
        jqEle.children('.touch-img').addClass('hide');
    }

    /**
     * 产生一种随机的颜色索引
     */
    function getRandomColor() {
        var min = 0,
            max = colors.length - 1,
            r;

        do {
            r = getRandomNum(min, max);
        } while (r == lastColors[0] || r == lastColors[1])
        lastColors[0] = lastColors[1];
        lastColors[1] = r;

        return r;        
    }

})()