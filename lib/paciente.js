"use strict"
const debug = require('debug')("restfulmodel:lib:account");

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ signatureVersion: 'v4' });

const uploadImage = (imagen) =>{

  // call S3 to retrieve upload file to specified bucket
  var uploadParams = { Bucket: 'podologia', Key: imagen.originalname, Body: imagen.buffer };

  return new Promise(( resolve, reject ) =>{
    // call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, function (err, data) {
      if (err) reject(err)
      if (data) resolve(data.Location);
    });
  });
};

class Paciente {
  constructor(main) {
    this.db = main.db;
  }

  insert(data) {
    debug('insert called: '+ JSON.stringify(data));

    const esFotoValida = (foto)=> {
      return foto.mimetype === 'image/jpeg';
    }

    if (!esFotoValida(data.fotoPerfil)) throw("el formato de la imagen no es valido");
    data.fechaAlta = new Date();

    return new Promise(( resolve, reject)=>{
      this.db.pacientes.findOne({ dni: data.dni }, (err, doc) => {
        if (err) reject(err);

        if (doc != null){
          uploadImage(data.fotoPerfil)
            .then(urlPerfil =>{
              data.fotoPerfil = urlPerfil;
              this.db.pacientes.update(
                  { "dni": data.dni },
                  data,
                  (err, doc) =>{
                    err? reject(err): resolve(doc);
                  }
              );
            })
            .catch(err => {
              reject(err);
            });
        }
        else {
          debug('INSERT');
          uploadImage(data.fotoPerfil)
            .then(urlPerfil => {
              data.fotoPerfil = urlPerfil;
              this.db.pacientes.insert(data, (err, doc)=>{
                err? reject(err): resolve(doc);
              });
            })
            .catch(err => {
              reject(err);
            });
        }
      })
    });
  }

  find(id, filters){

    let filt = {};
    if (filters.nombre) filt.nombre = { $regex: ".*" + filters.nombre + ".*"};
    if (filters.apellido) filt.apellido = { $regex: ".*" + filters.apellido + ".*"};
    if (filters.dni) filt.dni = filters.dni;

    return new Promise(( resolve, reject)=>{
      if (id)
        this.db.pacientes.findOne({ _id: this.db.ObjectId(id) }, (err, doc) => {
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

  insertHistorial(id, datos){
    datos.fechaCreacion = new Date();

    return new Promise(( resolve, reject)=>{
      this.db.pacientes.findOne({ _id: this.db.ObjectId(id) }, (err, doc) => {
        if (err) reject(err);

        if (doc != null){
          datos.pacienteId = id;
          this.db.historial.insert( datos, (err, doc) =>{
                err? reject(err): resolve(doc);
          });
        }
        else {
          reject('No existe el paciente')
        }
      })
    });
  }
}
module.exports = Paciente;
