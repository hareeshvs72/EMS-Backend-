import employees from "../models/employee.js";
import leaves from "../models/leaveAplication.js";
import payslips from "../models/paySlip.js";
import attendance from "../models/attendence.js"; // 👈 add this if exists

export const getDashbord = async (req, res) => {
    try {
        const session = req.payload;

        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // ================= ADMIN DASHBOARD =================
        if (session.role === "Admin") {

            const [
                totalEmployees,
                totalLeaves,
                pendingLeaves,
                approvedLeaves,
                totalPayslips,
                departments,
                totalAttendance
            ] = await Promise.all([
                employees.countDocuments({ isDeleted: false }),
                leaves.countDocuments(),
                leaves.countDocuments({ status: "Pending" }),
                leaves.countDocuments({ status: "Approved" }),
                payslips.countDocuments(),
                employees.distinct("department"), // 🔥 unique departments
                attendance ? attendance.countDocuments() : 0 // safe check
            ]);

            return res.json({
                role: "Admin",
                data: {
                    totalEmployees,
                    totalLeaves,
                    pendingLeaves,
                    approvedLeaves,
                    totalPayslips,
                    totalDepartments: departments.length, // 👈 important
                    totalAttendance
                },
            });
        }

        // ================= EMPLOYEE DASHBOARD =================
        if (session.role === "Employee") {
            const employee = await employees.findOne({
                userId: session.userId,
            });

            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
            }

            // ✅ Days Present (attendance count)
            const daysPresent = await attendance.countDocuments({
                employee: employee._id,
                status: "Present"
            });

            // ✅ Pending Leaves
            const pendingLeaves = await leaves.countDocuments({
                employeeId: employee._id,
                status: "Pending"
            });

            // ✅ Latest Payslip
            const latestPayslip = await payslips
                .findOne({ employeeId: employee._id })
                .sort({ createdAt: -1 });
console.log(latestPayslip);

            return res.json({
                role: "Employee",
                data: {
                    daysPresent,
                    pendingLeaves,
                    latestSalary: latestPayslip ? latestPayslip.netSalary : 0
                },
            });
        }

        return res.status(403).json({ error: "Invalid role" });

    } catch (error) {
        console.error("dashboard error", error);
        return res.status(500).json({ error: "Failed" });
    }
};