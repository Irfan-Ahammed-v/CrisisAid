const mongoose = require("mongoose");
const Camp = require("../models/reliefcamp");
const Volunteer = require("../models/volunteer");
const Disaster = require("../models/disaster");
const Request = require("../models/request");

exports.getCenterOverview = async (centerId) => {
  try {

    // STATS
    const stats = await Promise.all([
      Camp.countDocuments({ center_id: centerId }),
      Volunteer.countDocuments({ center_id: centerId }),
      Camp.countDocuments({ center_id: centerId, verification_status: "pending" }),
      Volunteer.countDocuments({ center_id: centerId, verification_status: "pending" }),
      Disaster.countDocuments({
        center_id: centerId,
        disaster_status: "active",
      }),
      Request.countDocuments({
        center_id: centerId,
        request_status: "pending",
      }),
    ]);

    // Pending Camps
    const pendingCamps = await Camp.find({
      center_id: centerId,
      verification_status: "pending",
    })
      .sort("-createdAt")
      .limit(4)
      .select("camp_name place createdAt")
      .lean();

    //  Pending Volunteers
    const pendingVolunteers = await Volunteer.find({
      center_id: centerId,
      verification_status: "pending",
    })
      .sort("-createdAt")
      .limit(4)
      .select("volunteer_name volunteer_email createdAt")
      .lean();

    //  Active Disasters
   const disasters = await Disaster.aggregate([
  {
    $match: {
      center_id: new mongoose.Types.ObjectId(centerId),
      disaster_status: "active",
    },
  },
  { $sort: { createdAt: -1 } },
  { $limit: 4 },

  // 🔹 Camp lookup
  {
    $lookup: {
      from: "tbl_reliefcamps",
      localField: "reliefcamp_id",
      foreignField: "_id",
      as: "camp",
    },
  },
  { $unwind: { path: "$camp", preserveNullAndEmptyArrays: true } },

  // 🔹 Disaster type lookup
  {
    $lookup: {
      from: "tbl_disaster_types",
      localField: "disaster_type",
      foreignField: "_id",
      as: "disasterType",
    },
  },
  { $unwind: { path: "$disasterType", preserveNullAndEmptyArrays: true } },

  // 🔹 Final shape
  {
    $project: {
      _id: 1,
      camp_name: "$camp.camp_name",
      disaster_type_name: "$disasterType.disaster_type_name",
      disaster_details: 1,
      disaster_status: 1,
      createdAt: 1,
    },
  },
]);

    //  Pending Requests
    const requests = await Request.aggregate([
      {
        $match: {
          center_id: new mongoose.Types.ObjectId(centerId),
          request_status: "pending",
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 4 },
      {
        $lookup: {
          from: "tbl_reliefcamps",
          localField: "camp_id",
          foreignField: "_id",
          as: "camp",
        },
      },
      { $unwind: "$camp" },
      {
        $project: {
          _id: 1,
          camp_name: "$camp.camp_name",
          request_details: 1,
          request_priority: 1,
          request_status: 1,
          createdAt: 1,
        },
      },
    ]);

    //  Available Volunteers
    const volunteers = await Volunteer.find({
      center_id: centerId,
      availability: true,
    })
      .limit(6)
      .select("volunteer_name availability")
      .lean();

    return {
      stats: {
        totalCamps: stats[0],
        totalVolunteers: stats[1],
        pendingCamps: stats[2],
        pendingVolunteers: stats[3],
        activeDisasters: stats[4],
        pendingRequests: stats[5],
      },
      pendingCamps,
      pendingVolunteers,
      disasters,
      requests,
      volunteers,
    };
  } catch (err) {
    console.error("Error in getCenterOverview:", err);
    throw err;
  }
};

 