
(function () {

    var jqPostContainer, jqDataTip, jqLoadMoreBtn,
        // 弹出框相关
        jqPAuthorImg, jqPRecordTime, jqPAuthorName, jqPPostTitle, jqPPostDescription,
        jqPPublishBtn, jqPCloseBtn;

    var currentUser,
        currentItems = [],  // 本地拿到的文章数据
        localPage = 0,  // 本地当前显示的页数
        localLimit = 5,  // 本地每页显示的条数 
        maxLimit = 30;  // 一次性从远处获取的文章的数量，只获取一次

    $(document).ready(function () {
        BmobBase.init();
        checkLogin();
        init();
        currentUser = BmobBase.User.current();
        initPopup();
        getMorePost();
    });

    function init() {
        jqPostContainer = $('#post-container');
        jqDataTip = $('#data-tip');
        jqLoadMoreBtn = $('.load-more');
        // 弹出框相关
        jqPAuthorImg = $('#popup-author-img');
        jqPRecordTime = $('#popup-record-time');
        jqPAuthorName = $('#popup-author-name');
        jqPPostTitle = $('#popup-post-title');
        jqPPostDescription = $('#popup-post-description');
        jqPPublishBtn = $('#popup-publish-btn');   
        jqPCloseBtn = $('#pop-up-close-btn'); 

        jqPPublishBtn.click(function (e) {
            e.preventDefault();
            savePost();
        });
        jqLoadMoreBtn.click(function (e) {
            e.preventDefault();
            getMorePost();
        });
    }

    function initPopup() {
        jqPAuthorImg.attr('src', currentUser.get('image'));
        jqPRecordTime.html(getDateString(new Date()));
        jqPAuthorName.html(currentUser.get('nickname'));
    }    

    function getMorePost() {
        DataTipHelper.showLoading(jqDataTip);

        var promises = [],
            tables = ['AbilityPost', 'SocialPost', 'WorkPost'],
            showItems = [],            
            query;

        if (currentItems.length > 0) {
            showItems = currentItems.slice(localPage * localLimit, (localPage + 1) * localLimit);    
            updatePostView(showItems, jqPostContainer);
            localPage += 1;
            if (localPage * localLimit < currentItems.length) {
                DataTipHelper.showLoadMore(jqDataTip);
            } else {
                DataTipHelper.showNoMoreData(jqDataTip);
            }   
            return;
        }

        for (var i=0; i<BmobBase.Record.TypeCount; i++) {
            query = new Bmob.Query(BmobBase[tables[i]]);
            query.equalTo('owner', BmobBase.User.createOnlyId(currentUser.id));
            query.descending('createdAt');
            query.limit(maxLimit);
            query.include('owner');
            promises.push(query.find());
        }        
        Bmob.Promise.when(promises).then(function () {
            var data = [];
            for (var i=0; i<arguments.length; i++) {
                data = data.concat(arguments[i]);             
            }
            data = data.sort(compare('createdAt'));
            currentItems = currentItems.concat(data);   
            showItems = currentItems.slice(localPage * localLimit, (localPage + 1) * localLimit);    
            updatePostView(showItems, jqPostContainer);
            localPage += 1;
            if (localPage * localLimit < currentItems.length) {
                DataTipHelper.showLoadMore(jqDataTip);
            } else {
                DataTipHelper.showNoMoreData(jqDataTip);
            }
        });
    }

    function savePost() {
        var title = jqPPostTitle.val(),
            description = jqPPostDescription.val(),
            type = +$('input[name="post-type"]:checked').val(),
            post;

        if (StringHelper.isEmpty(title)) {
            alert('您忘记填写标题了');
            jqPPostTitle.focus();
            return;
        }
        if (StringHelper.isEmpty(description)) {
            alert('您忘记写文章内容了哦');
            jqPPostDescription.focus();
            return;
        }
                
        if (type == BmobBase.Record.Type.Ability) {
            post = new BmobBase.AbilityPost();
        } else if (type == BmobBase.Record.Type.Social) {
            post = new BmobBase.SocialPost();
        } else if (type == BmobBase.Record.Type.Work) {
            post = new BmobBase.WorkPost();
        }

        post.set('title', title);
        post.set('description', description);
        post.set('type', type);
        post.set('owner', BmobBase.User.createOnlyId(currentUser.id));
        post.save().then(function (r) {
            alert('发表成功');
            location.reload();
        }, function (error) {
            LogHelper.error('save post', error);
            alert(ErrorHelper.translateError(error));
        });
    }

    function updatePostView(posts, jqParent) {
        for (var i=0; i<posts.length; i++) {
            jqParent.append(createPostItem(posts[i]));
        }
    }

    function createPostItem(post) {
        var e, time;

        time = new Date(post.createdAt);
        e = $('#tp-post-item').html();
        e = stringReplace(e, [time.getFullYear(), time.getMonth()+1, time.getDate(), post.get('title'), 
                              post.get('owner').get('nickname'), post.get('description'), 
                              BmobBase.Record.Label[+post.get('type')], 0, 0, 0]);

        return $(e);                        
    }

})()