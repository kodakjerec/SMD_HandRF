using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace RF_Web.handler
{
    /// <summary>
    /// testBarcode 的摘要描述
    /// </summary>
    public class testBarcode : IHttpHandler
    {
        DB_IO dbIO = new DB_IO();

        public void ProcessRequest(HttpContext context)
        {
            string Mode = context.Request.QueryString["mode"] ?? string.Empty; //傳入的參數
            switch (Mode)
            {
                case "Q_DCS_ITEM_HO":
                    Q_DCS_ITEM_HO(context);
                    break;
                default:
                    break;
            }

        }
        private void Q_DCS_ITEM_HO(HttpContext context)
        {
            Hashtable ht = new Hashtable();
            Hashtable ht1 = new Hashtable();

            ht.Add("@BasketId", "B2017040400045");

            DataSet ds = dbIO.SqlSp("MIDDLEDB", "spSMD_BASKET_LIST_ITEM", ht, ref ht1);
            string result_sp = JSON.JSONconvert.DataTableToJSONstr(ds.Tables[0]);

            context.Response.ContentType = "application/json";
            context.Response.Charset = "utf-8";
            context.Response.Write(result_sp);

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}