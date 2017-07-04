using System.Web;
using System.Web.Services;
using System.Data;
using System.Collections;

namespace RF_Web.handler
{
    /// <summary>
    /// $codebehindclassname$ 的摘要描述
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class CarNo : IHttpHandler
    {
        DB_IO dbIO = new DB_IO();

        public void ProcessRequest(HttpContext context)
        {
            string Mode = context.Request.QueryString["mode"] ?? string.Empty; //傳入的參數
            switch (Mode)
            {
                case "CarCheck":
                    CarCheck(context); break;
                case "Query": //_11checkIn 報到
                    QueryMode(context); break;
                case "QueryPaperDetail":
                    QueryPaperDetail(context); break;
                default:
                    break;
            }

        }

        //報到牌報到
        private void CarCheck(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            ht.Add("@JOB_ID", 2);
            ht.Add("@REG_ID", context.Request.QueryString["CarNo"]);
            ht.Add("@TEMP0", context.Request.QueryString["TEMP0"]);
            ht.Add("@TEMP1", context.Request.QueryString["TEMP1"]);
            ht.Add("@TEMP2", context.Request.QueryString["TEMP2"]);
            ht.Add("@USER_NAME", context.Request.QueryString["CarNo"]);
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
            ht.Add("@JOB_ID", 1);
            ht.Add("@REG_ID", context.Request.QueryString["CarNo"]);
            Hashtable ht2 = new Hashtable();

            DataTable dt = dbIO.SqlSp("DCStest", "spactDCS_ID_HEADER", ht, ref ht2).Tables[0];
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
            ht.Add("@JOB_ID", 11);
            ht.Add("@REG_ID", context.Request.QueryString["CarNo"]);
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
