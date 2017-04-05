'use strict';

import mongoose from 'mongoose';

var AppointmentSchema = new mongoose.Schema({
  title: String,
  procedencia: String,
  expediente: String,
  email: String,
  telefono: String,
  start: Date,
  end: Date,
  info: String,
  type: String,
  poblacion: String,
  active: Boolean
});

export default mongoose.model('Appointment', AppointmentSchema);
