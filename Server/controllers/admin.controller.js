const District = require("../models/district");
const Camp = require("../models/reliefcamp");
const Center = require("../models/centers");
const Type = require("../models/type");
const Place = require("../models/place");

{
  /*=============== POST =================== */
}

exports.addDistrict = async (req, res) => {
  try {
    const { districtName } = req.body;
    const exists = await District.findOne({ districtName });
    if (exists) {
      return res.json({ message: "District Already Exists!" });
    }

    const district = new District({
      districtName,
    });

    district.save();
    res.status(200).json({ message: "District Saved" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addType = async (req, res) => {
  try {
    let { type_name } = req.body;

    //  Validate
    if (!type_name || !type_name.trim()) {
      return res.status(400).json({
        message: "Type name is required",
      });
    }

    // Normalize capitalize first letter
    type_name = type_name.trim().toLowerCase();
    const formattedType =
      type_name.charAt(0).toUpperCase() + type_name.slice(1);

    const exists = await Type.findOne({ type_name: formattedType });
    if (exists) {
      return res.status(400).json({
        message: "Type already exists!",
      });
    }

    const type = new Type({
      type_name: formattedType,
    });

    await type.save();

    res.status(200).json({
      message: "Type added successfully!",
    });
  } catch (err) {
    console.error(err);

    // Mongo unique safety
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Type already exists!",
      });
    }

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.addPlace = async (req, res) => {
  try {
    let { place_name } = req.body;
    const { id: district_id } = req.params;


    if (!place_name || !place_name.trim()) {
      return res.status(400).json({
        message: "Place name is required",
      });
    }


    place_name = place_name.trim().toLowerCase();
    const formattedPlace =
    place_name.charAt(0).toUpperCase() + place_name.slice(1);


    const exists = await Place.findOne({
      place_name: formattedPlace,
      district_id,
    });

    if (exists) {
      return res.status(400).json({
        message: "Place already exists in this district",
      });
    }

    const place = new Place({
      place_name: formattedPlace,
      district_id,
    });

    await place.save();

    res.status(201).json({
      message: "Place added successfully",
      place,
    });
  } catch (err) {
    console.error(err);

    // Mongo unique safety
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Place already exists",
      });
    }

    res.status(500).json({
      message: "Server Error",
    });
  }
};


{
  /*================= GET =================== */
}
exports.getDistricts = async (req, res) => {
  try {
    const districts = await District.aggregate([
      {
        $lookup: {
          from: "tbl_centers",
          localField: "_id",
          foreignField: "district_id",
          as: "centers",
        },
      },
      {
        $addFields: {
          CentersCount: { $size: "$centers" },
        },
      },
      {
        $project: {
          centers: 0, // remove centers array (we only need count)
        },
      },
    ]);

    res.status(200).json({ districts });
  } catch (err) {
    console.error("Get districts error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// exports.getCampsByDistrict = async (req, res) => {
//   try {
//     const { districtId } = req.params;

//     if (!districtId) {
//       return res.status(400).json({
//         message: "District ID is required",
//       });
//     }

//     const camps = await Camp.find({ districtId })
//       .select("camp_name camp_email camp_address")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       count: camps.length,
//       camps,
//     });
//   } catch (error) {
//     console.error("Fetch camps error:", error);
//     res.status(500).json({
//       message: "Failed to fetch camps",
//     });
//   }
// };

exports.getCentersByDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;

    if (!districtId) {
      return res.status(400).json({
        message: "District ID is required",
      });
    }
    const centers = await Center.find({ district_id: districtId })
      .select(
        "center_name  center_address center_capacity center_occupancy center_status"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      centers,
    });
  } catch (error) {
    console.error("Fetch centers error:", error);
    res.status(500).json({
      message: "Failed to fetch centers",
    });
  }
};

exports.fetchTypes = async (req, res) => {
  try {
    const types = await Type.find().sort({ createdAt: -1 });
    res.status(200).json({ types });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.fetchPlaces  = async(req,res) =>{
  try{
    const { districtId } = req.params;
        if (!districtId) {
      return res.status(400).json({
        message: "District ID is required",
      });
    }
    const places = await Place.find({district_id:districtId}).sort({createdAt : -1});
    res.status(200).json({places})
  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server Error"})
  }
}

{
  /*================= PUT =================== */
}
exports.updateDistrict = async (req, res) => {
  try {
    const { districtName } = req.body;
    const updated = await District.findByIdAndUpdate(
      req.params.id,
      { districtName },
      { new: true }
    );
    if (!updated) {
      return res.status(500).json({ message: "Updation Failed" });
    }
    res.status(200).json({ message: "Updated Completed" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateType = async (req, res) => {
  try {
    const { type_name } = req.body;
    const { id } = req.params;

    if (!type_name || !type_name.trim()) {
      return res.status(400).json({
        message: "Type name is required",
      });
    }

    const cleanType = type_name.trim().toLowerCase();

    const exists = await Type.findOne({
      type_name: cleanType,
      _id: { $ne: id },
    });

    if (exists) {
      return res.status(400).json({
        message: "Type already exists",
      });
    }

    const updated = await Type.findByIdAndUpdate(
      id,
      { type_name: cleanType },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Type not found",
      });
    }

    res.status(200).json({
      message: "Successfully updated",
      type: updated,
    });
  } catch (err) {
    console.error(err);

    // Mongo duplicate key safety
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Type already exists",
      });
    }

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const { id } = req.params; // place id
    let { place_name } = req.body;


    if (!place_name || !place_name.trim()) {
      return res.status(400).json({
        message: "Place name is required",
      });
    }


    place_name = place_name.trim().toLowerCase();
    const formattedPlace =
      place_name.charAt(0).toUpperCase() + place_name.slice(1);


    const exists = await Place.findOne({
      place_name: formattedPlace,
      _id: { $ne: id },
    });

    if (exists) {
      return res.status(400).json({
        message: "Place already exists",
      });
    }


    const updated = await Place.findByIdAndUpdate(
      id,
      { place_name: formattedPlace },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    res.status(200).json({
      message: "Place updated successfully",
      place: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

{
  /*================= DELETE =================== */
}
exports.deleteDistrict = async (req, res) => {
  try {
    const deleted = await District.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(500).json({ message: "District not found" });
    }
    res.status(200).json({ message: "District deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteType = async (req, res) => {
  try {
    const deleted = await Type.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(500).json({ message: "Deletion Failed" });
    }
    res.status(200).json({ message: "Type Deleted Succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const deleted = await Place.findByIdAndDelete(req.params.districtId);
    if (!deleted) {
      return res.status(500).json({ message: "Deletion Failed" });
    }
    res.status(200).json({ message: "Place Deleted Succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
