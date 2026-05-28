// GEt Profile
// GET /api/profile

import Employees from '../models/employee.js'

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const session = req.payload;

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const emp = await Employees.findOne({ userId: session.userId });

    // ✅ If Admin
    if (!emp) {
      return res.json({
        name: "Admin",
        email: session.email,
        role: session.role,
        designation: "Administrator",
        bio:"Admin of EMS"
      });
    }

    // ✅ If Employee
    return res.json({
      name: emp.firstName,
      email: session.email,
      role: session.role,
      designation: emp.department,
      phone: emp.phone,
      address: emp.address,
      bio:emp.bio
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// update profile
// PUT /api/profile

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const session = req.payload;
    const { bio} = req.body;
console.log(bio);

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const emp = await Employees.findOne({ userId: session.userId });

    if (!emp) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // ✅ Update fields
    if (bio) emp.bio = bio;


    await emp.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: emp
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};