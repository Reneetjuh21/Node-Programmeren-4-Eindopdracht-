const express = require('express');
const router = express.Router();
let deelnemersController = require('../controllers/deelnemers_controller')

router.post('/studentenhuis/:id/maaltijd/:mId/deelnemers', deelnemersController.postNew);
router.get('/studentenhuis/:id/maaltijd/:mId/deelnemers', deelnemersController.getAll);
router.delete('/studentenhuis/:id/maaltijd/:mId/deelnemers', deelnemersController.deleteById);

module.exports = router;