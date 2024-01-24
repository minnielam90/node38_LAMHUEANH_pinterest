import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from "sequelize";

let conn = initModels(sequelize);

// GET danh sách ảnh về
const getImageList = async (req, res) => {
  try {
    const imageList = await conn.hinh_anh.findAll({
      attributes: ["hinh_id", "ten_hinh", "duong_dan", "mo_ta"],
    });

    if (imageList.length > 0) {
      res.status(200).json({
        message: "Get Image List Successfully!",
        imageList,
      });
    } else {
      res.status(404).json({ message: "No images found!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// GET tìm kiếm danh sách ảnh theo tên
const searchImageList = async (req, res) => {
  let { ten_hinh } = req.params;

  try {
    let searchResult = await conn.hinh_anh.findAll({
      where: {
        ten_hinh: {
          [Op.like]: `%${ten_hinh}%`,
        },
      },
    });

    if (searchResult.length > 0) {
      res.status(200).json({
        message: "Search Image List Successfully",
        searchResult,
      });
    } else {
      res
        .status(404)
        .json({ message: "No images found for the specified search term." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export { getImageList, searchImageList };
