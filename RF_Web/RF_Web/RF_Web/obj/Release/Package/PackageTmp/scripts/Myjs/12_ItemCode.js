function Reset() {
    //Delete Cookies
    Cookies.remove('HOID');
    Cookies.remove('ITEM_ID');
    Cookies.remove('RowTemp');
    Cookies.remove('Keyin_ItemCode');
    Cookies.remove('QueryPaperDetailRows');

    $('#txb_ItemCode').textbox('setValue', '');

    $('#div_ItemContent').panel({
        closed: true
    });
}
//查詢商品條碼
function searchItemCode() {
    $.messager.progress({
        title: '請稍等',
        msg: '查詢中...'
    });
    var itemCode = $('#txb_ItemCode').val();
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
        url: 'handler/12_ItemCode.ashx',
        data: { mode: "Query", PaperNo: Cookies.get('IDNo'), ItemCode: itemCode, USER_ID: Cookies.get('USER_ID') },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            //查詢正確
            if (result.rows[0].RT_CODE > '0') {
               $.messager.alert('錯誤', result.rows[0].RT_MSG);
            }
            else {
                Cookies.set('QueryPaperDetailRows', result.total);

                if (result.total == 1) {
                    //HOID
                    Cookies.set("HOID", result.rows[0].ITEM_HOID);
                    Cookies.set("ITEM_ID", result.rows[0].ITEM_ID);
                    Cookies.set("RowTemp", JSON.stringify(result.rows[0]));

                    $("#txb_ItemCode").textbox('setValue', result.rows[0].ITEM_ID);

                    //批號
                    if (result.rows[0].LM_TYPE > '0')
                        $('#txb_LOT').textbox({
                            disabled: false
                        });
                    //效期
                    if (result.rows[0].QM_TYPE > '0') {
                        $('#txb_SunDay').textbox({
                            disabled: false,
                            value: result.rows[0].QM_TYPE_TEXT
                        });
                    }
                    //溫度
                    if (result.rows[0].TM_TYPE > '0') {
                        $('#txb_Temperature').textbox({
                            disabled: false
                        });
                        $('#txb_UnderTemperature').textbox({
                            disabled: false
                        });
                    }
                    //填入數值
                    $('#span_ROW1').text(result.rows[0].ROW1);
                    $('#span_ROW2').text(result.rows[0].ROW2);
                    $('#span_ROW3').text(result.rows[0].ROW3);
                    $('#span_ROW4').text(result.rows[0].ROW4);
                    $('#span_ROW5').text(result.rows[0].ROW5);
                    $('#span_ROW6').text(result.rows[0].ROW6);
                    $('#span_ROW7').text(result.rows[0].ROW7);

                    $('#div_ItemContent').panel({
                        closed: false
                    });
                }
                else {
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows[i];
                        $('#QueryList').datalist('appendRow', {
                            value: row.BARCODE,
                            text: row.RT_MSG
                        });
                    }
                    $('#QueryList').datalist('deleteRow', 0);
                    $.ajax({
                        url: "scripts/Myjs/12_QueryListSelectRow.js",
                        dataType: "script",
                        success: function (event) {
                            Cookies.set('QueryTarget', 'txb_ItemCode');
                        }
                    });
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $.messager.alert('錯誤', $(xhr.responseText).filter('title').text());
        },
        complete:
            function () {
                $.messager.progress('close');
            }
    }).then(function () {
        if (Cookies.get('QueryPaperDetailRows') <= 1) {
            $('#dlg1').window('close');
        }
    }).then(function () {
        Cookies.remove('QueryPaperDetailRows');
    });
};

