$(document).ready(function () {
    var date = new Date();
    var y, m, d, result;
    y = (date.getFullYear()).toString();
    m = (parseInt(date.getMonth()) + 1).toString();
    d = (date.getDate()).toString();
    document.getElementById("date_year").innerHTML = y;
    document.getElementById("date_year_select").innerHTML = y;
    document.getElementById("date_month").innerHTML = m;
    document.getElementById("date_month_select").innerHTML = m;
    document.getElementById("date_day").innerHTML = d;
    document.getElementById("date_day_select").innerHTML = d;
    result = reformatDate(y,m,d);
    $("#date_select").attr("max",result);
});

function selectDate() {
    var string = $("#date_select").val().toString();
    var dateArray = string.split("-");

    var y, m, d;
    y = dateArray[0].toString();
    m = dateArray[1].toString();
    d = dateArray[2].toString();

    m = m.replace("0","");
    d = d.replace("0","");

    document.getElementById("date_year").innerHTML = y;
    document.getElementById("date_year_select").innerHTML = y;
    document.getElementById("date_month").innerHTML = m;
    document.getElementById("date_month_select").innerHTML = m;
    document.getElementById("date_day").innerHTML = d;
    document.getElementById("date_day_select").innerHTML = d;
}

function reformatDate(y,m,d) {
    var result = y;
    var split = "-";
    if(parseInt(m)<10)
        result = result + split + "0"  + m;
    else
        result = result + split + m;
    if(parseInt(d)<10)
        result = result + split + "0"  + d;
    else
        result = result + split + d;
    return result;
}