require('dotenv').config();

const methods = require('./helperFunctions.js')
const webpush = require('web-push');
const admin = require('firebase-admin');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const express = require('express');
const path = require('path');

// Global variables
var datePattern = /\d{4}-\d{2}-\d{2}/;
var timePattern = /\d{1,2}:\d{1,2}:\d{1,2}/;
var dateTime = moment.tz("Asia/Kolkata").format();
const subscription = JSON.parse(process.env.ANDROID_SUBCRIPTION_URL);

// Initializing firebase
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVER_KEY))
})

// Applying settings of web-push
webpush.setVapidDetails(
    "mailto:tanmaychavan1306@gmail.com",
    process.env.PUBLIC_KEY,
    process.env.PRIVATE_KEY
)

// Initializing instance of firestore and express app
const db = admin.firestore();
const app = express();

// Parsing incoming requests with json payloads
app.use(express.json());


// Routes to handle incoming requests
app.get('/sendLogFile', (req, res) => {
    console.log('Reached here...');
    res.sendFile(path.resolve(__dirname, "./log.txt"))
})

app.listen(process.env.PORT, () => {
    console.log('Listening to port ', process.env.PORT);
})



// Schedule operation for morning(12:00) notification
schedule.scheduleJob("0 9 * * *", () => {
    let payload = JSON.stringify({title: `My Meanings for-${dateTime}`})
    webpush.sendNotification(subscription, payload)
    .then(res => methods.log(`Notification sent on ${dateTime.match(datePattern)}`))
    .catch(err => methods.log(err))
})

// Schedule operation for evening(5:30) notification
schedule.scheduleJob("0 13 * * *", () => {
    let payload = JSON.stringify({title: `1st Notification successfull!-${dateTime.match(timePattern)}`})
    webpush.sendNotification(subscription, payload)
    .then(res => methods.log(`Notification sent on 01:00 ${dateTime.match(datePattern)}`))
    .catch(err => methods.log(err))
})

// Schedule operation for night(9:30) notification
schedule.scheduleJob("0 16 * * *", () => {
    let payload = JSON.stringify({title: `My Meanings for-${dateTime.match(timePattern)}`})
    webpush.sendNotification(subscription, payload)
    .then(res => methods.log(`Notification sent on ${dateTime.match(timePattern)}`))
    .catch(err => methods.log(err))
})

// Logging and sending notification of first set-up time to console and in file.
let setupMsg = `Set-up completed on date ${moment.tz('Asia/Kolkata').format().match(datePattern)} and time ${moment.tz('Asia/Kolkata').format().match(timePattern)}`
webpush.sendNotification(subscription, JSON.stringify({title: setupMsg}))
.then(res => methods.log(setupMsg))
.catch(err => methods.log(err))