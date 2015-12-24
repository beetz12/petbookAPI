var mongoose = require('mongoose'),
    // jwt = require('jsonwebtoken'),
    User = mongoose.model('User'),
    passport = require('passport'),
    cryptoUtil = require('../services/auth/cryptoUtil'),
    bcrypt = require('bcrypt-nodejs');



exports.ChangePassword = function(req, res) {
    
    var userName = req.body.username;
    var newPassword = req.body.newPass;
    var oldPassword = req.body.oldPass;
    
    var searchUser = {
            username: userName
    };
    
//    res.send('running ChangePassword', newPassword + '/' + oldPassword + "/" + userName);
    
    User.findOne(searchUser, function(err, user){
        if(err){
            res.send('error');
        }
        
        else{
            user.comparePasswords(oldPassword, function(err, isMatch) {
              if (err) res.send('error');
              if (!isMatch) res.send({errorMsg: 'username/password not match'});   
              else {
                  // Okay to update the password
                  
                  cryptoUtil.hashPassword(newPassword).then(function(data, err) {
                      if (err) {
                          return res.send({
                              success: false
                          });
                      } else {
                          hashedNewPassword = data;
                          var update = {
                                  password: hashedNewPassword,
                                  needsToChangePassword: false
                          };
                          
                          User.findOneAndUpdate({
                              username: userName
                          }, update, function(err, data) {
                              if (err) {
                                  return utility.handleError(res, err);
                              } else {
                                  res.send({
                                      success: true
                                  });
                              }
                          });                          
                      }
                  }); // end of hashPassword              
              } // end of else
            }); // end of comparePasswords
            
            }
        
    });
    

    
}; // end of ChangePassword


exports.Activate = function(req, res) {
    var activation = req.body.activation;
    console.log('activation is: ', activation);

    if (activation) {
        var userID = cryptoUtil.deCodeID(activation);
        var update = {
            status: 'active'
        };

        //see if the user has already been activated
        User.findOne({
                _id: userID,
                status: {
                    '$ne': 'pending'
                },
            },
            function(err, data) {
                console.log('date is: ', data);
                if (data) { //the user is already activated
                    return res.send({
                        activated: false
                    });
                } else { //the user needs to be activated
                    User.findOneAndUpdate({
                        _id: userID
                    }, update, function(err, data) {
                        if (err) {
                            return utility.handleError(res, err);
                        } else {
                            return res.send({
                                activated: true
                            });
                        }
                    });
                }
            });
    } else {
        return utility.handleError(res, 'the activation is missing');
    }
};


//the workflow: 
//first the user clicks forgot password link in app
//the app posts the email to the forgotpassword API
//which will generate a temporary password for the user and set a flag that will 
//require the user to change his password on the next sign in
//The user will sign in with his temporary password and be prompted to immediately change his password



exports.ForgotAndResetPassword = function(req, res) {
    var email = req.body.email;

    User.findOne({
            email: email
        },
        function(err, dbUser) {
            if (dbUser) {

                var newPassword = cryptoUtil.generateRandomPassword(8);
              cryptoUtil.hashPassword(newPassword).then(function(hashedNewPassword, err) {
                  if (err) {
                      return res.send({
                          success: false
                      });
                  } else {
                      var update = {
                          password: hashedNewPassword,
                          needsToChangePassword: true
                      };
                      
                      User.findOneAndUpdate({
                          email: email
                      }, update, function(err, data) {
                          if (err) {
                              utility.handleError(res, err);
                          } else {
                            //need to send email from here
                              res.send({
                                  success: true
                              });
                          }
                      });                          
                  }
              }); // end of hashPassword
            }

        }); //end of find one
};


