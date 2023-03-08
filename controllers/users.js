const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictDataError = require('../errors/ConflictDataError');
const NotFoundDataError = require('../errors/NotFoundDataError');
const { getToken } = require('../utils/jwt');
const { DUBLICATE_MONGOOSE_ERROR_CODE, SALT_ROUNDS } = require('../constants/const');
require('dotenv').config();

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      next(new NotFoundDataError('Пользователь с таким id отсутствует'));
      return;
    }
    res.status(200).send(user);
  } catch (err) {
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
    const user = await User.findUserByCredentials(email, password);
    const token = await getToken(user);
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.status(200).send({ token }); //  возвращаем токен в котором вся инфа о юзере включая его _id
    return;
  } catch (err) {
    next(err);
  }
};

//  выход
const exitUser = async (req, res, next) => {
  try {
    res.clearCookie('jwt', {
      maxAge: -1,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.status(200).send({ message: 'Выход' }); //  выход
    return;
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true },
    );
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ConflictDataError('Переданы некорректные данные пользователя'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getUser,
  createUser,
  login,
  updateUser,
  exitUser,
};
