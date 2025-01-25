import {Server} from "socket.io";
import http from "http";
import express from "express";


const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin : ["http://localhost:5173"],
    }
})

export function getReceiverSocketId (userId){
        return userSocketMap[userId];
}

//used to store online users
const userSocketMap = {}; //{userId : socketId}

io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    if (userId) {
        // Check for an existing connection
        const oldSocketId = userSocketMap[userId];
        if (oldSocketId) {
            const oldSocket = io.sockets.sockets.get(oldSocketId);
            if (oldSocket) {
                console.log(`Duplicate connection for user ${userId}. Disconnecting old socket.`);
                oldSocket.disconnect();
            }
        }

        // Store the new socket ID
        userSocketMap[userId] = socket.id;

        console.log("A user connected:", userSocketMap[userId]);
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect",()=>{
        console.log("A user disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

export {io,app,server}