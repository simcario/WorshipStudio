const express = require("express")
const router = express.Router();
var commonController = require('../controllers/common')
var songsController = require('../controllers/songs')


router.route('/checkConnection').get(commonController.checkConnection);


module.exports = router; 