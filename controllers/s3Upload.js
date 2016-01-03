var aws = require('aws-sdk');

var AWS_ACCESS_KEY = 'AKIAJQB2DVDLK4DDGSYA';
var AWS_SECRET_KEY = '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';
var S3_BUCKET = 'petbookpics';

aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
});

aws.config.update({
    region: 'us-west-2',
    signatureVersion: 'v4'
});
var s3 = new aws.S3();

exports.SignS3 = function(req, res) {

    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            var return_data = {
                signed_request: data,
                url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + req.query.file_name
            };
            // res.write(JSON.stringify(return_data));
            res.send(return_data);
        }
    });
}

// exports.UploadS3 = function(req, res) {
   
//     var signed_request = req.body.signed_request;
//     var file = req.files[0];
//     if (file) {

//         var params = {
//             Key: file.name,
//             ContentType: file.type,
//             Body: file
//         };
//         bucket.upload(params, function(err, data) {
//             results.innerHTML = err ? 'ERROR!' : 'UPLOADED.';
//         });
//     } else {
//         results.innerHTML = 'Nothing to upload.';
//     }
//     //////////
//     var xhr = new XMLHttpRequest();
//     xhr.open("PUT", signed_request);
//     xhr.setRequestHeader('x-amz-acl', 'public-read');
//     xhr.onload = function() {
//         if (xhr.status === 200) {
//             document.getElementById("preview").src = url;
//             document.getElementById("avatar_url").value = url;
//         }
//     };
//     xhr.onerror = function() {
//         alert("Could not upload file.");
//     };
//     xhr.send(file);
// }
