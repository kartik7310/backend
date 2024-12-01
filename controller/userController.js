import prisma from "../db/db.js";
import fileValidator from "../utils/file.js";
import uploadFile from "../utils/uploadFile.js";
const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(400).json("user not found");
    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json("internal server error");
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json("User id not provided");

    // Find the user in the database
    const user = await prisma.users.findFirst({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Handle the profile file from the request
    const profile = req.files?.profile;
    if (!profile || Object.keys(profile).length === 0) {
      return res.status(400).json("File is required");
    }

    // File validation
    const validationError = fileValidator(profile.size, profile.mimetype);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    // Upload the file
    const profileUpload = await uploadFile(profile); // Ensure uploadFile is a valid function that returns a file path or URL

    // Update the user's profile field in the database
    const updateProfile = await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        profile: profileUpload, // Save the uploaded file's path or URL
      },
    });

    // Return the success response with updated user profile
    return res.status(200).json({
      message: "Profile update success",
      user: updateProfile.profile,
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json(error.message);
  }
};

export { getUserProfile, updateUser };
