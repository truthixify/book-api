"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryHandler = (req, res, next) => {
  const { sort, filter, page = "1", limit = "10" } = req.query;
  // Initialize query options
  const filterOptions = {};
  const sortOptions = {};
  const paginationOptions = {
    limit: parseInt(limit, 10),
    skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
  };
  // Process filter (e.g., filter=author:John,category:Technology)
  if (filter) {
    const filterFields = filter.split(",");
    filterFields.forEach((field) => {
      const [key, value] = field.split(":");
      if (key && value) {
        filterOptions[key] = value;
      }
    });
  }
  // Process sort (e.g., sort=title:asc,author:desc)
  if (sort) {
    const sortFields = sort.split(",");
    sortFields.forEach((field) => {
      const [key, order] = field.split(":");
      sortOptions[key] = order === "desc" ? -1 : 1;
    });
  }
  // Attach options to req.query
  req.query.filterOptions = JSON.stringify(filterOptions);
  req.query.sortOptions = JSON.stringify(sortOptions);
  req.query.paginationOptions = JSON.stringify(paginationOptions);
  next();
};
exports.default = queryHandler;
