export const uploadImageToCloudinary = async (file: File) => {

  const cloudName = 'dff3d3nbn'; 
  const uploadPreset = 'upload_image'; 
  const apiUrl = 'https://api.cloudinary.com/v1_1'; 

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset); 
  formData.append("cloud_name", cloudName ); 
  formData.append("folder", "upload/images"); 

  try {
    const response = await fetch(
      `${apiUrl}/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}