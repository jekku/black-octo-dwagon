'use strict'

const fs = require('fs');
const _  = require('lodash');
const max_entries = process.argv[2] || 2000;
const max_cash    = parseFloat(process.argv[3]) || 2.0;

let accounts = [];
let pay_data = new Array(+max_entries);

let read_accounts_file = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('accounts.txt', 'utf-8', (err, data) => {
            if (err) {
              return reject(err);
            }

            resolve(data.trim());
        });
    });
};



let add_accounts = (data) => {
    _(data.split("\n")).forEach( account => {
        accounts.push(account);
    }).commit();
};



let generate_mass_pay_data = () => {
    let get_random_cash = () => {
        return (Math.random() * (max_cash)).toFixed(2);
    };

    let get_random_account = () => {
        return accounts[Math.floor(Math.random() * accounts.length)];
    };

    pay_data = _(pay_data).map( data => {
        return {
            email: get_random_account(),
            amount: get_random_cash()
        }
    }).value();

};



let write_mass_pay_data = () => {
    fs.truncateSync('masspay.csv', '');
    _(pay_data).forEach( data => {
        let line = `${data.email},${data.amount},USD\n`;
        fs.appendFileSync('masspay.csv', line);
    }).commit();
};

read_accounts_file().then(add_accounts)
                    .then(generate_mass_pay_data)
                    .then(write_mass_pay_data);

