const Volunteer = require("../models/volunteer");
const District = require("../models/district");
const Disaster = require("../models/disaster");
const Feedback = require("../models/feedback");
const VolunteerCall = require("../models/volunteercall");
const Centers = require("../models/centers");
const Request = require("../models/request");
const bcrypt = require("bcrypt");

// POST
exports.volunteerRegister = async (req, res) => {
  try {
    const { volunteer_name, volunteer_email, district_id, center_id, volunteer_password } = req.body;
    
    if (!volunteer_name || !volunteer_email || !district_id || !center_id || !volunteer_password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await Volunteer.findOne({
      $or: [{ volunteer_email }],
    });

    if (exists) {
      return res.status(409).json({ message: "Volunteer already registered" });
    }
        const hashedPassword = await bcrypt.hash(volunteer_password, 10);

    const volunteer = new Volunteer({
      volunteer_name,
      volunteer_email,
      district_id,
      center_id,
      volunteer_password:hashedPassword,
    });

    await volunteer.save();

    res.status(201).json({ message: "Volunteer registered successfully" });

  } catch (err) {
    console.error("Volunteer Register Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.home = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.volunteerId);

    res.json({
      message: "Welcome Volunteer",
      volunteerId: req.volunteerId,
      profileCompleted: volunteer.profileCompleted, 
      volunteer,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

exports.completeProfile = async (req, res) => {
  try {
    if (!req.files?.volunteer_photo || !req.files?.volunteer_proof) {
      return res.status(400).json({
        message: "Photo and proof are required",
      });
    }

    const photoPath = req.files.volunteer_photo[0].path;
    const proofPath = req.files.volunteer_proof[0].path;

    await Volunteer.findByIdAndUpdate(req.volunteerId, {
      volunteer_photo: photoPath,
      volunteer_proof: proofPath,
      profileCompleted: true,
    });

    res.json({ message: "Profile completed successfully" });
  } catch (err) {
    // FILE SIZE ERROR
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Each image must be less than 2MB",
      });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.volunteerId);

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    volunteer.availability = !volunteer.availability;
    await volunteer.save();

    res.json({
      message: "Availability updated",
      availability: volunteer.availability,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAssignedTasks = async (req, res) => {
  try {
    const tasks = await VolunteerCall.find({
      volunteer_id: req.volunteerId,
    })
      .populate("disaster_id")
      .populate("center_id")
      .populate({
        path: "request_id",
        populate: {
          path: "camp_id",
          select: "camp_name camp_address place"
        }
      })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptTask = async (req, res) => {
  try {
    const task = await VolunteerCall.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.task_status !== "assigned") {
      return res.status(400).json({ message: "Task already accepted" });
    }

    task.task_status = "accepted";
    await task.save();

    res.json({ message: "Task accepted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await VolunteerCall.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.task_status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Task must be accepted first" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Proof image required" });
    }

    task.task_status = "completed";
    task.proof_image = req.file.filename;
    await task.save();

    res.json({ message: "Task completed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addTaskRemark = async (req, res) => {
  try {
    const { remark } = req.body;

    if (!remark || remark.trim() === "") {
      return res.status(400).json({ message: "Remark is required" });
    }

    const task = await VolunteerCall.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Optional safety: only allow after acceptance
    if (task.task_status === "assigned") {
      return res
        .status(400)
        .json({ message: "Accept task before adding remarks" });
    }

    task.remarks = remark;
    await task.save();

    res.json({ message: "Remark saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllActiveDisasters = async (req, res) => {
  try {
    const disasters = await Disaster.find({ disaster_status: "active" })
      .populate("district_id", "district_name")
      .populate("place_id", "place_name")
      .populate("disaster_type", "disaster_type_name")
      .sort({ createdAt: -1 });

    res.json(disasters);
  } catch (err) {
    console.error("Get Disasters Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { feedback_content } = req.body;

    if (!feedback_content) {
      return res.status(400).json({ message: "Feedback content is required" });
    }

    const feedback = new Feedback({
      feedback_content,
      volunteer_id: req.volunteerId,
    });

    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Submit Feedback Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getActiveRequests = async (req, res) => {
  try {
    const acceptedRequestIds = await VolunteerCall.find({ volunteer_id: req.volunteerId }).distinct("request_id");

    const requests = await Request.find({
      _id: { $nin: acceptedRequestIds },
      request_status: "accepted",
      center_id: req.centerId,
      $expr: { $lt: ["$accepted_volunteers", "$estimated_volunteers"] }
    })
      .select("-request_reply -__v -center_id -disaster_id")
      .populate("camp_id", "camp_name camp_address place")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(requests);

  } catch (err) {
    console.error("Get Active Requests Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.request_status !== "accepted") {
      return res.status(400).json({ message: "Request not accepted yet" });
    }
    // Check if volunteer is already assigned
    const existingVolunteerCall = await VolunteerCall.findOne({ volunteer_id: req.volunteerId, request_id: id });
    if (existingVolunteerCall) {
      return res.status(400).json({ message: "You have already accepted this request" });
    }

    const volunteerCall = new VolunteerCall({
      volunteer_id: req.volunteerId,
      request_id: id,
        disaster_id: request.disaster_id,
      center_id: request.center_id,
      task_status: "accepted",
    });

    await volunteerCall.save();

    Request.findByIdAndUpdate(id, { $inc: { accepted_volunteers: 1 } }).exec();

    res.json({ message: "Task accepted successfully" });
  } catch (err) {
    console.error("Accept Task Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getVolunteerProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.volunteerId)
      .populate("district_id", "district_name")
      .populate("center_id", "center_name")
      .select("-volunteer_password -__v");

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.json(volunteer);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateVolunteerProfile = async (req, res) => {
  try {
    const { volunteer_name, volunteer_phone, volunteer_address, volunteer_skills } = req.body;

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.volunteerId,
      {
        volunteer_name,
        volunteer_phone,
        volunteer_address,
        volunteer_skills,
      },
      { new: true }
    ).select("-volunteer_password -__v");

    res.json({ message: "Profile updated successfully", volunteer: updatedVolunteer });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password required" });
    }

    const volunteer = await Volunteer.findById(req.volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, volunteer.volunteer_password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    volunteer.volunteer_password = hashedPassword;
    await volunteer.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
