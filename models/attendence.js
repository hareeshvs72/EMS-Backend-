import mongoose from "mongoose";
import { type } from "node:os";

const atendenceSchema =new mongoose.Schema({
 employeeId:{type:mongoose.Schema.Types.ObjectId , ref:"employee", required:true, },
 date:{type:Date ,required:true},
  checkIn:{type:Date ,default:null},
    checkOut:{type:Date ,default:null},
        status:{type:String ,enum:["Present", "Absent","Late"], default:"Presnet"} ,
        workingHours:{type:Number,default:null},
                status:{type:String ,enum:["Full Day", "Three Quater Day","Half Day" , "Short Day ",null ], default:null} ,





 



},{timestamps:true})

atendenceSchema.index({employeeId:1,date:1})

const attendences = mongoose.model("attendences",atendenceSchema)
export default attendences