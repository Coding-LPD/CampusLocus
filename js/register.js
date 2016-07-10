
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
            alert('验证码不能为空');
            jqPassword.focus();
            return;
        }

        var user = new Bmob.User();
        user.set('username', email);
        user.set('password', password);
        user.set('email', email);

        user.signUp().then(function (user) {
            alert('注册成功');
            location.replace('modify_personal_edit.html');
        }, function (error) {
            LogHelper.error('signUp', error);
            alert(ErrorHelper.translateError(error));
            jqEmail.focus().select();
        });
    }

})()