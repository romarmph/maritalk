const db = require("./../db");
const util = require("util");

const renderIndex = (req, res) => {
  res.render("index.ejs", {
    result: req.response.result,
    current: req.response.current,
    next: req.response.next,
    prev: req.response.prev,
    totalPages: req.response.totalPages,
    route: req.response.route,
  });
};

const renderCreatePost = (req, res) => {
  res.render("post/create");
};

const renderQuestions = (req, res) => {
  res.render("questions.ejs", {
    result: req.response.result,
    current: req.response.current,
    next: req.response.next,
    prev: req.response.prev,
    totalPages: req.response.totalPages,
    route: req.response.route,
  });
};

const renderIdeas = (req, res) => {
  res.render("ideas.ejs", {
    result: req.response.result,
    current: req.response.current,
    next: req.response.next,
    prev: req.response.prev,
    totalPages: req.response.totalPages,
    route: req.response.route,
  });
};

const renderArticles = (req, res) => {
  res.render("articles.ejs", {
    result: req.response.result,
    current: req.response.current,
    next: req.response.next,
    prev: req.response.prev,
    totalPages: req.response.totalPages,
    route: req.response.route,
  });
};

const renderEvents = (req, res) => {
  res.render("events.ejs", {
    result: req.response.result,
    current: req.response.current,
    next: req.response.next,
    prev: req.response.prev,
    totalPages: req.response.totalPages,
    route: req.response.route,
  });
};

const renderIssues = (req, res) => {
  res.render("issues.ejs", {
    result: req.response.result,
    current: req.response.current,
    next: req.response.next,
    prev: req.response.prev,
    totalPages: req.response.totalPages,
    route: req.response.route,
  });
};

const renderPost = async (req, res) => {
  res.render("post/view", {
    post: req.response.post,
    replies: req.response.replies,
  });
};

const requestCreatePost = async (req, res) => {
  const { title, content, category } = req.body;
  const { id } = req.session.user;

  const query = util.promisify(db.query).bind(db);

  const sql = `INSERT INTO posts (title, content, category, owner_id) VALUES (?, ?, ?, ?)`;

  try {
    const result = await query(sql, [title, content, category, id]);
    const { insertId } = result;
    res.redirect("/post/" + insertId);
  } catch (err) {
    console.error(err);
  }
};

const renderProfile = async (req, res) => {
  const { id } = req.params;

  const query = util.promisify(db.query).bind(db);

  const sql = `SELECT * FROM users WHERE id = ?`;

  const userSql = `SELECT * FROM users WHERE id = ?`;

  const totalLikesSql = `SELECT SUM(posts.likes) AS total FROM posts JOIN users ON posts.owner_id = users.id WHERE users.id = ?`;

  const totalDislikesSql = `SELECT SUM(posts.dislikes) AS total FROM posts JOIN users ON posts.owner_id = users.id WHERE users.id = ?`;

  const totalRepliesSql = `SELECT COUNT(replies.id) AS total FROM users JOIN posts ON users.id = posts.owner_id LEFT JOIN replies ON posts.id = replies.parent_id WHERE users.id = ?`;

  try {
    const profile = await query(sql, [id]);
    const userResult = await query(userSql, [id]);
    const totalLikes = await query(totalLikesSql, [id]);
    const totalDislikes = await query(totalDislikesSql, [id]);
    const totalReplies = await query(totalRepliesSql, [id]);

    console.log(userResult);

    res.render("profile/view", {
      profile: profile,
      likes: totalLikes[0].total,
      dislikes: totalDislikes[0].total,
      replies: totalReplies[0].total,
      userProfile: userResult[0],
      result: req.response.result,
      current: req.response.current,
      next: req.response.next,
      prev: req.response.prev,
      totalPages: req.response.totalPages,
      route: req.response.route,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
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
};
