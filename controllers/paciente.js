/* eslint-disable semi */
"use strict";

const debug = require('debug')("restful:controllers:paciente");

function Paciente(main) {
	debug("init...");

	return {
    'insert': (req, res, next)=> {
			debug(".paciente.insert called");

      let parametros = req.swagger.params.datos ? req.swagger.params.datos.value : null;

      main.libs.paciente.insert(parametros)
								.then(paciente => {
									res.json(paciente);
								})
								.catch(err => {
									return next(err);
								});
		},
    'find': (req, res, next)=> {
      debug(".paciente.find called");

      let parametro = req.swagger.params.id ? req.swagger.params.id.value : null;

      main.libs.paciente.find(parametro)
                .then(pacientes => {
                  res.json(pacientes);
                })
                .catch(err => {
                  return next(err);
                });
    }
	};
}

module.exports = Paciente;
