function Reset() {
    //Delete Cookies
    Cookies.remove('USER_ID');

    $('#txb_Name').textbox('setValue', '');
}

function login() {
    var username = $('#txb_Name').val();
    $('#txb_Name').textbox('setValue', '');
    Reset();

    if (username.length <= 0)
        $.messager.alert('錯誤', '請輸入名稱', 'error');
    else {
        $('#txb_Name').textbox('setValue', username);

        $.messager.alert('正確', '歡迎你 ' + username, 'info', function () {
            Cookies.set('USER_ID', username);
            window.open('Menu.html', '_self');
        });
    }
}

$(function () {
    $(document).ready(function () {
        //Bind Enter
        var t = $('#txb_Name');
        t.textbox('textbox').bind('keyup', function (e) {
            if (e.keyCode == 13) {   // when press ENTER key, accept the inputed value.
                login();
            }
        });

        //Clear Cookies
        var cookies = $.cookie();
        for (var cookie in cookies) {
            $.removeCookie(cookie);
        }

        //Clear Sessions
        $.session.clear();
    });

    $('#btn_Login').click(function () {
        login();
    });
});