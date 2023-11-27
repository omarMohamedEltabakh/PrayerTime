
import React, { useEffect, useState } from 'react'
import image1 from "../../Assets/Images/fajr-prayer (1).png"
import image2 from "../../Assets/Images/dhhr-prayer-mosque.png"
import image3 from "../../Assets/Images/asr-prayer-mosque.png"
import image4 from "../../Assets/Images/sunset-prayer-mosque (1).png"
import image5 from "../../Assets/Images/night-prayer-mosque.png"
import axios from 'axios'
// moment ar=====================================>
import moment from 'moment/moment'
import 'moment/locale/ar-dz';
moment.locale("ar")

export default function MainContent() {


    //select city==============================>
    const [selectedCity, setSelectedCity] = useState('القاهرة');

    const handleCityChange = (event) => {

        const selectedValue = event.target.value;
        setSelectedCity(selectedValue);

        if (selectedValue === 'القاهرة') {
            getAllPrayers("Cairo");
        } else if (selectedValue === 'الجيزة') {
            getAllPrayers("Giza");
        } else if (selectedValue === 'الاسكندرية') {
            getAllPrayers("Alexandria");
        } else {
            getAllPrayers("Aswan")
        }
    };

    //get response====================================>
    const [prayer, setPrayer] = useState([])

    async function getAllPrayers(city) {
        let { data } = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=EG&city=${city}`);
        setPrayer(data.data.timings)
    }

    // call response  ,  get current date and time=================================>
    const [today, setToday] = useState("")

    useEffect(() => {

        const t = moment();// t is object  
        setToday(t.format("MMM Do Y | h:mm"))

        getAllPrayers("cairo")

    }, [])

    // A counter to reach the next prayer==================>



    const prayersArray = [
        { key: "Fajr", displayName: "الفجر" },
        { key: "Dhuhr", displayName: "الظهر" },
        { key: "Asr", displayName: "العصر" },
        { key: "Sunset", displayName: "المغرب" },
        { key: "Isha", displayName: "العشاء" },
    ];
    const [nextPrayer, setnextPrayer] = useState()

    const [remainingTime, setRemainingTime] = useState("");


    const setupCountDownTimer = () => {

        const momentNow = moment();
        let prayerIndex = null;


        if (
            momentNow.isAfter(moment(prayer["Fajr"], "hh:mm")) &&
            momentNow.isBefore(moment(prayer["Dhuhr"], "hh:mm"))
        ) {
            prayerIndex = 1;
        } else if (
            momentNow.isAfter(moment(prayer["Dhuhr"], "hh:mm")) &&
            momentNow.isBefore(moment(prayer["Asr"], "hh:mm"))
        ) {
            prayerIndex = 2;
        } else if (
            momentNow.isAfter(moment(prayer["Asr"], "hh:mm")) &&
            momentNow.isBefore(moment(prayer["Sunset"], "hh:mm"))
        ) {
            prayerIndex = 3;
        } else if (
            momentNow.isAfter(moment(prayer["Sunset"], "hh:mm")) &&
            momentNow.isBefore(moment(prayer["Isha"], "hh:mm"))
        ) {
            prayerIndex = 4;
        } else {
            prayerIndex = 0;
        }
        setnextPrayer(prayerIndex);






        // <===================================================================>
        const nextPrayerObject = prayersArray[prayerIndex];
        const nextPrayerTime = prayer[nextPrayerObject.key];
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

        let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
            const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
                moment("00:00:00", "hh:mm:ss")
            );

            const totalDiffernce = midnightDiff + fajrToMidnightDiff;

            remainingTime = totalDiffernce;
        }

        const durationRemainingTime = moment.duration(remainingTime);

        setRemainingTime(
            `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
        );

        // <===================================================================>
    };


    useEffect(() => {

        const time = setInterval(() => {

            setupCountDownTimer()
        }, 1000);

        return () => { // The function will be executed if the unmounting fase 
            clearInterval(time)
        }


    }, [prayer])












    return <>

        <header>


            <div className="container d-flex justify-content-center flex-column  ">

                <div className='  timer row    mb-4 mx-auto text-white  '>

                    <div className=" col-lg-3 col-md-4 col-sm-6 col-6 offset-lg-3 offset-md-2 mb-2  ">
                        <h6 className='mainColor time'>متبقي حتي صلاه {prayersArray[nextPrayer]?.displayName}</h6>
                        <h1 className='text-reversed '>{remainingTime}</h1>
                    </div>

                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 offset-lg-3 offset-md-2 mb-2 ">
                        <h6 className='mainColor date fs-6 d-flex justify-content-end'>{today} </h6>

                        <h1 className='d-flex justify-content-end'>{selectedCity}</h1>
                    </div>

                </div>

                <div className="row row2 ">

                    {/* 1 */}
                    <div className="col-lg-2 col-md-4 offset-lg-1 col-sm-6 col-6  p-1 ">
                        <div className='bg-white pb-2'>

                            <div className='img d-flex flex-column justify-content-center text-center'>
                                <img className='w-100' src={image5} alt="" />
                            </div>

                            <h5 className='white d-flex justify-content-end mt-4 me-2 '>العشاء</h5>
                            <h1 className='me-2 mt-3 d-flex justify-content-end mb-4 pb-2'>{prayer?.Isha}</h1>

                        </div>
                    </div>

                    {/* 2 */}
                    <div className="col-lg-2 col-md-4 col-sm-6 col-6  p-1 ">
                        <div className='bg-white pb-2'>

                            <div className='img d-flex flex-column justify-content-center text-center'>
                                <img className='w-100' src={image4} alt="" />
                            </div>

                            <h5 className='white d-flex justify-content-end mt-4 me-2 '>المغرب</h5>
                            <h1 className='me-2 mt-3 d-flex justify-content-end mb-4 pb-2'>{prayer?.Maghrib}</h1>
                        </div>
                    </div>

                    {/* 3 */}
                    <div className="col-lg-2 col-md-4 col-sm-6 col-6  p-1 ">
                        <div className='bg-white pb-2'>

                            <div className='img d-flex flex-column justify-content-center text-center'>
                                <img className='w-100' src={image3} alt="" />
                            </div>

                            <h5 className='white d-flex justify-content-end mt-4 me-2 '>العصر</h5>
                            <h1 className='me-2 mt-3 d-flex justify-content-end mb-4 pb-2'>{prayer?.Asr}</h1>
                        </div>
                    </div>

                    {/* 4 */}
                    <div className="col-lg-2 col-md-4 col-sm-6 col-6  p-1 ">
                        <div className='bg-white pb-2'>

                            <div className='img d-flex flex-column justify-content-center text-center'>
                                <img className='w-100' src={image2} alt="" />
                            </div>

                            <h5 className='white d-flex justify-content-end mt-4 me-2 '>الظهر</h5>
                            <h1 className='me-2 mt-3 d-flex justify-content-end mb-4 pb-2'>{prayer?.Dhuhr}</h1>
                        </div>
                    </div>

                    {/* 5 */}
                    <div className="col-lg-2 col-md-4 col-sm-6 col-6  p-1 ">
                        <div className='bg-white pb-2'>

                            <div className='img d-flex flex-column justify-content-center text-center'>
                                <img className='w-100' src={image1} alt="" />
                            </div>

                            <h5 className='white d-flex justify-content-end mt-4 me-2 '>الفجر</h5>
                            <h1 className='me-2 mt-3 d-flex justify-content-end mb-4 pb-2'>{prayer?.Fajr}</h1>
                        </div>
                    </div>

                </div>

                <div className='d-flex justify-content-center mt-4'>

                    <select
                        className="form-select rounded-1 text-white "
                        value={selectedCity}
                        onChange={handleCityChange}
                    >
                        <option value="">اختر المدينة</option>
                        <option value="القاهرة">القاهرة</option>
                        <option value="الجيزة">الجيزة</option>
                        <option value="الاسكندرية">الاسكندرية</option>
                        <option value="اسوان">اسوان</option>
                    </select>
                </div>
            </div>
        </header>


    </>
}
