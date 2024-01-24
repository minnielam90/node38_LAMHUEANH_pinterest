import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";

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
const createUserImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { ten_hinh, duong_dan, mo_ta } = req.body;

    // Check if the user exists
    const user = await conn.nguoi_dung.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Create a new image for the user
    const newImage = await conn.hinh_anh.create({
      ten_hinh,
      duong_dan,
      mo_ta,
      nguoi_dung_id: userId,
    });

    res.status(201).json({ message: "Image added successfully!", newImage });
  } catch (error) {
    console.error("Error in createUserImage:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export { editUserInfo, createUserImage };
