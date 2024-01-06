const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { paginate } = require("../middleware/pageinate");
const { getPost } = require("../middleware/getPost");

const {
  renderIndex,
  renderCreatePost,
  renderPost,
  renderQuestions,
  renderIdeas,
  renderArticles,
  renderEvents,
  renderIssues,
} = require("../controllers/general");

const sql =
  "SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id";
const questionSql ="SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id";
const ideasSql ="SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id";
const articlesSql = "SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id";
const eventsSql = "SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id";
const issuesSql = "SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id";
const route = "";
router.get("/", paginate(sql, route), renderIndex);

router.get("/create", auth, renderCreatePost);

router.get("/post/:id", [getPost, auth], renderPost);

router.get("/questions", paginate(questionSql, "questions"), renderQuestions);
router.get("/ideas", paginate(ideasSql, "ideas"), renderIdeas);
router.get("/articles", paginate(articlesSql, "articles"), renderArticles);
router.get("/events", paginate(eventsSql, "events"), renderEvents);
router.get("/issues", paginate(issuesSql, "issues"), renderIssues);

module.exports = router;
