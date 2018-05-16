const express = require('express');
const router = express.Router();
let studentController = require('../controllers/studentenhuis_controller');

router.post('/studentenhuis', studentController.postNew);
router.get('/studentenhuis', studentController.getAll);
router.get('/studentenhuis/:id', studentController.getById);
router.put('/studentenhuis/:id', studentController.putById);
router.delete('/studentenhuis/:id', studentController.deleteById);

module.exports = router;