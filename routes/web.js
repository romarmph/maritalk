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
  searchPosts,
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

router.post("/reply", auth, async (req, res) => {
  const user = req.session.user;
  const { postid, reply } = req.body;

  const query = util.promisify(db.query).bind(db);

  const sql = `INSERT INTO replies (parent_id, owner_id, content) VALUES (?, ?, ?)`;

  try {
    const result = await query(sql, [postid, user.id, reply]);
    res.redirect("/post/" + postid);
  } catch (err) {
    console.error(err);
  }
});

router.post("/post/delete", auth, async (req, res) => {
  const { postid } = req.body;
  const { user } = req.session;

  const query = util.promisify(db.query).bind(db);

  const sql = `DELETE FROM posts WHERE id = ? AND owner_id = ?`;

  try {
    const result = await query(sql, [postid, user.id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

router.get("/post/edit/:id", auth, (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  const query = util.promisify(db.query).bind(db);

  const sql = `SELECT * FROM posts WHERE id = ? AND owner_id = ?`;

  query(sql, [id, user.id], (err, result) => {
    if (err) {
      console.error(err);
    }
    res.render("post/edit", { post: result[0] });
  });
});

router.post("/post/update", auth, async (req, res) => {
  const { postid, title, content, category } = req.body;
  const { user } = req.session;

  const query = util.promisify(db.query).bind(db);

  console.log(postid, title, content, category, user.id);

  const sql = `UPDATE posts SET title = ?, content = ?, category = ? WHERE id = ? AND owner_id = ?`;

  try {
    const result = await query(sql, [
      title,
      content,
      category,
      postid,
      user.id,
    ]);

    console.log(result);
    res.redirect("/post/" + postid);
  } catch (err) {
    console.error(err);
  }
});




const getCommentById = async (commentId) => {
  const commentSql = `SELECT * FROM replies WHERE id = ?`;

  const queryAsync = util.promisify(db.query).bind(db);

  try {
    const [comment] = await queryAsync(commentSql, [commentId]);
    return comment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


router.get("/comment/edit/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  try {
    const comment = await getCommentById(id);

  
    if (comment.owner_id === user.id) {
      res.render("comment/edit", { comment });
    } else {
    
      res.status(403).send("Permission Denied");
    }
  } catch (error) {
   
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/comment/update", auth, async (req, res) => {
  const { commentId, newContent } = req.body;
  const { user } = req.session;

  const queryAsync = util.promisify(db.query).bind(db);

  const updateCommentSql = `UPDATE replies SET content = ? WHERE id = ? AND owner_id = ?`;

  try {
    
    const comment = await getCommentById(commentId);
    if (comment.owner_id === user.id) {
      await queryAsync(updateCommentSql, [newContent, commentId, user.id]);
      res.redirect(`/post/${comment.parent_id}`);
    } else {
      
      res.status(403).send("Permission Denied");
    }
  } catch (error) {
   
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/reply/delete", auth, async (req, res) => {
  const { replyid } = req.body;
  const { user } = req.session;

  const query = util.promisify(db.query).bind(db);

  const sql = `DELETE FROM replies WHERE id = ? AND owner_id = ?`;

  try {
    const result = await query(sql, [replyid, user.id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

router.get("/search", searchPosts);
module.exports = { router };
