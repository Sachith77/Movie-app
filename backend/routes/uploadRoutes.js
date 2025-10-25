import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const __dirname = path.resolve();
      const uploadDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (err) {
      cb(err, undefined);
    }
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/i;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/i;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = (file.mimetype || "").toLowerCase();

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only (jpeg, jpg, png, webp)"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `${baseUrl}/uploads/${path.basename(req.file.path)}`,
      });
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;
