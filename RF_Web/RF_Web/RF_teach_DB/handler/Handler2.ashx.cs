using System.Collections;
using System.Data;
using System.Web;

namespace RF_teach_DB.handler
{
    /// <summary>
    /// Handler2 的摘要描述
    /// </summary>
    public class Handler2 : IHttpHandler
    {
        DB_IO dbIO = new DB_IO();

        public void ProcessRequest(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            string cmdQuery = "Select * From FTP_CLOSE ";
            DataTable dt = dbIO.SqlQuery("DRPtest", cmdQuery, ht).Tables[0];
            return_str = JSON.JSONconvert.DataTableToJSONstr(dt);

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