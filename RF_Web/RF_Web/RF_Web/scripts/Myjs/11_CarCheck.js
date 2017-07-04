function Reset() {
    //Delete Cookies
    Cookies.remove('CarNo');
    Cookies.remove('CarNoTemp');

    $('#btn_CarNo').textbox({ value: '' });

    $('#div_ItemContent').panel({
        closed: true
    });
}
//查詢報到牌
function searchCarNo() {
    $.messager.progress({
        title: '請稍等',
        msg: '查詢中...'
    });
    var itemCode = $('#btn_CarNo').val();
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
        url: 'handler/12_CarNo.ashx',
        data: { mode: "Query", CarNo: itemCode },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {            
            if (result.rows[0].RT_CODE == '0') {
                Cookies.set('QueryPaperDetailRows', result.total);

                //查詢正確
                //只有一行
                if (result.total == 1) {
                    Cookies.set('CarNo', result.rows[0].VEHICLE_NO);
                    Cookies.set('CarNoTemp', JSON.stringify(result.rows[0]));

                    //填入數值
                    $('#btn_CarNo').textbox({ value: result.rows[0].VEHICLE_NO });
                    $('#span_ROW1').text('狀　　態　' + result.rows[0].ROW10);
                    $('#span_ROW2').text('物流公司　' + result.rows[0].TRAN_NAME);
                    $('#span_ROW3').text('報到車牌　' + result.rows[0].VEHICLE_NO + ' ' + result.rows[0].VEHICLE_TYPE);
                    $('#span_ROW4').text('指派碼頭　' + result.rows[0].DOCK_NAME);
                    
                    if (result.rows[0].ROW10.indexOf('已') > -1) {
                        $('#txb_Temperature0').textbox({ disabled: true });
                        $('#txb_UnderTemperature0').textbox({ disabled: true });
                        $('#txb_Temperature1').textbox({ disabled: true });
                        $('#txb_UnderTemperature1').textbox({ disabled: true });
                        $('#txb_Temperature2').textbox({ disabled: true });
                        $('#txb_UnderTemperature2').textbox({ disabled: true });
                    }

                    $('#div_ItemContent').panel({
                        closed: false
                    });
                }
                else {
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows[i];
                        $('#QueryList').datalist('appendRow', {
                            value: row.REG_ID,
                            text: row.RT_MSG
                        });
                    }
                    $('#QueryList').datalist('deleteRow', 0);
                    $.ajax({
                        url: "scripts/Myjs/12_QueryListSelectRow.js",
                        dataType: "script",
                        success: function (event) {
                            Cookies.set('QueryTarget', 'btn_CarNo');
                        }
                    });
                }
            }
            else {
                $.messager.alert('錯誤', result.rows[0].RT_MSG);
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

//報到牌報到
function RegisterCarNo() {
    $.messager.progress({
        title: '請稍等',
        msg: '查詢中...'
    });

    var temp0 = 0 - $('#txb_UnderTemperature0').val();
    if ($('#txb_Temperature0').val() != '')
        temp0 = $('#txb_Temperature0').val();

    var temp1 = 0 - $('#txb_UnderTemperature1').val();
    if ($('#txb_Temperature1').val() != '')
        temp1 = $('#txb_Temperature1').val();

    var temp2 = 0 - $('#txb_UnderTemperature2').val();
    if ($('#txb_Temperature2').val() != '')
        temp2 = $('#txb_Temperature2').val();

    $.ajax({
        url: 'handler/12_CarNo.ashx',
        data: { mode: "CarCheck", CarNo: Cookies.get('CarNo'), TEMP0: temp0, TEMP1: temp1, TEMP2: temp2,USER_ID:Cookies.get('USER_ID') },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            if (result.rows[0].RT_CODE == '0') {
                //查詢正確
                //只有一行
                if (result.total == 1) {
                    $.messager.alert('完成', result.rows[0].RT_MSG, function () {
                        window.history.go(-2);
                    });
                }
                else {

                }
            }
            else {
                $.messager.alert('錯誤', result.rows[0].RT_MSG);
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
        //防止從login返回
        if (Cookies.get('USER_ID') == undefined)
            window.history.go(-2);
    });

    //輸入報到牌
    $("#btn_CarNo").textbox({
        icons: [{
            iconCls: 'icon-clear',
            handler: function (e) {
                Reset();
            }
        }, {
            iconCls: 'icon-search',
            handler: function () {
                searchCarNo();
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
            $.messager.confirm('詢問', '確定離開報到牌報到嗎？', function (r) {
                if (r) {
                    Reset();

                    window.history.go(-2);
                }
            });
        }
    });

    //下一頁
    $("#btn_NextStep").linkbutton({
        icons: [{
            handler: function () { }
        }],
        onClick: function () {
            if (Cookies.get('CarNo') == undefined) {
                searchCarNo();
            }
            else {
                RegisterCarNo();
            }
        }
    });
});