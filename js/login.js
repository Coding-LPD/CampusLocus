
(function () {

    var jqAccount, jqPassword, jqLoginBtn;

    $(document).ready(function () {

        jqAccount = $('#username'),
        jqPassword = $('#password'),
        jqLoginBtn = $('#login-btn');        

        Bmob.initialize(BmobBase.ApplicationId, BmobBase.RestAPIKey);

    });

    function login() {
        var account = jqAccount.val(),
            password = jqPassword.val();

        if (StringHelper.IsEmpty(account)) {
            alert('账号不能为空');
            return;
        }
        if (StringHelper.IsEmpty(password)) {
            alert('密码不能为空');
            return;
        }      

        Bmob.User.logIn(account, password, {
            success: function(user) {
                console.log(user);
            },
            error: function(user, error) {
                console.log(user, error);
            }
        });
    }

})();