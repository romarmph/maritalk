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
  renderOwnedPost,
} = require("../controllers/general");

const sql =
  "SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id";
const route = "";
router.get("/", paginate(sql, route), renderIndex);

router.get("/create", auth, renderCreatePost);

router.get("/post/:id", [getPost, auth], renderPost);

const questionSql =
  "SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id WHERE posts.category = 'question'";
router.get("/questions", paginate(questionSql, "questions"), renderQuestions);

const ideasSql =
  "SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id WHERE posts.category = 'idea'";
router.get("/ideas", paginate(ideasSql, "ideas"), renderIdeas);

const articlesSql =
  "SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id WHERE posts.category = 'article'";
router.get("/articles", paginate(articlesSql, "articles"), renderArticles);

const eventsSql =
  "SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id WHERE posts.category = 'event'";
router.get("/events", paginate(eventsSql, "events"), renderEvents);

const issuesSql =
  "SELECT posts.*, users.name, users.email FROM posts JOIN users ON posts.owner_id = users.id WHERE posts.category = 'issue'";
router.get("/issues", paginate(issuesSql, "issues"), renderIssues);
router.get("/myPosts", paginate(myPosts, "myposts"), renderOwnedPost);

module.exports = router;
