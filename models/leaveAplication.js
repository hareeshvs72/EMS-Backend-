import mongoose from "mongoose";

const leaveAplicationSchema = new mongoose.Schema({
   employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
   },
   type: { type: String, enum: ["SICK", "CASUAL", "ANNUAL"], required: true },
   startDate: { type: Date, required: true },
   endDate: { type: Date, required: true },
   reason: { type: String, required: true },
   Status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },



}, { timestamps: true })

const leaveApllications = mongoose.model("leaveApllications", leaveAplicationSchema)
export default leaveApllications