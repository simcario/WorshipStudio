const express = require("express")
const router = express.Router();
var commonController = require('../controllers/common')
var songsController = require('../controllers/songs')


router.route('/checkConnection').get(commonController.checkConnection);

//router.route('/file/:name').get(commonController.loadFile)
  


module.exports = router; 