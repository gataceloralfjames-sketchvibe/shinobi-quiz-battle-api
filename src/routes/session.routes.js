const { Router } = require('express');
const controller = require('../controllers/session.controller');
const rules = require('../validators/session.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');

const router = Router();

// Host only
router.post('/', requireUser('host'), rules.createRules, validate, controller.create);
router.post('/:id/start', requireUser('host'), rules.idParam, validate, controller.start);
router.post('/:id/end', requireUser('host'), rules.idParam, validate, controller.end);

// Player only
router.post('/join', requireUser('player'), rules.joinRules, validate, controller.join);

// Host or joined player (the service checks who is allowed to see this session)
router.get('/:id', requireUser(), rules.idParam, validate, controller.get);
router.get('/:id/players', requireUser(), rules.idParam, validate, controller.listPlayers);

module.exports = router;