var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Status = mongoose.model('Status'),
    Comment = mongoose.model('Comment'),
    moment = require('moment'),
    utility = require('../data/Utility');

//var deepPopulate = require('mongoose-deep-populate')(mongoose);

exports.getProfile = function(req, res) {
    var userID = req.params.userID;
    User.findOne({
            _id: userID
        },
        function(err, data) {
            if (err) {
                return utility.handleError(res, err);
            } else {
                return res.send(data);
            }
        });
}

exports.test = function(req, res) {
    return res.send({
        test: "successful"
    });
}

exports.UpdateOrSavePetProfile = function(req, res) {
    var userID = req.params.userID;
    console.log('req.body is: ', req.body);
    var upsertData = {
        pet: req.body
    };

    // var updateOptions = {
    //     upsertData: false,
    //     new: true
    // };

    var field = Object.keys(req.body)[0];
    var value = req.body[field];
    var combinedName = "pet." + field;
    console.log('field is: ', field);
    console.log('value is: ', value);
    console.log('combinedName is: ', combinedName);

    var petUpdate = {};
    petUpdate[combinedName] = value;


    var updateOptions = {
        $set: petUpdate
    };

    User.update({
            _id: userID
        },
        updateOptions,
        function(err, data) {
            if (err) {
                return utility.handleError(res, err);
            } else {
                return res.send(data);
            }
        });
}


exports.getMyPosts = function(req, res) {
    var userID = req.params.userID;

    Status.find({
        _Owner: userID
    }).lean().populate('comments').exec(
        function(err, docs) {
            if (err) {
                return utility.handleError(res, err);
            }

            Comment.populate(docs, {
                path: 'comments.commentBy',
                select: 'username',
                model: User
            }, function(err, data) {
                if (err) {
                    return utility.handleError(res, err);
                } else {
                    return res.send(data);
                }
            });
        });


}

exports.makeNewPost = function(req, res) {
    var userID = req.params.userID;
    console.log('user is: ', userID);
    //assigns the user as the donor
    var updateObj = req.body;
    updateObj._Owner = userID;
    console.log('b4 create');
    Status.create(updateObj, function(err, results) {
        if (err) {
            console.log('in err', err);
            return utility.handleError(res, err);
        } else {
            console.log('in else');
            return res.send(results);
        }
    });
}

exports.getMoments = function(req, res) {
    console.log('get moments');
    var userID = req.body.userID;
    var offset = req.body.offset || 0;
    var query = Status.find({}).lean().populate('_Owner comments');

    //     _Owner: {
    //         '$ne': userID
    //     }
    // });

    // get statuses in the last 4 hours

    // created >= now - 4 hours
    // query.where('createdDate').gte(moment().subtract(4, 'hours'));


    var location = req.body.location;
    var rad = req.body.rad;


    //if the location is set, find all wishes that are within (rad) miles within (location)
    if (location && rad) {
        console.log('got location and rad');
        console.log('loc is: ', location);

        var area = {
            center: location,
            radius: utility.milesToRadians(rad),
            unique: true,
            spherical: true
        };
        query.where('location').within().circle(area);

    }

    query.exec(function(err, docs) {
        if (err) {
            return utility.handleError(res, err);
        }

        Comment.populate(docs, {
            path: 'comments.commentBy',
            select: 'username',
            model: User
        }, function(err, data) {
            if (err) {
                return utility.handleError(res, err);
            } else {
                return res.send(data);
            }
        });

    });
} //end of get moments

exports.isEmailUnique = function(req, res) {
    var email = req.body.email;

    //console.log(email);
    User.find({
        email: email
    }).limit(1).exec(function(err, results) {
        if (err) {
            return utility.handleError(res, err);
        } else {
            if (results && results.length > 0) {
                console.log(results.length);
                return res.send({
                    "unique": false
                })
            } else {
                //console.log(results);
                return res.send({
                    "unique": true
                });

            }

        }
    });

};


exports.isUserNameUnique = function(req, res) {
    var userName = req.body.username;
    console.log(userName);
    User.find({
        username: userName

    }).limit(1).exec(function(err, results) {
        if (err) {
            return utility.handleError(res, err);
        } else {
            if (results && results.length > 0) {
                console.log(results.length);
                return res.send({
                    "unique": false
                });
            } else {
                console.log(results.length);
                return res.send({
                    "unique": true
                });
            }

        }
    });

};
