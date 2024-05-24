import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    startTime: String,  
    endTime: String,
    date: String,
    orderCount: Number,
}, 
    { timestamps: true }
);

const orderSlotModal = model("order", orderSchema, "orderschema");

export default orderSlotModal;