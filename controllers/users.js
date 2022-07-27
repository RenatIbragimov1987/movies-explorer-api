const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictDataError = require('../errors/ConflictDataError');
// const NotFoundDataError = require('../errors/NotFoundDataError');
const { getToken } = require('../utils/jwt');
const { DUBLICATE_MONGOOSE_ERROR_CODE, SALT_ROUNDS } = require('../constants/const');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные пользователя'));
      return;
    }
    next(err);
  }
};

// регистрация
const createUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Переданы некорректные данные логина или пароля'));
    return;
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      name,
      email,
      password: hash,
    });
    const savedUser = await user.save();
    const { password: removedPassword, ...result } = savedUser.toObject();
    res.status(201).send(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные создания пользователя'));
      return;
    }
    if (err.code === DUBLICATE_MONGOOSE_ERROR_CODE) {
      next(new ConflictDataError('Пользователь уже существует'));
      return;
    }
    next(err);
  }
};

// авторизация
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      next(new BadRequestError('Переданы некорректные данные логина или пароля'));
      return;
    }
    const user = await User.findUserByCredentials(email, password);
    const token = await getToken(user._id);
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    res.status(200).send({ token });
    return;
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  createUser,
  login,
  updateUser,
};
