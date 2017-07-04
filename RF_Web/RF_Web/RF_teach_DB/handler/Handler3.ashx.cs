using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Pxmart.Sockets;
using System.Web.WebSockets;
using System.Net.WebSockets;
using System.Threading.Tasks;
using System.Threading;
using System.Text;

namespace RF_teach_DB.handler
{
    /// <summary>
    /// Handler3 的摘要描述
    /// </summary>
    public class Handler3 : IHttpHandler
    {
        // list of client WebSockets that are open
        private static readonly IList<WebSocket> Clients = new List<WebSocket>();

        // ensure thread-safety of the WebSocket clients
        private static readonly ReaderWriterLockSlim Locker = new ReaderWriterLockSlim();

        //Socket: 連結後端的Tako
        ClientSocket ShareClientSocket = null;

        public void ProcessRequest(HttpContext context)
        {
            //新增一個Pxmart-socket
            //對後端的tako發送命令
            if (ShareClientSocket == null)
            {
                ShareClientSocket = ClientSocketInit(ShareClientSocket, "172.20.5.227", 1813);
            }
            
            if (context.IsWebSocketRequest)
            {
                context.AcceptWebSocketRequest(MyWebSocketHandler);
            }
            else
                context.Response.StatusCode = 400; //Bad Request 
        }

        public async Task MyWebSocketHandler(AspNetWebSocketContext context)
        {
            WebSocket socket = context.WebSocket;

            // add socket to socket list
            Locker.EnterWriteLock();
            try
            {
                Clients.Add(socket);
            }
            finally
            {
                Locker.ExitWriteLock();
            }

            // maintain socket
            while (true)
            {
                ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);

                // async wait for a change in the socket
                WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);

                //訊息傳給tako
                string message = Encoding.ASCII.GetString(buffer.Array, buffer.Offset, result.Count);
                ShareClientSocket.Send(context.UserHostAddress+" "+message);

                if (socket.State == WebSocketState.Open)
                {
                    // echo to all clients
                    foreach (WebSocket client in Clients)
                    {
                        await client.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                }
                else
                {
                    // client is no longer available - delete from list
                    Locker.EnterWriteLock();
                    try
                    {
                        Clients.Remove(socket);
                    }
                    finally
                    {
                        Locker.ExitWriteLock();
                    }

                    break;

                }
            }
        }

        #region Client-socket Init
        public ClientSocket ClientSocketInit(ClientSocket obj, string host, int ip)
        {
            obj = new ClientSocket();
            obj.OnConnect += clientSocket1_OnConnect;
            obj.OnDisconnect += clientSocket1_OnDisconnect;
            obj.OnError += clientSocket1_OnError;
            obj.OnReceive += clientSocket1_OnReceive;
            obj.OnSend += clientSocket1_OnSend;
            obj.Connect(host, ip);
            return obj;
        }
        #endregion

        #region Client-socket Event
        void clientSocket1_OnSend(object sender, SendEventArgs e)
        {

        }

        void clientSocket1_OnReceive(object sender, ReceiveEventArgs e)
        {
            //Log
            //WebService無法回應給Client
        }

        void clientSocket1_OnError(object sender, ErrorEventArgs e)
        {
            string localEndPoint = "";
            if (((ClientSocket)sender).LocalEndPoint != null)
                localEndPoint = ((ClientSocket)sender).LocalEndPoint.ToString();
        }

        void clientSocket1_OnDisconnect(object sender, DisconnectEventArgs e)
        {
        }

        void clientSocket1_OnConnect(object sender, ConnectEventArgs e)
        {
        }

        #endregion

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}