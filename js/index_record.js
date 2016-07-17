
(function () {

    var jqMyItemContainer, jqOtherItemContainer;

    var currentUser,     
        myCurrentItems = [],  // 保存远程获取到的我的记录的最新信息
        otherCurrentItems = [],  // 保存远程获取到的他人记录的最新信息
        myLocalPage = 0,  // 本地我的记录的最新信息页数
        myLocalLimit = 3,  // 本地我的记录的每页显示的条数
        otherLocalPage = 0,  // 本地他人记录的最新信息页数
        otherLocalLimit = 3,  // 本地他人记录的每页显示的条数
        maxRemoteLimit = 10;  // 只获取一次远程数据，每个表最多获取10条数据

    $(document).ready(function () {
        BmobBase.init();
        checkLogin();
        init();
        currentUser = BmobBase.User.current();
        getMoreMyLastUpdateInfo();
        getMoreOtherLastUpdateInfo();
    });

    function init() {
        jqMyItemContainer = $('#my-item-container');
        jqOtherItemContainer = $('#other-item-container');
    }

    /**
     * 获取我的记录的最新信息
     */
    function getMoreMyLastUpdateInfo() {
        var tables = ['Ability', 'Social', 'Work'],            
            promises = [],   
            showItems = [],
            query;        
        
        // 本地数据还未显示完，则继续列出本地数据，若显示完了则获取远程数据
        if ((myLocalPage * myLocalLimit) < myCurrentItems.length) {
            showItems = myCurrentItems.slice(myLocalPage*myLocalLimit, (myLocalPage+1)*myLocalLimit);
            updateMyItemView(showItems, jqMyItemContainer);
            myLocalPage++;
            return;
        }

        for (var i=0; i<tables.length; i++) {
            query = new Bmob.Query(BmobBase[tables[i]]);
            query.equalTo('owner', BmobBase.User.createOnlyId(currentUser.id));
            query.descending('updatedAt');
            query.limit(maxRemoteLimit);
            promises.push(query.find());
        }
        Bmob.Promise.when(promises).then(function () {  
            var data = [];          
            for (var i=0; i<arguments.length; i++) {
                data = data.concat(arguments[i]);
            }
            // 获取到的数据按更新时间排序，则加入本地数据
            data = data.sort(compare('updatedAt'));
            myCurrentItems = myCurrentItems.concat(data);                        
            showItems = myCurrentItems.slice(myLocalPage*myLocalLimit, (myLocalPage+1)*myLocalLimit);
            updateMyItemView(showItems, jqMyItemContainer);
            myLocalPage++;
        });
    }

    /**
     * 获取他人记录的最新信息
     */
    function getMoreOtherLastUpdateInfo() {
        var tables = ['AbilityConsultation', 'SocialConsultation', 'WorkConsultation'],            
            promises = [],   
            showItems = [],
            query;    

        // 本地数据还未显示完，则继续列出本地数据，若显示完了则获取远程数据
        if ((otherLocalPage * otherLocalLimit) < otherCurrentItems.length) {
            showItems = otherCurrentItems.slice(otherLocalPage*otherLocalLimit, (otherLocalPage+1)*myLocalLimit);
            updateOtherItemView(showItems, jqMyItemContainer);
            otherLocalPage++;
            return;
        }

        for (var i=0; i<tables.length; i++) {
            query = new Bmob.Query(BmobBase[tables[i]]);
            query.descending('updatedAt');
            query.limit(maxRemoteLimit);
            query.include('consultant');
            query.include('replyTo');
            query.include('recordOwner');
            promises.push(query.find());
        }
        Bmob.Promise.when(promises).then(function () {  
            var data = [];          
            for (var i=0; i<arguments.length; i++) {
                data = data.concat(arguments[i]);
            }
            // 获取到的数据按更新时间排序，则加入本地数据
            data = data.sort(compare('updatedAt'));
            otherCurrentItems = otherCurrentItems.concat(data);                 
            showItems = otherCurrentItems.slice(otherLocalPage*otherLocalLimit, (otherLocalPage+1)*otherLocalLimit);
            updateOtherItemView(showItems, jqOtherItemContainer);
            otherLocalPage++;
        });
    }

    /**
     * 更新我的记录的视图
     * updateInfos: array,要更新到视图的我的记录的数据
     * jqParent: 进行更新的jquery对象
     */
    function updateMyItemView(updateInfos, jqParent) {
        var length = 0;                
        if (myLocalPage * myLocalLimit < myCurrentItems.length) {
            length = (myLocalPage + 1) * myLocalLimit;
        } else {
            length = myCurrentItems.length;
        }
        jqParent.find('#my-item-length').html(length);
        for (var i=0; i<updateInfos.length; i++) {
            jqParent.append(createMyItem(updateInfos[i]));
        }
    }

    /**
     * 更新他人记录的视图
     * updateInfos: array,要更新到视图的他人记录的数据
     * jqParent: 进行更新的jquery对象
     */
    function updateOtherItemView(updateInfos, jqParent) {
        var length = 0;
        if (otherLocalPage * otherLocalLimit < otherCurrentItems.length) {
            length = (otherLocalPage + 1) * otherLocalLimit;
        } else {
            length = otherCurrentItems.length;
        }
        jqParent.find('#other-item-length').html(length);
        for (var i=0; i<updateInfos.length; i++) {
            jqParent.append(createOtherItem(updateInfos[i]));
        }
    }

    function createMyItem(updateInfo) {
        var e;

        e = $('#tp-my-item').html();
        e = stringReplace(e, [currentUser.get('image'), currentUser.get('nickname'), updateInfo.updatedAt, updateInfo.get('title')]);

        return $(e);
    }

    function createOtherItem(updateInfo) {
        var e, consultant, helper;

        // 若为回复信息，则说明是协作关系，否则为请教关系
        if (updateInfo.get('replyTo')) {
            e = $('#tp-other-item-help').html();
            consultant = updateInfo.get('replyTo');
            helper = updateInfo.get('consultant');
        } else {
            e = $('#tp-other-item-ask').html();
            consultant = updateInfo.get('consultant');
            helper = updateInfo.get('recordOwner');
        }        
        e = stringReplace(e, [consultant.get('image'), consultant.get('nickname'), helper.get('image'), helper.get('nickname')]);

        return $(e);
    }

})()