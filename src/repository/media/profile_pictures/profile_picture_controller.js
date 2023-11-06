class ProfilePictureController {
  default_profile_picture = async () => {
    const randomDecimal = Math.random();
    const randomNumber = Math.floor(randomDecimal * 7) + 1;
    const randomImageKey = `image_${randomNumber}`;
    const imagePath =
      "https://cdn.pixabay.com/photo/2023/06/22/15/04/tourist-8081644_1280.png";
    return imagePath;
  };
}
export default ProfilePictureController;
