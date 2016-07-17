
(function () {

    var jqEmail, jqPassword, jqRegisterBtn,
        smsId;

    $(document).ready(function () {
        BmobBase.init();
        // if (isAutoLogin()) {
        //     location.replace('#');
        // }
        init();
    });

    function init() {
        jqEmail = $('#mobilenumber');
        jqPassword = $('#verification');
        jqRegisterBtn = $('#register-btn'); //

        jqRegisterBtn.click(function (e) {
            e.preventDefault();
            register();
        });
    }

    function register() {
        var email = jqEmail.val(),
            password = jqPassword.val();

        if (StringHelper.isEmpty(email)) {
            alert('邮箱不能为空');
            jqEmail.focus();
            return;
        }
        if (StringHelper.isEmpty(password)) {
            alert('密码不能为空');
            jqPassword.focus();
            return;
        }

        var user = new Bmob.User();
        user.set('username', email);
        user.set('password', password);
        user.set('email', email);

        user.signUp().then(function (r) {
            createBestRecord(r).then(function (r) {
                alert('注册成功');
                location.replace('modify_personal_edit.html');
            }, function (error) {
                LogHelper.error('create best record', error);
                alert(ErrorHelper.translateError(error));
            });
        }, function (error) {
            LogHelper.error('sign up', error);
            alert(ErrorHelper.translateError(error));
            jqEmail.focus().select();
        });
    }

    function createBestRecord(user) {
        var promises = [],
            owner = BmobBase.User.createOnlyId(user.id),
            bestRecord;
            
        for (var i=0; i<BmobBase.Record.TypeCount; i++) {
            bestRecord = new BmobBase.BestRecord();
            bestRecord.set('type', i+1);
            bestRecord.set('owner', owner);
            bestRecord.set('praise', 0);
            promises.push(bestRecord.save());
        }
        return Bmob.Promise.when(promises);
    }

})()