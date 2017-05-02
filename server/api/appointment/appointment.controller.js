/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/appointments              ->  index
 * POST    /api/appointments              ->  create
 * GET     /api/appointments/:id          ->  show
 * PUT     /api/appointments/:id          ->  update
 * DELETE  /api/appointments/:id          ->  destroy
 */

'use strict';

import Appointment from './appointment.model';
var helper = require('sendgrid').mail;
var moment = require('moment');
import _ from 'lodash';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  console.log('updating new changes');
  // sendEmail
  return function(entity) {
    console.log(entity);
    // sendEmail(entity);
    var updated = _.merge(entity, updates);

    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function sendEmail(data){
  // console.log(req.body);
  // title: 'maike',
  // procedencia: 'CDMX',
  // expediente: '1234235243',
  // email: 'me@me.com',
  // telefono: '2324234',
  // start: '2016-11-04T09:00:00.000Z',
  // end: '2016-11-04T09:30:00.000Z',
  // type: 'primera-vez',
  // className: [ 'openSesame' ],
  // timezone: 'UTC' }

  console.log(data.start);
  var day = moment.utc(data.start, moment.ISO_8601, 'es');
  //day.format("D [de] MMMM [del] YYYY [a las] HH[:]MM[hrs]")
  var from_email = new helper.Email('agenda@caaincan.com');
  var to_email = new helper.Email(data.email);
  var subject = 'Cita Creada';
  var content = new helper.Content('text/plain', `Hola ${data.title} tu cita fue agendada el dia ${day.format("D [de] MMMM [del] YYYY [a las] HH[:]mm[hrs]")}`);
  var mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid')('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');
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
}

// Gets a list of Appointments
export function index(req, res) {
  console.log(req.query);
  return Appointment.find()
    .where('start').gt(req.query.start).lt(req.query.end)
    .select('id start end title type poblacion').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Appointment from the DB
export function show(req, res) {
  return Appointment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Appointment in the DB
export function create(req, res) {
  return Appointment.create(req.body)
    .then(sendEmail(req.body))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Search an Appointment
export function search(req, res){
  console.log(req.query.expediente);
  console.log(req.query.name);
  return Appointment.find({$or : [{title: req.query.q}, {expediente: req.query.q}]})
          .exec()
          .then(respondWithResult(res))
          .catch(handleError(res));
}

// Updates an existing Appointment in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  return Appointment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Appointment from the DB
export function destroy(req, res) {
  return Appointment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
