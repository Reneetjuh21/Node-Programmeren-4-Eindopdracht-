const express = require('express');
const router = express.Router();
let maaltijdController = require('../controllers/maaltijd_controller')

router.post('/studentenhuis/:id/maaltijd', maaltijdController.postNew);
router.get('/studentenhuis/:id/maaltijd', maaltijdController.getAll);
router.get('/studentenhuis/:id/maaltijd/:mId', maaltijdController.getById);
router.put('/studentenhuis/:id/maaltijd/:mId', maaltijdController.putById);
router.delete('/studentenhuis/:id/maaltijd/:mId', maaltijdController.deleteById);

module.exports = router;