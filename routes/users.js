const router = require('express').Router();
const { createUser, getUserData, getUserDataId, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUserData);

router.get('/:userId', getUserDataId);

router.post('/', createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar)

module.exports = router;