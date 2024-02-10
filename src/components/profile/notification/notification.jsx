import React, { useState } from 'react';
import notifStyles from './notification.module.css';
import { useNavigate } from 'react-router-dom';


function Notification({displayMessage}){
    let navigate = useNavigate();

    //eslint-disable-next-line
    const [minutes, updateMinutes] = useState(-1)
    const [minutesBorder, updateMinutesBorder] = useState({borderColor: 'white'})

    //eslint-disable-next-line
    const [hours, updateHours] = useState(['-1','00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'])
    const [hoursBorder, updateHoursBorder] = useState({borderColor: 'white'})

    //eslint-disable-next-line
    const [mdays, updateMdays] = useState(-1)
    const monthDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    const [mdaysBorder, updateMDaysBorder] = useState({borderColor: 'white'})

    //eslint-disable-next-line
    const [weekDays, updateWeekDays] = useState(-1)
    const weekDaysList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const [weekDaysBorder, updateWeekDaysBorder] = useState({borderColor: 'white'})

    //eslint-disable-next-line
    const [months, updateMonths] = useState(-1)
    const monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const [monthsBorder, updateMonthsBorder] = useState({borderColor: 'white'})

    function updateParam(attr, e){
        const val = parseInt(e.target.value)
        if (attr === 'minutes'){
            if (-1 <= val && val <= 59){
                updateMinutes(val)
                updateMinutesBorder({borderColor: 'green'})
            } else if (isNaN(val)) {
                updateMinutes(-1)
                updateMinutesBorder({borderColor: 'white'})
            } else {
                updateMinutes(-1)
                updateMinutesBorder({borderColor: 'red'})
            }
        } else if(attr === 'hours'){
            if (-1 <= val && val <= 23){
                updateHours(val)
                updateHoursBorder({borderColor: 'green'})
            } else if (isNaN(val)) {
                updateHours(-1)
                updateHoursBorder({borderColor: 'white'})
            } else {
                updateHours(-1)
                updateHoursBorder({borderColor: 'red'})
            }
        } else if(attr === 'weekDays'){
            if (mdays !== -1){
                updateMdays(-1)
                updateMDaysBorder({borderColor: "red"})
                displayMessage("You can either set month days or week days, internally it will take default value for another field", false, false, true)
            } else {
                updateMDaysBorder({borderColor: "white"})
            }
            if (-1 <= val && val <= 7){
                updateWeekDays(val)
                updateWeekDaysBorder({borderColor: 'green'})
            } else if (isNaN(val)) {
                updateWeekDays(-1)
                updateWeekDaysBorder({borderColor: 'white'})
            } else {
                updateWeekDays(-1)
                updateWeekDaysBorder({borderColor: 'red'})
            }
        } else if (attr === 'months'){
            if (-1 <= val && val <= 12){
                updateMonths(val)
                updateMonthsBorder({borderColor: 'green'})
            } else if (isNaN(val)) {
                updateMonths(-1)
                updateMonthsBorder({borderColor: 'white'})
            } else {
                updateMonths(-1)
                updateMonthsBorder({borderColor: 'red'})
            }
        } else if (attr === 'mdays') {
            if (weekDays !== -1){
                updateWeekDays("")
                updateWeekDaysBorder({borderColor: "red"})
                displayMessage("You can either set month days or week days, internally it will take default value for another field", false, false, true)
            } else {
                updateWeekDaysBorder({borderColor: "white"})
            }
            if (-1 <= val && val <= 31){
                updateMdays(val)
                updateMDaysBorder({borderColor: 'green'})
            } else if (isNaN(val)) {
                updateMdays(-1)
                updateMDaysBorder({borderColor: 'white'})
            } else {
                updateMdays(-1)
                updateMDaysBorder({borderColor: 'red'})
            }
        }
    }

    function submitTime(){
        const payload = {
            title: "Static Title",
            minutes: minutes,
            hours: hours,
            mdays: mdays,
            wdays: weekDays,
            months: months
        }
        fetch(`${process.env.REACT_APP_SERVERURL}/addNotificationSlot`, {
            method: "POST",
            headers:{
                'Content-type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(payload)
        })
        .then(resp => {
            if (resp.status === 401){
                displayMessage('Session timeout, redirecting to login page', true)
                setTimeout(() => {
                    console.log("LOgging out from notification")
                    navigate('/login', { replace: true });
                }, 2000);
            } else if (resp.status === 200){
                displayMessage('Notification added successfully')
            } else if (resp.status === 509){
                displayMessage('Notification added but something went wrong whlie updating your account', false, true)
            } else {
                console.log(resp.status)
                displayMessage('Failed to add notification', true)
            }
        })
    }

    return(
        <div id={notifStyles.notification_container_wrapper} class='sb'>
            <div id={notifStyles.notificationContainer}>
                <div id={notifStyles.notif_list_container}>
                    <div id={notifStyles.notif_input_section}>
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
                                <input style={hoursBorder} onChange={(e) => updateParam('hours', e)} type="text" placeholder='0 - 23 [-1 default]' className={notifStyles.notif_input_ele}/>
                            </div>
                        </div>
                        <div className={notifStyles.input_sec_container}>
                            <div className={notifStyles.notif_input_text}>
                                <h4>Days </h4>
                            </div>
                            <h3>:</h3>
                            <div className={notifStyles.notif_input_box}>
                                <input style={mdaysBorder} onChange={(e) => updateParam('mdays', e)} type="text" placeholder='1 - 31 [-1 default]' className={notifStyles.notif_input_ele}/>
                            </div>
                        </div>
                        <div className={notifStyles.input_sec_container}>
                            <div className={notifStyles.notif_input_text}>
                                <h4>Week Days </h4>
                            </div>
                            <h3>:</h3>
                            <div className={notifStyles.notif_input_box}>
                                <input style={weekDaysBorder} onChange={(e) => updateParam('weekDays', e)} type="text" placeholder='1 - 7 [-1 default]' className={notifStyles.notif_input_ele}/>
                            </div>
                        </div>
                        <div className={notifStyles.input_sec_container}>
                            <div className={notifStyles.notif_input_text}>
                                <h4>Month </h4>
                            </div>
                            <h3>:</h3>
                            <div className={notifStyles.notif_input_box}>
                                <input style={monthsBorder} onChange={(e) => updateParam('months', e)} type="text" placeholder='1 - 12 [-1 default]' className={notifStyles.notif_input_ele}/>
                            </div>
                        </div> 
                        <button onClick={submitTime} id ={notifStyles.sumbitButtons}> Submit </button>
                    </div>
                    <div id={notifStyles.notif_output_section}>
                        
                    </div>
                </div>
                
                

                {/* <div className={notifStyles.data_container_wrapper}>
                    <h2>Minutes</h2>
                    <div className={notifStyles.data_container} data-ele='minutes' onScroll={checkPos}>
                        {
                            minutes.map((element) => {
                                return(
                                    <div className={notifStyles.display_block}>
                                        <h3>{element}</h3>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={notifStyles.data_container_wrapper}>
                    <h2>Hours</h2>
                    <div className={notifStyles.data_container} data-ele='hours' onScroll={checkPos}>
                        {
                            hours.map((element) => {
                                return(
                                    <div className={notifStyles.display_block}>
                                        <h3>{element}</h3>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={notifStyles.data_container_wrapper}>
                    <h2>Month Days</h2>
                    <div className={notifStyles.data_container} data-ele='mdays' onScroll={checkPos}>
                        {
                            mdays.map((element) => {
                                return(
                                    <div className={notifStyles.display_block}>
                                        <h3>{element}</h3>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={notifStyles.data_container_wrapper}>
                    <h2>Week Days</h2>
                    <div className={notifStyles.data_container} data-ele='weekDays' onScroll={checkPos}>
                        {
                            weekDays.map((element) => {
                                return(
                                    <div className={notifStyles.display_block}>
                                        <h3>{element}</h3>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={notifStyles.data_container_wrapper}>
                    <h2>Months</h2>
                    <div className={notifStyles.data_container} data-ele='months' onScroll={checkPos}>
                        {
                            months.map((element) => {
                                return(
                                    <div className={notifStyles.display_block}>
                                        <h3>{element}</h3>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div> */}
            </div>
            {/* <button onClick={submitTime} id={notifStyles.submitTime}>Submit</button> */}
        </div>
    )
}

export default Notification