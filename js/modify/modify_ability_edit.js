
(function () {

    var jqTitle, jqTime, jqNature, jqResult, jqDescription, jqPartner, jqSubmit, jqCancel,
        editItem,
        currentUser;

    $(document).ready(function () {
        BmobBase.init();
        checkLogin();
        currentUser = BmobBase.User.current();
        init();
        var id = queryString('id');
        getData(id);
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

    function getData(id) {
        var query = new Bmob.Query(BmobBase.Ability);

        query.get(id).then(function (r) {            
            jqTitle.val(r.get('title'));
            jqNature.val(r.get('nature'));
            jqResult.val(r.get('result'));
            jqDescription.val(r.get('description'));
            jqPartner.val(r.get('partner'));
            jqTime.val(getDateString(r.get('time')));
            jqTime.change();
            editItem = r;
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
            
        editItem.set('title', title);
        editItem.set('partner', partner);
        editItem.set('nature', nature);
        editItem.set('result', result);
        editItem.set('description', description);
        editItem.set('time', new Date(time));        

        editItem.save().then(function (r) {
            alert('修改成功');
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

        if (title === editItem.get('title')    &&  nature === editItem.get('nature')           &&
            result === editItem.get('result')  &&  description === editItem.get('description') &&
            partner === editItem.get('partner')) {
            location.replace(document.referrer);
        } else {
            if (confirm('数据有修改，确定要取消吗？')) {
                location.replace(document.referrer);
            }
        } 
    }

})()