//商品驗收
function StartReceive() {
    $.messager.progress({
        title: '請稍等',
        msg: '查詢中...'
    });
    var itemLOT = $('#txb_LOT').val();
    var itemSunDay = $('#txb_SunDay').val();
    if (itemSunDay == '')
        itemSunDay = '0';
    var itemTemp = null;
    if ($('#txb_Temperature').val() != '')
        itemTemp = $('#txb_Temperature').val();
    else
        itemTemp = $('#txb_UnderTemperature').val();

    $.ajax({
        url: 'handler/12_ItemCode.ashx',
        data: { mode: 'JOBID2', PaperNo: Cookies.get('IDNo'), HOID: Cookies.get('HOID'), LOT: itemLOT, SunDay: itemSunDay, Temp: itemTemp, USER_ID: Cookies.get('USER_ID') },
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
                    //鎖定號碼
                    Cookies.set('LockNo', result.rows[0].LOT_ID);
                    //紀錄輸入資料
                    var Keyin_ItemCode = new Object();

                    Keyin_ItemCode.LOT = itemLOT;
                    Keyin_ItemCode.SunDay = itemSunDay;
                    Keyin_ItemCode.Temp = $('#txb_Temperature').val();
                    Keyin_ItemCode.UnderTemp = $('#txb_UnderTemperature').val();

                    Cookies.set('Keyin_ItemCode', JSON.stringify(Keyin_ItemCode));

                    window.open("12_ItemReceive.html", "_self");
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

//單品完成
function FinishItem() {
    $.messager.progress({
        title: '請稍等',
        msg: '查詢中...'
    });

    $.ajax({
        url: 'handler/12_ItemCode.ashx',
        data: { mode: 'JOBID45', IDNo: Cookies.get('IDNo'), HOID: Cookies.get('HOID'), USER_ID: Cookies.get('USER_ID') },
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
                    Cookies.remove('RowTemp');
                    Cookies.remove('Keyin_ItemCode');

                    $("#txb_ItemCode").textbox({
                        value: ''
                    });
                    $('#div_ItemContent').panel({
                        closed: true
                    });

                    $.messager.alert('完成', result.rows[0].RT_MSG);
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

//按鈕動作
$(
    function () {
        $(document).ready(function () {
            $('#span_CarNo').text('報到牌　　' + Cookies.get('CarNo'));
            $('#span_PaperNo').text('訂單編號　' + Cookies.get('PaperNo'));

            //Bind Enter
            var t = $('#txb_ItemCode');
            t.textbox('textbox').bind('keyup', function (e) {
                if (e.keyCode == 13) {   // when press ENTER key, accept the inputed value.
                    searchItemCode();
                }
            });

            //已經查詢過,或從驗收畫面返回
            if (Cookies.get('RowTemp') != undefined) {
                var RowTemp = JSON.parse(Cookies.get('RowTemp'));

                //批號
                if (RowTemp.LM_TYPE > '0')
                    $('#txb_LOT').textbox({
                        disabled: false
                    });
                //效期
                if (RowTemp.QM_TYPE > '0') {
                    $('#txb_SunDay').textbox({
                        disabled: false,
                        value: RowTemp.QM_TYPE_TEXT
                    });
                }
                //溫度
                if (RowTemp.TM_TYPE > '0') {
                    $('#txb_Temperature').textbox({
                        disabled: false
                    });
                    $('#txb_UnderTemperature').textbox({
                        disabled: false
                    });
                }

                //如果從驗收返回
                if (Cookies.get('Keyin_ItemCode') != undefined) {
                    var Keyin_ItemCode = JSON.parse(Cookies.get('Keyin_ItemCode'));
                    $('#txb_LOT').textbox('setValue', Keyin_ItemCode.LOT);
                    $('#txb_SunDay').textbox('setValue', Keyin_ItemCode.SunDay);
                    $('#txb_Temperature').textbox('setValue', Keyin_ItemCode.Temp);
                    $('#txb_UnderTemperature').textbox('setValue', Keyin_ItemCode.UnderTemp);
                }

                //填入數值
                $("#txb_ItemCode").textbox('setValue', RowTemp.ITEM_ID);
                $('#span_ROW1').text(RowTemp.ROW1);
                $('#span_ROW2').text(RowTemp.ROW2);
                $('#span_ROW3').text(RowTemp.ROW3);
                $('#span_ROW4').text(RowTemp.ROW4);
                $('#span_ROW5').text(RowTemp.ROW5);
                $('#span_ROW6').text(RowTemp.ROW6);
                $('#span_ROW7').text(RowTemp.ROW7);

                $('#div_ItemContent').panel({
                    closed: false
                });
            }
        });

        //查詢商品條碼
        $("#txb_ItemCode").textbox({
            icons: [{
                iconCls: 'icon-clear',
                handler: function (e) {
                    Reset();
                }
            }, {
                iconCls: 'icon-search',
                handler: function () {
                    searchItemCode();
                }
            }]
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
        //單品完成
        $("#btn_Fun1").linkbutton({
            icons: [{
                handler: function () { }
            }],
            onClick: function () {
                if ($('#div_ItemContent').panel('options').closed == true) {
                    searchItemCode();
                }
                else {
                    $.messager.confirm('詢問', '確定執行單品完成？', function (r) {
                        if (r) {
                            FinishItem();
                        }
                    });
                }
            }
        });
        //下一頁
        $("#btn_NextStep").linkbutton({
            icons: [{
                handler: function () { }
            }],
            onClick: function () {
                if ($('#div_ItemContent').panel('options').closed == true) {
                    searchItemCode();
                }
                else {
                    StartReceive();
                }
            }
        });
    }
);