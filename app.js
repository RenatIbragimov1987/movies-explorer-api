require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser'); // модуль для чтения куки
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const { MONGO_URL, PORT } = require('./utils/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const handleError = require('./middlewares/handleError');
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
  await mongoose.connect(MONGO_URL, {
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

  app.use((req, res, next) => {
    next(new NotFoundDataError('Запрошен несуществующий маршрут'));
    next();
  });

  app.use(errorLogger);
  app.use(errors());

  app.use(handleError);

  app.listen(PORT, () => {
    console.log(`Слушаем ${PORT} порт`);
  });
}
main();
