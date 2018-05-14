const express = require('express');
const router = express.Router();
let studentcontroller = require('../controllers/studentenhuis_controller')

router.post('/studentenhuis', studentcontroller.postNew);
router.get('/studentenhuis', studentcontroller.getAll);
router.get('/studentenhuis/:id', studentcontroller.getById);
router.put('/studentenhuis/:id', studentcontroller.putById);
router.delete('/studentenhuis/:id', studentcontroller.deleteById);

module.exports = router;