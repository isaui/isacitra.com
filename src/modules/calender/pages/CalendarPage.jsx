import { HomepageNav } from "../../../components/nav/Nav";
import Footer from "../../../components/footer/Footer";
import SectionButton from "../component/Section";
import { useEffect, useState, useRef } from "react";
import EventCard, { AuthorizedEventCard } from "../component/Event";
import BookingCard from "../component/BookingCard";
import Calendar from "react-calendar";
import "../styles.css"
import TimeCard from "../component/TimeCard";
import DemoScheduler from "../component/DemoScheduler";
import BookingModal from "../component/BookingModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import BASE_URL from "../../../api/base_url";
import { useSelector } from "react-redux";



//import query from "../../../../postgres/query";
function formatISO8601ToHHMM(iso8601DateTime) {
    const isoStringWithUTC = iso8601DateTime;

    const dateObj = new Date(isoStringWithUTC);
    dateObj.setUTCHours(dateObj.getUTCHours() + 7);
    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
  
    return formattedTime;
  }


const formatDate = (inputDate) => {
    // Buat objek Date dari string tanggal
    const dateObject = new Date(inputDate);
  
    // Daftar nama bulan dalam bahasa Inggris
    const monthNames = [
      'Januari', 'Februari', 'Maret',
      'April', 'Mei', 'Juni', 'Juli',
      'Agustus', 'September', 'Oktober',
      'November', 'Desember'
    ];
  
    // Ambil informasi tanggal, bulan, dan tahun dari objek Date
    const day = dateObject.getDate();
    const monthIndex = dateObject.getMonth();
    const year = dateObject.getFullYear();
  
    // Konstruksi string dengan format yang diinginkan
    const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;
  
    return formattedDate;
  };

  function convertISOToGMTMinus7(isoString) {
    const date = new Date(isoString);
    
    // Mengurangkan offset waktu GMT-7
    date.setHours(date.getHours() - 7);
    
    // Menghasilkan string dengan zona waktu GMT-7
    return date.toISOString();
}

  function toTimestamp(timeStr, dateStr) {
    // Dapatkan string datetime dalam format ISO 8601
    const iso8601DateTime = `${dateStr}T${timeStr}:00Z`;

  //  console.log(convertISOToJakartaTime(iso8601DateTime))
    return convertISOToGMTMinus7(iso8601DateTime);
  }

  const formatDateToString = (dateObject) => {
    const monthNames = [
        'Januari', 'Februari', 'Maret',
        'April', 'Mei', 'Juni', 'Juli',
        'Agustus', 'September', 'Oktober',
        'November', 'Desember'
      ];
    
      // Ambil informasi tanggal, bulan, dan tahun dari objek Date
      const day = dateObject.getDate();
      const monthIndex = dateObject.getMonth();
      const year = dateObject.getFullYear();
    
      // Konstruksi string dengan format yang diinginkan
      const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;
    
      return formattedDate;
  }

  function areDateStringEqual(dateString1, dateString2) {
    // Buat objek Date dari string tanggal pertama
    const date1 = new Date(dateString1);
    // Buat objek Date dari string tanggal kedua
    const date2 = new Date(dateString2);
  
    // Bandingkan kedua tanggal tanpa memperhatikan jam, menit, detik, dan milidetik
    const strippedDate1 = new Date(date1.toDateString());
    const strippedDate2 = new Date(date2.toDateString());
  
    return strippedDate1.getTime() === strippedDate2.getTime();
  }

  function areDateEqual(d1,d2){
   // console.log(formatDate(d1))
   // console.log(formatDate(d2))
   // console.log('#############################################')
    return formatDate(d1) == formatDate(d2)
  }

