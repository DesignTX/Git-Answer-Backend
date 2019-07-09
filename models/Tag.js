const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  id: {
    type: Number, //what are we using for ID generation?
    required: true
  },
  name: {
    // consider renaming to label for ease of understanding?
    type: String,
    required: true
  }
});

module.exports = Tag = mongoose.model('tag', TagSchema);
