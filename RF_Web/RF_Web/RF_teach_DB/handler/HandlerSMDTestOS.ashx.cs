using System.Collections;
using System.Data;
using System.Web;

namespace RF_teach_DB.handler
{
    /// <summary>
    /// HandlerSMDTestOS 的摘要描述
    /// </summary>
    public class HandlerSMDTestOS : IHttpHandler
    {
        DB_IO dbIO = new DB_IO();
        public void ProcessRequest(HttpContext context)
        {

            string[] paramlist = context.Request.Form.AllKeys;

            string Mode = context.Request.QueryString["mode"] ?? string.Empty; //傳入的參數
            switch (Mode)
            {
                case "Order":
                    Order(context);break;
                case "NewOrder":
                    NewOrder(context); break;
                case "OrderHistory":
                    OrderHistory(context); break;
                default:
                    break;
            }
        }
        //取得發注本
        private void Order(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            ht.Add("@mode", context.Request.QueryString["param1"]);
            ht.Add("@Value1", context.Request.QueryString["param2"]);
            Hashtable ht2 = new Hashtable();
            DataTable dt = dbIO.SqlSp("EEP2015", "SMDTestOS_GetOrder", ht, ref ht2).Tables[0];
            return_str = JSON.JSONconvert.DataTableToJSONstr(dt);

            context.Response.ContentType = "application/json";
            context.Response.Charset = "utf-8";
            context.Response.Write(return_str);
        }

        //新增需求
        private void NewOrder(HttpContext context)
        {
            Hashtable ht = new Hashtable();
            ht.Add("@RECEIVE_DATE", context.Request.QueryString["param1"]);
            ht.Add("@CALLING_NUM", context.Request.QueryString["param2"]);
            ht.Add("@QTY", context.Request.QueryString["param3"]);
            ht.Add("@USER", context.Request.QueryString["param4"]);
            Hashtable ht2 = new Hashtable();
            dbIO.SqlSp("EEP2015", "SMDTestOS_newOrder", ht, ref ht2);
        }

        //訂單歷史
        private void OrderHistory(HttpContext context)
        {
            string return_str = "";
            Hashtable ht = new Hashtable();
            ht.Add("@LastID", context.Request.QueryString["LastID"]);
            Hashtable ht2 = new Hashtable();
            DataTable dt = dbIO.SqlSp("EEP2015", "SMDTestOS_OrderHistory", ht, ref ht2).Tables[0];
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