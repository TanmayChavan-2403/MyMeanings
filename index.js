require('dotenv').config();

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
const subscription = JSON.parse({"endpoint":"https://fcm.googleapis.com/fcm/send/cJJOIp4RMCs:APA91bFlXYfyYboQbRUiKUSMx2rBrnqSdsN676at31V3yvfYHvvPyE9JT7MZ2dAGv0TrQO9UZ9oLqQKqidLMVNY-9JVAa2RhynopDzz6rBAkFtJPhfskyS0WpwTAr31bZN5jECCFkD6S","expirationTime":null,"keys":{"p256dh":"BL03Vcd-S-ZAWnMEXbyB00hqep8zY2_ZL2YIVbfozEZ59T4bnG8ANFcqrUWo3VAYmjUMSxr33En3ZHyhOwmwqIs","auth":"FnSeCTk6oKMfYQ2XMz3DBg"}})

// Applying settings of web-push

// const vapidKeys = webpush.generateVAPIDKeys();
// webpush.setVapidDetails(
//     'mailto:tanmaychavan1306@gmail.com',
//     vapidKeys.publicKey,
//     vapidKeys.privateKey
// );

webpush.setVapidDetails(
    "mailto:codebreakers1306@gmail.com",
    "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo",
    "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM"
)

// Initializing instance of express app and Middleware
const app = express();
app.use(cors());
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
        title: `Today's morning dose.`,
        body: notification[0] + ': ' + notification[1],
        link: "https://my-meanings-server.onrender.com/sendLogFile"
    })
    webpush.sendNotification(subscription, payload)
    .then(data => {
        methods.log(`Notification sent from server on-8:15`)
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
    // })
    // .catch(err => console.log(err));
})

app.listen(4000, () => {
    console.log('Listening to port ', 4000);
})

// Logging and sending notification of first set-up time to console and in file.
// let setupMsg = `Set-up completed on time ${moment.tz('Asia/Kolkata').format().match(timePattern)}`
// webpush.sendNotification(subscription, JSON.stringify({title: setupMsg}))
// .then(res => methods.log(`Set-up completed on date ${moment.tz('Asia/Kolkata').format().match(datePattern)} and on time ${moment.tz('Asia/Kolkata').format().match(timePattern)}`))
// .catch(err => {
//     methods.log(err);
//     console.log(err)
// })