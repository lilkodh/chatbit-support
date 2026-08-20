const { User } = require("../models");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

const register = async ({ full_name, email, password }) => {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const password_hash = await hashPassword(password);

  const user = await User.create({
    full_name,
    email,
    password_hash,
  });

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const validPassword = await comparePassword(password, user.password_hash);

  if (!validPassword) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

module.exports = {
  register,
  login,
};
