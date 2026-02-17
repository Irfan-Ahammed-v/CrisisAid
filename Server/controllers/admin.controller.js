const District = require("../models/district");
const Camp = require("../models/reliefcamp");
const Center = require("../models/centers");
const Items = require("../models/items");
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

exports.addItem = async (req, res) => {
  try {
    let { item_name, unit, category } = req.body;

    // 🔹 Validate
    if (!item_name || !item_name.trim()) {
      return res.status(400).json({
        message: "Item name is required",
      });
    }

    if (!unit) {
      return res.status(400).json({
        message: "Unit is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    // 🔹 Normalize name (First letter capital)
    item_name = item_name.trim().toLowerCase();
    const formattedItem =
      item_name.charAt(0).toUpperCase() + item_name.slice(1);

    // 🔹 Check duplicate
    const exists = await Items.findOne({ item_name: formattedItem });

    if (exists) {
      return res.status(400).json({
        message: "Item already exists!",
      });
    }

    const newItem = new Items({
      item_name: formattedItem,
      unit,
      category,
      is_active: true,
    });

    await newItem.save();

    res.status(201).json({
      message: "Item added successfully!",
      item: newItem,
    });

  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Item already exists!",
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

exports.fetchItems = async (req, res) => {
  try {
    const items = await Items.find({ is_active: true })
      .select("item_name unit category")
      .sort({ item_name: 1 })
      .lean();

    const unitEnum = Items.schema.path("unit").enumValues;
    const categoryEnum = Items.schema.path("category").enumValues;

    res.status(200).json({
      items,
      meta: {
        units: unitEnum,
        categories: categoryEnum
      }
    });

  } catch (err) {
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

exports.updateItem = async (req, res) => {
  try {
    let { item_name, unit, category, is_active } = req.body;
    const { id } = req.params;

    if (!item_name || !item_name.trim()) {
      return res.status(400).json({
        message: "Item name is required",
      });
    }

    if (!unit) {
      return res.status(400).json({
        message: "Unit is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    // 🔹 Normalize (Capitalize properly)
    item_name = item_name.trim().toLowerCase();
    const formattedItem =
      item_name.charAt(0).toUpperCase() + item_name.slice(1);

    // 🔹 Check duplicate (excluding current item)
    const exists = await Items.findOne({
      item_name: formattedItem,
      _id: { $ne: id },
    });

    if (exists) {
      return res.status(400).json({
        message: "Item already exists",
      });
    }

    const updated = await Items.findByIdAndUpdate(
      id,
      {
        item_name: formattedItem,
        unit,
        category,
        is_active: typeof is_active === "boolean" ? is_active : true,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json({
      message: "Successfully updated",
      item: updated,
    });

  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Item already exists",
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

exports.deleteItem = async (req, res) => {
  try {
    const deleted = await Items.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item disabled successfully",
    });

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
