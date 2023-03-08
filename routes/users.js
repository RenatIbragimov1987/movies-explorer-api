const express = require('express');

const { validateUserUpdate } = require('../validator/validator');

const users = express.Router();
const {
  getUser,
  updateUser,
} = require('../controllers/users');

users.get('/users/me', getUser);
users.patch('/users/me', validateUserUpdate, updateUser);

module.exports = {
  users,
};
