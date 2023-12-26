const authRouter = require("./routes/auth");

module.exports = (app) => {
  app.use("/", authRouter);
};
