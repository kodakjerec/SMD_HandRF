using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace RF_Web.handler
{
    /// <summary>
    /// login 
    /// 呼叫134 DCS 登入帳密驗證SP：spDCS_LOGIN
    /// </summary>
    public class login : IHttpHandler
    {
        DB_IO dbIO = new DB_IO();
        public void ProcessRequest(HttpContext context)
        {
            string Mode = context.Request.QueryString["mode"] ?? string.Empty; //傳入的參數
            switch (Mode)
            {
                case "spDCS_LOGIN":
                    spDCS_LOGIN(context);
                    break;
                case "spMENU":
                    spMENU(context);
                    break;
                default:
                    break;
            }
        }

        private void spMENU(HttpContext context)
        {
            Hashtable ht = new Hashtable();

            string return_str = "";
            string cmdQuery = "SELECT * FROM _vDCS_ANITA";

            DataTable dt = dbIO.SqlQuery("DCStest", cmdQuery, ht).Tables[0];
            return_str = JSON.JSONconvert.DataTableToJSONstr(dt);

            context.Response.ContentType = "application/json";
            context.Response.Charset = "utf-8";
            context.Response.Write(return_str);
        }

        private void spDCS_LOGIN(HttpContext context)
        {
            Hashtable ht = new Hashtable();
            Hashtable ht1 = new Hashtable();

            ht.Add("@ID",  context.Request.QueryString["ID"]);
            ht.Add("@PASSWORD", context.Request.QueryString["PASSWORD"]);

            DataSet ds = dbIO.SqlSp("DCStest", "[sys.spDCS_LOGIN]", ht, ref ht1);
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