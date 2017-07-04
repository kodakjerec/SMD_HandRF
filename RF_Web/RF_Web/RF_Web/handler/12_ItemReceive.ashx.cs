using System.Web;
using System.Web.Services;
using System.Data;
using System.Collections;
using System;

namespace RF_Web.handler
{
    /// <summary>
    /// _12_ItemReceive 的摘要描述
    /// </summary>
    public class _12_ItemReceive : IHttpHandler
    {

        DB_IO dbIO = new DB_IO();

        public void ProcessRequest(HttpContext context)
        {
            string Mode = context.Request.QueryString["mode"] ?? string.Empty; //傳入的參數
            switch (Mode)
            {
                case "Receive":
                    Receive(context); break;
                case "UnLock":
                    UnLock(context); break;
                case "QueryItemState":
                    QueryItemState(context); break;
                default:
                    break;
            }

        }
        //品質
        private void QueryItemState(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            string cmdQuery = "Select ID as Value, Name from vDCS_Table_item_State";
            DataTable dt = dbIO.SqlQuery("DCStest", cmdQuery, ht).Tables[0];
            return_str = "{\"total\": " + dt.Rows.Count.ToString() + ", "
                        + " \"rows\":" + JSON.JSONconvert.DataTableToJSONstr(dt)
                        + "}";

            context.Response.ContentType = "application/json";
            context.Response.Charset = "utf-8";
            context.Response.Write(return_str);
        }

        //驗收
        private void Receive(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            ht.Add("@JOB_ID", 3);
            ht.Add("@ID", context.Request.QueryString["IDNo"]);
            ht.Add("@ITEM", context.Request.QueryString["LockNo"]);
            ht.Add("@STATE_TYPE", context.Request.QueryString["TYPE"]);
            ht.Add("@QTY", context.Request.QueryString["QTY"]);
            ht.Add("@WT", context.Request.QueryString["WT"]);
            ht.Add("@USER_ID", context.Request.QueryString["USER_ID"]);
            Hashtable ht2 = new Hashtable();

            DataTable dt = dbIO.SqlSp("DCStest", "spactDCS_ID_LINE", ht, ref ht2).Tables[0];
            return_str = "{\"total\": " + dt.Rows.Count.ToString() + ", "
                        + " \"rows\":" + JSON.JSONconvert.DataTableToJSONstr(dt)
                        + "}";

            context.Response.ContentType = "application/json";
            context.Response.Charset = "utf-8";
            context.Response.Write(return_str);
        }

        //開始驗收(解鎖定)
        private void UnLock(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            ht.Add("@JOB_ID", 4);
            ht.Add("@ID", context.Request.QueryString["IDNo"]);
            ht.Add("@ITEM", context.Request.QueryString["LockNo"]);
            ht.Add("@USER_ID", context.Request.QueryString["USER_ID"]);
            Hashtable ht2 = new Hashtable();

            DataTable dt = dbIO.SqlSp("DCStest", "spactDCS_ID_LINE", ht, ref ht2).Tables[0];
            return_str = "{\"total\": " + dt.Rows.Count.ToString() + ", "
                        + " \"rows\":" + JSON.JSONconvert.DataTableToJSONstr(dt)
                        + "}";

            context.Response.ContentType = "application/json";
            context.Response.Charset = "utf-8";
            context.Response.Write(return_str);
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