import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";

let conn = initModels(sequelize);

// GET thông tin ảnh và người tạo ảnh bằng id ảnh
const getImageInfo = async (req, res) => {
  try {
    let { hinhId } = req.params;
    let imageInfo = await conn.hinh_anh.findByPk(hinhId, {
      include: ["nguoi_dung"],
    });

    if (imageInfo) {
      res.status(200).json({
        message: "Get Image Info Successfully!",
        imageInfo,
      });
    } else {
      res.status(404).json({ message: "Image not found!" });
    }
  } catch (error) {
    console.error("Error in getImageInfo:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// GET thông tin bình luận theo id ảnh
const getCommentInfo = async (req, res) => {
  try {
    let { hinhId } = req.params;
    let dataComment = await conn.binh_luan.findAll({
      where: {
        hinh_id: hinhId,
      },
    });

    if (dataComment) {
      res.status(200).json({
        message: "Get Comment Info Successfully!",
        dataComment,
      });
    } else {
      res.status(404).json({ message: "Comment not found!" });
    }
  } catch (error) {
    console.error("Error in getCommentInfo:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// GET thông tin đã lưu hình này chưa theo id ảnh (dùng để kiểm tra ảnh đã lưu hay chưa ở nút Save)
const getSaveImage = async (req, res) => {
  try {
    let { hinhId } = req.params;
    const userId = req.user.id;

    let checkHinh = await conn.hinh_anh.findByPk(hinhId);

    if (checkHinh) {
      let checkSaved = await conn.luu_anh.findOne({
        where: {
          hinh_id: hinhId,
          nguoi_dung_id: userId,
        },
        attributes: ["luu_anh_id", "hinh_id", "nguoi_dung_id", "ngay_luu"],
      });

      if (checkSaved) {
        res
          .status(200)
          .json({ message: "Image has been saved!", savedInfo: checkSaved });
      } else {
        res.json({
          message: "This image has not been saved!",
          savedInfo: null,
        });
      }
    } else {
      res.status(404).json({ message: "Image ID does not exist!" });
    }
  } catch (err) {
    console.error("Error in getSaveImage:", err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

// POST để lưu thông tin bình luận của người dùng với hình ảnh
const postCommentImage = async (req, res) => {
  try {
    const { hinhId } = req.params;
    const { noi_dung } = req.body;
    const nguoi_dung_id = req.user.id; // Use the authenticated user's ID

    // Check if the image exists
    const checkHinh = await conn.hinh_anh.findByPk(hinhId);
    if (!checkHinh) {
      return res.status(404).json({ message: "Image ID does not exist!" });
    }

    // Create a new comment
    const newComment = await conn.binh_luan.create({
      nguoi_dung_id,
      hinh_id: hinhId,
      ngay_binh_luan: new Date(),
      noi_dung,
    });

    res
      .status(201)
      .json({ message: "Comment added successfully!", newComment });
  } catch (error) {
    console.error("Error in postCommentImage:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export { getImageInfo, getCommentInfo, getSaveImage, postCommentImage };
