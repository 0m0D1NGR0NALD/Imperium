const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Family } = require('../models');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, familyName } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    let family = null;

    // If familyName provided, create a new family; otherwise, join existing (we'll handle later)
    if (familyName) {
      family = await Family.create({ name: familyName });
    } else {
      // For simplicity, we'll require a family for now
      return res.status(400).json({ error: 'Family name required' });
    }

    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      familyId: family.id,
      role: 'admin'
    });

    // Create default constitution and budget for the family
    const { Constitution, Budget } = require('../models');
    await Constitution.create({ familyId: family.id });
    await Budget.create({ familyId: family.id });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user.id, email, firstName, lastName }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, email, firstName: user.firstName, lastName: user.lastName }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};