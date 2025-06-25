module.exports = (req, res, next) => {
  let visits = parseInt(req.cookies.visits || "0");
  visits += 1;
  res.cookie("visits", visits, { maxAge: 86400000 * 7 }); // 7 days
  req.visits = visits;
  next();
};
