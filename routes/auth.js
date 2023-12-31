const authRouter = require("express").Router();
const { auth } = require("../middleware/auth");
const {
  renderLogin,
  requestLogin,
  renderRegister,
  requestRegister,
  requestLogout,
} = require("../controllers/auth");

authRouter.get("/login", renderLogin);
authRouter.post("/login", requestLogin);

authRouter.get("/register", renderRegister);
authRouter.post("/register", requestRegister);

authRouter.get("/logout", auth, requestLogout);

module.exports = authRouter;
