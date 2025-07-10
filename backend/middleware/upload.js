const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Dynamic destination logic
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "uploads";

    if (req.originalUrl.includes('/appointments') && req.originalUrl.includes('/prescriptions')) {
      uploadPath += "/prescriptions";
    } else if (req.originalUrl.includes('/reports')) {
      uploadPath += "/reports";
    } else if (req.originalUrl.includes('/api/auth/register')) {
    } else {
      uploadPath += "/";
    }

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = "file-" + Date.now() + ext;
    cb(null, filename);
  }
});

// Single, array, or dynamic usage depending on route/controller
const upload = multer({ storage });

module.exports = upload;
