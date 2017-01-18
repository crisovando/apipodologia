"use strict"
const debug = require('debug')("restfulmodel:lib:account");

class Account {
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

  find(data){
    return new Promise(( resolve, reject)=>{
      if (data)
        this.db.pacientes.find({ _id: data }, (err, doc) => {
          if (err) reject(err);
          resolve(doc);
        });
      else {
        this.db.pacientes.find({}, (err, doc) => {
          if (err) reject(err);
          resolve(doc);
        });
      }
    });
  }
}

module.exports = Account;
