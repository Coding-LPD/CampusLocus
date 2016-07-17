
(function () {

    var jqContainer,
        currentUser;

    $(document).ready(function () {
        BmobBase.init();
        checkLogin();
        init();
        currentUser = BmobBase.User.current();
        getWork(currentUser).then(function (data) {
            createWorkView(data, jqContainer);
        });
    });

    function init() {
        jqContainer = $('#container');
    }

    function getWork(user) {
        var query = new Bmob.Query(BmobBase.Work),
            promise;

        query.equalTo('owner', user);
        query.descending('time');
        promise = query.find().then(function (r) {
            return Bmob.Promise.as(r);
        }, function (error) {
            LogHelper.error('get work', error);
            alert(ErrorHelper.translateError(error));
            return Bmob.Promise.error(error);
        });
        
        return promise;
    }

    function createWorkView(data, jqParent) {
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
    }

    function createContainer(year) {
        var e;

        e = $('#tp-container').html();
        e = stringReplace(e, [year]);

        return $(e);
    }

    function createItem(index, work) {
        var e, params;

        params = [work.get('time').getMonth()+1, work.get('time').getDate(), work.get('title'),
                  work.get('company'), work.get('description'), index + 1];                  
        e = $('#tp-container-item').html();
        e = stringReplace(e, params);

        return $(e);
    }

})()