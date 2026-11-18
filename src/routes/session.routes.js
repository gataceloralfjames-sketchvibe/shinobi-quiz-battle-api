 const { Router } = require('express');
const controller = require('../controllers/session.controller');
const rules = require('../validators/session.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');

const router = Router();

router.post('/', requireUser('host'), rules.createRules, validate, controller.create);
router.get('/:code', requireUser(), rules.codeRules, validate, controller.get);
router.patch('/:code', requireUser('host'), rules.statusRules, validate, controller.changeStatus);

// Players are a part of a session, so their URLs sit under it.
router.post('/:code/players', requireUser('player'), rules.joinRules, validate, controller.join);
router.get('/:code/players', requireUser(), rules.codeRules, validate, controller.listPlayers);

module.exports = router;