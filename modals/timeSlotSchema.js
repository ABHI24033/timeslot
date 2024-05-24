import { Schema, model } from "mongoose"

const TimeSlotSchema= new Schema({
    startTime: {type: String, },
    endTime: {type: String, },
    // day: {type: String, required: true},
    // available: {type: Boolean, required: true},

},{timestamps:true});

const timeSlotModal=model("timeSlot",TimeSlotSchema);

// module.exports=timeSlotModal;
export default timeSlotModal;