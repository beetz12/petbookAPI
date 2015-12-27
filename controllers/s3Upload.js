var aws = require('aws-sdk');

var AWS_ACCESS_KEY = 'AKIAJQB2DVDLK4DDGSYA';
var AWS_SECRET_KEY = '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';
var S3_BUCKET = 'petbookpics';

exports.SignS3 = function(req, res) {
     aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
    aws.config.update({region: 'us-west-2' , signatureVersion: 'v4' });
    var s3 = new aws.S3(); 
    var s3_params = { 
        Bucket: S3_BUCKET, 
        Key: req.query.file_name, 
        Expires: 60, 
        ContentType: req.query.file_type, 
        ACL: 'public-read'
    }; 
    s3.getSignedUrl('putObject', s3_params, function(err, data){ 
        if(err){ 
            console.log(err); 
        }
        else{ 
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name 
            };
            res.write(JSON.stringify(return_data));
            res.end();
        } 
    });
}

