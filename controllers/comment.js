var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Status = mongoose.model('Status'),
    Comment = mongoose.model('Comment'),
    moment = require('moment'),
    utility = require('../data/Utility');


exports.addComment = function(req, res) {
//	POST
//	http://localhost:8080/api/status/563684f2853e6411003a1a2f/comment/userIDxxxxxx
	
	// statusID is retrieved from url
	var statusID = req.params.statusID;
	var commentUserID = req.params.userID;
	var commentMsg = req.body.comment;

	// find the status to add new comment
	var filter = {
		_id: statusID
	}
	
    var insertObj = {
    	commentBy: commentUserID,
	    comment: commentMsg 
	  }
	
	// get notificationGroup list
	
	
	// use mongoose method to generate a new comment
	// comment: _id, CommentBy, Comment, CreatedDate
    var promise = Comment.create(insertObj, function(err, results) {
        if (err) {
            console.log('in err', err);
            return utility.handleError(res, err);
        } 
        
        else {
        	
        	// here we get the newly generated commentID
        	var commentID = results._id;
        	var commentByID = results.commentBy;
//            return res.send({
//                message: commentID
//            });	
            
        	// commentByID could be added correctly, but notificationGroup should be unique. bug here needs to be fixed.
        	var updateObj = {
        		$push: { comments: commentID, notificationGroup: commentByID }
        	
        	};
        	
        	// the next step is to add this commentID into status comments list
        	// 1. find the statusID that status needs to be updated
        	// 2. add the commentID in updateObj then update the status
        	Status.findByIdAndUpdate(statusID, updateObj, {new: true}, function(err, results) {
	                if (err) {
	                    console.log('in err', err);
	                    return utility.handleError(results, err);
	                } else {
	                    console.log('in status upate else');
	                    return res.send(results);
	                }
	        });       
        	
        	// send notification to user group
        	
        	
        }
      });
    
}

exports.getComments = function(req, res) {
//	GET
//	http://localhost:8080/api/status/563684f2853e6411003a1a2f/comments	
    return res.send({
        message: 'getComments Successful'
    });
}