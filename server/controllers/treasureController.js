module.exports = {
  dragonTreasure: async (req, res) => {
    try {
      const result = await req.app.get('db').get_dragon_treasure(1);
      return res.status(200).json(result)
    } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Could not get treasure" });

    }
  },
  getUserTreasure: async (req, res) => {
    try { 
      const result = await req.app.get('db').get_user_treasure(req.session.user.id);
      res.status(200).json(result);
    } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Could not get treasure" });
    }
  },
  addUserTreasure: async (req, res) => {
    const { treasureURL } = req.body;
    const { id } = req.session.user;
    try {
      const result = await req.app.get('db').add_user_treasure([treasureURL, id]);
      const userTreasure = result[0];
      res.status(200).json(userTreasure);
    } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Could not get treasure" });
    }
  },
  getAllTreasure: async (req, res) => {
    try {
      const result = await req.app.get('db').get_all_treasure();
      res.status(200).json(result);
    } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Could not get treasure" });
    }
  }
}