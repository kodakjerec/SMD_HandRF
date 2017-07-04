function btn_Close_QueryList() {
    $('#dlg1').dialog('close');
    var row = $('#QueryList').datagrid('getSelected');
    if (row) {
        var obj = '#'+Cookies.get('QueryTarget');
        $(obj).textbox({
            value: row.value
        });
    }

    $('#btn_NextStep').trigger('click');
}