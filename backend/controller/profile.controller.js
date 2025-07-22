import { User } from "../model/user.model.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileUrl = req.file.path;
    const fileType = req.query.type;
    const userId = req.user?.id;

    let updateField = {};
    if (fileType === "photo") updateField.profilePhoto = fileUrl;
    else if (fileType === "resume") updateField.resume = fileUrl;
    else return res.status(400).json({ success: false, message: "Invalid file type" });

    const updatedUser = await User.findByIdAndUpdate(userId, updateField, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      message: `${fileType === "photo" ? "Profile photo" : "Resume"} uploaded successfully!`,
      fileUrl,
      user: updatedUser,
    });

  } catch (error) {
    console.error("UPLOAD FILE CONTROLLER ERROR:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};



export const updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phoneNumber },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
