const Camp = require("../models/reliefcamp");
const Center = require("../models/centers");
const RequestItems = require("../models/type");
const bcrypt = require("bcrypt");
const place = require("../models/place");
const Disaster = require("../models/disaster");
const Request = require("../models/request");
const RequestItem = require("../models/requestitem");

// Used to verify authenticated camp session and fetch camp context
// for frontend initialization and navigation control
exports.home = async (req, res) => {
  try {
    //Camp basic info
    const camp = await Camp.findById(req.campId)
      .select("camp_name camp_status verification_status");

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    //Request counts
    const total = await Request.countDocuments({
      camp_id: req.campId
    });

    const pending = await Request.countDocuments({
      camp_id: req.campId,
      request_status: "pending"
    });

        const approved = await Request.countDocuments({
      camp_id: req.campId,
      request_status: "approved"
    });
    //Recent requests (last 5)
    const recentRequests = await Request.find({
      camp_id: req.campId
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("request_details request_status request_priority createdAt");
    res.json({
      camp,
      stats: {
        total,
        pending,
        approved,
      },
      recentRequests
    });

  } catch (err) {
    console.error("Camp home error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

{
  /*======================================================POST=================================================*/
}
//new disaster reporting
exports.newdisaster = async (req, res) => {
  try {
    const { details, placeId } = req.body;

    if (!details || !placeId) {
      return res.status(400).json({ message: "Missing details or place" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Photo is required" });
    }

    if (!req.campId || !req.district_id) {
      return res.status(401).json({ message: "Unauthorized context" });
    }

    const newDisaster = new Disaster({
      disaster_details: details,
      place_id: placeId,
      disaster_photo: req.file.filename,
      reliefcamp_id: req.campId,
      district_id: req.district_id,
      disaster_status: "active"
    });

    await newDisaster.save();

    res.status(201).json({
      message: "Disaster reported successfully",
      disaster_id: newDisaster._id
    });

  } catch (err) {
    console.error("New disaster error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

//Camp Registration
exports.campRegister = async (req, res) => {
  try {
    const {
      camp_name,
      camp_address,
      camp_details,
      district_id,
      center_id,
      camp_email,
      camp_password,
    } = req.body;

    const exists = await Camp.findOne({ camp_email });
    if (exists) {
      return res.status(409).json({
        message: "Camp already exists. Please login.",
      });
    }
    const hashedPassword = await bcrypt.hash(camp_password, 10);

    const camp = new Camp({
      camp_name,
      camp_address,
      camp_details,
      district_id,
      center_id,
      camp_email,
      camp_password: hashedPassword,
    });

    await camp.save();

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

//new request
exports.newRequest = async (req, res) => {
  try {
    const { request_details, items } = req.body;

    if (!request_details || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing request data" });
    }

    if(!req.campId) {
      return res.status(401).json({ message: "Unauthorized context" });
    }

    // Find active disaster for this camp
    const disaster = await Disaster.findOne({
      reliefcamp_id: req.campId,
      disaster_status: "active"
    });

    if (!disaster) {
      return res.status(400).json({
        message: "No active disaster found. Please report a disaster first."
      });
    }

    //Create request
    const request = await Request.create({
      camp_id: req.campId,
      disaster_id: disaster._id,
      request_details,
      request_status: "pending"
    });

    //Create request items
    const requestItemsData = items.map(item => ({
      request_id: request._id,
      requestitem_name: item.itemName,
      requestitem_qty: item.qty
    }));

    await RequestItem.insertMany(requestItemsData);

    res.status(201).json({
      message: "Request created successfully",
      request_id: request._id
    });

  } catch (err) {
    console.error("Create request error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.CampProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const campId = req.campId; // from campAuth middleware

    await Camp.findByIdAndUpdate(
      campId,
      {
        camp_proof: req.file.filename,
        verification_status: "pending",
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Proof uploaded successfully. Awaiting verification.",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while uploading proof",
    });
  }
};




{/*============================================GET===========================================================*/}
//fetch Centers Using DistrictId
exports.getCentersByDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;

    if (!districtId) {
      return res.status(400).json({ message: "District ID is required" });
    }

    const centers = await Center.find({ district_id: districtId })
      .select(
        "center_name"
      )

    res.status(200).json({
      centers,
    });
  } catch (err) {
    console.error("Get centers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//fetch Request Items
exports.getRequestitems = async (req, res) => {
  try {
    const requestitems = await RequestItems.find().select("type_name -_id");

    const itemNames = requestitems.map(item => item.type_name);

    res.status(200).json(itemNames);
  } catch (err) {
    console.error("Get request items error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

//fetch places using district id from JWT for disaster reporting
exports.getPlaces = async (req, res) => {
  try {
    const district_id = req.district_id; // from JWT middleware

    if (!district_id) {
      return res.status(400).json({ message: "District not found" });
    }

    const places = await place.find({ district_id });

    res.status(200).json(places);
  } catch (err) {
    console.error("Get places error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

//fetch request details along with items for a specific request
exports.getRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }
    const request = await Request.findOne({
      _id: requestId,
      camp_id: req.campId
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Fetch request items
    const requestItems = await RequestItem.find({
      request_id: requestId
    }).select("requestitem_name requestitem_qty -_id");

    res.status(200).json({
      ...request.toObject(),
      items: requestItems
    });

  } catch (err) {
    console.error("Get request error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

//fetch all requests with basic details for listing
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ camp_id: req.campId })
      .sort({ createdAt: -1 })
      .select("request_details request_status request_priority createdAt");
    res.status(200).json(requests);

    if (!requests) {
      return res.status(404).json({ message: "No requests found" });
    }
  } catch (err) {
    console.error("Get requests error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

//fetch profile deails for camp profile page
exports.getCampProfile = async (req, res) => {
  try {
    const camp = await Camp.findById(req.campId)
      .populate("center_id", "center_name")
      .lean();

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.status(200).json({
      camp_name: camp.camp_name,
      camp_details: camp.camp_details,
      camp_address: camp.camp_address,
      camp_email: camp.camp_email,
      place: camp.place,
      center: camp.center_id?.center_name || null,
      current_occupancy: camp.current_occupancy,
      camp_status: camp.camp_status,
      createdAt: camp.createdAt
    });

  } catch (err) {
    console.error("Get camp profile error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

{/*============================================PATCH===========================================================*/}
//update current occupancy for camp profile
exports.updateOccupancy = async (req, res) => {
  try {
    const { current_occupancy } = req.body;

    if (typeof current_occupancy !== "number") {
      return res.status(400).json({ message: "Current occupancy  must be a number" });
    }

    const camp = await Camp.findById(req.campId);

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }
    camp.current_occupancy = current_occupancy;

    if (camp.current_occupancy < 0) {
      camp.current_occupancy = 0;
    }

    const updatedCamp = await camp.save();

    res.status(200).json({
      message: "Occupancy updated successfully",
      current_occupancy: updatedCamp.current_occupancy
    });
  } catch (err) {
    console.error("Update occupancy error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

//update profile details for camp profile page
exports.updateProfile = async (req, res) => {
  try {
    const { camp_name, camp_details, camp_address, place } = req.body;
    const camp = await Camp.findById(req.campId);

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }
    if (camp_name) camp.camp_name = camp_name;
    if (camp_details) camp.camp_details = camp_details;
    if (camp_address) camp.camp_address = camp_address;
    if (place) camp.place = place;
    
    const updatedCamp = await camp.save();
    res.status(200).json({
      message: "Camp profile updated successfully",
      camp: updatedCamp
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};