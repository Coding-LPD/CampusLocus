
function StringHelper() {}

StringHelper.IsEmpty = function (str) {
    if (!str) return true;
    var re = new RegExp('^[ ]*$');    
    return re.test(str);
};