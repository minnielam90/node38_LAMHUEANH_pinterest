import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import hinh_anh from "../models/hinh_anh.js";
import { verifyUserToken } from "../config/jwt.js";

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
  verifyUserToken(req, res, async () => {
    const userId = req.user.id;

    try {
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
  });
};

// GET danh sách ảnh đã tạo theo user id
const getCreatedImageByUserId = async (req, res) => {
  verifyUserToken(req, res, async () => {
    const userId = req.user.id;

    try {
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
  });
};

// DELETE xóa ảnh đã tạo theo id ảnh
const deleteImage = async (req, res) => {
  const hinhId = req.params.hinhId;

  try {
    if (hinhId === undefined || isNaN(parseInt(hinhId))) {
      return res.status(400).json({
        message: "Invalid request. Missing or invalid hinhId parameter.",
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

    // Find the image by ID
    const imageToDelete = await conn.hinh_anh.findByPk(hinhId);

    if (!imageToDelete) {
      return res.status(404).json({
        message: "Image not found. Unable to delete.",
      });
    }

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
// DELETE xóa ảnh đã tạo theo id ảnh
// const deleteImage = async (req, res) => {
//   try {
//     const hinhId = req.params.hinhId;

//     if (hinhId === undefined || isNaN(parseInt(hinhId))) {
//       return res.status(400).json({
//         message: "Invalid request. Missing or invalid hinhId parameter.",
//       });
//     }
//     verifyUserToken(req, res, async () => {
//       try {
//         const userId = req.user.id;
//         // Find the image by ID
//         const imageToDelete = await conn.hinh_anh.findByPk(hinhId);

//         if (!imageToDelete) {
//           return res.status(404).json({
//             message: "Image not found. Unable to delete.",
//           });
//         }
//         // Ensure that the image belongs to the user
//         console.log("Token from headers:", req.headers.token);
//         console.log("User ID from image:", imageToDelete.nguoi_dung_id);
//         console.log("User ID from token:", userId);

//         if (imageToDelete.nguoi_dung_id !== userId) {
//           console.log("Unauthorized condition met");
//           return res.status(401).json({
//             message: "Unauthorized. The image does not belong to the user.",
//           });
//         }
//         // Delete associated rows in luu_anh table
//         await conn.luu_anh.destroy({
//           where: { hinh_id: hinhId },
//         });
//         // Delete associated comments in binh_luan table
//         await conn.binh_luan.destroy({
//           where: { hinh_id: hinhId },
//         });
//         // Perform the deletion
//         await imageToDelete.destroy();
//         res.status(200).json({
//           message: "Image deleted successfully.",
//         });
//       } catch (error) {
//         console.error("Error in deleteImage:", error.message);
//         res
//           .status(500)
//           .json({ message: "Internal Server Error", error: error.message });
//       }
//     });
//   } catch (error) {
//     console.error("Error in deleteImage:", error.message);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: error.message });
//   }
// };

export {
  getUserInfo,
  getSavedImageByUserId,
  getCreatedImageByUserId,
  deleteImage,
};
