import images from "./pictures.json";

class ProfilePictureController {
  default_profile_picture = async () => {
    const randomDecimal = Math.random();
    const randomNumber = Math.floor(randomDecimal * 7) + 1;
    const randomImageKey = `image_${randomNumber}`;
    const imagePath = images[randomImageKey];
    return imagePath;
  };
}
export default ProfilePictureController;
