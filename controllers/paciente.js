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
	'update':(req,res,next)=>{
		let params = req.swagger.params.id ? req.swagger.params.id.value : null;

		main.libs.paciente.update(params)
			.then(busqueda =>{
				res.json(busqueda);
			})
			.catch(err => {
				 next(err);
			});
	}
	};
}

module.exports = Paciente;
