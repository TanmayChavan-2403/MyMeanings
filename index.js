require('dotenv').config();
const fs = require('fs')

const path = require('path');
const express = require('express');
const webpush = require('web-push');
const moment = require('moment-timezone');
const status = require("./supplementary/status");
const methods = require('./supplementary/helperFunctions');
const Middleware = require('./supplementary/middlewares');
let cors = require('cors');


// Global variables
var datePattern = /\d{4}-\d{2}-\d{2}/;
var timePattern = /\d{1,2}:\d{1,2}:\d{1,2}/;
const subscription = JSON.parse(process.env.SUBSCRIPTION_URL)

// Applying settings of web-push

// const vapidKeys = webpush.generateVAPIDKeys();
// webpush.setVapidDetails(
//     'mailto:tanmaychavan1306@gmail.com',
//     vapidKeys.publicKey,
//     vapidKeys.privateKey
// );

webpush.setVapidDetails(
    "mailto:codebreakers1306@gmail.com",
    process.env.PUBLIC_KEY,
    process.env.PRIVATE_KEY
)

// Initializing instance of express app and Middleware
const app = express();
app.use(cors());
app.set('view engine', 'ejs');
const middleWare = new Middleware();

// Parsing incoming requests with json payloads
app.use(express.json());

app.get('/', async (req, res) => {
    // Check if the dataCount is in range(4)
    res.json({
        hello: "Hey there! Handsome.",
        dataCount: status.dataCount,
        data: status.data,
    });
});


// Routes to handle incoming requests
app.get('/sendLogFile', (req, res) => {
    res.sendFile(path.resolve(__dirname, "./log.txt"))
})

app.get('/notify', middleWare.populateIfLess, async (req, res) => {
    // Getting fresh notification
    const notification = status.data.pop()
    status.updateStatus(1, 'sub')

    // Getting subscription URL from database
    // methods.fetchSubscriptURL()
    // .then(subscription => {
    let payload = JSON.stringify({
        title: '🔔 Todays word:- ' + notification[0],
        body: notification[1],
        flag: false,
        link: "https://my-meanings-server.onrender.com/sendLogFile"
    })
    webpush.sendNotification(subscription, payload)
    .then(data => {
        methods.log(`Notification sent from server successfully [` + moment.tz('Asia/Kolkata').format() + ']')
        res.json({
            notified: 'Success',
            CurrentDataCount: status.dataCount,
            NotificationSent: notification[0] + ':   ' + notification[1],
        })
    })
    .catch(err => {
        methods.log(err)
        res.json({
            notified: 'Failed',
            error: err
        })
    })
})

app.get('/summaryNotification', middleWare.populateIfLess, async (req, res) => {

    let payload = JSON.stringify({
        flag: true,
        title: '🔔 Would you like to see what you have added today?',
        link: "https://my-meanings-server.onrender.com/sendRecentlyAddedList",
    })

    webpush.sendNotification(subscription, payload)
    .then(data => {
        methods.log(`Notification sent from server successfully [` + moment.tz('Asia/Kolkata').format() + ']')
        res.json({
            notified: 'Success',
        })
    })
    .catch(err => {
        methods.log(err)
        res.json({
            notified: 'Failed',
            error: err
        })
    })
})

app.get('/sendRecentlyAddedList', (req, res) =>{
    let meanings = []
    methods.fetchRecentlyAddedList()
    .then(data => {
        for(const property in data){
            meanings.push([property, data[property]])
        }
        res.render('index', {meanings})
    })
    .catch(error => {
        console.log(error)
        methods.log(error)
    })
    // res.render('index', viewsData)
})

app.listen(process.env.PORT, () => {
    console.log('Listening to port ', process.env.PORT);
})