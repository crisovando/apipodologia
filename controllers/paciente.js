'use strict';

const debug = require('debug')('restful:controllers:paciente');

function Paciente(main) {
  debug('init...');

  return {
    'insert': (req, res, next) => {
      debug('.paciente.insert called');

      let parametros = {
        dni: req.swagger.params.dni ? req.swagger.params.dni.value : null,
        nombre: req.swagger.params.nombre ? req.swagger.params.nombre.value : null,
        apellido: req.swagger.params.apellido ? req.swagger.params.apellido.value : null,
        domicilio: req.swagger.params.domicilio ? req.swagger.params.domicilio.value : null,
        telefono: req.swagger.params.telefono ? req.swagger.params.telefono.value : null,
        fotoPerfil: req.swagger.params.fotoPerfil ? req.swagger.params.fotoPerfil.value : null,
        email: req.swagger.params.email ? req.swagger.params.email.value : null
      };

      main.libs.paciente.insert(parametros)
        .then(paciente => {
          res.json(paciente);
        })
        .catch(err => {
          return next(err);
        });
    },
    'find': (req, res, next) => {
      debug('.paciente.find called');

      let parametro = req.swagger.params.id ? req.swagger.params.id.value : null;
      let dni = req.swagger.params.dni ? req.swagger.params.dni.value : null;
      let nombre = req.swagger.params.nombre ? req.swagger.params.nombre.value : null;
      let apellido = req.swagger.params.apellido ? req.swagger.params.apellido.value : null;

      main.libs.paciente.find(parametro, {
        dni: dni,
        nombre: nombre,
        apellido: apellido
      })
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