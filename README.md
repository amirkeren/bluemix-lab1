# Node.js and Cloudant Starter Overview

The Node.js Starter demonstrates a simple, reusable Node.js web application that works with Cloudant NoSQL DB.

# Preparation

1. Install Bluemix CLI using the link [here](http://clis.ng.bluemix.net/ui/home.html)

2. Install the CloudFoundry CLI using the link [here](https://github.com/cloudfoundry/cli/releases)

3. Login to Bluemix with your username and password using the command - `bluemix login -a https://api.ng.bluemix.net`

# Deploy the app on Bluemix

1. Clone this repository or by running `git clone https://github.com/amirkeren/bluemix-lab1.git` (if you have git installed) or download it as a zip file from [here](https://github.com/amirkeren/bluemix-lab1/archive/master.zip)
2. Navigate to the cloned project folder (extract the file first if you downloaded the zip file)
3. Create a new file named manifest.yml in the root folder of the project with the following content - 

```
applications:
- path: .
  memory: 256M
  instances: 1
  domain: mybluemix.net
  name: <APP_NAME>
  host: <APP_NAME>
  disk_quota: 1024M
```

And then run `cf push`
Note that <APP_NAME>.mybluemix.net must be *unique* (so it is best to use your fullname-lab1 for example)

You can view your deployed application on your [dashboard](https://console.ng.bluemix.net/dashboard/apps)

# Implement endpoints

1. Replace the existing TODO code for the two endpoints (lines 44-56) with the following -

```
//endpoint for retrieving all students
app.get('/getStudents', function(req, res) {
  var result = 'No Students Found';
  if (db == null) {
    console.log(DATABASE_ERROR);
    res.send(result);
    return;
  }
  db.list({ include_docs: true }, function(err, data) {
    if (err) {
      console.log("Error: ", err);
    } else {
      result = '';
      for (var i = 0; i < data.total_rows; i++) {
        result += '<li>' + data.rows[i].id + '</li>';
      }
    }
    res.send(result);
  });
});

//endpoint for adding a new student
app.post('/addStudent', function(req, res) {
  if (db == null) {
    console.log(DATABASE_ERROR);
    res.sendStatus(500);
    return;
  }
  var name = req.body.name;
  if (name == null) {
    console.log(PARAMETER_ERROR);
    res.sendStatus(500);
    return;
  }
  db.insert({ _id: name }, function(err, data) {
    if (err) {
      console.log("Document already exists. Error: ", err);
      res.sendStatus(500);      
    } else {
      console.log("Inserted new document");
      res.sendStatus(200);
    }
  });
});
```

And run `cf push`

Wait for the application to redeploy and then try to add a new student. 
To view the live application log simply run `cf logs <APP_NAME>`

# Add Cloudant NoSQL DB service to the application

1. Go to the creation page of the Cloudant NoSQL DB service using [this](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db/) link or search for "Cloudant" in the Bluemix catalog

2. Before creating the service *bind* it to the application you created in the previous step

3. Restage the application if prompt to do so

# Add adapter methods

1. Add the following code to the bottom of app.js - 

```
var Cloudant = require('cloudant');

var cloudant_url;
//check if services are bound to your project
if (process.env.VCAP_SERVICES) {
	var services = JSON.parse(process.env.VCAP_SERVICES);
  //check if CloudantNoSQLDB service is bound to your project
	if (services.cloudantNoSQLDB)
		cloudant_url = services.cloudantNoSQLDB[0].credentials.url;
}

//check that we have a valid Cloudant url
if (cloudant_url == null)
  console.log(DATABASE_ERROR);
else {
  //connect using cloudant npm and URL obtained from previous step
  var cloudant = Cloudant({ url: cloudant_url });
  var dbname = 'students';
  //create database
  cloudant.db.create(dbname, function(err, data) {
    	if (err)
  	    console.log("Database already exists. Error: ", err);
    	else
  	    console.log("Created database");
    	db = cloudant.db.use(dbname);
  });
}
```

And run `cf push`

Wait for the application to redeploy and then try to add a new student
