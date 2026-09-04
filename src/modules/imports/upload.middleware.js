import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const extensionesPermitidas = [".csv", ".xlsx", ".xls"];

  const extension = path.extname(file.originalname).toLowerCase();

  if (!extensionesPermitidas.includes(extension)) {
    return cb(
      new Error("Solo se permiten archivos CSV, XLSX o XLS"),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter,
});

export const subirArchivo = upload.single("archivo");
