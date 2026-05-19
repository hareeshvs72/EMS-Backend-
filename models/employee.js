import mongoose from "mongoose";
import { type } from "node:os";

const employeeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    basicSalary: { type: String, required: true, default: 0 },
    allowance: { type: String, required: true, default: 0 },
    deduction: { type: String, required: true, default: 0 },
        employeeStatus: { type: String, enum:["Active","Inactive"], default: "Active" },
            joinDate: { type: Date, required: true },
                isDeleted: { type: Boolean, default: false },
                bio:{ type: Boolean, default: "" },
                                bio:{ type: String, enum: "" },

    role: { type: String, enum: ["Admin", "Employee"], default: "Employee" },



}, { timestamps: true })

const employees = mongoose.model("employees", employeeSchema)
export default employees