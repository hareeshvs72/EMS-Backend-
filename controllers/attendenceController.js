// clock in/out for employee
// POST /api/attendence

import attendences from "../models/attendence.js";
import employees from "../models/employee.js";

export const clockiInOut = async (req, res) => {
  try {
    const session = req.payload;

    // ✅ Find employee
    const employee = await employees.findOne({
      userId: session.userId,
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot clock in/out",
      });
    }

    const now = new Date();

    // ✅ Get today's range (fix timezone issue)
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // ✅ Find today's attendance
    const existing = await attendences.findOne({
      employeeId: employee._id,
      date: { $gte: start, $lte: end },
    });

    // =====================================================
    // ✅ CHECK IN
    // =====================================================
    if (!existing) {
      const isLate =
        now.getHours() > 9 ||
        (now.getHours() === 9 && now.getMinutes() > 0);

      const attendance = await attendences.create({
        employeeId: employee._id,
        date: now,
        checkIn: now,
        status: isLate ? "Late" : "Present",
      });

      return res.json({
        success: true,
        type: "CHECK_IN",
        data: attendance,
      });
    }

    // =====================================================
    // ✅ CHECK OUT
    // =====================================================
    if (!existing.checkOut) {
      const checkInTime = new Date(existing.checkIn).getTime();
      const diffMs = now.getTime() - checkInTime;
      const diffHours = diffMs / (1000 * 60 * 60);

      const workingHours = parseFloat(diffHours.toFixed(2));

      let dayType = "Short Day";
      if (workingHours >= 8) dayType = "Full Day";
      else if (workingHours >= 6) dayType = "Three Quarter Day";
      else if (workingHours >= 4) dayType = "Half Day";

      existing.checkOut = now;
      existing.workingHours = workingHours;
      existing.dayType = dayType;

      await existing.save();

      return res.json({
        success: true,
        type: "CHECK_OUT",
        data: existing,
      });
    }

    // =====================================================
    // ✅ ALREADY CHECKED OUT
    // =====================================================
    return res.json({
      success: true,
      type: "ALREADY_COMPLETED",
      message: "You have already checked out today",
      data: existing,
    });

  } catch (error) {
    console.log("attendance Error", error);
    return res.status(500).json({ error: "Operation Failed" });
  }
};

// get Attendence for employee
// get /api/attendence

export const getAttendence = async (req, res) => {
    try {
        const session = req.payload
        const employee = await employees.findOne({
            userId: session.userId
        })
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" })
        }

        const limit = parseInt(req.query.limit || 30)
        const history = await attendences
            .find({ employeeId: employee._id })
            .sort({ date: -1 })
            .limit(limit);
        return res.json({
            data: history,
            employee: { isDeleted: employee.isDeleted }
        })

    } catch (error) {
        console.log("attendence Error", error);
        return res.status(500).json({ error: "Failed To Fetch Attendence" })
    }
}