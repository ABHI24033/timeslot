import express from 'express';
import timeSlotModal from './modals/timeSlotSchema.js';
import orderSlotModal from './modals/orderModel.js';

const router = express.Router();

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

router.post("/create-time-slot", async (req, res) => {
    try {
        // const { startTime, endTime } = req.body;
        const timeslots = req.body;
        // const timeSlot = { startTime, endTime };
        // const counting=0;
        const data=[];
        timeslots?.forEach(async (element) => {
            const { startDate, endDate, orderCount, Date } = element;
            data.push(element);

            // const timeSlot = new timeSlotModal(
            //     {
            //         startDate,
            //         endDate,
            //         orderCount,
            //         currentDate: Date,
            //     }
            // );
            // await timeSlot.save();
            // counting++;
            //             // end{code};
        });
        const postdata=await timeSlotModal.insertMany(data);
        console.log(timeslots);
        // if(counting===0){
        //     res.status(400).send("No data found");
        // }
        // const data = new timeSlotModal(timeslots);
        // await data.save();
        res.status(201).json({ message: "Time slot created",postdata });
    } catch (error) {
        res.status(500).json({ message: "Inetrnal Server Error" });
    }
});

router.get("/get-time-slot", async (req, res) => {
    try {
        const timeSlot = await timeSlotModal.find();
        res.status(200).json({ message: "Time slot fetched", data: timeSlot });
    } catch (error) {
        res.status(500).json({ message: "Inetrnal Server error" });
    }
});

router.delete("/delete_all_timeslot", async (req, res) => {
    try {
        const deleteall = await timeSlotModal.deleteMany({});
        res.status(200).json({ message: "All time slot deleted", data: deleteall });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/update_time_slot/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime } = req.body;
        if (!startTime || !endTime) {
            return res.status(400).json({ error: 'starttime and endtime are required' });
        }
        // const update=await timeSlotModal.updateOne({startTime:startTime},{endTime:endTime});
        const update = await timeSlotModal.findByIdAndUpdate(id, { startTime: startTime, endTime });
        res.status(200).json({ message: "Updated Successfully", update });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ========================order data==========================
router.post("/post_data_order", async (req, res) => {
    try {
        const { startTime, endTime, date, orderCount } = req.body;
        if (!startTime || !endTime || !date || !orderCount) {
            return res.status(400).json({ error: 'starttime and endtime are required' });
        }
        if (orderCount > 10) {
            return res.status(400).json({ error: 'Order limit full' });
        }
        const timeslots = await timeSlotModal.find();
        console.log(timeslots);
        let counting = 0;
        timeslots?.forEach(async (item) => {
            if (startTime === item.startTime && endTime === item.endTime) {
                const orderData = { startTime, endTime, date, orderCount };
                const data = new orderSlotModal(orderData);
                await data.save();
                counting++;
            }
        });
        if (counting === 0) {
            return res.status(400).json({ error: 'Can not post Data' });
        }

        res.status(201).json({ message: "Order data created" });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});

router.get("/get_data", async (req, res) => {
    try {
        const data = await orderSlotModal.find();

        res.status(200).json({ data });
    } catch (error) {

    }
});

router.put("/update_order/:id", async (req, res) => {
    try {
        const { date, orderCount } = req.body;
        const { id } = req?.params;
        const data = await orderSlotModal.findById(id);
        if (date === data?.date) {
            if (data?.orderCount >= 10) {
                res.status(200).json({ message: "Slot is full" });
            }
            // data.orderCount=data?.orderCount + 1; 
            data.orderCount = orderCount;
            await data.save();
        } else {
            return res.status(404).json({ message: "Slot is full" });
        }


        res.status(200).json({ message: "order confirmed", });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/delete_order/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // const data=a
        await orderSlotModal.findByIdAndDelete(id);
        res.status(200).json({ message: "Order deleted", });
    } catch (error) {
        res.status(500).json("Internal Server Error");
    }
})






export default router;