const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cookies = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { signinValidation } = require('./middlewares/signinValidation');
const { signupValidation } = require('./middlewares/signupValidation');
const NotFoundError = require('./utils/not-found-error');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(cookies());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true })
  .then(() => {
    console.log('Успешно установлена связь с MongoDB');
  })
  .catch((error) => {
    console.error('Произошла ошибка при установлении связи с MongoDB:', error);
  });

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.post('/signin', signinValidation, login);

app.post('/signup', signupValidation, createUser);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Application is running on PORT ${PORT}`);
});
