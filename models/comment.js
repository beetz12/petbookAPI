var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({

    commentBy: { 
    	type: Schema.Types.ObjectId, 
    	ref: 'User',
    	required: true
    },

    comment: {
    	type: String,
    	required: true
    },
    
    createdDate: {
        type: Date,
        default: Date.now
    }
    
});

mongoose.model('Comment', CommentSchema);


