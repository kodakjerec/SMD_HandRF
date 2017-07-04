using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace RF_Web.handler
{
    /// <summary>
    /// _12_PaperNo 的摘要描述
    /// </summary>
    public class _12_PaperNo : IHttpHandler
    {

        DB_IO dbIO = new DB_IO();

        public void ProcessRequest(HttpContext context)
        {
            string Mode = context.Request.QueryString["mode"] ?? string.Empty; //傳入的參數
            switch (Mode)
            {
                case "Query":
                    QueryMode(context); break;
                case "QueryPaperDetail":
                    QueryPaperDetail(context); break;
                case "FinishPaperNo":
                    FinishPaperNo(context);break;
                default:
                    break;
            }

        }

        //訂單完成驗收
        private void FinishPaperNo(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            ht.Add("@JOB_ID", 4);
            ht.Add("@REG_ID", context.Request.QueryString["CarNo"]);
            ht.Add("@ID", context.Request.QueryString["IDNo"]);
            Hashtable ht2 = new Hashtable();

            DataTable dt = dbIO.SqlSp("DCStest", "spactDCS_ID_HEADER", ht, ref ht2).Tables[0];
            return_str = "{\"total\": " + dt.Rows.Count.ToString() + ", "
                        + " \"rows\":" + JSON.JSONconvert.DataTableToJSONstr(dt)
                        + "}";

            context.Response.ContentType = "application/json";
            context.Response.Charset = "utf-8";
            context.Response.Write(return_str);
        }

        //查詢報到牌
        private void QueryMode(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            Hashtable ht2 = new Hashtable();

            #region 查詢ID單
            ht = new Hashtable();
            ht.Add("@JOB_ID", 3);
            ht.Add("@REG_ID", context.Request.QueryString["CarNo"]);
            ht.Add("@ID", context.Request.QueryString["PaperNo"]);
            ht.Add("@USER_NAME", context.Request.QueryString["USER_ID"]);

            DataTable dt0 = dbIO.SqlSp("DCStest", "spactDCS_ID_HEADER", ht, ref ht2).Tables[0];
            if (dt0.Rows[0]["RT_CODE"].ToString() != "0")
            {
                return_str = "{\"total\": " + dt0.Rows.Count.ToString() + ", "
                        + " \"rows\":" + JSON.JSONconvert.DataTableToJSONstr(dt0)
                        + "}";

                context.Response.ContentType = "application/json";
                context.Response.Charset = "utf-8";
                context.Response.Write(return_str);
                return;
            }
            #endregion

            #region 查詢驗收狀況
            ht = new Hashtable();
            ht.Add("@JOB_ID", 31);
            ht.Add("@REG_ID", context.Request.QueryString["CarNo"]);
            ht.Add("@ID", context.Request.QueryString["PaperNo"]);
            ht.Add("@USER_NAME", context.Request.QueryString["USER_ID"]);

            DataTable dt = dbIO.SqlSp("DCStest", "spactDCS_ID_HEADER", ht, ref ht2).Tables[0];

            dt.Columns.Add("ID", typeof(string));
            foreach (DataRow dr in dt.Rows)
                dr["ID"] = dt0.Rows[0]["ID"].ToString();
            #endregion

            return_str = "{\"total\": " + dt.Rows.Count.ToString() + ", "
                        + " \"rows\":" + JSON.JSONconvert.DataTableToJSONstr(dt)
                        + "}";

            context.Response.ContentType = "application/json";
            context.Response.Charset = "utf-8";
            context.Response.Write(return_str);
        }

        //查詢報到牌驗收成果
        private void QueryPaperDetail(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            ht.Add("@JOB_ID", 13);
            ht.Add("@REG_ID", context.Request.QueryString["CarNo"]);
            ht.Add("@ID", context.Request.QueryString["PaperNo"]);
            Hashtable ht2 = new Hashtable();

            DataTable dt = dbIO.SqlSp("DCStest", "spactDCS_ID_HEADER", ht, ref ht2).Tables[0];
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