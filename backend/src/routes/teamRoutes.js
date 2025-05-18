const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, teamController.getTeams);
router.post('/', authMiddleware, teamController.createTeam);
router.post('/members', authMiddleware, teamController.addMember);
router.delete('/members', authMiddleware, teamController.removeMember);

module.exports = router;