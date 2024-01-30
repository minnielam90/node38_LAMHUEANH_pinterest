import { createToken } from "../config/jwt.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from "bcrypt";

const conn = initModels(sequelize);

const login = async (req, res) => {
  try {
    let { email, mat_khau } = req.body;

    // check email có tồn tại trong DB hay không

    let existUser = await conn.nguoi_dung.findOne({
      where: {
        email: email,
      },
    });

    // trường hợp 1: nếu email đã tồn tại -> tạo token
    if (existUser) {
      let checkPassword = bcrypt.compareSync(mat_khau, existUser.mat_khau);
      if (checkPassword) {
        let payload = {
          nguoi_dung_id: existUser.nguoi_dung_id,
        };

        let token = createToken(payload);

        res.status(200).send(token);
      } else {
        res.status(400).send("Password incorrect!");
      }
    } else {
      res.status(404).send("Login failed!");
    }
  } catch (error) {
    res.send(`Error: ${error}`);
  }
};

const signUp = async (req, res) => {
  try {
    let { email, mat_khau, ho_ten, tuoi, anh_dai_dien } = req.body;

    // kiểm tra user đã tồn tại trong DB
    let existUser = await conn.nguoi_dung.findOne({
      where: {
        email: email,
      },
    });

    // trường hợp 1: nếu đã tồn tại -> báo lỗi user đã tồn tại
    if (existUser) {
      res.status(400).send("The user already exists!");
    } else {
      // mã hóa mật khẩu
      let encodePassword = bcrypt.hashSync(mat_khau, 10);
      let newUser = {
        email,
        mat_khau: encodePassword,
        ho_ten,
        tuoi,
        anh_dai_dien: anh_dai_dien,
      };

      await conn.nguoi_dung.create(newUser);
      res.status(201).send("Sign up successfully!");
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
};

export { login, signUp };
