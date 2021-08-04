// Requiring mailchimp's module
// npm i @mailchimp/mailchimp_marketing
const client = require("@mailchimp/mailchimp_marketing");

// Requiring express and https for initializing the constant "app"
const express = require('express');
const https = require('https');
const app = express();

// app constant will pull static files(css) as well as express body parser options
app.use(express.static(__dirname)); //used to send the css file
app.use(express.urlencoded({
  extended: true
}));

// Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// As soon as the sign in button is pressed execute this
app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.secondName;
  const email = req.body.email;

  // mailchimp accepts data through this member keyword which is a array of key value pair
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data); // server accepts data as json object so convert it into json object
  const url = "https:us6.api.mailchimp.com/3.0/lists/MAILCHIMP AUDIENCE KEY HERE"; // now for using the https request method we need url, options and callback

  const options = {
    method: "POST",
    auth: "MAIL CHIMP API KEY HERE"
  }

  const request = https.request(url, options, function(response) {

    response.on("data", function(data) {
      const received = JSON.parse(data);
      console.log(received);
      // Check if user name email address are correct
      if (received.error_count != 0) {
        res.sendFile(__dirname + "/failure.html");
      } else {
        res.sendFile(__dirname + "/success.html");
      }
    });
  });

  request.write(jsonData); // using our constant to send our data to mailchimp server
  request.end();
});

// Success page to redirect to home route
app.post("/success", function(req, res){
  res.redirect("/");
})

// Failure page to redirect to home route
app.post("/failure", function(req, res){
  res.redirect("/");
})

// Listening on port 3000 and if it goes well then logging a message saying that the server is running
app.listen(process.env.PORT || 3000, function() {
  console.log("server is listening on port 3000");
});
