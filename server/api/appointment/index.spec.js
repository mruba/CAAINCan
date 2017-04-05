'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var appointmentCtrlStub = {
  index: 'appointmentCtrl.index',
  show: 'appointmentCtrl.show',
  create: 'appointmentCtrl.create',
  update: 'appointmentCtrl.update',
  destroy: 'appointmentCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var appointmentIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './appointment.controller': appointmentCtrlStub
});

describe('Appointment API Router:', function() {

  it('should return an express router instance', function() {
    expect(appointmentIndex).to.equal(routerStub);
  });

  describe('GET /api/appointments', function() {

    it('should route to appointment.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'appointmentCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/appointments/:id', function() {

    it('should route to appointment.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'appointmentCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/appointments', function() {

    it('should route to appointment.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'appointmentCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/appointments/:id', function() {

    it('should route to appointment.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'appointmentCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/appointments/:id', function() {

    it('should route to appointment.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'appointmentCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/appointments/:id', function() {

    it('should route to appointment.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'appointmentCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
