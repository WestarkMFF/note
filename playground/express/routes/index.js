var express = require("express")
var router = express.Router()
const axios = require("axios")

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" })
})

router.get("/microResource", async (req, res) => {
    // res.send('fuck')
    const resp = await axios.get("http://localhost:8080")

    res.send({ data: resp.data })
})

module.exports = router
