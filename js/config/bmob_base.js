function BmobBase() {}

/* 连接bmob所需的信息 */
BmobBase.ApplicationId = '2a6abdaa10da425f7dabcfede217ab39';
BmobBase.RestAPIKey = '76edadf5430a9b4bb04c8230565b5fe5';

/* bmob上的表名 */
BmobBase.Tables = {};
BmobBase.Tables.Ability = 'Ability';
BmobBase.Tables.Social = 'Social';
BmobBase.Tables.Work = 'Work';
BmobBase.Tables.AbilityConsultation = 'AbilityConsultation';
BmobBase.Tables.SocialConsultation = 'SocialConsultation';
BmobBase.Tables.WorkConsultation = 'WorkConsultation';
BmobBase.Tables.BestRecord = 'BestRecord';
BmobBase.Tables.Feedback = 'Feedback';
BmobBase.Tables.AbilityPost = 'AbilityPost';
BmobBase.Tables.SocialPost = 'SocialPost';
BmobBase.Tables.WorkPost = 'WorkPost';

BmobBase.init = function () {
    Bmob.initialize(BmobBase.ApplicationId, BmobBase.RestAPIKey);

    // 根据已有表初始化相应的bmob类
    if (!BmobBase.Ability) {
        BmobBase.Ability = Bmob.Object.extend(BmobBase.Tables.Ability);
        BmobBase.Social = Bmob.Object.extend(BmobBase.Tables.Social);
        BmobBase.Work = Bmob.Object.extend(BmobBase.Tables.Work);
        BmobBase.AbilityConsultation = Bmob.Object.extend(BmobBase.Tables.AbilityConsultation);
        BmobBase.SocialConsultation = Bmob.Object.extend(BmobBase.Tables.SocialConsultation);
        BmobBase.WorkConsultation = Bmob.Object.extend(BmobBase.Tables.WorkConsultation);
        BmobBase.BestRecord = Bmob.Object.extend(BmobBase.Tables.BestRecord);
        BmobBase.Feedback = Bmob.Object.extend(BmobBase.Tables.Feedback);
        BmobBase.AbilityPost = Bmob.Object.extend(BmobBase.Tables.AbilityPost);
        BmobBase.SocialPost = Bmob.Object.extend(BmobBase.Tables.SocialPost);
        BmobBase.WorkPost = Bmob.Object.extend(BmobBase.Tables.WorkPost);
        BmobBase.Record = {};
        BmobBase.Record.TypeCount = 3;
        BmobBase.Record.Type = {            
            Ability: 1,
            Social: 2,
            Work: 3
        };
        BmobBase.Record.Label = ['', '才艺才能', '社团经历', '工作实习'];
    }
};

// bmob自带的user信息缓存只有在用户重新登录时才会刷新，为了使缓存信息在用户登录时能保持最新，
// 用edit方法来记录用户修改的个人信息，用current方法来替换Bmob.User.current方法来获得当前
// 用户，使程序能获得用户最新信息
BmobBase.User = {

    createOnlyId: function (id) {
        var user = new Bmob.User();
        user.id = id;
        return user;
    },

    current: function () {
        var user = Bmob.User.current(),
            userJson = localStorage.getItem('user_extra_info'),
            userExtra;

        if (userJson != null) {
            userExtra = JSON.parse(userJson);
            user.set('nickname', userExtra.nickname);
            user.set('gender', userExtra.gender);
            user.set('age', userExtra.age);
            user.set('phone', userExtra.phone);
            user.set('school', userExtra.school);
            user.set('academy', userExtra.academy);
            user.set('major', userExtra.major);
            user.set('hobby', userExtra.hobby);
            user.set('image', userExtra.image);
        }        
        return user;
    },

    edit: function (user) {
        var userExtra = {};

        userExtra.nickname = user.get('nickname');
        userExtra.gender = user.get('gender');
        userExtra.age = user.get('age');
        userExtra.phone = user.get('phone');
        userExtra.school = user.get('school');
        userExtra.academy = user.get('academy');
        userExtra.major = user.get('major');
        userExtra.hobby = user.get('hobby');
        userExtra.image = user.get('image');
        localStorage.setItem('user_extra_info', JSON.stringify(userExtra));
    },

    logout: function () {
        Bmob.User.logOut();
        localStorage.removeItem('user_extra_info');   
    }
};