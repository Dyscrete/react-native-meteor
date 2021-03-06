import Data from '../Data';
import call from '../Call';
import User from './User';
import { hashPassword } from '../../lib/utils';


module.exports = {
  createUser(options, callback = ()=>{}) {
    if (options.username) options.username = options.username;
    if (options.email) options.email = options.email;

    // Replace password with the hashed password.
    options.password = hashPassword(options.password);

    User._startLoggingIn();
    call("createUser", options, (err, result)=>{
      User._endLoggingIn();

      User._handleLoginCallback(err, result);

      callback(err);
    });
  },
  changePassword(oldPassword, newPassword, callback = ()=>{}) {

    //TODO check Meteor.user() to prevent if not logged

    if(typeof newPassword != 'string' || !newPassword) {
      return callback("Password may not be empty");
    }

    call("changePassword",
          oldPassword ? hashPassword(oldPassword) : null,
          hashPassword(newPassword),
      (err, res) => {

      callback(err);
    });
  },
  forgotPassword(options, callback = ()=>{}) {
    if (!options.email) {
      return callback("Must pass options.email");
    }

    call("forgotPassword", options, err => {
      callback(err);
    });
  }
}
