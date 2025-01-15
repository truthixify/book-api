import { Request, Response, NextFunction } from "express";

const queryHandler = (req: Request, res: Response, next: NextFunction) => {
  const { sort, filter, page = "1", limit = "10" } = req.query;

  // Initialize query options
  const filterOptions: Record<string, any> = {};
  const sortOptions: Record<string, 1 | -1> = {};
  const paginationOptions = {
    limit: parseInt(limit as string, 10),
    skip: (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10),
  };

  // Process filter (e.g., filter=author:John,category:Technology)
  if (filter) {
    const filterFields = (filter as string).split(",");
    filterFields.forEach((field) => {
      const [key, value] = field.split(":");
      if (key && value) {
        filterOptions[key] = value;
      }
    });
  }

  // Process sort (e.g., sort=title:asc,author:desc)
  if (sort) {
    const sortFields = (sort as string).split(",");
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

export default queryHandler;
