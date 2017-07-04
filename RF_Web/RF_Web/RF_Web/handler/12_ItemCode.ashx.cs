using System.Web;
using System.Web.Services;
using System.Data;
using System.Collections;
using System;

namespace RF_Web.handler
{
    /// <summary>
    /// $codebehindclassname$ 的摘要描述
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class ItemCode : IHttpHandler
    {
        DB_IO dbIO = new DB_IO();

        public void ProcessRequest(HttpContext context)
        {
            string Mode = context.Request.QueryString["mode"] ?? string.Empty; //傳入的參數
            switch (Mode)
            { 
                case "Query":
                    QueryMode(context); break;
                case "JOBID2":
                    JOBID2(context);break;
                case "JOBID45":
                    JOBID45(context); break;
                default:
                    break;
            }

        }
        //單品完成
        private void JOBID45(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            ht.Add("@JOB_ID", 45);
            ht.Add("@ID", context.Request.QueryString["IDNo"]);
            ht.Add("@ITEM", context.Request.QueryString["HOID"]);
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

        //開始驗收(鎖定)
        private void JOBID2(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            ht.Add("@JOB_ID", 2);
            ht.Add("@ID", context.Request.QueryString["PaperNo"]);
            ht.Add("@ITEM", context.Request.QueryString["HOID"]);
            ht.Add("@ITEM_LOT", context.Request.QueryString["LOT"]);
            ht.Add("@ITEM_DATE", context.Request.QueryString["SunDay"]);
            ht.Add("@ITEM_TEMP", context.Request.QueryString["Temp"]);
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

        //查詢條碼
        private void QueryMode(HttpContext context)
        {
            string return_str = "";
            Hashtable ht=new Hashtable();
            ht.Add("@JOB_ID",1);
            ht.Add("@ID", context.Request.QueryString["PaperNo"]);
            ht.Add("@ITEM", context.Request.QueryString["ItemCode"]);
            ht.Add("@USER_ID", context.Request.QueryString["USER_ID"]);
            Hashtable ht2=new Hashtable();

            DataTable dt = dbIO.SqlSp("DCStest", "spactDCS_ID_LINE", ht, ref ht2).Tables[0];
            return_str = "{\"total\": " + dt.Rows.Count.ToString() + ", "
                        + " \"rows\":" + JSON.JSONconvert.DataTableToJSONstr(dt) 
                        + "}";

            context.Response.ContentType = "application/json";
            context.Response.Charset = "utf-8";
            context.Response.Write(return_str);
            //context.Response.Write(JSON.JSONconvert.DataTableToJSONstr(dt));
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
