import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("mern_form_db", "root", "Jerin@2001", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err: any) => console.log("Error: " + err));
