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

  update(paciente) {
      let self = this;
      let ObjectId = require("mongojs").ObjectId;

      let q = paciente;

      return new Promise(( resolve, reject)=>{
          console.log(currency)
          self.db.currency.update({_id:ObjectId(currency._Id)}, {Currency: currency.Currency, Description: currency.Description, q: q}, (err, doc)=>{
              err? reject(err): resolve(doc);
          });
      });
  }
}

module.exports = Account;
