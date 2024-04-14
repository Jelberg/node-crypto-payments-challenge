import express from 'express'

var router = express.Router()

router.get('/', (req, res) => {
    res.send('The sedulous hyena ate the antelope!')
})

export default router
