const authRouter = require("./routes/auth");
const { router } = require("./routes/web");

module.exports = (app) => {
  app.use("/", router);
  app.use("/", authRouter);
};
