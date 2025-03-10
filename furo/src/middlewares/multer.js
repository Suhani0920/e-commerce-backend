import multer from "multer";
import path from "path";
import fs from "fs";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads'); 
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath); // Create uploads folder if it doesn't exist
      }
      cb(null, 'uploads/'); // Folder to save uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
    }
  });

  const allowedExtensions = /jpg|jpeg|png|glb|dae/;
  const allowedMimeTypes = {
    'image/jpeg': 'image',
    'image/png': 'image',
    'model/gltf-binary': 'model',
    'model/vnd.collada+xml': 'model',
  };
  const fileFilter = (req, file, cb) => {
    

    console.log(`File original name: ${file.originalname}`);
  console.log(`File MIME type: ${file.mimetype}`);
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes[file.mimetype];


    console.log(`Extension Valid: ${extname}, MIME Type Valid: ${mimetype}`);
  
    if (extname && mimetype) {
       return cb(null, true);  // Accept file
    } else {
       return cb('Error: Invalid file type! Only images and 3D models are allowed.', false);
    }
  };
  
  // Export Multer upload middleware
  export const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter
  });

