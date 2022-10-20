require('dotenv').config();

const methods = require('./helperFunctions.js')
const webpush = require('web-push');
const admin = require('firebase-admin');
const schedule = require('node-schedule');
const moment = require('moment-timezone');

// Global variables
let DATE = "2022-10-20";
var datePattern = /\d{4}-\d{2}-\d{2}/;
var timePattern = /\d{1,2}:\d{1,2}:\d{1,2}/;
var schedule1 = moment.tz(`${DATE} 12:00`, "Asia/Kolkata").format();
var schedule2 = moment.tz(`${DATE} 17:30`, "Asia/Kolkata").format();
var schedule3 = moment.tz(`${DATE} 21:30`, "Asia/Kolkata").format();
const subscription = JSON.parse(process.env.ANDROID_SUBCRIPTION_URL);

// Initializing firebase
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVER_KEY))
})

// Initializing instance of firestore
const db = admin.firestore();

// Applying settings of web-push
webpush.setVapidDetails(
    "mailto:tanmaychavan1306@gmail.com",
    process.env.PUBLIC_KEY,
    process.env.PRIVATE_KEY
)

// Schedule operation for morning(12:00) notification
schedule.scheduleJob(schedule1, () => {
    let payload = JSON.stringify({title: `My Meanings for-${schedule1}`})
    webpush.sendNotification(subscription, payload)
    .then(res => methods.log(`Notification sent on ${schedule1}`))
    .catch(err => methods.log(err))
})

// Schedule operation for evening(5:30) notification
schedule.scheduleJob(schedule2, () => {
    let payload = JSON.stringify({title: `My Meanings for-${schedule2.match(timePattern)}`})
    webpush.sendNotification(subscription, payload)
    .then(res => methods.log(`Notification sent on ${schedule2}`))
    .catch(err => methods.log(err))
})

// Schedule operation for night(9:30) notification
schedule.scheduleJob(schedule3, () => {
    let payload = JSON.stringify({title: `My Meanings for-${schedule3.match(timePattern)}`})
    webpush.sendNotification(subscription, payload)
    .then(res => methods.log(`Notification sent on ${schedule3.match(timePattern)}`))
    .catch(err => methods.log(err))
})

// Updating the date variable at 12:01 each night
schedule.scheduleJob("1 0 * * *", () => {
    DATE = moment.tz('Asia/Kolkata').format().match(datePattern)[0];
})

// Logging and sending notification of first set-up time to console and in file.
let setupMsg = `Set-up completed on date ${moment.tz('Asia/Kolkata').format().match(datePattern)} and time ${moment.tz('Asia/Kolkata').format().match(timePattern)}`
webpush.sendNotification(subscription, JSON.stringify({title: setupMsg}))
.then(res => methods.log(setupMsg))
.catch(err => methods.log(err))