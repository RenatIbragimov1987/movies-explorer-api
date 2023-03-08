const router = require('express').Router();
const { login, createUser, exitUser } = require('../controllers/users');
const { validateSignin, validateSignup } = require('../validator/validator');
const isAuth = require('../middlewares/auth');
const { users } = require('./users');
const { movies } = require('./movies');

router.post('/signin', validateSignin, login);
router.post('/signup', validateSignup, createUser);
router.post('/signout', exitUser);

// защищаем роуты все что снизу
router.use(isAuth);
router.use('/', users);
router.use('/', movies);

module.exports = router;
