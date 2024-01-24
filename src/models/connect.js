import { Sequelize } from "sequelize";

const sequelize = new Sequelize("node38_pinterest", "root", "1234", {
  host: "localhost",
  port: 3307,
  dialect: "mysql",
});

try {
  await sequelize.authenticate();
  console.log("Kết nối thành công");
} catch (error) {
  console.log("Kết nối thất bại");
}

export default sequelize;
