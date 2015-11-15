var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StatusSchema = new Schema({

    commentBy: { 
    	type: Schema.Types.ObjectId, 
    	ref: 'User' 
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

mongoose.model('Status', StatusSchema);


