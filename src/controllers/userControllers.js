import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { verifyUserToken } from "../config/jwt.js";
import bcrypt from "bcrypt";

let conn = initModels(sequelize);

// PUT chỉnh sửa thông tin cá nhân của user
const editUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { mat_khau, ho_ten, tuoi, anh_dai_dien } = req.body;

    // Check if the user exists
    const user = await conn.nguoi_dung.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the user making the request is the same as the user being edited
    if (req.user.id !== Number(user.nguoi_dung_id)) {
      console.log("Unauthorized: User IDs do not match");
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Hash the new password if provided
    let hashedPassword = user.mat_khau; // default to the existing hashed password
    if (mat_khau) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(mat_khau, saltRounds);
    }

    // Update user information
    await conn.nguoi_dung.update(
      {
        mat_khau: hashedPassword,
        ho_ten,
        tuoi,
        anh_dai_dien,
      },
      {
        where: {
          nguoi_dung_id: userId,
        },
      }
    );

    res.status(200).json({ message: "User information updated successfully!" });
  } catch (error) {
    console.error("Error in editUserInfo:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const uploadSingleImage = async (req, res) => {
  try {
    const userIdFromRoute = req.params.userId;

    // Check if the user with the specified userId exists
    const user = await conn.nguoi_dung.findByPk(userIdFromRoute);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user making the request is the same as the user being uploaded for
    if (req.user.id !== Number(userIdFromRoute)) {
      console.log("Unauthorized: User IDs do not match");
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Insert a new record into the hinh_anh table
    const newImage = await conn.hinh_anh.create({
      ten_hinh: req.file.filename,
      duong_dan: req.file.path,
      nguoi_dung_id: req.user.id,
    });

    res.status(200).json({
      message: "Image uploaded successfully!",
      fileDetails: {
        hinh_id: newImage.hinh_id,
        nguoi_dung_id: req.user.id,
        filename: req.file.filename,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        size: req.file.size,
        destination: req.file.destination,
        path: req.file.path,
      },
    });
  } catch (error) {
    console.error("Error in uploadSingleImage:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export { editUserInfo, uploadSingleImage };
