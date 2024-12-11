const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
  const { username, password, avatar } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    await User.create({ username, password: hashedPassword, avatar });
    res.status(201).send('User registered');
  } catch (err) {
    console.error('Error during user registration:', err);
    res.status(500).send('Server error');
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).send('User not found');

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send('Invalid password');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
    res.status(200).send({ auth: true, token, avatar: user.avatar });
  } catch (err) {
    console.error('Error during user login:', err);
    res.status(500).send('Server error');
  }
};

module.exports = { register, login };