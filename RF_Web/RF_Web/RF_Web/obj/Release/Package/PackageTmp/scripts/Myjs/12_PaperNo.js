function Reset() {
    //Delete Cookies
    Cookies.remove('PaperNo');
    Cookies.remove('IDNo');

    $('#txb_PaperNo').textbox('setValue', '');

    $('#div_ItemContent').panel({
        closed: true
    });
}

//查詢驗收明細
function QueryPaperDetail() {
    //產生window
    $('#dlg1').window({
        width: '100%',
        modal: true,
        closed: false,
        collapsible: true
    });

    //User-Define
    //讀取排版+填資料
    $('#dlg1').window('refresh', '12_QueryTable.html');
    //修改排版細節
    $('#dlg1').window({
        title: '驗收明細',
        top: '0',
        left: '0'
    });
    Cookies.set('QueryPaperDetailRows', 0);

    $.messager.progress({
        title: '請稍等',
        msg: '查詢中...'
    });
    $.ajax({
        url: 'handler/12_PaperNo.ashx',
        data: { mode: "QueryPaperDetail", CarNo: Cookies.get('CarNo'), PaperNo: Cookies.get('PaperNo') },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            //查詢正確
            if (result.rows[0].RT_CODE != '0') {
                $.messager.alert('錯誤', result.rows[0].RT_MSG);
            }
            else {
                Cookies.set('QueryPaperDetailRows', result.total);

                $('#QueryTable').datagrid({
                    columns: [[
                        { field: 'ITEM_ID', title: '呼出碼', width: '30%', sortable: true },
                                { field: 'NAME', title: '品名', width: '46%' },
                                { field: 'PO_QTY', title: '訂購量', width: '15%' },
                                { field: 'QTY', title: '驗收量', width: '15%' }
                    ]],
                    data: result.rows,
                    height: $(window).height() - 80,
                    rowStyler: function (index, row) {
                        if (row.NotIF > 0) {
                            return 'color:#FF0000;'; // return inline style
                        }
                    }
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $.messager.alert('錯誤', $(xhr.responseText).filter('title').text());
        },
        complete: function () {
            $.messager.progress('close');
        }
    }).then(function () {
        if (Cookies.get('QueryPaperDetailRows') <= 1)
            $('#dlg1').window('close');
    }).then(function () {
        Cookies.remove('QueryPaperDetailRows');
    });
}

//查詢訂單
function searchPaperNo() {
    $.messager.progress({
        title: '請稍等',
        msg: '查詢中...'
    });
    var itemCode = $('#txb_PaperNo').val();
    Reset();

    //產生window
    $('#dlg1').window({
        width: '100%',
        modal: true,
        closed: false,
        collapsible: true
    });

    //User-Define
    //讀取排版+填資料
    $('#dlg1').window('refresh', '12_QueryList.html');
    //修改排版細節
    $('#dlg1').window({
        title: '選擇商品',
        top: '0',
        left: '0'
    });
    Cookies.set('QueryPaperDetailRows', 0);

    $.ajax({
        url: 'handler/12_PaperNo.ashx',
        data: { mode: 'Query', CarNo: Cookies.get('CarNo'), PaperNo: itemCode, USER_ID: Cookies.get('USER_ID') },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            Cookies.set('QueryPaperDetailRows', result.total);
            if (result.rows[0].RT_CODE != '0') {
                $.messager.alert('錯誤', result.rows[0].RT_MSG);
            }
            else {
                //查詢正確
                if (result.total == 1) {
                    Cookies.set("PaperNo", result.rows[0].PO_ID);
                    Cookies.set("IDNo", result.rows[0].ID);

                    //填入數值
                    $('#txb_PaperNo').textbox('setValue', result.rows[0].PO_ID);
                    $('#span_ROW1').text('總品項數　' + result.rows[0].ITEM_QTY);
                    $('#span_ROW2').text('未驗品數　' + result.rows[0].ITEM_QTY0);
                    $('#span_ROW3').text('待驗品數　' + result.rows[0].ITEM_QTY1);
                    $('#span_ROW4').text('已驗品數　' + result.rows[0].ITEM_QTY2);

                    $('#div_ItemContent').panel({
                        closed: false
                    });
                }
                else {
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows[i];
                        $('#QueryList').datalist('appendRow', {
                            value: row.PO_ID,
                            text: row.RT_MSG
                        });
                    }
                    $('#QueryList').datalist('deleteRow', 0);
                    $.ajax({
                        url: "scripts/Myjs/12_QueryListSelectRow.js",
                        dataType: "script",
                        success: function (event) {
                            Cookies.set('QueryTarget', 'txb_PaperNo');
                        }
                    });
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $.messager.alert('錯誤', $(xhr.responseText).filter('title').text());
        },
        complete: function () {
            $.messager.progress('close');
        }
    }).then(function () {
        if (Cookies.get('QueryPaperDetailRows') <= 1)
            $('#dlg1').window('close');
    }).then(function () {
        Cookies.remove('QueryPaperDetailRows');
    });
}

//訂單完成驗收
function FinishPaperNo() {
    $.messager.progress({
        title: '請稍等',
        msg: '查詢中...'
    });

    $.ajax({
        url: 'handler/12_PaperNo.ashx',
        data: { mode: 'FinishPaperNo', CarNo: Cookies.get('CarNo'), IDNo: Cookies.get('IDNo'), USER_ID: Cookies.get('USER_ID') },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            //查詢正確
            if (result.total == 1) {
                if (result.rows[0].RT_CODE != '0') {
                    $.messager.alert('錯誤', result.rows[0].RT_MSG);
                }
                else {
                    $.messager.alert('完成', result.rows[0].RT_MSG);
                    Reset();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $.messager.alert('錯誤', $(xhr.responseText).filter('title').text());
        },
        complete: function () {
            $.messager.progress('close');
        }
    });
}

$(function () {
    $(document).ready(function () {
        $('#span_CarNo').text('報到牌  ' + Cookies.get('CarNo'));

        //Bind Enter
        var t = $('#txb_PaperNo');
        t.textbox('textbox').bind('keyup', function (e) {
            if (e.keyCode == 13) {   // when press ENTER key, accept the inputed value.
                searchPaperNo();
            }
        });

        //查詢過或從商品條碼返回
        if (Cookies.get('PaperNo') != undefined) {
            $('#txb_PaperNo').textbox('setValue', Cookies.get('PaperNo'));

            searchPaperNo();
        }
    });

    $("#txb_PaperNo").textbox({
        icons: [{
            iconCls: 'icon-clear',
            handler: function (e) {
                Reset();
            }
        }, {
            iconCls: 'icon-search',
            handler: function () {
                searchPaperNo();
            }
        }
        ]
    });

    //上一頁
    $("#btn_Previous").linkbutton({
        icons: [{
            handler: function () { }
        }],
        onClick: function () {
            Reset();

            window.history.go(-2);
        }
    });

    //完成驗收
    $("#btn_Fun1").linkbutton({
        icons: [{
            handler: function () { }
        }],
        onClick: function () {
            if (Cookies.get('PaperNo') == undefined) {
                searchPaperNo();
            }
            else {
                FinishPaperNo();
            }
        }
    });

    //驗收明細
    $("#btn_Fun2").linkbutton({
        icons: [{
            handler: function () { }
        }],
        onClick: function () {
            if (Cookies.get('PaperNo') == undefined) {
                searchPaperNo();
            }
            else {
                QueryPaperDetail();
            }
        }
    });

    //下一頁
    $("#btn_NextStep").linkbutton({
        icons: [{
            handler: function () { }
        }],
        onClick: function () {
            if (Cookies.get('PaperNo') == undefined) {
                searchPaperNo();
            }
            else {
                window.open('12_ItemCode.html', '_self');
            }
        }
    });
});