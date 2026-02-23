const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Centers = require("../models/centers");
const Volunteer = require("../models/volunteer");
const Camp = require("../models/reliefcamp");
const Disaster = require("../models/disaster");
const Request = require("../models/request");
const dashboardService = require("../services/centerDashboard.service");

{
  /*======================================================POST=================================================*/
}
exports.centerReg = async (req, res) => {
  try {
    const { district_id, center_email, center_password } = req.body;

    const exists = await Centers.findOne({
      district_id,
      center_email,
    });

    if (exists) {
      return res.status(409).json({
        message: "Center already exists in this district",
      });
    }

    const hashedPassword = await bcrypt.hash(center_password, 10);

    const center = new Centers({
      district_id,
      center_email,
      center_password: hashedPassword,
      profileCompleted: false,
    });

    await center.save();

    return res.status(201).json({
      message: "Center registered successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};


{
  /*======================================================GET=================================================*/
}
exports.home = async (req, res) => {
  try {
    const center = await Centers.findById(req.centerId);

    res.json({
      message: "Welcome Center",
      centerId: req.centerId,
      profileCompleted: center.profileCompleted,
      center,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOverview = async (req, res) => {
  try {
    const overview = await dashboardService.getCenterOverview(
      req.centerId
    );
    const center = await Centers.findById(req.centerId).select("center_name");
    res.json({
      center: {
        center_name: center.center_name,
      },
      ...overview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeCenterProfile = async (req, res) => {
  try {
    const centerId = req.centerId;
    const { name, address, capacity } = req.body;

    await Centers.findByIdAndUpdate(centerId, {
      center_name: name,
      center_address: address,
      center_capacity: capacity,
      profileCompleted: true,
    });

    res.json({ message: "Profile completed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.centerLogout = (req, res) => {
  res.clearCookie("center_token", {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // true in production (HTTPS)
  });

  res.json({ message: "Logged out successfully" });
};

exports.getCamps = async (req, res) => {
  try{
    const centerId = req.centerId;
    const camps = await Camp.find({ center_id: centerId }).select("-center_id -__v");
    res.status(200).json(camps);
  }catch(err){
    res.status(500).json({ message: "Server error" });
  }
}

exports.updateCampStatus = async (req, res) => {
  try {
    const { campId } = req.params;
    const { verification_status } = req.body;

    // validate so random values can't be passed in
    const allowed = ["approved", "rejected"];
    if (!allowed.includes(verification_status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const camp_status = verification_status === "approved" ? "active" : "inactive";

    const camp = await Camp.findByIdAndUpdate(
      campId,
      { verification_status, camp_status },
      { new: true }
    );

    if (!camp) return res.status(404).json({ message: "Camp not found" });

    res.status(200).json({ message: `Camp ${verification_status}`, camp });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getVolunteers = async (req, res) => {
  try {
    const centerId = req.centerId;
    const volunteers = await Volunteer.find({ center_id: centerId }).select("-volunteer_password");
    res.status(200).json(volunteers);
  } catch (err) {
    console.error("Get Volunteers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, reply } = req.body;

    const allowed = ["accepted", "rejected", "assigned"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findByIdAndUpdate(
      requestId,
      { request_status: status, request_reply: reply },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.status(200).json({ message: `Request ${status} successfully`, request });
  } catch (err) {
    console.error("Update Request Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.assignVolunteers = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { volunteerIds } = req.body;

    if (!volunteerIds || volunteerIds.length === 0) {
      return res.status(400).json({ message: "No volunteers selected" });
    }

    const request = await Request.findByIdAndUpdate(
      requestId,
      { 
        request_status: "assigned",
        assigned_volunteers: volunteerIds 
      },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    // Update volunteers availability to false (busy)
    await Volunteer.updateMany(
      { _id: { $in: volunteerIds } },
      { availability: false }
    );

    res.status(200).json({ message: "Volunteers assigned successfully", request });
  } catch (err) {
    console.error("Assign Volunteers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const centerId = req.centerId;
    const requests = await Request.find({ center_id: centerId })
      .populate("camp_id", "camp_name camp_address")
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map(req => ({
      _id: req._id,
      camp_name: req.camp_id.camp_name,
      camp_location: req.camp_id.camp_address,
      request_details: req.request_details,
      request_priority: req.request_priority,
      request_status: req.request_status,
      isAiGenerated: req.isAiGenerated,
      createdAt: req.createdAt,
      request_reply: req.request_reply,
      estimated_people_affected: req.estimated_people_affected,
      assigned_volunteers: req.assigned_volunteers,
      items: [],
    }));

    // Optionally fetch items for each request if needed for the dashboard list
    // For now, let's just return the basic info as the sample data had items
    // I will fetch items for these requests to match the frontend expectation
    const requestIds = formattedRequests.map(r => r._id);
    const RequestItem = require("../models/requestitem");
    const allItems = await RequestItem.find({ request_id: { $in: requestIds } });

    formattedRequests.forEach(req => {
      req.items = allItems
        .filter(item => item.request_id.toString() === req._id.toString())
        .map(item => ({
          itemName: item.requestitem_name,
          qty: item.requestitem_qty,
          unit: "units" // Default unit if not specified
        }));
    });

    res.status(200).json(formattedRequests);
  } catch (err) {
    console.error("Get Center Requests Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};