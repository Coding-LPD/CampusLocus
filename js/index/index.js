
(function () {

    var jqRecordDataTip, jqMainPanel,
        // 侧边个人信息相关
        jqUserHeadImg, jqUserName, jqLogoutBtn,
        // 轨迹详细信息弹出框相关
        jqPRecordTime, jqPAuthorImg, jqPAuthorName, jqPRecordTitle, jqPRecordDesc, jqPRecordLabel, jqPPublishText, jqPMessageList,  
        jqPAskBtn, jqPChatBtn, jqPPraiseBtn, jqPPublishBtn,
        jqReplyDataTip, jqReplyItem, jqAnchorToPopup,
        // 顶部搜索框
        jqGuideSearchText, jqGuideSearchBtn;

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
        localPage = 0,  // 本地显示的记录页数
        localLimit = 3,  // 本地显示的每页的记录的数量
        remotePage = 0,  // 远程获取的轨迹记录的页数
        remoteLimit = 3,  // 远程获取的每页轨迹的数量 
        messagePage = 0, // 请教列表的页数
        messageLimit = 3,  // 请教列表每页的条数
        currentUser = 1, 
        recordArray = [],
        selectedRecord; // 用户选中，显示在弹出框中的轨迹记录

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
        BmobBase.init();
        init();
        initEvent();        
        currentUser = BmobBase.User.current();
        if (currentUser == null) {
            jqUserName.html('请登录');
        } else {
            setUserInfo(currentUser);
        }        
        // getMoreRecord(nowType);
        showLocalRecord();
    });

    function init() {
        jqRecordDataTip = $('#record-data-tip');    
        jqMainPanel = $('.main-panel');  
        // 侧边个人信息相关
        jqUserHeadImg = $('#user-head-img');  
        jqUserName = $('#user-name');
        jqLogoutBtn = $('#logout-btn');
        // 轨迹详细信息弹出框相关
        jqPRecordTime = $('#popup-record-time');
        jqPAuthorImg = $('#popup-author-img');
        jqPAuthorName = $('#popup-author-name');
        jqPRecordTitle = $('#popup-record-title');
        jqPRecordDesc = $('#popup-record-description');
        jqPRecordLabel = $('#popup-record-label');
        jqPPublishText = $('#popup-publish-text');
        jqPMessageList = $('#popup-message-list');
        jqPAskBtn = $('#popup-ask-btn');
        jqPChatBtn = $('#popup-chat-btn');
        jqPPraiseBtn = $('#popup-praise-btn');
        jqPPublishBtn = $('#popup-publish-btn');
        jqReplyDataTip = $('#reply-data-tip');
        jqReplyItem = $('#popup-reply-item');
        jqAnchorToPopup = $('#to-pop-up');
        // 顶部搜索框
        jqGuideSearchText = $('#guide-search');
        jqGuideSearchBtn = $('#guide-search-btn');
    }

    function initEvent() {
        // 退出当前账号
        jqLogoutBtn.click(function (e) {
            e.preventDefault();
            BmobBase.User.logout();
            location.replace('login.html');
        });
        // 类别选择
        $('.category-list li').click(function (e) {
            e.preventDefault();
            if (nowType == $(this).val()) {
                return;
            }
            nowType = $(this).val();
            localPage = 0;
            recordArray = [];
            jqMainPanel.find('.item').remove();
            // getMoreRecord(nowType);
            showLocalRecord()
        });
        // 加载轨迹的'加载更多'
        jqRecordDataTip.find('.load-more').click(function (e) {
            e.preventDefault();
            // getMoreRecord(nowType);
            showLocalRecord()
        });
        // 发表请教内容
        jqPPublishBtn.click(function (e) {
            e.preventDefault();
            saveConsultation(jqPPublishText, currentUser.id, selectedRecord);
        });
        // 请教内容框中按'回车'进行发表
        jqPPublishText.keyup(function (e) {
            if (e.keyCode == 13) {
                jqPPublishBtn.click();
            }
        });
        // 请教内容'加载更多'
        jqReplyDataTip.find('.load-more').click(function (e) {
            e.preventDefault();
            getMoreMessage(selectedRecord);
        });
        // 实现搜索框搜索
        jqGuideSearchBtn.click(function (e) {
            e.preventDefault();
            searchRecord(jqGuideSearchText);
        });
        jqGuideSearchText.keyup(function (e) {
            if (e.keyCode == 13) {
                jqGuideSearchBtn.click();
            }
        })
    }

    /**
     * 设置侧边用户个人信息
     * user: Bmob.User,提供信息的对象
     */
    function setUserInfo(user) {
        jqUserHeadImg.attr('src', user.get('image'));
        jqUserName.html(user.get('nickname'));
    }
    
    /**
     * 设置弹出框的轨迹详细信息
     * record: BmobBase.Ability | BmobBase.Social | BmobBase.Work,轨迹对象
     */
    function initPopup(record) {
        jqPRecordTime.html(getDateString(record.get('time')));
        jqPAuthorImg.attr('src', record.get('owner').get('image') || '');
        jqPAuthorName.html(record.get('owner').get('nickname'));
        jqPRecordTitle.html(record.get('title'));
        jqPRecordDesc.html(record.get('description'));
        jqPRecordLabel.html(BmobBase.Record.Label[record.get('type')]);  
        selectedRecord = record;
        messagePage = 0;
        jqPMessageList.children('.message-item').remove();
        getMoreMessage(record);
    }

    /**
     * 显示本地数据(当前策略为一次性获取远程所有数据，分页显示本地数据)
     */
    function showLocalRecord() {
        DataTipHelper.showLoading(jqRecordDataTip);

        var i, index;
        // 本地无数据则先去远程获取，一次性将数据获取完
        if (recordArray.length <= 0) {
            getMoreRecord(nowType).then(function (r) {
                showLocalRecord();
            });
        } else {            
            // 分页显示本地数据
            for (i=0; i<localLimit; i++) {
                index = localPage*localLimit+i;
                // 有数据则显示，无数据则显示加载完毕
                if (recordArray[index]) {
                    jqRecordDataTip.before(createItem(index, recordArray[index]));
                }
                else {
                    DataTipHelper.showNoMoreData(jqRecordDataTip);
                }
            }
            // 还有下一条记录则显示加载更多按钮
            if (recordArray[index+1]) {
                DataTipHelper.showLoadMore(jqRecordDataTip);
            } else {
                DataTipHelper.showNoMoreData(jqRecordDataTip);
            }
            localPage += 1;
        }
    }

    /**
     * 获取下一页轨迹记录，并在页面上显示出来
     * selectedType: 用户选中的轨迹类别
     */
    function getMoreRecord(selectedType) {
        var userQuery;
        userQuery = new Bmob.Query(BmobBase.BestRecord);
        // userQuery.limit(remoteLimit);
        // userQuery.skip(remotePage * remoteLimit);
        userQuery.descending('praise');
        // 不是'精选'类别时需要指定特定轨迹类型
        if (selectedType != 0) {
            userQuery.equalTo('type', selectedType);
        }
        // 按'赞数'排序，依次获取到用户
        return userQuery.find().then(function (data) {
            var promises = [],
                recordCount = data.length,
                owner, 
                type,
                recordQuery;

            // 并行获取这些用户的轨迹记录
            for (var j=0; j<data.length; j++) {                                              
                owner = data[j].get('owner');
                type = data[j].get('type');

                 if (type == BmobBase.Record.Type.Ability) {
                    recordQuery = new Bmob.Query(BmobBase.Ability);
                } else if (type == BmobBase.Record.Type.Work) {
                    recordQuery = new Bmob.Query(BmobBase.Work);
                } else if (type == BmobBase.Record.Type.Social) {
                    recordQuery = new Bmob.Query(BmobBase.Social);
                } else {
                    continue;
                }
                recordQuery.equalTo('owner', owner);
                recordQuery.descending('time');
                recordQuery.include('owner');
                promises.push(recordQuery.find());  
            }
            // 当所有记录获取完毕，开始生成并插入DOM
            return Bmob.Promise.when(promises).then(function () {
                var data;
                for (var i=0; i<arguments.length; i++) {
                    // recordArray[recordArray.length] = [];
                    data = arguments[i];
                    if (data.length <= 0) {
                        continue;
                    }
                    recordArray[recordArray.length] = data;
                    // // 产生新的轨迹
                    // jqRecordDataTip.before(createItem(recordArray.length-1, data));
                }
                return new Bmob.Promise.as(data);
                // // 返回的记录数量少于每页数量,则表明没有数据了
                // if (recordCount < remoteLimit) {
                //     DataTipHelper.showNoMoreData(jqRecordDataTip);
                // } else {
                //     remotePage += 1;
                //     DataTipHelper.showLoadMore(jqRecordDataTip);
                // }
            });
        });
    }

    /**
     * 获取下一页的轨迹相关请教记录
     * record: BmobBase.Ability | BmobBase.Social | BmobBase.Work,轨迹对象
     */
    function getMoreMessage(record) {
        DataTipHelper.showLoading(jqReplyDataTip);
        var type, query, pointerProperty;

        type = record.get('type');
        if (type == BmobBase.Record.Type.Ability) {
            query = new Bmob.Query(BmobBase.AbilityConsultation);
            pointerProperty = 'ability';
        } else if (type == BmobBase.Record.Type.Social) {
            query = new Bmob.Query(BmobBase.SocialConsultation);
            pointerProperty = 'social';
        } else if (type == BmobBase.Record.Type.Work) {
            query = new Bmob.Query(BmobBase.WorkConsultation);
            pointerProperty = 'work';
        } else {
            return;
        }

        query.limit(messageLimit);
        query.skip(messageLimit * messagePage);
        query.equalTo(pointerProperty, record);
        query.descending('createdAt');
        query.include('consultant');
        query.include('replyTo');
        query.find().then(function (messages) {
            console.log(messages);
            for (var i=0; i<messages.length; i++) {
                // 生成请教记录列表
                jqReplyDataTip.before(createMessageItem(messages[i]));                
            }            
            // 返回的记录数量少于每页数量,则表明没有数据了
            if (messages.length < messageLimit) {
                DataTipHelper.showNoMoreData(jqReplyDataTip);
            } else {
                messagePage += 1;
                DataTipHelper.showLoadMore(jqReplyDataTip);
            }
        }, function (error) {
            LogHelper.error('get messages', error);
            alert(ErrorHelper.translateError(error));
        });
    }

    /**
     * 保存要发表的请教的内容，并在页面上显示
     * jqText: 提供着请教内容的jquery对象
     * consultantId: 请教者id
     * record: BmobBase.Ability | BmobBase.Social | BmobBase.Work,轨迹对象
     * replyToId: 所要回复的用户的id
     * replyToName: 所要回复的用户的姓名 
     */
    function saveConsultation(jqText, consultantId, record, replyToId, replyToName) {
        var consultation, pointerProperty, type, text;
        text = jqText.val();
        if (StringHelper.isEmpty(text)) {
            alert('您忘记填写要发表的内容了');
            return;
        }
        
        type = +record.get('type');
        if (type == BmobBase.Record.Type.Ability) {
            consultation = new BmobBase.AbilityConsultation();
            pointerProperty = 'ability';
        } else if (type == BmobBase.Record.Type.Social) {
            consultation = new BmobBase.SocialConsultation();
            pointerProperty = 'social';
        } else if (type == BmobBase.Record.Type.Work) {
            consultation = new BmobBase.WorkConsultation();
            pointerProperty = 'work';
        } else {
            return;
        }
        if (replyToId) {
            consultation.set('replyTo', BmobBase.User.createOnlyId(replyToId));
        }
        consultation.set('content', text);
        consultation.set('consultant', BmobBase.User.createOnlyId(consultantId));
        consultation.set('recordOwner', selectedRecord.get('owner'));
        consultation.set(pointerProperty, record);

        consultation.save().then(function (r) {
            alert('发表成功');
            jqText.val('');
            if (r.get('replyTo')) {
                r.get('replyTo').set('nickname', replyToName);
            }            
            jqPMessageList.prepend(createMessageItem(r, currentUser));
        }, function (error) {
            LogHelper.error('save consultation', error);
            alert(ErrorHelper.translateError(error));
        });
    }

    /**
     * 搜索轨迹
     * jqKeyword: 提供搜索关键字的jquery对象
     */
    function searchRecord(jqKeyword) {
        var keyword = jqKeyword.val(),
            tables = ['Ability', 'Social', 'Work'],            
            promises = [],            
            query;

        if (StringHelper.isEmpty(keyword)) {
            alert('搜索关键词不能为空');
            jqKeyword.focus();
            return;
        }

        for (var i=0; i<tables.length; i++) {
            query = new Bmob.Query(BmobBase[tables[i]]);
            query.matches('title', new RegExp(keyword));
            promises.push(query.find());
        } 
        Bmob.Promise.when(promises).then(function () {
            console.log(arguments);
        });
    }

    function createItem(itemIndex, records) {
        var e, jqEle, owner;

        owner = records[0].get('owner');
        e = $('#tp-item').html();
        e = stringReplace(e, [owner.get('image'), owner.get('nickname'), itemIndex]);
        jqEle = $(e);
        jqEle.find('.locus').append(createTimeline(itemIndex, records));

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

    function createTimeline(itemIndex, records) {
        var e, jqEle, recordType;

        e = '<div class="timeline"></div>';
        jqEle = $(e);
        // recordArray[itemIndex][0] = records[0];
        recordType = RecordType.Up;
        jqEle.append(createBigPoint());
        jqEle.append(createHr());
        jqEle.append(createRecord(0, records[0], recordType, getRandomColor()));
        for (i=1; i<records.length; i++) {
            // recordArray[itemIndex][i] = records[i];
            diffMonth = getMonthBetween(records[i-1].get('time'), records[i].get('time'));
            if (diffMonth != 0) {
                jqEle.append(createHr());
                jqEle.append(createBigPoint());
                recordType = 1 - recordType;
            }
            jqEle.append(createHr());
            jqEle.append(createRecord(i, records[i], recordType, getRandomColor()));
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
            var itemIndex = $(this).parents('.item').attr('item-index');
                recordIndex = $(this).parent('.record').attr('record-index');
            initPopup(recordArray[+itemIndex][+recordIndex]);
            jqAnchorToPopup.click();
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

    function createRecord(recordIndex, record, recordType, colorType) {
        var e, jqEle;

        e = '#tp-record-' + records[recordType];
        e = $(e).html();
        e = stringReplace(e, [record.get('title'), record.get('description'), getDateString(record.get('time')), colors[colorType], recordIndex]);
        jqEle = $(e);
        jqEle.css('left', nowLeft - reDis / 2 + spDis / 2);
        spCount += 1;
        nowLeft += spDis;
        return jqEle;
    }

    function createMessageItem(consultation, consultant) {
        var e, jqEle, extra = '';

        consultant = consultant || consultation.get('consultant');
        if (consultation.get('replyTo')) {
            extra = ' 回复 ' + consultation.get('replyTo').get('nickname');
        }
        e = '#tp-message-item';
        e = $(e).html();
        e = stringReplace(e, [consultant.get('image'), consultant.get('nickname'), extra, consultation.get('content'), 
                              consultation.createdAt, consultant.id]);
        jqEle = $(e);        
        // '回复'某人的请教
        jqEle.find('.reply').click(function () {
            var consultantName = jqEle.find('.publisher-name').html();
            
            // 使回复框位于当前请教项下方
            jqEle.after(jqReplyItem);
            ReplyBoxHelper.show(jqReplyItem, consultantName, function (e) {
                // 点击回复框的'发表'按钮时触发的函数
                e.preventDefault();
                var text = ReplyBoxHelper.getReplyText(jqReplyItem),
                    consultantId = jqEle.find('.consultant-id').val();

                saveConsultation(ReplyBoxHelper.getJQReplyText(jqReplyItem), currentUser.id, selectedRecord, consultantId, consultantName);
            });
        });
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

    // // 将所有轨迹记录按照拥有者来分开
    // // 返回的是一个二维数组，每一个一维数组代表一个拥有者的完整轨迹
    // function categoryByUser(allRecords) {
    //     var result = [],
    //         key = {},            
    //         count = 0,
    //         ownerId;

    //     for (var i=0; i<allRecords.length; i++) {
    //         ownerId = allRecords[i].get('owner').id;
    //         if (ownerId in key) {
    //             result[key[ownerId]].push(allRecords[i]);
    //         } else {
    //             key[ownerId] = count;
    //             result[count] = [];
    //             result[count].push(allRecords[i]);
    //             count += 1;            
    //         }
    //     }
    //     return result;
    // }

})()