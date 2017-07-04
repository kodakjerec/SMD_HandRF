function Reset() {
    //Delete Cookies
    Cookies.remove('CarNo');
    Cookies.remove('CarNoTemp');

    $('#btn_CarNo').textbox('setValue', '');

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
        url: 'handler/12_CarNo.ashx',
        data: { mode: "QueryPaperDetail", CarNo: Cookies.get('CarNo') },
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
                    $('#btn_CarNo').textbox('setValue', result.rows[0].VEHICLE_NO);
                    $('#span_ROW1').text('狀　　態　' + result.rows[0].ROW10);
                    $('#span_ROW2').text('物流公司　' + result.rows[0].TRAN_NAME);
                    $('#span_ROW3').text('報到車牌　' + result.rows[0].VEHICLE_NO + ' ' + result.rows[0].VEHICLE_TYPE);
                    $('#span_ROW4').text('指派碼頭　' + result.rows[0].DOCK_NAME);
                    $('#span_Temp0').text('冷　　凍　' + result.rows[0].VEHICLE_TEMP0);
                    $('#span_Temp1').text('冷　　藏　' + result.rows[0].VEHICLE_TEMP1);
                    $('#span_Temp2').text('溫　　控　' + result.rows[0].VEHICLE_TEMP2);

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

$(function () {
    $(document).ready(function () {
        //防止從login返回
        if (Cookies.get('USER_ID') == undefined)
            window.history.go(-1);

        //Bind Enter
        var t = $('#btn_CarNo');
        t.textbox('textbox').bind('keyup', function (e) {
            if (e.keyCode == 13) {   // when press ENTER key, accept the inputed value.
                searchCarNo();
            }
        });

        //查詢過或從訂單編號返回
        if (Cookies.get('CarNoTemp') != undefined) {
            var CarNoTemp = JSON.parse(Cookies.get('CarNoTemp'));

            //填入數值
            $('#btn_CarNo').textbox('setValue', CarNoTemp.VEHICLE_NO);
            $('#span_ROW1').text('狀　　態　' + CarNoTemp.ROW10);
            $('#span_ROW2').text('物流公司　' + CarNoTemp.TRAN_NAME);
            $('#span_ROW3').text('報到車牌　' + CarNoTemp.VEHICLE_NO);
            $('#span_ROW4').text('指派碼頭　' + CarNoTemp.VEHICLE_TYPE + ' ' + CarNoTemp.DOCK_NAME);
            $('#span_Temp0').text('冷　　凍　' + CarNoTemp.VEHICLE_TEMP0);
            $('#span_Temp1').text('冷　　藏　' + CarNoTemp.VEHICLE_TEMP1);
            $('#span_Temp2').text('溫　　控　' + CarNoTemp.VEHICLE_TEMP2);

            $('#div_ItemContent').panel({
                closed: false
            });
        }
    });

    //輸入
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
            $.messager.confirm('詢問', '確定離開進貨檢品嗎？', function (r) {
                if (r) {
                    Reset();

                    window.history.go(-2);
                }
            });
        }
    });

    //驗收明細
    $("#btn_Fun2").linkbutton({
        icons: [{
            handler: function () { }
        }],
        onClick: function () {
            if (Cookies.get('CarNo') == undefined) {
                searchCarNo();
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
            if (Cookies.get('CarNo') == undefined) {
                searchCarNo();
            }
            else {
                window.open("12_PaperNo.html", "_self");
            }
        }
    });
});