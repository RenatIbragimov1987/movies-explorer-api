const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Неверный формат записи почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function comparisons(email, password) {
  return this.findOne({ email }).select('+password')
    // по умолчанию хеш пароля пользователя не будет возвращаться из базы,
    // но для аутентификации хэш пароля нужен (метод .select + 'password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные email или пароль');
      }
      return bcrypt.compare(password, user.password) // сравниваем переданный пароль и хеш из базы
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные email или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
