const express = require('express')
const {createServer} = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const ACTIONS = require('./Action')
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 8000


const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors : {
        origin : process.env.CLIENT_URL,
        credentials: true,
    }
})
app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials: true,
}))
app.use(express.json())

let clients = {}




server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})
app.get('/', (req, res) => {
    res.json({"message" : "server running..."})
})

io.on('connection', (socket) => {
    
    socket.on(ACTIONS.JOIN, ({roomId, username}) => {
        try{
            socket.join(roomId)
            clients[socket.id] = username
            const clientList = getClientList(roomId)
            //console.log(roomId, clientList)
            io.to(roomId).emit(ACTIONS.JOINED, username, clientList, socket.id)
        }
        catch(err){
            console.log(err)
        }
    })
    
    socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) => {
        //io.to(roomId).except(socket.id).emit(ACTIONS.CODE_CHANGE, code)
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, code)
    })
    socket.on(ACTIONS.SYNC_CODE, ({code, socketId}) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, code)
    })

    // socket.on(ACTIONS.LEAVE, (roomId) => {
    //     try{
    //         socket.leave(roomId)
    //         const username = clients[socket.id]
    //         if(username){
    //             const clientList = getClientList(roomId)
    //             io.to(roomId).emit(ACTIONS.DISCONNECTED, username, clientList)
    //             delete clients[socket.id]
    //             console.log(roomId, username, clientList)
    //         }
    //     }
    //     catch(err){
    //         console.log(err)
    //     }
    // })

    socket.on('disconnecting', () => {
        const username = clients[socket.id]
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.leave(roomId)
            const clientList = getClientList(roomId)
            io.to(roomId).emit(ACTIONS.DISCONNECTED, username, clientList)
        });
        delete clients[socket.id];
    });
})

const getClientList = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((clientSocketID) => {      //io.socket.adapter.room is map where key is roomId and its value is set of socketId present in that room 
        if(clients[clientSocketID]){
            return {socketId : clientSocketID , username : clients[clientSocketID]}
        }
        else {
            return null
        }
    }).filter(client => client !== null)

}

