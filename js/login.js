
(function () {

    var jqEmail, jqPassword, jqLoginBtn, jqAutoLogin, jqResetPassword,
        loginPromise;

    $(document).ready(function () {
        BmobBase.init();
        if (isAutoLogin()) {
            location.replace('#');
        }
        init();
    });

    function init() {
        jqEmail = $('#username'),
        jqPassword = $('#password'),
        jqLoginBtn = $('#login-btn');  //
        jqAutoLogin = $('#auto-login'); //
        jqResetPassword = $('#reset-password') //        

        jqLoginBtn.click(function (e) {
            e.preventDefault();
            login();
        });
        jqResetPassword.click(function (e) {
            e.preventDefault();
            resetPassword();
        });
    }

    function login() {
        var email = jqEmail.val(),
            password = jqPassword.val(),
            autoLogin = jqAutoLogin.is(':checked');

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

        // 防止重复请求
        if (AjaxHelper.isRequesting(loginPromise)) {
            return;
        }

        loginPromise = Bmob.User.logIn(email, password);
        loginPromise.then(function (user) {
            alert('登录成功');
            loginPromise = null;
            localStorage.setItem('AutoLogin', autoLogin);
            location.replace('index.html');
        }, function (error) {
            LogHelper.error('login', error);
            alert(ErrorHelper.translateError(error));
            loginPromise = null;
            jqEmail.focus().select();
        });
    }

    function resetPassword() {
        var email = jqEmail.val();
        if (StringHelper.isEmpty(email)) {
            alert('邮箱不能为空');
            jqEmail.focus();
            return;
        }

        Bmob.User.requestPasswordReset(email).then(function (r) {
            if (r.msg === 'ok') {
                alert('邮件发送成功，请耐心等待...');
                jqPassword.focus();
            }
        }, function (error) {
            LogHelper.error('resetPassword', error);
            alert(ErrorHelper.translateError(error));
        });
    }

})();