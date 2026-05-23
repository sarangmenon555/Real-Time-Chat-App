const router = require("express").Router();
const { getMessages, createMessage } = require("../controllers/messageController");
const auth = require("../middleware/auth");

router.get("/:channelId", auth, getMessages);
router.post("/", auth, createMessage);

module.exports = router;
