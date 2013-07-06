#!/usr/bin/env node

var config = require('../config')
  , path = require("path")
  , bcrypt = require('bcrypt-nodejs')
  , uuid = require('node-uuid')
	, orm = require("orm")
  , program = require("commander");


var AddSubwayUser = function (username, password) {
	orm.connect({ protocol: "sqlite", pathname: config.sqlite_path }, function (err, db) {
		db.load(path.join(__dirname, "/models"), function (err) {
			db.sync(function (err) {
        // map ORM to app object
        var User = db.models.user;
        User.count({ username: username }, function (err, count) {
          if (count === 0) {
            // hash the password
            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(password, salt, null, function(err, hash) {
                // create the new user
                User.create([{
                 user_id: uuid.v1()
                 , username: username
                 , password: hash
                 , joined: Date.now()
                }], function (err, users) {
                  console.log('Add '+username+' success');
                });
              });
            });
          } else {
            console.error('User '+username+' existed');
          }
        });
      });
		});
	});
};

if(require.main == module) {
  console.error('Invoked at command line.');
  if(process.argv.length > 2 ) {
    program
      .version('0.0.1')
      .option('-u, --user <string>', 'Add User')
      .option('-p, --password <string>', 'User Password (must include -u)') 
      .parse(process.argv);
    if(program.user && program.password) {
      console.log('Under Construction');
    }
  } else {
    program.prompt('Username: ', function (username) {
      if (username === '' || username.match(/^[0-9]/)) {
        console.error('Username cannot be empty or begin with a number');
        process.exit(1);
      } else {
        program.password('Password: ', '*', function (password) {
          AddSubwayUser(username, password, function () {
            process.exit(1);
          });
        });
      }
    });   
  }
} else {
  console.error('Invoked via library call');
}

exports.AddSubwayUser = AddSubwayUser;