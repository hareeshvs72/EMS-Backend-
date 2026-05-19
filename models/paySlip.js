import mongoose from "mongoose";
import { type } from "node:os";

const payslipSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "employee", required: true, },
    month: { type: Number, required: true },

    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    allowance: { type: Number, default: 0 },
    deduction: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },


}, { timestamps: true })


const payslips = mongoose.model("payslips", payslipSchema)
export default payslips