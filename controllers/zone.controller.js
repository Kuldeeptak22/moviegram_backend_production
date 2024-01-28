import fs from "fs";
import multer from "multer";
import ZoneModel from "../models/zone.model";
import { storage } from "../utils/multerFile";

const upload = multer({
  storage: storage,
});

export const addZone = (req, res) => {
  try {
    const uploadZoneData = upload.single("image");
    uploadZoneData(req, res, function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      const { name, description } = req.body;

      let image = null;
      if (req.file != undefined) {
        image = req.file.filename;
      }
      const saveZone = new ZoneModel({
        name,
        description,
        image,
      });
      saveZone.save();
      if (saveZone) {
        return res.status(201).json({
          data: saveZone,
          message: "Zone has been added Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getZones = async (req, res) => {
  try {
    const zones = await ZoneModel.find({ status: 1 });
    if (zones) {
      return res.status(200).json({
        data: zones,
        total: zones.length,
        message: "SuccessFully Fetched",
        filepath: `${process.env.BASE_URL}/uploads`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getZone = async (req, res) => {
  const zoneID = req.params.zone_id;
  try {
    const zone = await ZoneModel.findOne({
      status: 1,
      _id: zoneID,
    });
    if (zone) {
      return res.status(200).json({
        data: zone,
        message: "Data has been Successfully Fetched",
        filepath: `${process.env.BASE_URL}/uploads`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updateZone = async (req, res) => {
  try {
    const updateZoneData = upload.single("image");
    updateZoneData(req, res, async function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      const { name, description } = req.body;
      const zoneID = req.params.zone_id;
      const existZone = await ZoneModel.findOne({
        _id: zoneID,
      });

      let image = existZone.image;
      if (req.file) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/zones/" + existZone.image)) {
          fs.unlinkSync("./uploads/zones/" + existZone.image);
        }
      }
      const updatedZone = await ZoneModel.updateOne(
        { _id: zoneID },
        {
          $set: {
            name,
            description,
            image,
          },
        }
      );
      if (updatedZone.matchedCount) {
        return res.status(200).json({
          message: "Item has been Successfully Updated..!.",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteZone = async (req, res) => {
    try {
      const zoneID = req.params.zone_id;
      const deletedZone = await ZoneModel.updateOne(
        { _id: zoneID },
        {
          $set: {
            status: 0,
          },
        }
      );
      if (deletedZone.acknowledged) {
        return res.status(200).json({
          message: "Item has been Successfully Deleted..!",
        });
      }
    } catch (error) {
      return res.status(500).jason({
        message: error.message,
      });
    }
};
export const removeZone = async (req, res) => {
    try {
      const zoneID = req.params.zone_id;
      const existZone = await ZoneModel.findOne({
        _id: zoneID,
      });
  
      if (fs.existsSync("uploads/zones/" + existZone.image)) {
        fs.unlinkSync("uploads/zones/" + existZone.image);
      }
  
      const deletedZone = await ZoneModel.deleteOne({
        _id: zoneID,
      });
  
      if (deletedZone.acknowledged) {
        return res.status(200).json({
          message: "Item has been Successfully Deleted..!",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  