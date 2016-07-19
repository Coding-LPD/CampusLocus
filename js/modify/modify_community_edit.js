
(function () {

    var jqTitle, jqAssociation, jqPosition, jqDescription, jqTime, jqSubmit, jqCancel,
        editItem,
        currentUser;

    $(document).ready(function () {
        BmobBase.init();
        checkLogin();
        init();
        currentUser = BmobBase.User.current();
        var id = queryString('id');
        getData(id);
    });

    function init() {
        jqTitle = $('#community_input');
        jqAssociation = $('#community_name_input');
        jqPosition = $('#community_position_input');
        jqDescription = $('#community_details_input');
        jqTime = $('#date_select');
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

    function getData(id) {
        var query = new Bmob.Query(BmobBase.Social);

        query.get(id).then(function (r) {            
            jqTitle.val(r.get('title'));
            jqAssociation.val(r.get('association'));
            jqPosition.val(r.get('position'));
            jqDescription.val(r.get('description'));
            jqTime.val(getDateString(r.get('time')));
            jqTime.change();
            editItem = r;
        });
    }

    function save() {
        var title = jqTitle.val(),
            association = jqAssociation.val(),
            position = jqPosition.val(),
            description = jqDescription.val(),
            time = jqTime.val() || new Date().toString();

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
            
        editItem.set('title', title);
        editItem.set('position', position);
        editItem.set('association', association);
        editItem.set('description', description);
        editItem.set('time', new Date(time));

        editItem.save().then(function (r) {
            alert('修改成功');
            location.replace('modify_community.html');
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

        if (title === editItem.get('title')       && association === editItem.get('association') &&
            position === editItem.get('position') && description === editItem.get('description')) {
            location.replace(document.referrer);
        } else {
            if (confirm('数据有修改，确定要取消吗？')) {
                location.replace(document.referrer);
            }
        }
    }

})()