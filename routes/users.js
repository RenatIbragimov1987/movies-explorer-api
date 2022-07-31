const express = require('express');

const { validateUserUpdate } = require('../validator/validator');

const users = express.Router();
const {
  getUsers,
  updateUser,
} = require('../controllers/users');

users.get('/users/me', getUsers);
users.patch('/users/me', validateUserUpdate, updateUser);

module.exports = {
  users,
};
