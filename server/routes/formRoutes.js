const express = require('express')
const requireAuth = require('../middlewares/requireAuth.js')
const { logRequest, validateEventData } = require('../middleware.js')
const { getAllForms, createForm, submitResponse, getResponses, getFormFields, getPublicForms } = require('../controllers/formController.js')

const router = express.Router()

router.get('/', getPublicForms)
router.get('/all', getAllForms)
router.post('/create', requireAuth, createForm)
router.post('/submit/:id', submitResponse)
router.get('/get-responses/:id', getResponses)
router.get('/:id', getFormFields)

module.exports = router
