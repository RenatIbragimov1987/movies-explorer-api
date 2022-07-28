const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { validateSignin, validateSignup } = require('../validator/validator');

router.post('/signin', validateSignin, login);
router.post('/signup', validateSignup, createUser);
router.post('/signout', (req, res) => {
  res
    .status(200)
    .clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    .send({ message: 'Выход' });
});
module.exports = router;
