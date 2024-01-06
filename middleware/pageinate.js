const util = require("util");
const db = require("../db");

const paginate = (sql, route) => {
  return async (req, res, next) => {
    const { page = 1 } = req.query;

    // if (route === "profile") {
    //   if (!req.params.id) {
    //     return res.redirect("/");
    //   }
    // }

    const { id } = req.params;

    let totalPages = 0;
    const query = util.promisify(db.query).bind(db);
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
      const countQuery = `SELECT COUNT(*) as total FROM (${sql}) as subquery`;
      let countResult = await query(countQuery, [id]);

      const totalRecords = countResult[0].total;

      if (totalRecords === 0) {
        const response = {
          result: [],
          next: `/${route}?page=1`,
          prev: `/${route}?page=1`,
          current: 1,
          totalPages: 1,
          route: route,
        };

        req.response = response;
        return next();
      }

      totalPages = Math.ceil(totalRecords / limit);
    } catch (err) {
      console.error(err);
    }

    if (!page || isNaN(page) || page < 1 || page > totalPages) {
      return res.redirect(`/${route}?page=1`);
    }

    try {
      const resultQuery = `${sql} ORDER BY posts.created_at DESC LIMIT ? OFFSET ?`;
      let result = {};

      if (route !== "profile") {
        result = await query(resultQuery, [limit, offset]);
      } else {
        result = await query(resultQuery, [id, limit, offset]);
      }

      const response = {
        result: result,
        next: `/${route}?page=${parseInt(page) + 1}`,
        prev: `/${route}?page=${parseInt(page) - 1}`,
        current: page,
        totalPages: totalPages,
        route: route,
      };

      req.response = response;
      next();
    } catch (err) {
      console.error(err);
    }
  };
};

module.exports = {
  paginate,
};
