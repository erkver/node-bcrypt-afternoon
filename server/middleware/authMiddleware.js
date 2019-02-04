module.exports = {
  usersOnly: (req, res, next) => {
    if(!req.session.user) {
      return res.status(401).json("Please log in");
    }
    next();
  },
  adminsOnly: (req, res, next) => {
    if(!req.session.user.isAdmin) {
      return res.status(403).json("You shall not pass");
    }
    next();
  }
}