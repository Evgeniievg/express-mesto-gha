const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookies = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookies());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://127.0.0.1:27017/mydb', { useNewUrlParser: true })
  .then(() => {
    console.log('Успешно установлена связь с MongoDB');
  })
  .catch((error) => {
    console.error('Произошла ошибка при установлении связи с MongoDB:', error);
  });

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30).required(),
    password: Joi.string().min(2).max(30).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30).required(),
    password: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страница не найдена' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Application is running on PORT ${PORT}`);
});
