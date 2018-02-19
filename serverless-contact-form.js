// Code modified from the example given at
// https://codehabitude.com/2016/04/05/forms-to-emails-using-aws-lambda-api-gateway/

var AWS = require('aws-sdk')
const querystring = require('querystring');

// Set the region 
AWS.config.update({region: 'us-west-2'});

var ses = new AWS.SES()

 
var RECEIVER = process.env.RECEIVER;
var SENDER = process.env.SENDER;

 
exports.handler = function (event, context, callback) {
    console.log('Received event:', event)

    //Extract the request parameters from the event body
    const params = querystring.parse(event.body);
    
    //Extract the message details from the parameters
    var contact_name = params['name'];
    var contact_email = params['email'];
    var contact_phone = params['phone'];
    var contact_message = params['message'];
    
    /*
    console.log('Name:', contact_name);
    console.log('Email:', contact_email);
    console.log('Phone:', contact_phone);
    console.log('Message:', contact_message);
    */
    

    sendEmail(contact_name, contact_email, contact_phone, contact_message, function (err, data) {
       context.done(err, null)
    })


    // if we have not crashed by now then everything must have been a success right?
    var responseCode = '200';
    var responseBody = 'success';
    
    var response = {
        statusCode: responseCode,
        headers: {
			"Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
			"Access-Control-Allow-Methods": "OPTIONS,POST",
			"Access-Control-Allow-Origin": "*"
		},
        body: JSON.stringify(responseBody)
    };
    console.log("response: " + JSON.stringify(response))
    callback(null, response);

}
 
function sendEmail (contact_name, contact_email, contact_phone, contact_message, done) {
    var params = {
        Destination: {
            ToAddresses: [
                RECEIVER
            ]
        },
        Message: {
            Body: {
                Text: {
                    Data: 'Name: ' + contact_name + '\nEmail: ' + contact_email + '\nPhone: ' + contact_phone + '\nMessage: ' + contact_message,
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                Data: 'Website Contact From: ' + contact_name,
                Charset: 'UTF-8'
            }
        },
        Source: SENDER
    }
    ses.sendEmail(params, done)
}
