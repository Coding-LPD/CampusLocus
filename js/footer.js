
(function () {
    
    var jqFeedbackTitle, jqFeedbackContent, jqFeedbackSubmitBtn,
        currentUser;

    $(document).ready(function () {
        BmobBase.init();
        init();
        currentUser = BmobBase.User.current();
    });

    function init() {
        jqFeedbackTitle = $('#feedback-title');
        jqFeedbackContent = $('#feedback-content');
        jqFeedbackSubmitBtn = $('#feedback-submit-btn');

        // 提交反馈内容
        jqFeedbackSubmitBtn.click(function (e) {
            e.preventDefault();
            if (currentUser == null) {
                alert('只有登录了才能进行反馈哦');
                return;
            }
            saveFeedback(jqFeedbackTitle, jqFeedbackContent, currentUser.id);
        });
    }

    /**
     * 保存用户提交的反馈
     * jqTitle: 提供标题的jquery对象
     * jqContent: 提供内容的jquery对象
     * userId: 提交反馈的用户id
     */
    function saveFeedback(jqTitle, jqContent, userId) {
        var title = jqTitle.val(),
            content = jqContent.val(),
            feedback;

        if (StringHelper.isEmpty(title)) {
            alert('您忘记填写标题了');
            jqTitle.focus();
            return;
        }
        if (StringHelper.isEmpty(content)) {
            alert('您忘记填写反馈内容了');
            jqContent.focus();
            return;
        }           

        feedback = new BmobBase.Feedback();
        feedback.set('owner', BmobBase.User.createOnlyId(userId));
        feedback.set('title', title);
        feedback.set('content', content);

        feedback.save().then(function (r) {
            alert('感谢您的意见，我们会尽力做得更好的！');
            jqTitle.val('');
            jqContent.val('');
        }, function (error) {
            LogHelper.error('save feedback', error);
            alert(ErrorHelper.translateError(error));
        });
    }
})()