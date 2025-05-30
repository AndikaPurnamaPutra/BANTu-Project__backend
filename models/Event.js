const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },      
  subtitle: { type: String },             
  description: { type: String },       
  location: { type: String },                 
  date: { type: Date, required: true },    
  time: { type: String },                
  contact: { type: String },  
  thumbnail: { type: String },           
  multimedia: [{ type: String }],                   
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
