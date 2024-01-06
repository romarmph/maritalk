const db = require("../db");
const util = require("util");

const getPost = async (req, res, next) => {
  const { id } = req.params;

  const query = util.promisify(db.query).bind(db);

  let sql = `SELECT posts.*, users.name, users.email, users.photo FROM posts JOIN users ON posts.owner_id = users.id WHERE posts.id = ?`;

  let post = null;
  let replies = [];

  try {
    const result = await query(sql, [id]);
    post = result[0];
  } catch (err) {
    console.error(err);
  }

  if (!post) {
    return res.redirect("/");
  }

  sql = `SELECT replies.*, users.name, users.email, users.photo FROM replies JOIN users ON replies.owner_id = users.id WHERE replies.parent_id = ?`;

  try {
    const result = await query(sql, [id]);
    replies = result;
  } catch (err) {
    console.error(err);
  }
  console.log({
    post: post,
    replies: replies,
  });

  req.response = {
    post: post,
    replies: replies,
  };

  next();
};

module.exports = {
  getPost,
};
