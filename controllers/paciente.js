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
		}

	};
}

module.exports = Paciente;
