
(function () {

    var jqContainer, jqEmptyTip, jqLoading,
        currentUser;

    $(document).ready(function () {
        BmobBase.init();
        checkLogin();
        init();
        currentUser = BmobBase.User.current();

        getSocial(currentUser).then(function (data) {
            if (data.length <= 0) {            
                jqEmptyTip.removeClass('hide');
                jqContainer.addClass('hide');
                jqLoading.addClass('hide');
            } else {
                createSocialView(data, jqContainer)
            }
        });
    }); 

    function init() {
        jqContainer = $('#container');
        jqEmptyTip = $('#empty-tip');
        jqLoading = $('.spinner');
    }

    function getSocial(user) {
        var query = new Bmob.Query(BmobBase.Social),
            promise;

        query.equalTo('owner', user);
        query.descending('time');
        promise = query.find().then(function (r) {
            return Bmob.Promise.as(r);
        }, function (error) {
            LogHelper.error('get social', error);
            alert(ErrorHelper.translateError(error));
            return Bmob.Promise.error(error);
        });
        
        return promise;
    }

    function createSocialView(data, jqParent) {
        var item, container, lastTime, diffYear = 1;

        for (var i=0; i<data.length; i++) {
            data[i].set('time', new Date(data[i].get('time')));
            if (lastTime) {
                diffYear = getYearBetween(lastTime, data[i].get('time'));
            }
            // 若与上一个记录不在同一年份，则新建
            if (diffYear != 0) {
                container = createContainer(data[i].get('time').getFullYear());
            }
            item = createItem(i, data[i]);
            container.append(item);
            jqParent.append(container);
            lastTime = data[i].get('time');
        }
        jqLoading.addClass('hide');
    }

    function createContainer(year) {
        var e;

        e = $('#tp-container').html();
        e = stringReplace(e, [year]);

        return $(e);
    }

    function createItem(index, social) {
        var e, params;

        params = [social.get('time').getMonth()+1, social.get('time').getDate(), social.get('title'),
                  social.get('association'), social.get('position'), social.get('description'),
                  index + 1, social.id, social.get('time').getFullYear()];
        e = $('#tp-container-item').html();
        e = stringReplace(e, params);

        return $(e);
    }
})()