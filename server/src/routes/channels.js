const router = require("express").Router();
const { getChannels, createChannel } = require("../controllers/channelController");
const auth = require("../middleware/auth");

router.get("/", auth, getChannels);
router.post("/", auth, createChannel);

module.exports = router;
