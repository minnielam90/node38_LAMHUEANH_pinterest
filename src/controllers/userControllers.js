import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { verifyUserToken } from "../config/jwt.js";

let conn = initModels(sequelize);

// PUT chỉnh sửa thông tin cá nhân của user
const editUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, mat_khau, ho_ten, tuoi, anh_dai_dien } = req.body;

    // Check if the user exists
    const user = await conn.nguoi_dung.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Update user information
    await conn.nguoi_dung.update(
      {
        email,
        mat_khau,
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

// POST thêm một ảnh của user
const uploadSingleImage = (req, res) => {
  verifyUserToken(req, res, async () => {
    try {
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
  });
};

export { editUserInfo, uploadSingleImage };
