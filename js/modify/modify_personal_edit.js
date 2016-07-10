
(function () {

    var jqLocusid, jqNickname, jqPassword, jqPasswordconfirm, jqGender, jqAge, jqPhone,
        jqEmail, jqSchool, jqAcademy, jqMajor, jqHobby, jqSubmit, jqCancel, jqHeadImg,
        jqResetPassword,
        currentUser;

    $(document).ready(function () {     
        BmobBase.init();
        checkLogin();
        init();
        // bmob缓存的user不包含email等系统默认字段，必须先获取user信息才可以
        getUserInfo().then(function (user) {
            currentUser = user;
            setUserInfo(user);
        });
    });

    function init() {
        jqLocusid = $('#locusid');
        jqNickname = $('#username_input');
        jqGender = $('input[name="usersex"]:checked');
        jqAge = $('#userage_input');
        jqPhone = $('#usermobile_input');
        jqEmail = $('#useremail');
        jqSchool = $('#usercollege_input');
        jqAcademy = $('#userschool_input');
        jqMajor = $('#usermajor_input');
        jqHobby = $('#userhobby_input');
        jqSubmit = $('#button_submit');
        jqCancel = $('#button_cancel');
        jqHeadImg = $('#head_image');
        jqResetPassword = $('#reset_password');

        jqSubmit.click(function (e) {
            e.preventDefault();
            save();
        });
        
        jqCancel.click(function (e) {
            e.preventDefault();
            cancelEdit();
        });

        jqResetPassword.click(function (e) {
            e.preventDefault();
            if (confirm('是否确认重置密码？确认则将发送一封重置密码的邮件')) {
                resetPassword();
            }
        })
    }

    function getUserInfo() {
        var user = Bmob.User.current(),
            query = new Bmob.Query(Bmob.User),
            promise;

        promise = query.get(user.id).then(function (data) {
            return Bmob.Promise.as(data);
        });
        return promise;
    }

    function setUserInfo(user) {
        jqLocusid.html(user.id);
        jqNickname.val(user.get('nickname'));
        $('input[name="usersex"][value="' + user.get('gender') + '"]').attr('checked', true);
        jqAge.val(user.get('age'));
        jqPhone.val(user.get('phone'));
        jqEmail.html(user.get('email'));
        jqSchool.val(user.get('school'));
        jqAcademy.val(user.get('academy'));
        jqMajor.val(user.get('major'));
        jqHobby.val(user.get('hobby'));      
        jqHeadImg.attr('src', user.get('image'));  
    }

    function save() {
        jqGender = $('input[name="usersex"]:checked');

        var nickname = jqNickname.val(),
            gender = jqGender.val(),
            age = jqAge.val(),
            phone = jqPhone.val(),
            school = jqSchool.val(),
            academy = jqAcademy.val(),
            major = jqMajor.val(),
            hobby = jqHobby.val();        

        if (StringHelper.isEmpty(nickname)) {
            alert('姓名不能为空');
            return;
        }

        currentUser.set('nickname', nickname);
        currentUser.set('gender', gender);
        currentUser.set('age', +age);
        currentUser.set('phone', phone);
        currentUser.set('school', school);
        currentUser.set('academy', academy);
        currentUser.set('major', major);
        currentUser.set('hobby', hobby); 

        // 先上传图片，才能获取用户头像的url，之后再保存用户信息
        uploadImage(currentUser.get('email')).then(function (r) {
            if (r.url) {
                currentUser.set('image', r.url());
            }
            currentUser.save().then(function (r) {
                alert('保存成功');
                location.href = 'modify_personal.html';
            }, function (error) {
                LogHelper.error('save user', error);
                alert(ErrorHelper.translateError(error));        
            });
        });      
    }

    function cancelEdit() {
        location.href = 'modify_personal.html';
    }

    function uploadImage(filename) {
        var fileUploadControl = $("#button_file_personal")[0],
            promise;

        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = filename + getFileExtension(file.name);
            var file = new Bmob.File2(name, file);     
            promise = file.save();
        } else {
            promise = Bmob.Promise.as({});
        }
        return promise;
    }

    function resetPassword() {
        Bmob.User.requestPasswordReset(currentUser.get('email')).then(function () {
            alert('重设密码的邮件发送成功，请耐心等候');
        }, function (error) {
            LogHelper.error('reset password', error);
            alert(ErrorHelper.translateError(error));  
        });
    }

})()