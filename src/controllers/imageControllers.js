import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import hinh_anh from "../models/hinh_anh.js";

let conn = initModels(sequelize);

// GET thông tin user
const getUserInfo = async (req, res) => {
  try {
    let userInfo = await conn.nguoi_dung.findAll();
    res.status(200).json({ message: "Get User Info Successfully", userInfo });
  } catch (error) {
    res.status(500).send("Internal Server Error!");
  }
};

// GET danh sách ảnh đã lưu theo user id
const getSavedImageByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestedUserId = req.params.userId;

    // Check if the requested user ID exists in the database
    const requestedUser = await conn.nguoi_dung.findByPk(requestedUserId);

    if (!requestedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the user ID from the token with the requested user ID
    if (userId !== parseInt(requestedUserId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const savedImages = await conn.luu_anh.findAll({
      where: { nguoi_dung_id: userId },
      include: [
        {
          model: hinh_anh,
          as: "hinh",
          attributes: ["hinh_id", "ten_hinh", "duong_dan", "mo_ta"],
        },
      ],
    });

    if (savedImages.length > 0) {
      res.status(200).json({
        message: "Get Saved Images Successfully",
        savedImages,
      });
    } else {
      res
        .status(404)
        .json({ message: "No saved images found for the specified user." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// GET danh sách ảnh đã tạo theo user id
const getCreatedImageByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestedUserId = req.params.userId;

    // Check if the requested user ID exists in the database
    const requestedUser = await conn.nguoi_dung.findByPk(requestedUserId);

    if (!requestedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the user ID from the token with the requested user ID
    if (userId !== parseInt(requestedUserId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const createdImages = await conn.hinh_anh.findAll({
      where: { nguoi_dung_id: userId },
      attributes: ["hinh_id", "ten_hinh", "duong_dan", "mo_ta"],
    });

    if (createdImages.length > 0) {
      res.status(200).json({
        message: "Get Created Images Successfully",
        createdImages,
      });
    } else {
      res
        .status(404)
        .json({ message: "No created images found for the specified user." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// DELETE xóa ảnh đã tạo theo id ảnh
const deleteImage = async (req, res) => {
  const hinhId = req.params.hinhId;
  const userId = req.user.id;

  try {
    if (hinhId === undefined || isNaN(parseInt(hinhId))) {
      return res.status(400).json({
        message: "Invalid request. Missing or invalid hinhId parameter.",
      });
    }

    // Check if the user owns the image
    const imageToDelete = await conn.hinh_anh.findOne({
      where: { hinh_id: hinhId, nguoi_dung_id: userId },
    });

    if (!imageToDelete) {
      return res.status(403).json({
        message: "You do not have permission to delete this image.",
      });
    }

    // Delete associated rows in luu_anh table
    await conn.luu_anh.destroy({
      where: { hinh_id: hinhId },
    });

    // Delete associated comments in binh_luan table
    await conn.binh_luan.destroy({
      where: { hinh_id: hinhId },
    });

    // Perform the deletion
    await imageToDelete.destroy();

    res.status(200).json({
      message: "Image deleted successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export {
  getUserInfo,
  getSavedImageByUserId,
  getCreatedImageByUserId,
  deleteImage,
};
