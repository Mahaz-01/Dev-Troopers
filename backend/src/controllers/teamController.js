const Team = require('../models/Team');
const ChatRoom = require('../models/ChatRoom');

const getTeams = async (req, res) => {
  try {
    const userId = req.user.id;
    const teams = await Team.findByUser(userId);
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    const creatorId = req.user.id;

    // Create the team
    const team = await Team.create({ name, creator_id: creatorId });

    // Add creator and members to the team
    const allMemberIds = [...new Set([creatorId, ...memberIds])];
    for (const userId of allMemberIds) {
      await Team.addMember(team.id, userId);
    }

    // Create a chat room for the team
    const chatRoom = await ChatRoom.create(`${name} Chat`, allMemberIds, team.id, creatorId);

    res.status(201).json({ team, chatRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { teamId, userId } = req.body;
    const member = await Team.addMember(teamId, userId);

    // Add the user to the team's chat room
    const chatRoom = await ChatRoom.findByTeam(teamId);
    if (chatRoom) {
      const query = `
        INSERT INTO chat_room_members (chat_room_id, user_id)
        VALUES ($1, $2)
      `;
      await pool.query(query, [chatRoom.id, userId]);
    }

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { teamId, userId } = req.body;
    const member = await Team.removeMember(teamId, userId);

    // Remove the user from the team's chat room
    const chatRoom = await ChatRoom.findByTeam(teamId);
    if (chatRoom) {
      const query = `
        DELETE FROM chat_room_members
        WHERE chat_room_id = $1 AND user_id = $2
      `;
      await pool.query(query, [chatRoom.id, userId]);
    }

    res.status(200).json({ message: 'Member removed', member });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTeams,
  createTeam,
  addMember,
  removeMember
};