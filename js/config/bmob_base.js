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
    }
};