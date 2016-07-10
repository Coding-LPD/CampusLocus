
(function () {

    var jqLocusid, jqNickname, jqPassword, jqPasswordconfirm, jqGender, jqAge, jqPhone,
        jqEmail, jqSchool, jqAcademy, jqMajor, jqHobby, jqSubmit, jqCancel, jqHeadImg;

    $(document).ready(function () {     
        BmobBase.init();
        checkLogin();  
        init();
        getUserInfo().then(function (user) {
            setUserInfo(user);
        });
    });

    function init() {
        jqLocusid = $('#locusid');
        jqNickname = $('#username');
        jqGender = $('#usersex')
        jqAge = $('#userage');
        jqPhone = $('#usermobile');
        jqEmail = $('#useremail');
        jqSchool = $('#usercollege');
        jqAcademy = $('#userschool');
        jqMajor = $('#usermajor');
        jqHobby = $('#userhobby');
        jqSubmit = $('#submit');
        jqCancel = $('#cancel');
        jqHeadImg = $('#head_image');
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
        var noValue = '未填',
            id = user.id || noValue,
            nickname = user.get('nickname') || noValue,
            age = user.get('age') || noValue,
            gender = user.get('gender'),
            phone = user.get('phone') || noValue,
            email = user.get('email'),
            school = user.get('school') || noValue,
            academy = user.get('academy') || noValue,
            major = user.get('major') || noValue,
            hobby = user.get('hobby') || noValue,
            img = user.get('image') || '';
        
        jqLocusid.val(id).html(id);
        jqNickname.val(nickname).html(nickname);
        jqGender.val(gender).html(gender);
        jqAge.val(age).html(age);
        jqPhone.val(phone).html(phone);
        jqEmail.val(email).html(email);
        jqSchool.val(school).html(school);
        jqAcademy.val(academy).html(academy);
        jqMajor.val(major).html(major);
        jqHobby.val(hobby).html(hobby);
        jqHeadImg.attr('src', img);
    }
})()