function btn_Close_QueryList() {
    $('#dlg1').dialog('close');
    var row = $('#QueryList').datagrid('getSelected');
    if (row) {
        Cookies.set('STATE_TYPE', row.value);
        var btnColor = 'rgb(0,0,0)';
        if (row.value < 1)
            btnColor = 'rgb(0,255,0)';
        else if (row.value > 1)
            btnColor = 'rgb(255,0,0)';

        $('#btn_Quality').linkbutton({
            text: row.text
        });
        $('#btn_Quality').css('color', btnColor);
    }
}