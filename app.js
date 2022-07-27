// const helmet = require('helmet');
// const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // модуль для чтения куки
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
// const isAuth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { validateSignin, validateSignup } = require('./validator/validator');

require('dotenv').config();

const { PORT = 4000 } = process.env;
const { login, createUser } = require('./controllers/users');
const { users } = require('./routes/users');
const { movies } = require('./routes/movies');
const NotFoundDataError = require('./errors/NotFoundDataError');

const app = express();
// app.use(morgan('dev'));
const accessCors = [
  'https://renat.domains.nomoredomains.sbs',
  'http://renat.domains.nomoredomains.sbs',
  'http://localhost:3000',
  'https://localhost:3000',
];

const options = {
  origin: accessCors,
  method: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(options));

async function main() {
  await mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.send(req.body);
  });

  app.use(express.json());

  app.use(requestLogger);

  app.post('/signin', validateSignin, login);
  app.post('/signup', validateSignup, createUser);
  app.post('/signout', (req, res) => {
    res
      .status(200)
      .clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .send({ message: 'Выход' });
  });

  app.use((req, res, next) => {
    req.user = {
      _id: '62d993ffd5a4530c22d19d28',
    };
    next();
  });
  // app.use(isAuth);
  app.use('/', users);
  app.use('/', movies);

  app.use((req, res, next) => {
    next(new NotFoundDataError('Запрошен несуществующий маршрут'));
    next();
  });

  app.use(errorLogger);
  app.use(errors());

  app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
      });
    next();
  });

  app.listen(PORT, () => {
    console.log(`Слушаем ${PORT} порт`);
  });
}
main();
