const router = require('express').Router();
const todoController = require('../controllers/TodoController');
const authVerify = require('../middleware/auth')


router.post('/create-todo',authVerify, todoController.createTodo);
router.get('/get-todo',authVerify,todoController.getTodo);
router.post('/update-todo',authVerify,todoController.updateTodo);
router.post('/update-status',authVerify,todoController.updateStatus);
router.post('/delete-todo',authVerify,todoController.removeTodo);
router.post('/select-todo-by-status',authVerify,todoController.selectToByStatus);
router.post('/select-todo-by-date',authVerify,todoController.selectToByDate)











module.exports = router;