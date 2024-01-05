const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { paginate } = require("../middleware/pageinate");
const { getPost } = require("../middleware/getPost");

const {
  renderIndex,
  renderCreatePost,
  renderPost,
} = require("../controllers/general");

const sql =
  "SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id";
const route = "";
router.get("/", paginate(sql, route), renderIndex);

router.get("/create", auth, renderCreatePost);

router.get("/post/:id", [getPost, auth], renderPost);

module.exports = router;
