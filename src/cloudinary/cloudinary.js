import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";
class CloudinaryService {
  upload_to_cloudinary = async (req) => {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });

    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    return new Promise((resolve, reject) => {
      upload.single("file")(req, null, async function (err) {
        if (err) {
          return reject("Multer Error: File Upload Failed");
        }

        if (!req.file) {
          return reject("No file provided");
        }

        const fileBuffer = req.file.buffer;

        try {
          const result = await cloudinary.uploader
            .upload_stream(
              { resource_type: "auto" }, // 'auto' detects the file type
              (error, result) => {
                if (error) {
                  return reject(
                    "Upload to Cloudinary failed: " + error.message,
                  );
                }
                resolve(result.secure_url);
              },
            )
            .end(fileBuffer);
        } catch (error) {
          reject("Error OK to Cloudinary: " + error.message);
        }
      });
    });
  };
  upload_to_cloudinary_from_project = async (file_path) => {
    // Check if the file exists on the given path
    try {
      fs.accessSync(file_path, fs.constants.F_OK);
      console.log(`File found on this path: ${file_path}`);
    } catch (err) {
      console.log(`File not found on this path: ${file_path}`);
      console.log("Cannot upload, EXIT");
      throw new Error("File not found");
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
      secure: true,
    });

    // Return a promise for the asynchronous Cloudinary upload
    return new Promise((resolve, reject) => {
      // Use fs.readFile to read the file buffer
      fs.readFile(file_path, (err, fileBuffer) => {
        if (err) {
          console.error("Error reading file:", err);
          reject("Error reading file");
        }

        // Upload the file to Cloudinary
        cloudinary.uploader.upload(
          file_path,
          {
            resource_type: "raw",
          },
          (error, result) => {
            if (error) {
              console.error("Upload to Cloudinary failed:", error.message);
              reject("Upload to Cloudinary failed?");
            }
            resolve(result);
            console.log(result.secure_url);
          },
        );
      });
    });
  };
}

export default CloudinaryService;
