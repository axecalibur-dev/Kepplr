import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
class CloudinaryService {
  upload_to_cloudinary = async (req) => {
    cloudinary.config({
      cloud_name: "dtmq9wa1d",
      api_key: "629858856521668",
      api_secret: "cPR2NEnpkonpAhTvAJNC-h2Idvc",
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
}

export default CloudinaryService;
