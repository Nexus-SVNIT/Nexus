const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
  count:{
    type: Number,
    default: 0
  }
}, { timestamps: true })

const CounterDetails = mongoose.model('Counter', counterSchema)

module.exports = CounterDetails
