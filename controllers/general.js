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

// const saveCreatePost = (req, res) => {
//   const {title, category, content, owner_id } = req.body;

//   if (!title || !category || !content ) {
//     if (!title) {
//       req.session.message = "Title is required";
//       return res.redirect("/create");
//     }
//     if (!category) {
//       req.session.message = "Category is required";
//       return res.redirect("/create");
//     }
//     if (!content) {
//       req.session.message = "Content is required";
//       return res.redirect("/create");;
//     }
//   }
//     const sql = `INSERT INTO posts (title, content, owner_id, category) VALUES (?, ?, ?, ?, ?)`;
//     db.query(sql, [title, content, owner_id, category], (err, result) => {
//       if (err) {
//         req.session.message = "Something went wrong";
//         return res.redirect("/");
//       }
//       req.session.message = "Discussion Posted Successfully";
//       res.redirect("/");
//     });
// };

const renderPost = async (req, res) => {
  res.render("post/view", {
    post: req.response.post,
    comments: req.response.comments,
  });
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

const renderOwnedPost = (req, res) => {
  res.render("owned.ejs", {
    result: req.response.result,
    current: req.response.current,
    next: req.response.next,
    prev: req.response.prev,
    totalPages: req.response.totalPages,
    route: req.response.route,
  });
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
  renderOwnedPost,
};