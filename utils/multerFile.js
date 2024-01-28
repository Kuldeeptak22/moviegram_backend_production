import multer from "multer";
import fs from "fs";
import path from "path";

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("uploads" + req.baseUrl)) {
      cb(null, "uploads" + req.baseUrl);
    } else {
      fs.mkdirSync("uploads" + req.baseUrl);
      cb(null, "uploads" + req.baseUrl);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const orgName = file.originalname;
    const imgArr = orgName.split(".");
    imgArr.pop();
    const fname = imgArr.join(".");
    const extention = path.extname(orgName);
    cb(null, fname + "_" + uniqueSuffix + extention);
  },
});
