$(function () {
    $(body).append("<div id='dlg1'></div>");
    //產生window
    $('#dlg1').window({
        width: '100%',
        modal: true,
        closed: false,
        collapsible: true
    });
    //User-Define
    //讀取排版+填資料
    $('#dlg1').window('refresh', 'SMD_NumberKeyboard.html');
    //修改排版細節
    $('#dlg1').window({
        title: '',
        top: '20%',
        left: '0'
    });
});