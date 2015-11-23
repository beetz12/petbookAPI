var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Status = mongoose.model('Status'),
    Comment = mongoose.model('Comment'),
    moment = require('moment'),
    utility = require('../data/Utility');


exports.addComment = function(req, res) {
//	POST
//	http://localhost:8080/api/status/563684f2853e6411003a1a2f/comment
	
	var statusID = req.params.statusID;
	var commentUserID = req.body.userID;
	var commentMsg = req.body.comment;
	
	// find the status to add new comment
	var filter = {
		_id: statusID
	}
	
    var insertObj = {
    	commentBy: commentUserID,
	    comment: commentMsg 
	  }
	// use mongoose method
    Comment.create(insertObj, function(err, results) {
        if (err) {
            console.log('in err', err);
            return utility.handleError(res, err);
        } else {
        	
        	var commentID = results._id;
        	var updateObj = {
        		$push: { comments:commentID}
        	};

        }
    });
   
    
//    Status.update();
    
}

exports.getComments = function(req, res) {
    return res.send({
        message: 'getComments Successful'
    });
}