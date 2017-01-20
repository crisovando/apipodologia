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
      
      let dni = req.swagger.params.id ? req.swagger.params.id.value : null;
      let nombre = req.swagger.params.nombre ? req.swagger.params.nombre.value : null;
      let apelido = req.swagger.params.apelido ? req.swagger.params.apelido.value : null;
      let telefono = req.swagger.params.apelido ? req.swagger.params.apelido.value : null;

      main.libs.paciente.find(dni)
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
