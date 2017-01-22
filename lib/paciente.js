"use strict"
const debug = require('debug')("restfulmodel:lib:account");

class Paciente {
  constructor(main) {
    this.db = main.db;
  }

  insert(data) {
    debug('insert called: '+ JSON.stringify(data));
    data.fechaAlta = new Date();

    return new Promise(( resolve, reject)=>{
      this.db.pacientes.findOne({ dni: data.dni }, (err, doc) => {
        if (err) reject(err);

        if (doc != null){
          this.db.pacientes.update(
              { "dni": data.dni },
              data,
              (err, doc) =>{
                err? reject(err): resolve(doc);
              }
          );
        }
        else {
          debug('INSERT')
          this.db.pacientes.insert(data, (err, doc)=>{
            err? reject(err): resolve(doc);
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
        this.db.pacientes.find({ _id: this.db.ObjectId(id) }, (err, doc) => {
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
}

module.exports = Paciente;
