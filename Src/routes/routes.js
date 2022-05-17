const express = require('express')
const urlController = require('../controller/urlController')
const router= express.Router()


router.post('/url/shorten', urlController.shortUrl)

router.get("/:urlCode", urlController .getUrl)
module.exports=router
