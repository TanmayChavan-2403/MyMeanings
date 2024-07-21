import React, { useState, useEffect } from 'react';
import notifStyles from './notification.module.css';
import { useNavigate } from 'react-router-dom';
import {ServerError} from '../../fallbackComp'


function Notification({ displayMessage }) {
    let navigate = useNavigate();

    const [jobList, udpateJobList] = useState([])
    const [notifTitle, updateNotifTitle] = useState("")
    const [submitBtnStatus, udpateSubmitBtnCol] = useState(true)

    //eslint-disable-next-line
    const [minutes, updateMinutes] = useState(-1)
    const [minutesBorder, updateMinutesBorder] = useState({ borderColor: 'white' })

    //eslint-disable-next-line
    const [hours, updateHours] = useState(['-1', '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'])
    const [hoursBorder, updateHoursBorder] = useState({ borderColor: 'white' })

    //eslint-disable-next-line
    const [mdays, updateMdays] = useState(-1)
    const [mdaysBorder, updateMDaysBorder] = useState({ borderColor: 'white' })

    //eslint-disable-next-line
    const [weekDays, updateWeekDays] = useState(-1)
    const [weekDaysBorder, updateWeekDaysBorder] = useState({ borderColor: 'white' })

    //eslint-disable-next-line
    const [months, updateMonths] = useState(-1)
    const [monthsBorder, updateMonthsBorder] = useState({ borderColor: 'white' })

    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    function updateParam(attr, e) {
        const val = parseInt(e.target.value)
        if (attr === 'minutes') {
            if (-1 <= val && val <= 59) {
                updateMinutes(val)
                updateMinutesBorder({ borderColor: 'green' })
            } else if (isNaN(val)) {
                updateMinutes(-1)
                updateMinutesBorder({ borderColor: 'white' })
            } else {
                updateMinutes(-1)
                updateMinutesBorder({ borderColor: 'red' })
            }
        } else if (attr === 'hours') {
            if (-1 <= val && val <= 23) {
                updateHours(val)
                updateHoursBorder({ borderColor: 'green' })
            } else if (isNaN(val)) {
                updateHours(-1)
                updateHoursBorder({ borderColor: 'white' })
            } else {
                updateHours(-1)
                updateHoursBorder({ borderColor: 'red' })
            }
        } else if (attr === 'weekDays') {
            if (mdays !== -1) {
                updateMdays(-1)
                updateMDaysBorder({ borderColor: "red" })
                displayMessage("You can either set month days or week days, internally it will take default value for another field", false, false, true)
            } else {
                updateMDaysBorder({ borderColor: "white" })
            }
            if (-1 <= val && val <= 7) {
                updateWeekDays(val)
                updateWeekDaysBorder({ borderColor: 'green' })
            } else if (isNaN(val)) {
                updateWeekDays(-1)
                updateWeekDaysBorder({ borderColor: 'white' })
            } else {
                updateWeekDays(-1)
                updateWeekDaysBorder({ borderColor: 'red' })
            }
        } else if (attr === 'months') {
            if (-1 <= val && val <= 12) {
                updateMonths(val)
                updateMonthsBorder({ borderColor: 'green' })
            } else if (isNaN(val)) {
                updateMonths(-1)
                updateMonthsBorder({ borderColor: 'white' })
            } else {
                updateMonths(-1)
                updateMonthsBorder({ borderColor: 'red' })
            }
        } else if (attr === 'mdays') {
            if (weekDays !== -1) {
                updateWeekDays("")
                updateWeekDaysBorder({ borderColor: "red" })
                displayMessage("You can either set month days or week days, internally it will take default value for another field", false, false, true)
            } else {
                updateWeekDaysBorder({ borderColor: "white" })
            }
            if (-1 <= val && val <= 31) {
                updateMdays(val)
                updateMDaysBorder({ borderColor: 'green' })
            } else if (isNaN(val)) {
                updateMdays(-1)
                updateMDaysBorder({ borderColor: 'white' })
            } else {
                updateMdays(-1)
                updateMDaysBorder({ borderColor: 'red' })
            }
        }
    }

    function submitTime() {
        const payload = {
            title: notifTitle,
            minutes: minutes,
            hours: hours,
            mdays: mdays,
            wdays: weekDays,
            months: months
        }
        fetch(`${process.env.REACT_APP_SERVERURL}/addNotificationSlot`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(payload)
        })
        .then(resp => {
            if (resp.status === 401) {
                displayMessage('Session timeout, redirecting to login page', true)
                setTimeout(() => {
                    console.log(">>>>>>>>>>>>>>...NAGIVATING TO LOGIN")
                    // navigate('/login');
                }, 2000);
            } else if (resp.status === 200) {
                displayMessage('Notification added successfully')
            } else if (resp.status === 509) {
                displayMessage('Notification added but something went wrong whlie updating your account', false, true)
            } else if (resp.status === 503){
                setError(true)
                setErrorMessage("Notification Server is Down")
            } else {
                displayMessage('Failed to add notification', true)
            }
        })
    }

    function updateSubmitSection(e){
        updateNotifTitle(e.target.value)
        udpateSubmitBtnCol(e.target.value.length > 0 ? false : true)
    }

    function deleteCronJob(e, jobid){
        
        e.target.src = 'sub-preloader.gif'
        fetch(`${process.env.REACT_APP_SERVERURL}/deleteJob`, {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({jobid})
        })
        .then(resp => {
            if (resp.status == 200){
                displayMessage('Job Deleted successfully')
                let newJobList = jobList.filter(([key, title]) => key != jobid)
                udpateJobList(newJobList)

                let notification_lists = JSON.parse(window.sessionStorage.getItem("notif_lists"))['payload'] || []
                let new_notification_list = notification_lists.filter(([key, title]) => key != jobid)
                window.sessionStorage.setItem('notif_lists', JSON.stringify({payload: new_notification_list}))
            } else if (resp.status == 429){
                e.target.src = 'icons/deleteIcon.svg'
                displayMessage('Rate limit exhausted, please try deleting tomorrow.', false, false, true)
            } else if (resp.status == 500){
                e.target.src = 'icons/deleteIcon.svg'
                displayMessage('Internal server issue, please try again after sometime.')
            }
        })
        .catch(err => {
            e.target.src = 'icons/deleteIcon.svg'
            displayMessage("Couldn't perform this action, please refresh and try again", true)
        })
    }

    useEffect(() => {
        const notification_lists = JSON.parse(window.sessionStorage.getItem("notif_lists")) || []
        if (notification_lists.length === 0) {
            console.log("Requesting notification list")
            fetch(`${process.env.REACT_APP_SERVERURL}/fetchNotificationList`, {
                method: "GET",
                credentials: "include"            
            }).then(resp => {
                if (resp.status === 201){
                    return resp.json()
                } else if (resp.status === 204){
                    return Promise.reject(204);
                }
            })
            .then(data => {
                let temp_holder= []
                Object.entries(data['payload']).forEach(([index, jobObject]) => {
                    temp_holder.push(Object.entries(jobObject)[0])
                })
                window.sessionStorage.setItem('notif_lists', JSON.stringify({payload: temp_holder}))
                udpateJobList(temp_holder)
            })
            .catch(err => {
                if (err === 204){
                    displayMessage('No Notification jobs found', false, false, true);
                } else {
                    displayMessage("Something went wrong while fetching list")
                }
            })
        } else {
            udpateJobList(notification_lists['payload'])
        }
    }, [])

    if (error){
        return(
            <ServerError message={errorMessage} />
        )
    } else {
        return (
            <div id={notifStyles.notification_container_wrapper} class='sb'>
                <div id={notifStyles.notificationContainer}>
                    <div id={notifStyles.notif_list_container}>
                        <div id={notifStyles.notif_input_section}>
                            <h3>Schedule Notification</h3>
                            <div className={notifStyles.input_sec_container}>
                                <div className={notifStyles.notif_input_text}>
                                    <h4>Minutes</h4>
                                </div>
                                <h3>:</h3>
                                <div className={notifStyles.notif_input_box}>
                                    <input style={minutesBorder} onChange={(e) => updateParam('minutes', e)} type="text" placeholder='0 - 59 [-1 default]' className={notifStyles.notif_input_ele} />
                                </div>
                            </div>
                            <div className={notifStyles.input_sec_container}>
                                <div className={notifStyles.notif_input_text}>
                                    <h4>Hours </h4>
                                </div>
                                <h3>:</h3>
                                <div className={notifStyles.notif_input_box}>
                                    <input style={hoursBorder} onChange={(e) => updateParam('hours', e)} type="text" placeholder='0 - 23 [-1 default]' className={notifStyles.notif_input_ele} />
                                </div>
                            </div>
                            <div className={notifStyles.input_sec_container}>
                                <div className={notifStyles.notif_input_text}>
                                    <h4>Days </h4>
                                </div>
                                <h3>:</h3>
                                <div className={notifStyles.notif_input_box}>
                                    <input style={mdaysBorder} onChange={(e) => updateParam('mdays', e)} type="text" placeholder='1 - 31 [-1 default]' className={notifStyles.notif_input_ele} />
                                </div>
                            </div>
                            <div className={notifStyles.input_sec_container}>
                                <div className={notifStyles.notif_input_text}>
                                    <h4>Week Days </h4>
                                </div>
                                <h3>:</h3>
                                <div className={notifStyles.notif_input_box}>
                                    <input style={weekDaysBorder} onChange={(e) => updateParam('weekDays', e)} type="text" placeholder='1 - 7 [-1 default]' className={notifStyles.notif_input_ele} />
                                </div>
                            </div>
                            <div className={notifStyles.input_sec_container}>
                                <div className={notifStyles.notif_input_text}>
                                    <h4>Month </h4>
                                </div>
                                <h3>:</h3>
                                <div className={notifStyles.notif_input_box}>
                                    <input style={monthsBorder} onChange={(e) => updateParam('months', e)} type="text" placeholder='1 - 12 [-1 default]' className={notifStyles.notif_input_ele} />
                                </div>
                            </div>
                            <div id={notifStyles.submitSection}>
                                <input style={monthsBorder} onChange={(e) => updateSubmitSection(e)} type="text" placeholder="Enter title for Notification" className={notifStyles.notifTitleInputBox} />
                                <button onClick={submitTime} id={notifStyles.sumbitButtons} disabled={submitBtnStatus} > Submit </button>
                            </div>
                        </div>
                        <div id={notifStyles.notif_output_section}>
                            <h3>List of Scheduled Notifications</h3>
                            {
                                jobList.map(job => {
                                    return(
                                        <div key={job[0]} className={notifStyles.input_sec_container}>
                                            <div className={notifStyles.jobList}>
                                                <h4>{job[0]}</h4>
                                                <div className={notifStyles.cronJobName}>
                                                    <p>{job[1]}</p>
                                                    <img src="icons/deleteIcon.svg" alt="delete" onClick={(e) => deleteCronJob(e, job[0])}/>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Notification