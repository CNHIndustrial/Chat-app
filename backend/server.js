import http from 'http';
import handler from "serve-handler";
import nanobuffer from "nanobuffer";
import { Server } from "socket.io";

const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

// serve static assets
const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "./frontend",
    rewrites: [
      { source: "/agent", destination: "/agent/index.html" },
    ],
  });
});

const io = new Server(server, {});

// // Store socket IDs of connected clients
// let clients = {};

io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  // If there are already two clients connected, disconnect the new connection
//   if (Object.keys(clients).length >= 2) {
//     console.log('Connection rejected: Too many clients');
//     socket.disconnect(true);
//     return;
//   }



     // When a client joins a room
//   socket.on('joinRoom', room => {
//     // Leave any previous rooms
//     Object.values(socket.rooms).forEach(room => {
//       if (room !== socket.id) {
//         socket.leave(room);
//       }
//     });

//     // Join the new room
//     socket.join(room);
//   });

  // Store client's socket ID
//   clients[socket.id] = socket;

  socket.emit("msg:get", { msg: getMsgs() });

  socket.on("disconnect", () => {
    console.log(`disconnected: ${socket.id}`);
   // delete clients[socket.id];
  });

  socket.on("msg:post", (data) => {
    msg.push({
    //  room: data.room,
    //   sender: data.sender,
      user: data.user,
      text: data.text,
      time: Date.now(),
    });


        // io.to(room).emit('msg:get', { msg: getMsgs()  });

    // When a message is received from one client, send it to the other client
    // const { recipient, message } = data;
    // const recipientSocket = clients[data.recipient];
    // if (recipientSocket) {
    //   recipientSocket.emit("msg:get", { msg: getMsgs() });
    // }


    io.emit("msg:get", { msg: getMsgs() });
  });
});

const port = process.env.PORT || 8085;
server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
