import { v4 as uuidv4 } from 'uuid';



const http = require("http");
const websocketServer = require("websocket").server
const httpServer = http.createServer();
const SERVER_PORT = 8080


httpServer.listen(SERVER_PORT, () => console.log("Listening.. on " + SERVER_PORT))

const app = require("express")();
app.get("/", (req,res)=> res.sendFile(__dirname + "/home.html"))
app.listen(9091, ()=>console.log("Listening on http port 9091"))

//hashmap clients
const clients = {};
const games = {};

const wsServer = new websocketServer({
    "httpServer": httpServer
})


wsServer.on("request", request => {
    //connect
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"))
    connection.on("close", () => console.log("closed!"))
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)
    })

    //generate a new clientId
    const clientId = uuidv4();
    clients[clientId] = {
        "connection":  connection
    }

    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }
    //send back the client connect
    connection.send(JSON.stringify(payLoad))

})


