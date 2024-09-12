import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { BadRequest } from "./error";
import log from "../utils/logger";
import { Storage } from 'megajs';
import config from "../config";

// Ensure upload directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create the directory if it doesn't exist
}

// Configure multer to use diskStorage to keep the original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the directory for storing files
  },
  filename: (req, file, cb) => {
    // Extract file extension from original filename
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    
    // Add timestamp to filename to avoid overwriting
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const newFilename = `${baseName}-${uniqueSuffix}${ext}`;
    
    cb(null, newFilename); // Save file with unique name
  }
});

// Configure multer for file uploads with fileFilter and limits
const upload = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedMimeTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequest("Invalid file type. Only PDF, text, and Word documents are allowed."));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB size limit
  },
});

// Middleware to handle file uploads
export function uploadFile(req: Request, res: Response, next: NextFunction) {

  if (req.body.use_existing_resume) { // MAKE FILE UPLOAD OPTIONAL
    return next();
  }

  const uploadSingle = upload.single("resume");

  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return next(new BadRequest(`File upload failed: ${err.message}`));
    } else if (err?.message === "Unexpected end of form") {
      return next(new BadRequest(`No file Uploaded`));
    } else if (err) {
      return next(new BadRequest(`An unknown error occurred during the upload: ${err.message}`));
    }

    if (!req.file) {
      return next(new BadRequest("No file uploaded"));
    }

    log.info(`File Upload Succesful: ${req.file.filename}`);
    next();
  });
}


export async function uploadToMega (filePath: string, originalFileName: string) {
  try {
    // Create the Mega storage instance
    const storage = await new Storage({
      email: config.MEGA_EMAIL,
      password: config.MEGA_PASSWORD,
    }).ready;
    const folder = config.MEGA_FOLDER;

    // Read the file into a buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Find the folder where the file will be uploaded, or create it if it doesn't exist
    const existingFolder = storage.root.children.find((child) => child.name === folder);

    let uploadFolder;
    if (!existingFolder) {
      // Folder doesn't exist, create it
      uploadFolder = await storage.root.mkdir(folder);
    } else {
      // Folder exists, use it
      uploadFolder = existingFolder;
    }

    // Upload the file buffer to Mega    
    const uploadedFile = await uploadFolder.upload(originalFileName, fileBuffer).complete;
    
    console.log('A file was uploaded to Mega!');
    await deleteFile(filePath);

    // Return the URL or link to the uploaded file
    return await uploadedFile.link(true);
  } catch (error) {
    console.error('Error uploading file to Mega:', error);
    throw new Error("Failed to upload file");
  }
};

export function deleteFile(path: string): Promise<void> {
  log.info(`File Deleted: ${path}`);
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
