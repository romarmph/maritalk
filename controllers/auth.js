const db = require("../db");
const argon2 = require("argon2");

const renderLogin = (req, res) => {
  req.session.destroy();
  res.render("auth/login");
};

const requestLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.session.message = "Please enter email and password";
    res.redirect("/login");
    return;
  }

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [email], async (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      req.session.message = "Account not found";
      return res.redirect("/login");
    }

    if (result.length > 0) {
      const user = result[0];

      console.log(user);
      try {
        if (await argon2.verify(user.password, password)) {
          req.session.user = user;
          res.locals.user = user;
          res.redirect("/");
        } else {
          req.session.message = "Incorrect password";
          res.redirect("/login");
        }
      } catch (err) {
        console.error(err);
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
};

const renderRegister = (req, res) => {
  req.session.destroy();
  res.render("auth/register");
};

const requestRegister = async (req, res) => {
  const { name, email, password, confirm_password, terms } = req.body;

  if (!name || !email || !password || !confirm_password) {
    if (!name) {
      req.session.message = "Name is required";
      return res.redirect("/register");
    }
    if (!email) {
      req.session.message = "Email is required";
      return res.redirect("/register");
    }
    if (!password) {
      req.session.message = "Password is required";
      return res.redirect("/register");
    }
    if (!confirm_password) {
      req.session.message = "Please confirm your password";
      return res.redirect("/register");
    }

    if (password.length < 6) {
      req.session.message = "Password must be at least 6 characters";
      return res.redirect("/register");
    }
  }

  if (password !== confirm_password) {
    req.session.message = "Password does not match";
    return res.redirect("/register");
  }

  if (terms === undefined) {
    req.session.message = "Please accept our terms and conditions";
    return res.redirect("/register");
  }

  try {
    const hashedPassword = await argon2.hash(password);
    const role = "user";
    const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    db.query(sql, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          req.session.message = "Email already exists";
          return res.redirect("/register");
        }

        req.session.message = "Something went wrong";
        return res.redirect("/register");
      }

      req.session.message = "Register success";

      const user = {
        id: result.insertId,
        name,
        email,
        role,
      };

      req.session.user = user;
      res.locals.user = user;
      res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    res.redirect("/register");
  }
};

const requestLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

module.exports = {
  renderLogin,
  renderRegister,
  requestLogin,
  requestLogout,
  requestRegister,
};
