module.exports = {
  handle404: function (req, res) {
    res.status(404);
    res.render("errors/404.ejs");
  },
};
