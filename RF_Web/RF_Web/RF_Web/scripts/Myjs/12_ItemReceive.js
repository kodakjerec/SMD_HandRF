//解鎖
function Unlock() {
    $.messager.progress({
        title: '請稍等',
        msg: '查詢中...'
    });
    $.ajax({
        url: 'handler/12_ItemReceive.ashx',
        data: { mode: "UnLock", IDNo: Cookies.get('IDNo'), LockNo: Cookies.get('LockNo'), USER_ID: Cookies.get('USER_ID') },
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
                    //Delete Cookies
                    Cookies.remove('LockNo');
                    Cookies.remove('DeleteMode');
                    Cookies.remove('STATE_TYPE');

                    window.history.go(-2);
                }
            }
            else {
                $.messager.alert('錯誤', '資料大於一筆');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $.messager.alert('錯誤', $(xhr.responseText).filter('title').text());
        },
        complete:
            function () {
                $.messager.progress('close');
            }
    });
}

//驗收
function Receive() {
    $.messager.progress({
        title: '請稍等',
        msg: '查詢中...'
    });
    var Qty = $('#txb_Qty').val();
    if (Qty == '') Qty = 0;
    var Weight = $('#txb_Weight').val();
    if (Weight == '') Weight = 0;

    if (Cookies.get('DeleteMode') == '1') {
        Qty = 0 - Qty;
        Weight = 0 - Weight;
    }

    if (Qty == 0 && Weight == 0) {
        $.messager.alert('錯誤', '數量和重量不可均為零');
        $.messager.progress('close');
        return;
    }

    var Type = Cookies.get('STATE_TYPE');

    $.ajax({
        url: 'handler/12_ItemReceive.ashx',
        data: { mode: "Receive", IDNo: Cookies.get('IDNo'), LockNo: Cookies.get('LockNo'), TYPE: Type, QTY: Qty, WT: Weight, USER_ID: Cookies.get('USER_ID') },
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
                    //更新前景
                    $('#span_ROW3').text(result.rows[0].ROW3);
                    $('#span_ROW5').text(result.rows[0].ROW4);
                    $('#span_ROW6').text(result.rows[0].ROW5);
                    $('#span_ROW7').text(result.rows[0].ROW6);
                    $('#txb_Qty').textbox('setValue', '');
                    $('#txb_Weight').textbox('setValue', '');

                    //更新Cookie
                    var RowTemp = JSON.parse(Cookies.get('RowTemp'));

                    RowTemp.ROW3 = result.rows[0].ROW3;
                    RowTemp.ROW5 = result.rows[0].ROW4;
                    RowTemp.ROW6 = result.rows[0].ROW5;
                    RowTemp.ROW7 = result.rows[0].ROW6;
                    Cookies.set('RowTemp', JSON.stringify(RowTemp));

                    $.messager.alert('完成', result.rows[0].RT_MSG);

                    $('#div_ItemContent').panel({
                        closed: false
                    });
                }
            }
            else {
                $.messager.alert('錯誤', '資料大於一筆');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $.messager.alert('錯誤', $(xhr.responseText).filter('title').text());
        },
        complete:
            function () {
                $.messager.progress('close');
            }
    });
}

//品質
function ChangeQuality() {
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
        title: '品質',
        top: '0',
        left: '0'
    });
    Cookies.set('QueryPaperDetailRows', 0);

    $.messager.progress({
        title: '請稍等',
        msg: '查詢中...'
    });

    $.ajax({
        url: 'handler/12_ItemReceive.ashx',
        data: { mode: "QueryItemState" },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            Cookies.set('QueryPaperDetailRows', result.total);

            //查詢正確
            if (result.total > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows[i];
                    $('#QueryList').datalist('appendRow', {
                        value: row.Value,
                        text: row.Name
                    });
                }
                $('#QueryList').datalist('deleteRow', 0);
                $.ajax({
                    url: "scripts/Myjs/12_ItemReceive_StateType.js",
                    dataType: "script",
                    success: function (event) { }
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
    });

    Cookies.remove('QueryPaperDetailRows');
}

$(function () {
    $(document).ready(function () {
        var RowTemp = JSON.parse(Cookies.get('RowTemp'));

        //填入數值
        $('#span_ROW1').text(RowTemp.ROW1);
        $('#span_ROW2').text(RowTemp.ROW2);
        $('#span_ROW3').text(RowTemp.ROW3);
        $('#span_ROW4').text(RowTemp.ROW4);
        $('#span_ROW5').text(RowTemp.ROW5);
        $('#span_ROW6').text(RowTemp.ROW6);
        $('#span_ROW7').text(RowTemp.ROW7);
        $('#txb_Qty').textbox('setValue', '');
        $('#txb_Weight').textbox('setValue', '');

        if (RowTemp.PRICE_TYPE != '0')
            $('#txb_Weight').textbox({
                disabled: true
            });

        Cookies.set('DeleteMode', '0');
        Cookies.set('STATE_TYPE', '1');
    });
    //上一頁
    $("#btn_Previous").linkbutton({
        icons: [{
            handler: function () { }
        }],
        onClick: function () {
            Unlock();
        }
    });
    //減量
    $("#btn_Fun1").linkbutton({
        icons: [{
            handler: function () { }
        }],
        onClick: function () {

            if (Cookies.get('DeleteMode') == '0') {
                Cookies.set('DeleteMode', '1');
                $('#btn_Fun1_text').text('加量');
                $('#div_ItemContent').css('background-color', 'red');
            }
            else {
                Cookies.set('DeleteMode', '0');
                $('#btn_Fun1_text').text('減量');
                $('#div_ItemContent').css('background-color', '');
            }
        }
    });
    //品質
    $("#btn_Quality").linkbutton({
        icons: [{
            handler: function () { }
        }],
        onClick: function () {
            ChangeQuality();
        }
    });
    //下一頁
    $("#btn_NextStep").linkbutton({
        icons: [{
            handler: function () { }
        }],
        onClick: function () {
            Receive();
        }
    });
});