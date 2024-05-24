import { Schema, model } from "mongoose";

const TimeSlotSchema = new Schema({
    startDate: String,  
    endDate: String,
    // day: String,
    available: Boolean,
    currentDate: {
        type: String,
    },
    // orders: [],
    orderCount: Number,
}, 
    { timestamps: true }
);

const timeSlotModal = model("slot", TimeSlotSchema, "slotschema");

export default timeSlotModal