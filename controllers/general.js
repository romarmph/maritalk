const db = require("./../db");
const util = require("util");
const argon2 = require("argon2");

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

const renderProfileEdirtForm = (req, res) => {
  const { user } = req.session;
  req.session.success = null;
  req.session.message = null;
  res.render("account/edit", { user: user });
};

const requestAccountUpdate = async (req, res) => {
  const { name, email, oldpassword, newpassword, confirmpassword } = req.body;
  const { id } = req.session.user;

  console.log(req.body);

  if (!name || !email) {
    req.session.message = "Please fill name and email";
    return res.redirect("/account");
  }

  if (oldpassword && !newpassword && !confirmpassword) {
    req.session.message = "Please fill new password and confirm password";
    return res.redirect("/account");
  }

  if (newpassword && !oldpassword && !confirmpassword) {
    req.session.message = "Please fill old password and confirm password";
    return res.redirect("/account");
  }

  if (confirmpassword && !oldpassword && !newpassword) {
    req.session.message = "Please fill old password and new password";
    return res.redirect("/account");
  }

  if (newpassword && newpassword.length < 6) {
    req.session.message = "Password must be at least 6 characters";
    return res.redirect("/account");
  }

  if (newpassword !== confirmpassword) {
    req.session.message = "Password does not match";
    return res.redirect("/account");
  }

  const query = util.promisify(db.query).bind(db);

  if (newpassword && oldpassword && confirmpassword) {
    let sql = `SELECT * FROM users WHERE id = ?`;
    const user = await query(sql, [id]);
    const { password } = user[0];
    const result = await argon2.verify(password, oldpassword);
    if (!result) {
      req.session.message = "Old password is incorrect";
      return res.redirect("/account");
    }

    const hash = await argon2.hash(newpassword);
    sql = `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`;
    try {
      await query(sql, [name, email, hash, id]);

      req.session.success = "Account updated";
      return res.redirect("/account");
    } catch {
      console.error(err);
    }
  }

  let sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  try {
    await query(sql, [name, email, id]);
  } catch {
    console.error(err);
  }
  req.session.user.name = name;
  req.session.user.email = email;

  req.session.success = "Account updated";
  res.redirect("/account");
};
const searchPosts = async (req, res) => {
  const { q } = req.query;

  // Perform a search query using the input 'q'
  const searchResults = await performSearchQuery(q);

  res.render("searchResults.ejs", { searchResults });
};

const performSearchQuery = async (query) => {
  // Perform your search query logic here, e.g., search by post title or content
  const queryAsync = util.promisify(db.query).bind(db);
  const sql = `SELECT posts.*, users.name, users.email, COUNT(replies.parent_id) AS replies_count
  FROM posts
  JOIN users ON posts.owner_id = users.id
  LEFT JOIN replies ON posts.id = replies.parent_id
  WHERE posts.title LIKE ? OR posts.content LIKE ?
  GROUP BY posts.id, users.name, users.email`;
  const searchResults = await queryAsync(sql, [`%${query}%`, `%${query}%`]);

  return searchResults;
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
  renderProfileEdirtForm,
  requestAccountUpdate,
  searchPosts,
};
