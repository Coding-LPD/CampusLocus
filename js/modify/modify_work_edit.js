
(function () {

    var jqTitle, jqCompany, jqTime, jqDescription, jqSubmit, jqCancel,
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
        jqTitle = $('#work_input');
        jqCompany = $('#work_company_input');
        jqTime = $('#date_select');
        jqDescription = $('#work_details_input');
        jqSubmit = $('#button_submit');
        jqCancel = $('#button_cancel');

        jqSubmit.click(function (e) {
            e.preventDefault()
            save();
        });
        jqCancel.click(function (e) {
            e.preventDefault();
            cancel();
        })
    }

    function getData(id) {
        var query = new Bmob.Query(BmobBase.Work);

        query.get(id).then(function (r) {            
            jqTitle.val(r.get('title'));
            jqCompany.val(r.get('company'));
            jqDescription.val(r.get('description'));
            jqTime.val(getDateString(r.get('time')));
            jqTime.change();
            editItem = r;
        });
    }

    function save() {
        var title = jqTitle.val(),
            company = jqCompany.val(),
            time = jqTime.val() || new Date().toString(),
            description = jqDescription.val();

        if (StringHelper.isEmpty(title)) {
            alert('您忘记填写职位了');
            jqTitle.focus();
            return;
        }
        if (StringHelper.isEmpty(company)) {
            alert('您忘记填写公司名了');
            jqCompany.focus();
            return;
        }
        if (StringHelper.isEmpty(description)) {
            alert('别忘记写下您经历的点点滴滴哦');
            jqDescription.focus();
            return;
        }
            
        editItem.set('title', title);
        editItem.set('company', company);
        editItem.set('description', description);
        editItem.set('time', new Date(time));

        editItem.save().then(function (r) {
            alert('修改成功');
            location.replace('modify_work.html');
        }, function (error) {
            LogHelper.error('save work', error);
            alert(ErrorHelper.translateError(error));
        });
    }

    function cancel() {
        var position = jqTitle.val(),
            company = jqCompany.val(),
            description = jqDescription.val();

        if (position === editItem.get('position') && company === editItem.get('company') &&
            description === editItem.get('description')) {
            location.replace(document.referrer);
        } else {
            if (confirm('您有填写的数据，确定要取消吗？')) {
                location.replace(document.referrer);
            }
        }
    }

})()