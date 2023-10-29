const express = require("express")
const { MongoClient } = require("mongodb")
const cors = require("cors")
const net = require("net")

const HTTP_PORT = 8000
const SERVER_PORT = 9000
const DATABASE_URI = "mongodb://127.0.0.1:27017"

const client = new MongoClient(DATABASE_URI)
const app = express(cors())
const tcpServer = net.createServer(serverSockerHandler)

let geolocationCoordinates = {}
let destinationLocation = null
let database = null

app.use(express.static("public"))

function serverSockerHandler(socket){
    
    let locationData = database.collection("locationData")

    socket.setEncoding('utf-8')

    socket.on('data', (data) => {
        try{
            let args = data.replace("\r", "").replace("\n", "").split(",")

            geolocationCoordinates._id = Math.random().toString().split(".")[1]
            geolocationCoordinates.latitude = args[0]
            geolocationCoordinates.longitude = args[1]
            geolocationCoordinates.time = Date().toString()

            locationData.insertOne(geolocationCoordinates)
        }catch(e){
            console.log("[!] DATA ERROR")
        }
    })

    socket.on('end', () => {})

}

async function userLoginEndPoint(req, res){
    try{

        let userQuery = req.query

        let users = database.collection("users")
       
        users.findOne(userQuery).then( result => {
            if(result){
                if(result.type == 'client'){
                    res.json({error:200, message:"client.html"})  
                }else if(result.type == 'driver'){
                    res.json({error:200, message:"driver.html"})  
                }
            }else{
                res.json({error:403, message:"Invalid Username or Password"})  
            }
        }).catch(e => {
            res.json({error:500, message:"Internal Error"})  
        })

    }catch(e){
        res.json({error:500, message:"Internal Error"})   
    }

}


async function locationDataPull(req, res){
    try{
        let locationData = database.collection("locationData")
        let dataArray = []

        let cursor = locationData.find({})

        for await(const doc of cursor){
            dataArray.push(doc)
        }
       
        await res.json({error:200, message:dataArray})

    }catch(e){
        res.json({error:500, message:"Internal Error"})  
    }
}


function setDestination(req, res){
    try{
        let locationData = req.query
        destinationLocation = locationData
        locationData.epoch = Date().toString();
        let destinationLog = database.collection("destinationLog")
        destinationLog.insertOne(locationData)
    }catch(e){
        res.json({error:500, message:"Internal Error"})   
    }
}

function getDestinationEndpoint(req, res){
    try{
        res.json({error:200, message:destinationLocation})
    }catch(e){
        res.json({error:500, message:"Internal Error"})   
    }
}

function getLocationEndpoint(req, res){
    try{
        res.json({error:200, message:geolocationCoordinates})
    }catch(e){
        res.json({error:500, message:"Internal Error"})   
    }
}


app.get("/login", userLoginEndPoint)
app.get("/log", locationDataPull)
app.get("/set-destination", setDestination)
app.get("/get-destination", getDestinationEndpoint)
app.get("/location", getLocationEndpoint)

tcpServer.listen(SERVER_PORT, '0.0.0.0' , () => {
    console.log("[+] GPS-TCP: ONLINE")
})

app.listen(HTTP_PORT, () => {
    client.connect();
    database = client.db("trackR")
    console.log("[+] Backend-API: ONLINE")
})