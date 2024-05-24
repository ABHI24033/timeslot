import express from "express";
import connection from "./db.js";
import timeSlotModal from "./modals/TimeSlot.js";
import router from "./route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/",router);

// app.get("/", (req, res) => {
//     res.send("Hello World");
// });

const convertTo24HourFormat = (timeString) => {
    const [time, modifier] = timeString.split(/(am|pm)/i);
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
    }
    if (modifier.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};



// app.post("/postTimeSlot", async (req, res) => {
//     try {
//         const data = req.body;
//         console.log(data);

//         data?.forEach(async (element) => {
//             const { startDate, endDate, orderCount, Date } = element;
//             const timeSlot = new timeSlotModal(
//                 {
//                     startDate,
//                     endDate,
//                     orderCount,
//                     currentDate: Date,
//                 }
//             );
//             await timeSlot.save();
//             // end{code};
//         });

//         res.status(201).json({ message: "created" })

//     } catch (error) {
//         console.log("Error : ", error);
//         res.status(500).json({ message: "Inetrnal Server Error" });
//     }
// });

app.get("/getTimeSlots", async (req, res) => {
    try {
        const data = await timeSlotModal.find();

        // Create a new Date object
        const now = new Date();

        // Get the current hours, minutes, and seconds
        const hours = now.getHours();
        const minutes = now.getMinutes();
        // const seconds = now.getSeconds();

        // Format the time as HH:MM:SS :${seconds.toString().padStart(2, '0') && orderCount < 10
        const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}}`;

        console.log("Current Time:", currentTime);

        let sendData = [];
        data?.forEach((element) => {
            const { startDate, endDate, orderCount, currentDate } = element;
            const starttime = convertTo24HourFormat(startDate);
            const endtime = convertTo24HourFormat(endDate);
            console.log("StartTime :", starttime < currentTime);
            console.log("endTime :", endtime > currentTime);
            console.log("endTime :", orderCount);
            if (starttime < currentTime && endtime > currentTime && orderCount < 10) {
                sendData.push(element);
            }
        })

        res.status(200).json({ data: sendData });
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
});

app.put("/updateSlotTime/:id", async (req, res) => {
    try {

        const { id } = req?.params;
        const data=await timeSlotModal.findById(id);
        if(data?.orderCount>10){
            res.status(200).json({message:"Slot is full"});
        }
        data.orderCount=data?.orderCount + 1; 
        await data.save();
        res.status(200).json({ message: "order confirmed", });


    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

app.delete("/timeSlotdelete", async (req, res) => {
    try {
        // const {id}=req.params;
        const result = await timeSlotModal.deleteMany({});
        res.status(200).json({ message: "Deleted Successfully", result })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

connection().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
});
// app.listen(4000,()=>{console.log(`server is listing at 4000`);});