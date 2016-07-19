
(function () {

    var jqContainer, jqEmptyTip, jqLoading,
        currentUser;

    $(document).ready(function () {
        BmobBase.init();
        checkLogin();
        init();
        currentUser = BmobBase.User.current();
                
        getAbility(currentUser).then(function (data) {
            if (data.length <= 0) {            
                jqEmptyTip.removeClass('hide');
                jqContainer.addClass('hide');
                jqLoading.addClass('hide');
            } else {
                createAbilityView(data, jqContainer);
            }
        });
    });

    function init() {
        jqContainer = $('#container');
        jqEmptyTip = $('#empty-tip');
        jqLoading = $('.spinner');
    }

    function getAbility(user) {
        var query = new Bmob.Query(BmobBase.Ability),
            promise;

        query.equalTo('owner', user);
        query.descending('time');
        promise = query.find().then(function (r) {
            return Bmob.Promise.as(r);
        }, function (error) {
            LogHelper.error('get ability', error);
            alert(ErrorHelper.translateError(error));
            return Bmob.Promise.error(error);
        });
        
        return promise;
    }

    function createAbilityView(data, jqParent) {
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

    function createItem(index, ability) {
        var e, jqEle, params;

        params = [ability.get('time').getMonth()+1, ability.get('time').getDate(), ability.get('title'),
                  ability.get('partner'), ability.get('nature'), ability.get('result'), 
                  ability.get('description'), index + 1, ability.id];
        e = $('#tp-container-item').html();
        e = stringReplace(e, params);
        jqEle = $(e);

        return $(e);
    }
    
})()