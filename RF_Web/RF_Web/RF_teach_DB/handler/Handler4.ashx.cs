using System.Collections;
using System.Data;
using System.Web;

namespace RF_teach_DB.handler
{
    /// <summary>
    /// Handler1 的摘要描述
    /// </summary>
    public class Handler4 : IHttpHandler
    {
        DB_IO dbIO = new DB_IO();

        public void ProcessRequest(HttpContext context)
        {
            string Mode = context.Request.QueryString["mode"] ?? string.Empty; //傳入的參數
            switch (Mode)
            {
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