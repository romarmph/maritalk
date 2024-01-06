const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { paginate } = require("../middleware/pageinate");
const { getPost } = require("../middleware/getPost");
const util = require("util");
const db = require("../db");

const {
  renderIndex,
  renderCreatePost,
  renderPost,
  renderQuestions,
  renderIdeas,
  renderArticles,
  renderEvents,
  renderIssues,
  requestCreatePost,
  renderProfile,
  renderProfileEdirtForm,
  requestAccountUpdate,
} = require("../controllers/general");

const sql =
  "SELECT posts.*, users.name, users.email, (SELECT COUNT(*) FROM replies WHERE replies.parent_id = posts.id) AS replies_count FROM posts JOIN users ON posts.owner_id = users.id";
const route = "";
router.get("/", paginate(sql, route), renderIndex);

router.get("/create", auth, renderCreatePost);

const questionSql =
  "SELECT posts.*, users.name, users.email, COUNT(replies.parent_id) AS replies_count FROM posts  JOIN users ON posts.owner_id = users.id  LEFT JOIN replies ON posts.id = replies.parent_id WHERE posts.category = 'question' GROUP BY posts.id, users.name, users.email";
router.get("/questions", paginate(questionSql, "questions"), renderQuestions);

const ideasSql =
  "SELECT posts.*, users.name, users.email, COUNT(replies.parent_id) AS replies_count FROM posts  JOIN users ON posts.owner_id = users.id  LEFT JOIN replies ON posts.id = replies.parent_id WHERE posts.category = 'idea' GROUP BY posts.id, users.name, users.email";
router.get("/ideas", paginate(ideasSql, "ideas"), renderIdeas);

const articlesSql =
  "SELECT posts.*, users.name, users.email, COUNT(replies.parent_id) AS replies_count FROM posts  JOIN users ON posts.owner_id = users.id  LEFT JOIN replies ON posts.id = replies.parent_id WHERE posts.category = 'article' GROUP BY posts.id, users.name, users.email";
router.get("/articles", paginate(articlesSql, "articles"), renderArticles);

const eventsSql =
  "SELECT posts.*, users.name, users.email, COUNT(replies.parent_id) AS replies_count FROM posts  JOIN users ON posts.owner_id = users.id  LEFT JOIN replies ON posts.id = replies.parent_id WHERE posts.category = 'events' GROUP BY posts.id, users.name, users.email";
router.get("/events", paginate(eventsSql, "events"), renderEvents);

const issuesSql =
  "SELECT posts.*, users.name, users.email, COUNT(replies.parent_id) AS replies_count FROM posts  JOIN users ON posts.owner_id = users.id  LEFT JOIN replies ON posts.id = replies.parent_id WHERE posts.category = 'issue' GROUP BY posts.id, users.name, users.email";
router.get("/issues", paginate(issuesSql, "issues"), renderIssues);

router.get("/post/:id", [getPost], renderPost);

router.post("/create", auth, requestCreatePost);

router.get("/account", auth, renderProfileEdirtForm);

router.post("/account/update", auth, requestAccountUpdate);

const postSql = `SELECT posts.*, users.name, users.email, COUNT(replies.parent_id) AS replies_count FROM posts  JOIN users ON posts.owner_id = users.id  LEFT JOIN replies ON posts.id = replies.parent_id WHERE posts.owner_id = ? GROUP BY posts.id, users.name, users.email`;
router.get("/profile/:id", paginate(postSql, "profile"), renderProfile);

router.post("/like", auth, async (req, res) => {
  const { postid } = req.body;
  const { user } = req.session;

  const query = util.promisify(db.query).bind(db);

  const sql = `UPDATE posts SET likes = likes + 1 WHERE id = ?`;

  try {
    const result = await query(sql, [postid, user.id]);
    res.redirect("/post/" + postid);
  } catch (err) {
    console.error(err);
  }
});

router.post("/dislike", auth, async (req, res) => {
  const { postid } = req.body;
  const { user } = req.session;

  const query = util.promisify(db.query).bind(db);

  const sql = `UPDATE posts SET dislikes = dislikes + 1 WHERE id = ?`;

  try {
    const result = await query(sql, [postid, user.id]);
    res.redirect("/post/" + postid);
  } catch (err) {
    console.error(err);
  }
});

module.exports = { router };
