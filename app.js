const cors = require('cors');
const cookieParser = require('cookie-parser'); // модуль для чтения куки
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const isAuth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

require('dotenv').config();

const { PORT = 4000 } = process.env;

const { users } = require('./routes/users');
const { movies } = require('./routes/movies');
const NotFoundDataError = require('./errors/NotFoundDataError');

const app = express();

const accessCors = [
  // 'https://movies.nomoredomains.xyz',
  // 'http://movies.nomoredomains.xyz',
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

  app.use(router);
  // защищаем роуты все что снизу
  app.use(isAuth);
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
