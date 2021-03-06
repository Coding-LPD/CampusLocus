
(function () {

    var jqTitle, jqCompany, jqTime, jqDescription, jqSubmit, jqCancel,
        currentUser;

    $(document).ready(function () {
        BmobBase.init();
        checkLogin();        
        init();
        currentUser = BmobBase.User.current();
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

        var owner = BmobBase.User.createOnlyId(currentUser.id),
            work = new BmobBase.Work();
            
        work.set('title', title);
        work.set('company', company);
        work.set('description', description);
        work.set('time', new Date(time));
        work.set('type', BmobBase.Record.Type.Work);
        work.set('owner', owner);

        work.save().then(function (r) {
            alert('保存成功');
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

        if (!StringHelper.isEmpty(position)     || !StringHelper.isEmpty(company) ||
            !StringHelper.isEmpty(description)) {

            if (confirm('您有填写的数据，确定要取消吗？')) {
                location.replace(document.referrer);
            }
        } else {
            location.replace(document.referrer);
        }
    }

})()