import React, { useState } from 'react';
import notifStyles from './notification.module.css';
import { useNavigate } from 'react-router-dom';


function Notification({displayMessage}){
    let navigate = useNavigate();

    //eslint-disable-next-line
    const [minutes, updateMinutes] = useState([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59])
    const [selectedMinute, updateSelectedMinute] = useState(-1)

    //eslint-disable-next-line
    const [hours, updateHours] = useState(['-1','00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'])
    const [selectedHour, updateSelectedHour] = useState(-1)

    //eslint-disable-next-line
    const [mdays, updateMdays] = useState([-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
    const [selectedMDays, updateSelectedMDays] = useState(-1)

    //eslint-disable-next-line
    const [weekDays, updateWeekDays] = useState([-1, "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
    const [selectedWeekDay, updateSelectedWeekDay] = useState(-1)

    //eslint-disable-next-line
    const [months, updateMonths] = useState([-1, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])
    const [selectedMonth, updateSelectedMonths] = useState(-1)


    function checkPos(e){
        let attr = e.target.attributes['data-ele'].nodeValue
        if (e.target.scrollTop % 50 === 0){
            if (attr === 'minutes'){
                updateSelectedMinute(minutes[e.target.scrollTop / 50])
            } else if(attr === 'hours'){
                updateSelectedHour(hours[e.target.scrollTop / 50])
            } else if(attr === 'weekDays'){
                updateSelectedWeekDay(weekDays[e.target.scrollTop / 50])
            } else if (attr === 'months'){
                updateSelectedMonths(months[e.target.scrollTop / 50])
            } else if (attr === 'mdays') {
                updateSelectedMDays(mdays[e.target.scrollTop / 50])
            }else {
                updateSelectedMonths(mdays[e.target.scrollTop / 50])
            }
        }
    }

    function submitTime(){
        const payload = {
            title: "Static Title",
            minutes: selectedMinute,
            hours: selectedHour,
            mdays: selectedMDays,
            wdays: selectedWeekDay,
            months: selectedMonth
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
                displayMessage('Session timeout, please login again', true)
                setTimeout(() => {
                    navigate('login', { replace: true });
                }, 2000);
            } else if (resp.status === 200){
                displayMessage('Notification added successfully')
            } else if (resp.status === 509){
                displayMessage('Notification added but something went wrong whlie updating your account')
            } else {
                console.log(resp.status)
                displayMessage('Failed to add notification', true)
            }
        })
    }

    return(
        <div id={notifStyles.notification_container_wrapper} class='sb'>
            <div id={notifStyles.notificationContainer}>
                <div className={notifStyles.data_container_wrapper}>
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
                </div>
            </div>
            <button onClick={submitTime} id={notifStyles.submitTime}>Submit</button>
        </div>
    )
}

export default Notification