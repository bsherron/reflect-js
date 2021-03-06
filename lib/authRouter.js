const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const config = require('../config')


module.exports = function () {
  router.get('/', function(req, res, next) {
    if (config.authentication) {
      const token = jwt.sign(req.user, req.app.get('secret'), { expiresIn: '2h' })
      res.json({
        success: true,
        user: req.user.username,
        token,
      })
    } else {
      res.json({
        success: true,
      })
    }
  })
  return router
}
