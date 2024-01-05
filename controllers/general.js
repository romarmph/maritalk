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

const renderPost = async (req, res) => {
  res.render("post/view", {
    post: req.response.post,
    comments: req.response.comments,
  });
};

module.exports = {
  renderIndex,
  renderCreatePost,
  renderPost,
};
