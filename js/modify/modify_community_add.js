
(function () {

    var jqTitle, jqAssociation, jqPosition, jqDescription, jqTime, jqSubmit, jqCancel,
        currentUser;

    $(document).ready(function () {
        BmobBase.init();
        checkLogin();
        init();
        currentUser = BmobBase.User.current();
    });

    function init() {
        jqTitle = $('#community_input');
        jqAssociation = $('#community_name_input');
        jqPosition = $('#community_position_input');
        jqDescription = $('#community_details_input');
        jqTime = $();
        jqSubmit = $('#button_submit');
        jqCancel = $('#button_cancel');

        jqSubmit.click(function (e) {
            e.preventDefault();
            save();
        });
        jqCancel.click(function (e) {
            e.preventDefault();
            cancel();
        });
    }

    function save() {
        var title = jqTitle.val(),
            association = jqAssociation.val(),
            position = jqPosition.val(),
            description = jqDescription.val(),
            time = new Date();

        if (StringHelper.isEmpty(title)) {
            alert('您忘记填写活动名字了');
            jqTitle.focus();
            return;
        }
        if (StringHelper.isEmpty(association)) {
            alert('您忘记填写您的社团了');
            jqAssociation.focus();
            return;
        }    
        if (StringHelper.isEmpty(position)) {
            alert('您忘记填写您的职位了');
            jqPosition.focus();
            return;
        }    
        if (StringHelper.isEmpty(description)) {
            alert('别忘记写下您的精彩经历哦');
            jqDescription.focus();
            return;
        }      

        var owner = BmobBase.User.createOnlyId(currentUser.id),
            social = new BmobBase.Social();
            
        social.set('title', title);
        social.set('position', position);
        social.set('association', association);
        social.set('description', description);
        social.set('time', time);
        social.set('type', BmobBase.Record.Type.Social);
        social.set('owner', owner); 

        social.save().then(function (r) {
            alert('保存成功');
            location.replace('modify_community_finished.html');
        }, function (error) {
            LogHelper.error('save social', error);
            alert(ErrorHelper.translateError(error));
        });                           
    }

    function cancel() {
        var title = jqTitle.val(),
            association = jqAssociation.val(),
            position = jqPosition.val(),
            description = jqDescription.val();

        if (!StringHelper.isEmpty(title)     || !StringHelper.isEmpty(association) ||
            !StringHelper.isEmpty(position)  || !StringHelper.isEmpty(description)) {

            if (confirm('您有填写的数据，确定要取消吗？')) {
                location.replace(document.referrer);
            }
        } else {
            location.replace(document.referrer);
        }
    }

})()