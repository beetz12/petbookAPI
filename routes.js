var passport = require('passport');
var createSendToken = require('./services/auth/jwt');

module.exports = function(app) {

    var PATH = '/api/';

    //auth functions

    app.post(PATH + 'register', passport.authenticate('local-register', {
        failureFlash: false,
    }), function(req, res) {
        createSendToken(req.user, res);
    });
    app.post(PATH + 'login', passport.authenticate('local-login'), function(req, res) {
        createSendToken(req.user, res);
    });

    var Auth = require('./controllers/auth');
    app.post(PATH + 'auth/activation', Auth.Activate);
    app.post(PATH + 'auth/forgotAndResetPassword', Auth.ForgotAndResetPassword);
    app.post(PATH + 'auth/changePassword', Auth.ChangePassword);
    
    // app.post(PATH + 'auth/canResetPassword', Auth.CanResetPassword);
    // app.post(PATH + 'auth/resetPassword', Auth.ResetPassword);


    var User = require('./controllers/user');

    app.get(PATH + 'test', User.test);
    //get entire user object profile
    app.get(PATH + 'pet/:userID', User.getProfile);
    //add or update pet profile
    app.post(PATH + 'pet/:userID', User.UpdateOrSavePetProfile);

    //get my posts (my wishes)
    app.get(PATH + 'status/:userID', User.getMyPosts);

    //make new post 
    app.post(PATH + 'status/:userID', User.makeNewPost);

    //check for duplicate email and username
    app.post(PATH + 'user/isEmailUnique', User.isEmailUnique);
    app.post(PATH + 'user/isUserNameUnique', User.isUserNameUnique);

    //upload profie avatar
    // app.post(PATH + 'status/:userID', User.uploadAvatarImg);

    var Status = require('./controllers/status');
    //like a post 
    app.post(PATH + 'status/:statusID/likes/:userID', Status.likePost);

    app.post(PATH + 'status/:statusID/disLikes/:userID', Status.disLikePost);
    //get other people's status updates (fulfill a wish)
    app.post(PATH + 'status', User.getMoments);

    var SendEmails = require('./controllers/sendEmails');
    //send signup confirmation email
    app.post(PATH + 'emails/signup/:userID', SendEmails.signupConfirmation); //sign up emails

    var Comment = require('./controllers/comment');
    // add a new comment for a status
    app.post(PATH + 'status/:statusID/comment/:userID', Comment.addComment);    
    // get all comments from one status
    app.get(PATH + 'status/:statusID/comments', Comment.getComments);
};
