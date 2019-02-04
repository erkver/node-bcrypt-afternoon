const bcrypt = require("bcryptjs");

module.exports = {
  register: async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const db = req.app.get('db');
    try {
      const result = await db.get_user(username);
      const existingUser = result[0]
      if(existingUser) {
        return res.status(409).json({message: "Username taken"})
      } 
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const registeredUser = await db.register_user([isAdmin, username, hash]);
      const user = registeredUser[0];
      req.session.user = {
        isAdmin: user.is_admin,
        id: user.id,
        username: user.username
      }
      res.status(201).json(req.session.user); 
    } catch(err) {
      console.log(err);
      res.status(500).json({error: "Could not register user"});
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get('db');
    try {
      const foundUser = await db.get_user(username);
      const user = foundUser[0];
      if(!user) {
        res.status(401).json("User not found, please register")
      }
      const isAuthenticated = bcrypt.compareSync(password, user.hash);
      if(!isAuthenticated) {
        res.status(403).json("Incorrect password");
      }
      req.session.user = {
        isAdmin: user.is_admin,
        id: user.id, 
        username: user.username
      };
      res.status(200).json(req.session.user);
    } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Could not login user" });
    }
  },
  logout: async (req, res) => {
    try {req.session.destroy();
    res.sendStatus(200);
    } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Could not logout user" });
    }
  }
}