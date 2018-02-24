/* eslint-disable semi */
"use strict";

const debug = require('debug')("restful:controllers:paciente.historial");

function Historial(main) {
	debug("init...");

	return {
    'insert': (req, res, next)=> {
			debug(".paciente.historial.insert called");

      let id = req.swagger.params.id ? req.swagger.params.id.value : null;
      let parametros = req.swagger.params.datos ? req.swagger.params.datos.value : null;

      main.libs.paciente.insertHistorial(id,parametros)
								.then(historial => {
									res.json(historial);
								})
								.catch(err => {
									return next(err);
								});
		},
		'find': (req, res, next)=> {
			debug(".paciente.historial.find called");

      let id = req.swagger.params.id ? req.swagger.params.id.value : null;

      main.libs.paciente.findHistorial(id)
								.then(historial => {
									res.json(historial);
								})
								.catch(err => {
									return next(err);
								});
		},

		'remove': (req, res, next)=> {
			debug(".paciente.historial.remove called");

			const id = req.swagger.params.id ? req.swagger.params.id.value : null;
			const historialId = req.swagger.params.historialId ? req.swagger.params.historialId.value : null;

      main.libs.paciente.removeHistorial(id, historialId)
								.then(historial => {
									res.json(historial);
								})
								.catch(err => {
									return next(err);
								});
		}
	};
}

module.exports = Historial;
