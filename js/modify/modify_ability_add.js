
(function () {

    var jqTitle, jqTime, jqNature, jqResult, jqDescription, jqPartner, jqSubmit, jqCancel,
        currentUser;

    $(document).ready(function () {
        BmobBase.init();
        checkLogin();
        currentUser = BmobBase.User.current();
        init();
    });

    function init() {
        jqTitle = $('#ability_input');
        jqTime = $('#date_select');
        jqNature = $('#ability_competition_input');
        jqResult = $('#ability_award_input');
        jqDescription = $('#ability_details_input');
        jqPartner = $('#ability_partner_input');        
        jqSubmit = $('#button_submit');
        jqCancel = $('#button_cancel');

        jqSubmit.click(function (e) {
            e.preventDefault();
            save();
        });
        jqCancel.click(function (e) {
            e.preventDefault();
            cancel();
        });
    }

    function save() {
        var title = jqTitle.val(),            
            nature = jqNature.val(),
            result = jqResult.val(),
            description = jqDescription.val(),
            partner = jqPartner.val(),
            time = jqTime.val() || new Date().toString();
        
        if (StringHelper.isEmpty(title)) {
            alert('您忘记填写您的才艺才能了');
            jqTitle.focus();
            return;
        }
        if (StringHelper.isEmpty(partner)) {
            alert('您忘记填写您的队员了');
            jqPartner.focus();
            return;
        }        
        if (StringHelper.isEmpty(nature)) {
            alert('您忘记填写比赛活动名了');
            jqNature.focus();
            return;
        }
        if (StringHelper.isEmpty(result)) {
            alert('您忘记填写奖励证书了');
            jqResult.focus();
            return;
        }
        if (StringHelper.isEmpty(description)) {
            alert('您忘记填写比赛的精彩过程了')
            jqDescription.focus();
            return;
        }

        var owner = BmobBase.User.createOnlyId(currentUser.id),
            ability = new BmobBase.Ability();
            
        ability.set('title', title);
        ability.set('partner', partner);
        ability.set('nature', nature);
        ability.set('result', result);
        ability.set('description', description);
        ability.set('type', BmobBase.Record.Type.Ability);
        ability.set('owner', owner);
        ability.set('time', new Date(time));

        ability.save().then(function (r) {
            alert('保存成功');
            location.replace('modify_ability.html');
        }, function (error) {
            LogHelper.error('save ability', error);
            alert(ErrorHelper.translateError(error));
        });        
    }

    function cancel() {
        var title = jqTitle.val(),
            nature = jqNature.val(),
            result = jqResult.val(),
            description = jqDescription.val(),
            partner = jqPartner.val();

        if (!StringHelper.isEmpty(title)   || !StringHelper.isEmpty(nature)      ||
            !StringHelper.isEmpty(result)  || !StringHelper.isEmpty(description) ||
            !StringHelper.isEmpty(partner)) {

            if (confirm('您有填写的数据，确定要取消吗？')) {
                location.replace(document.referrer);
            }
        } else {
            location.replace(document.referrer);
        }
    }

})()