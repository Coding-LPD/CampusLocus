$("body").css("width", $(window).width());

function indexMouseOver() {
    document.getElementById("home_cut").src = "images/home1.png";
}

function indexMouseOut() {
    document.getElementById("home_cut").src = "images/home.png";
}

function nextMouseDown() {
    document.getElementById("button_next").style.backgroundPosition = "bottom";
}

function nextMouseUp() {
    document.getElementById("button_next").style.backgroundPosition = "center";
}

function previewMouseDown() {
    document.getElementById("button_preview").style.backgroundPosition = "bottom";
}

function previewMouseUp() {
    document.getElementById("button_preview").style.backgroundPosition = "center";
}

function editMouseOut() {
    document.getElementById("button_edit").style.background = "url('images/edit.png')";
}

function editMouseOver() {
    document.getElementById("button_edit").style.background = "url('images/edit_click.png')";
    document.getElementById("button_edit").title = "编辑";
}

function submitMouseOver() {
    document.getElementById("button_submit").style.color = "#FFF85F";
}

function submitMouseOut() {
    document.getElementById("button_submit").style.color = "#FFF";
}

function cancelMouseOver() {
    document.getElementById("button_cancel").style.color = "#FFF85F";
}

function cancelMouseOut() {
    document.getElementById("button_cancel").style.color = "#FFF";
}

function selectImg() {
    var jqFile = $('#button_file_personal');
    jqFile.click();
}

function changeImg() {
    var jqFile = $('#button_file_personal'),
        jqImg = $('#head_image'),
        files = jqFile[0].files, 
        file,
        imgUrl;

    if (files && files.length > 0) {
        file = files[0];
        imgUrl = convertImagePath(file);
        jqImg.attr('src', imgUrl);
        jqImg.load(function () {
            window.URL.revokeObjectURL(imgUrl);
        });
    }
}

function addMouseDown() {
    document.getElementById("button_add").style.background = "url('images/add_click.png')";
}

function addMouseUp() {
    document.getElementById("button_add").style.background = "url('images/add.png')";
}

function editMouseOut(num) {
    document.getElementById("button_edit" + num).style.background = "url('images/edit.png')";
}

function editMouseOver(num) {
    document.getElementById("button_edit" + num).style.background = "url('images/edit_click.png')";
    document.getElementById("button_edit" + num).title = "编辑";
}

function editAbility(id) {
    location.href = 'modify_ability_edit.html?id=' + id;
}    

function editWork(id) {
    window.location = "modify_work_edit.html?id=" + id;
}

function editCommunity(id) {
    window.location = "modify_community_edit.html?id=" + id;
}

function showFullText(modify,num) {
    var details = document.getElementById(modify + "_details" + num);
    var btnshow = document.getElementById(modify + "_fulltext" + num);
    var line = document.getElementById("vertical_line" + num);
    var totalHeight = details.scrollHeight;
    var maxHeight = 90;

    /*切换<a>内容*/
    btnshow.innerHTML = (btnshow.innerHTML == '收起' ? '查看全文..' : '收起');

    if (totalHeight > maxHeight) {
        details.style.maxHeight = totalHeight + "px";

        if (btnshow.innerHTML == "查看全文..") {
            details.style.maxHeight = maxHeight + "px";
            if( modify == "ability" ) {
                line.style.height = "250px";
            }
            else if (modify == "community") {
                line.style.height = "230px";
            }
            else {
                line.style.height = "200px";
            }
        }

        if (btnshow.innerHTML == "收起") {
            line.style.height = parseInt(line.style.height) + ( totalHeight - maxHeight ) + 'px';
        }
    }
}

function collapse(year) {
    /*滑动效果*/
    $('div[class^=year' + year + ']').slideToggle();

    $("#collapse" + year).attr('src',$("#collapse" + year).attr('src')=='images/open.png'?'images/close.png':'images/open.png');

    /*$("#collapse" + year).rotate(45);*/

    /*toggle(
        function() {
            $(this).attr("src", "images/close.png");
        },
        function() {
            $(this).attr("src","images/open.png");
        }
    );*/
}