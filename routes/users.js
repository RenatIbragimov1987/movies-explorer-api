const express = require('express');
// const { celebrate, Joi } = require('celebrate');

const users = express.Router();
const {
  getUsers,
  // getUserByID,
  // currentUser,
  updateUser,
  // updateAvatar,
} = require('../controllers/users');

users.get('/users/me', getUsers);
// users.get('/users/me', currentUser);
// users.get('/users/:userId', celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().length(24).hex().required(),
//   }),
// }), getUserByID);

users.patch('/users/me/:_id', updateUser);

// users.patch('/users/me/avatar', celebrate({
//   body: Joi.object().keys({
//     avatar: Joi.string().regex(/(http|https):\/\/(www)?\.?([A-Za-z0-9.-]+)\.([A-z]{2,})((?:\/[+~%/.\w-_]*)?\??(?:[-=&;%@.\w_]*)#?(?:[\w]*))?/).required(),
//   }),
// }), updateAvatar);

module.exports = {
  users,
};
