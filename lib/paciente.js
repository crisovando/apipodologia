'use strict';
const debug = require('debug')('restfulmodel:lib:account');

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

const uploadImage = (imagen) => {

  // call S3 to retrieve upload file to specified bucket
  var uploadParams = {
    Bucket: 'podologia',
    Key: imagen.originalname,
    Body: imagen.buffer
  };

  return new Promise((resolve, reject) => {
    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
      if (err) reject(err);
      if (data) resolve(data.Location);
    });
  });
};

class Paciente {
  constructor(main) {
    this.db = main.db;
  }

  insert(data) {
    debug('insert called: ' + JSON.stringify(data));

    const esFotoValida = (foto) => {
      return foto.mimetype === 'image/jpeg';
    };
    const upsertPaciente = (urlPerfil) => {
      return new Promise((resolve, reject) => {
        data.fotoPerfil = urlPerfil;
        this.db.pacientes.update(
          { 'dni': data.dni },
          data,
          { upsert: true },
          (err, doc) => {
            err ? reject(err) : resolve(doc);
          }
        );
      });
    };

    if (data.fotoPerfil && !esFotoValida(data.fotoPerfil)) throw ('el formato de la imagen no es valido');
    data.fechaAlta = new Date();

    return new Promise((resolve, reject) => {
      this.db.pacientes.findOne({
        dni: data.dni
      }, (err, doc) => {
        if (err) reject(err);

        let upload;
        if (data.fotoPerfil){
          upload = uploadImage(data.fotoPerfil);
          debug('promise upload: ' + JSON.stringify(upload));
        }
          
        if (doc != null) {
          if (upload)
            upload
              .then(upsertPaciente)
              .then(doc => resolve(doc))
              .catch(err => {
                reject(err);
              });
          else 
            upsertPaciente()
              .then(doc => resolve(doc))
              .catch(err => reject(err));
        } else {
          debug('INSERT');
          upsertPaciente()
            .then(doc => resolve(doc))
            .catch(err => reject(err));
        }
      });
    });
  }

  find(id, filters) {

    let filt = {};
    if (filters.nombre) filt.nombre = {
      $regex: '.*' + filters.nombre + '.*'
    };
    if (filters.apellido) filt.apellido = {
      $regex: '.*' + filters.apellido + '.*'
    };
    if (filters.dni) filt.dni = filters.dni;

    return new Promise((resolve, reject) => {
      if (id)
        this.db.pacientes.findOne({
          _id: this.db.ObjectId(id)
        }, (err, doc) => {
          if (err) reject(err);
          resolve(doc);
        });
      else {
        this.db.pacientes.find(filt, (err, doc) => {
          if (err) reject(err);
          resolve(doc);
        });
      }
    });
  }

  insertHistorial(id, datos) {
    datos.fechaCreacion = new Date();

    return new Promise((resolve, reject) => {
      this.db.pacientes.findOne({
        _id: this.db.ObjectId(id)
      }, (err, doc) => {
        if (err) reject(err);

        if (doc != null) {
          datos.pacienteId = id;
          this.db.historial.insert(datos, (err, doc) => {
            err ? reject(err) : resolve(doc);
          });
        } else {
          reject('No existe el paciente');
        }
      });
    });
  }

  findHistorial(pacienteId) {
    return new Promise((resolve, reject) => {
      this.db.historial.find({
        pacienteId: pacienteId
      }).sort({ fechaCreacion:-1 }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  removeHistorial(pacienteId, historialId) {
    return new Promise((resolve, reject) => {
      this.db.historial.remove({
        pacienteId: pacienteId,
        _id: this.db.ObjectId(historialId)
      },(err, doc) => {
        err ? reject(err) : resolve(doc);
      });
    });
  }

  updateHistorial(notaClinica, historialId) {
    notaClinica.fechaModificacion = new Date();
    const id = notaClinica._id;
    return new Promise((resolve, reject) => {
      this.db.historial.update(
        {_id: this.db.ObjectId(historialId)},
        {
          $set: {
            titulo: notaClinica.titulo,
            observacion: notaClinica.observacion
          }
        },
        (err, doc) => {
          err ? reject(err) : resolve(doc);
        }
      );
    });
  }
}
module.exports = Paciente;