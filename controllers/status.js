var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Status = mongoose.model('Status'),
    moment = require('moment'),
    utility = require('../data/Utility');

exports.likePost = function(req, res) {
    var statusID = req.params.statusID;
    // console.log('status is: ', statusID);
    var userID = req.params.userID;
    //assigns the user as the donor

    var filter = {
    	_id: statusID
    }
    var updateObj = {
    	$push: { likedBy: userID }
    }

//    updateObj._Owner = userID;
    console.log('b4 create');
    Status.update(filter, updateObj,
    	function(err, results) {
        if (err) {
            console.log('in err', err);
            return utility.handleError(res, err);
        } else {
            console.log('in else');
            return res.send(results);
        }
    }); 
}