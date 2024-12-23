const cloudinary = require('cloudinary').v2;
const fs = require("fs");


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });


  const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        // upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file has been uploaded successfully
        console.log("File is uploaded on Cloudinary", response.url);
        return response;
    } catch(error){
        // remove the locally saved temporaryfile as the upload failed
        fs.unlinkSync(localFilePath);
    }
    const upload = await cloudinary.uploader.upload(file);
    return upload;
  };


export { uploadOnCloudinary }