const CalendarPage = () => {
    const [selectedSection, setSelectedSection] = useState('Events')

    const user = useSelector((state) => state.auth.user)
    const [events, setEvents] = useState({});
    const [dates, setDates] = useState({});
    const [sessions, setSessions] = useState({});
    const [booking, setBooking] = useState({});
    const [npm, setSelectedNpm] = useState(null);
    const [needFetch, setNeedFetch] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isModalActive, setIsModalActive] = useState(false)
    const [filterTime, setFilterTime] = useState([])
    const [selectedSession, setSelectedSession] = useState(null)
    const textFieldRef = useRef(null);

   
    
      useEffect(() => {
        // Panggil fungsi scrollToTop() saat komponen dimuat
        scrollToTop();
      }, []);
    
   // const [rawNpm, setRawNpm] = useState('')

    const section = !user ? ['Events', 'Your Booking'] :  ['Events', 'Your Booking', 'Admin'];


    const fetchData = async () => {
        const queryStr = `SELECT DISTINCT de.demoEventId, de.title, de.startDate, de.endDate, de.isActive, de.email as demoeventemail,
        ds.demoSessionDateId, ds.date, d.demoSessionId ,d.startTime, d.endTime, b.bookingDemoId, b.nomorMahasiswa, b.status, b.platform, b.email FROM DEMO_EVENT de LEFT JOIN
        DEMO_SESSIONS_DATE ds ON de.demoEventId = ds.demoEventId LEFT JOIN DEMO_SESSION d ON 
        ds.demoSessionDateId = d.demoSessionDateId LEFT JOIN BOOKING_DEMO b ON b.demoSessionId = d.demoSessionId;`
        const res = await axios.post(BASE_URL+'/postgres/', {
            queryString: queryStr
        })

     //   console.log(res.data)
        const result = res.data.result;
        const rows = result.rows;
       

        const eventsMap = {}
        const dateMap = {}
        const sessionMap = {}
        const bookingDemo = {}

        for(let i = 0; i < rows.length; i++){
            
            const row = rows[i];
            const eventId = row.demoeventid;
            const eventOwnerEmail = row.demoeventemail
            const startDate = row.startdate;
            const endDate = row.enddate;
            const eventTitle = row.title;
            const isActive = row.isactive;
            const demoSessionDateId = row.demosessiondateid;
            const sessionId = row.demosessionid;
            const date = row.date;
            const endTime = row.endtime;
            const startTime = row.starttime;
            const bookingDemoId = row.bookingdemoid;
            const nomorMahasiswa = row.nomormahasiswa;
            const bookingDemoStatus = row.status;
            const platform = row.platform;
            const email = row.email;
       //     console.log(row)

            if(eventId != null){
                eventsMap[eventId] = {
                    id: eventId,
                    email: eventOwnerEmail,
                    startDate: startDate,
                    endDate: endDate,
                    title: eventTitle,
                    isActive:isActive
                }
              //  console.log(startDate)
            }
            if(eventId != null && demoSessionDateId != null){
                dateMap[demoSessionDateId] = {
                    id: demoSessionDateId,
                    eventId: eventId,
                    date: date
                }
            }
            if(demoSessionDateId != null){
                sessionMap[sessionId] = {
                    id: sessionId,
                    dateId: demoSessionDateId,
                    startTime: startTime,
                    endTime: endTime,
                    //isAvailable: sessionMap[sessionId] && sessionMap[sessionId] == true? true :  bookingDemoStatus != 'active' ? true: false
                }
                
            }
            if(eventId != null && sessionId != null && bookingDemoId != null){
                bookingDemo[bookingDemoId] = {
                    bookingDemoId:bookingDemoId,
                    date:date,
                    eventName: eventTitle,
                    owner:eventOwnerEmail,
                    eventId:eventId,
                    demoSessionId: sessionId,
                    npm: nomorMahasiswa,
                    status: bookingDemoStatus,
                    startTime: startTime,
                    endTime: endTime,
                    platform: platform,
                    email: email
                }
            }
        }
        setEvents(eventsMap)
        setSessions(sessionMap)
        setDates(dateMap)
        setBooking(bookingDemo)
        setSelectedEvent(null)
        setSelectedDate(null)
    }

    const synchronizeData = () => {
        if( selectedEvent != null && !events[selectedEvent.id]){
            setSelectedEvent(null)
            setSelectedDate(null)
            setFilterTime(null)
            setSelectedSession(null)
        }
    }

    const fireFetch = () => {
        setNeedFetch(prev => !prev)
    }

    

    useEffect(()=>{
        fetchData()
    },[needFetch])
    useEffect(()=>{
        synchronizeData()
    },[events])

    useEffect(()=>{
        if(selectedEvent == null){
            return
        }
        if(selectedDate == null){
            return
        }
        
        const res = Object.values(dates).find(dt => {
           // console.log(typeof selectedDate)
            //console.log('ARE DATE EQUAL? ', areDateEqual(dt.date, selectedDate) )
            //console.log('d1 ', dt.date)
           // console.log('d kita ', selectedDate)
            //console.log('/////////////////////////////////////////////////////////////////////////////////////')
            //console.log('ARE EVENT EQUAL? ', dt.eventId == selectedEvent.id)
            return areDateEqual(dt.date, selectedDate) && dt.eventId == selectedEvent.id
        });
        if(res){
            const filteredTime = Object.values(sessions).filter(session => session.dateId == res.id && 
                Object.values(booking).filter(book => (book.status == 'active' || book.status == 'completed')&& 
                session.id == book.demoSessionId).length == 0);
            setFilterTime(filteredTime)
        }
        else{
           // console.log("YOLLOW")
            setFilterTime([])
        }
        setSelectedSession(null)
        
    }, [selectedEvent, selectedDate])


    useEffect(()=>{
        setSelectedDate(null)
        setFilterTime([])
    },[selectedEvent])

    const handleTextFieldChange = () => {
        //const textFieldValue = textFieldRef.current.value;
        // Lakukan sesuatu dengan nilai sementara
      //  console.log(textFieldValue);
      };
    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };

    

    return (<div className=" bg-slate-900">
    <div className='mx-auto min-h-screen flex justify-center items-center flex-col w-full max-w-[1600px] '>
        <HomepageNav floatingButtonOpen={true}/>
        {isModalActive && <BookingModal onClose={()=>{setIsModalActive(false)
        }
        
    }
    onError={(err)=>{toast.error(err)}}
    onSubmit={async (platform, email)=>{
        const bookingDemoId = uuidv4()
        const prequery = `SELECT DEMO_EVENT.demoEventId FROM DEMO_EVENT
        INNER JOIN DEMO_SESSIONS_DATE ON DEMO_EVENT.demoEventId = DEMO_SESSIONS_DATE.demoEventId
        INNER JOIN DEMO_SESSION ON DEMO_SESSIONS_DATE.demoSessionDateId = DEMO_SESSION.demoSessionDateId
        INNER JOIN BOOKING_DEMO ON BOOKING_DEMO.demoSessionId = DEMO_SESSION.demoSessionId WHERE 
        DEMO_EVENT.demoEventId = '${selectedEvent.id}'AND BOOKING_DEMO.status = 'active' AND BOOKING_DEMO.nomorMahasiswa = '${npm}' `
        const response = await axios.post(BASE_URL+'/postgres/', {
            queryString: prequery
        })
        const result = response.data.result;
        //console.log(result)
        if(result.rows.length > 0){
            toast.error('Anda harus membatalkan demo yang aktif yang dibuat sebelumnya di '+selectedEvent.title)
            return
        }
        else{
            console.log(selectedSession.id)
            const query = `INSERT INTO BOOKING_DEMO (bookingDemoId, demoSessionId, nomorMahasiswa, status, platform, email) VALUES
            ('${bookingDemoId}', '${selectedSession.id}', '${npm}', 'active', '${platform}', '${email}') RETURNING 1;`
            try {
                setSelectedSection(section[1])
                scrollToTop()
                const res = await axios.post(BASE_URL+'/postgres/', {
                    queryString: query
                })
                console.log(res)
                try {
                    await axios.post(BASE_URL+'/postgres/schedule-email', {
                        id: bookingDemoId,
                        taskType: 'NOTIFY'
                    })
                } catch (error) {
                    console.log(error)
                }
                toast.success('Berhasil membooking demo')
                fireFetch()
                
            } catch (error) {
                fireFetch()
                console.log(error.response.data.message)
                toast.error(error.response.data.message)
            }
        }
        
        
        
    }} />}
     <div className='homepage-content  min-h-screen w-full flex flex-col my-auto items-center max-w-full'>
        <div className="mx-auto max-w-5xl min-h-screen w-full pt-24 px-4 pb-10 container flex flex-col bgx-red-500">
            <ToastContainer/>
           {
            !npm &&  <div className="mb-4 max-w-2xl  w-full flex flex-col space-y-4 md:space-y-0 mx-auto md:flex-row md:items-center md:space-x-4">
            <input ref={textFieldRef} onChange={handleTextFieldChange} required type="text" id="nim" name="nim" placeholder='Enter your NPM'className="border  border-neutral-700 rounded-md w-full text-white px-3 py-3 mt-1 bg-neutral-900" />
            <button onClick={
                () => {
                    if(!textFieldRef.current){
                        toast.error('Terjadi kesalahan dengan sistem')
                        return
                    }
                    else{
                        if (!/^\d+$/.test(textFieldRef.current.value)) {
                            toast.error('Masukkan hanya angka (digit)!');
                            return;
                          }
                        toast.success('Berhasil masuk dengan npm')
                        setSelectedNpm(textFieldRef.current.value)
                        fireFetch()
                    }
                }
            } className="rounded-md w-min px-2 md:px-3 py-1 md:py-3 ml-auto text-center text-white bg-teal-800">Submit</button>
            </div>
           }
            
            <div className="flex flex-col  w-full bgx-blue-400 mb-4">
                <h1 className="text-2xl font-bold text-white"> Scheduler</h1>
                <h1 className="text-base font-bold text-blue-500"> {npm? `Logged in as ${npm}` : 'Anonim'}</h1>
            </div>
            <div className="w-full flex space-x-2 px-1 rounded-md bg-neutral-950 items-start py-2">
                {
                    section.map((sc)=>{
                        return <SectionButton key={sc+'-section'} props={{
                            title: sc,
                            isActive: sc == selectedSection,
                            callback: (title) => {
                                setSelectedSection(title)
                            }
                        }}/>
                    })
                }    
            </div>
            {
                selectedSection == 'Events' && <div className="w-full flex flex-col mt-2 space-y-2">
                    {
                        Object.entries(events).length != 0 && 
                        Object.entries(events).map(([key, value])=> {
                            return <div key={key+'-card'} className={`flex w-full rounded-md ${selectedEvent && selectedEvent.id == key? 
                            'border-4 border-blue-800':''}`}>
                                <EventCard  props={{
                                    owner: value.email,
                                title: value.title,
                                action: selectedEvent && selectedEvent.id == key? 'Selected' : 'Select',
                                timeRange: 
                                    `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`,
                                isActive:value.isActive,
                                callback: ()=>{
                                    if(npm){
                                        setSelectedEvent(value)
                                    }
                                    else{
                                        toast.error('Kamu harus memasukkan npm-mu')
                                    }
                                    
                                }
                            }}/>
                            </div>
                        })
                    }
                    {
                        Object.entries(events).length == 0 && <div
                        className="w-full flex flex-col min-h-[12rem] items-center justify-center bg-slate-950 text-white rounded-md"
                        >
                            <h1>Belum ada event yang tersedia</h1>
                        </div>
                    }
                
            </div>
                }
                {
                    selectedSection == 'Your Booking' &&  Object.values(booking).filter(book => book.npm == npm).length == 0  &&
                    <div
                        className="w-full flex flex-col min-h-[12rem] mt-2 items-center justify-center bg-slate-950 text-white rounded-md"
                        >
                            <h1>Kamu Belum Ngapa-Ngapain</h1>
                        </div>
                }
            {
              Object.values(booking).filter(book => book.npm == npm).length >= 0 &&  selectedSection == 'Your Booking' && <div className="w-full flex flex-col mt-2 space-y-2">
                {
                   /* myBooked.map(bookData=>{
                        return <BookingCard key={bookData.id}
                        
                        props={
                            {
                                time: `${bookData.sessionData.startTime} - ${bookData.sessionData.endTime}`,
                                                            }

                        }
                        />})*/
                    Object.values(booking).filter(book => book.npm == npm).sort((a, b) => {
                        const statusOrder = ['active', 'cancelled', 'completed'];
                      
                        // Menentukan urutan status untuk a dan b
                        const orderA = statusOrder.indexOf(a.status);
                        const orderB = statusOrder.indexOf(b.status);
                      
                        // Membandingkan berdasarkan urutan status
                        return orderA - orderB;
                      }).map((book)=>{
                    return <BookingCard key={book.bookingDemoId} props={{
                    owner:book.owner,
                    time: `${formatISO8601ToHHMM(book.startTime)} - ${formatISO8601ToHHMM(book.endTime)} WIB (${formatDate(book.date)})`,
                    title: 'Demo '+ book.eventName,
                    onCancel: async () => {

                        const query = `UPDATE BOOKING_DEMO SET status = 'cancelled' WHERE bookingDemoId
                         = '${book.bookingDemoId}' RETURNING 1;`
                        await axios.post(BASE_URL+'/postgres/', {
                            queryString: query
                        })
                        try {
                            await axios.post(BASE_URL+'/postgres/schedule-email', {
                                id: book.bookingDemoId,
                                taskType: 'INFO',
                                subject: 'Pembatalan Demo',
                                text: ' telah dibatalkan oleh yang bersangkutan.'
                            })
                        } catch (error) {
                            console.log(error)
                        }
                        fireFetch()
                    },
                    status: book.status,
                    platform: book.platform,
                    email: book.email
                    }}/>
                    })
                }
                
            </div>
            }
            
            {
                selectedSection == section[0] && selectedEvent != null && 
                <div className="mt-4 w-full min-h-[12rem]">
                <div className="flex items-center w-full mb-4">
                    <h1 className="text-white text-2xl font-semibold"> Pilih Tanggal </h1>
                </div>
                <div className="w-full items-center flex">
                <Calendar
                  //activeStartDate={new Date(selectedEvent.startDate)}
                  className={'w-full'}
                  onChange={(date) => {
                 // console.log(typeof date)
                  setSelectedDate(date)}}
                  value={selectedDate}
                  minDate={new Date() > new Date(selectedEvent.startDate)? new Date() : new Date(selectedEvent.startDate) }
                  maxDate={new Date(selectedEvent.endDate)}
                />
                </div>
            </div>
            }
            {
                selectedSection == section[0] && selectedDate != null &&
                <div className="mt-4 w-full min-h-[12rem]">
                <div className="flex items-center w-full mb-4">
                    <h1 className="text-white text-2xl font-semibold"> Pilih Waktu</h1>
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {
                        filterTime.length == 0 || selectedDate == null ? <div
                        className="col-span-1 md:col-span-2 lg:col-span-3 w-full flex flex-col min-h-[12rem] items-center justify-center bg-slate-950 text-white rounded-md"
                        >
                            <h1>Tidak ada sesi yang tersedia</h1>
                        </div>: 
                        filterTime.map((time)=>{
                            return <TimeCard key={time.startTime+time.endTime} 
                            props={
                                {
                                    callback: ()=> {
                                        setSelectedSession(time)
                                        setIsModalActive(true)
                                    },
                                    timeRange: `${formatISO8601ToHHMM(time.startTime)} - ${formatISO8601ToHHMM(time.endTime)} WIB`,
                                    date: formatDateToString(selectedDate)
                                }
                            }/>
                        })
                    }
                </div>
                <div className="w-full items-center flex">
                </div>
            </div>
             }
             {
                selectedSection == 'Admin' && 
                <div className="w-full flex flex-col mt-4 space-y-4">
                    <DemoScheduler onEventSubmit={async (e)=>{
                        const demoEventId = e.id
                        const sessionDateLst = []
                        const sessionLst = []
                        let queryStr = `INSERT INTO DEMO_EVENT (demoEventId, title, startDate, endDate, email)
                        VALUES 
                        ('${demoEventId}', '${e.title}', '${e.startDate}', '${e.endDate}', '${e.email}');`
                        
                        const demoSessionDateObj = e.infoSesi
                        const keys = Object.keys(demoSessionDateObj);

                        for (let i = 0; i < keys.length; i++) {
                            const key = keys[i];
                            const value = demoSessionDateObj[key];
                            const demoSessionDateId = value.id;
                            const date = value.date;
                            sessionDateLst.push(`('${demoEventId}', '${demoSessionDateId}', '${date}')`);
                            const sessions = demoSessionDateObj[key].sessions

                            for (let j = 0; j < sessions.length; j++){
                                const sessionId = sessions[j].id
                                const startTime = sessions[j].startTime
                                const endTime = sessions[j].endTime
                                sessionLst.push(`('${demoSessionDateId}','${sessionId}', '${toTimestamp(startTime, date)}', '${toTimestamp(endTime, date)}')`)
                            }
                        }

                        if(sessionDateLst.length > 0){
                            queryStr += `INSERT INTO DEMO_SESSIONS_DATE(demoEventId, demoSessionDateId, date)
                        VALUES `
                            for(let i = 0; i < sessionDateLst.length; i++){
                                queryStr += sessionDateLst[i]
                                if(i < sessionDateLst.length - 1){
                                    queryStr += ', '
                                }
                                else {
                                    queryStr += '; '
                                }
                            }
                        }
                        if(sessionLst.length > 0){
                            queryStr += `INSERT INTO DEMO_SESSION (demoSessionDateId, demoSessionId, startTime, endTime)
                            VALUES`
                            for(let i = 0; i < sessionLst.length; i++){
                                queryStr += sessionLst[i]
                                if(i < sessionLst.length - 1){
                                    queryStr += ', '
                                }
                                else {
                                    queryStr += '; '
                                }
                            }
                        }
                        const resultQuery = queryStr +' SELECT 1 FROM DEMO_SESSION;'
                        await axios.post(BASE_URL+'/postgres/', {
                            queryString: resultQuery
                        })
                        fireFetch()
                        
                    }}/>
                    {
                        Object.keys(events).length != 0 &&
                        Object.keys(events).map(key => {
                            const event = events[key]
                            return <AuthorizedEventCard key={'authorized-'+event.id} props={{
                                owner: event.email,
                                title: event.title,
                                eventId: key,
                                callback: ()=> {
                                    fireFetch()
                                },
                                timeRange: 
                                    `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`,
                                isActive: event.isActive
                            }}/>
                        })
                    }
                    {
                        <div className="flex flex-col w-full my-4">
                            <h1 className="text-xl text-white font-bold mb-4">Demo Booking </h1>
                            {
                                Object.values(booking).length == 0 && <div
                                className="w-full flex flex-col min-h-[12rem] items-center justify-center bg-slate-950 text-white rounded-md"
                                >
                                    <h1>Gak Ada Apa-Apa</h1>
                                </div>
                            }
                            {
                                Object.values(booking).length > 0 &&   
                                <div className="w-full flex flex-col space-y-3">
                                    {
                                         Object.values(booking).sort((a, b) => {
                                            const statusOrder = ['active', 'cancelled', 'completed'];
                                          
                                            // Menentukan urutan status untuk a dan b
                                            const orderA = statusOrder.indexOf(a.status);
                                            const orderB = statusOrder.indexOf(b.status);
                                          
                                            // Membandingkan berdasarkan urutan status
                                            return orderA - orderB;
                                          }).map((book)=>{
                                          return  <BookingCard
                                            key={book.bookingDemoId+'-adminstrator'}
                                            props={{
                                                
                                                time: `${formatISO8601ToHHMM(book.startTime)} - ${formatISO8601ToHHMM(book.endTime)} (${formatDate(book.date)})`,
                                                title: book.eventName,
                                                onCancel:async ()=>{
                                                    const query = `UPDATE BOOKING_DEMO SET status = 'cancelled' WHERE bookingDemoId
                                                    = '${book.bookingDemoId}' RETURNING 1;`
                                                   await axios.post(BASE_URL+'/postgres/', {
                                                       queryString: query
                                                   })
                                                try {
                                                    await axios.post(BASE_URL+'/postgres/schedule-email', {
                                                        id: book.bookingDemoId,
                                                        taskType: 'INFO',
                                                        subject: 'Pembatalan Demo',
                                                        text: ' telah dibatalkan oleh saya.'
                                                    })
                                                } catch (error) {
                                                    console.log(error)
                                                }
                                                   fireFetch()
                                                },
                                                
                                                platform: book.platform,
                                                status: book.status,
                                                email: book.email,
                                                npm: book.npm,
                                                owner: book.owner,
                                                administrator: {
                                                    onDelete: async ()=>{
                                                        try {
                                                            await axios.post(BASE_URL+'/postgres/schedule-email', {
                                                                id: book.bookingDemoId,
                                                                taskType: 'INFO',
                                                                subject: 'Penghapusan Demo',
                                                                text: ' telah dihapus oleh saya.'
                                                            })
                                                        } catch (error) {
                                                            console.log(error)
                                                        }
                                                        const query = `DELETE FROM BOOKING_DEMO WHERE bookingDemoId
                                                    = '${book.bookingDemoId}' RETURNING 1;`
                                                    await axios.post(BASE_URL+'/postgres/', {
                                                        queryString: query
                                                    })
                                                    fireFetch()
                                                    },
                                                    onCompleted: async ()=>{
                                                        const query = `UPDATE BOOKING_DEMO SET status = 'completed' WHERE bookingDemoId
                                                        = '${book.bookingDemoId}' RETURNING 1;`
                                                       await axios.post(BASE_URL+'/postgres/', {
                                                           queryString: query
                                                       })
                                                       try {
                                                        await axios.post(BASE_URL+'/postgres/schedule-email', {
                                                            id: book.bookingDemoId,
                                                            taskType: 'INFO',
                                                            subject: 'Demo Selesai',
                                                            text: ' telah diselesaikan oleh yang bersangkutan.'
                                                        })
                                                       } catch (error) {
                                                        console.log(error)
                                                       }
                                                       fireFetch()
                                                    }
                                                }
                                            }}
                                            
                                            />
                                        })
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
             }
        </div>
      
    
        </div>
    </div>
    <Footer/>
</div>)
}

export default CalendarPage