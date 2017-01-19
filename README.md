# Node.js and Cloudant Starter Overview

The Node.js Starter demonstrates a simple, reusable Node.js web application that works with Cloudant NoSQL DB.

# Preparation

1. [Register](https://console.ng.bluemix.net/registration) for a Bluemix account if you have not done so already

2. Install the Bluemix CLI using the link [here](http://clis.ng.bluemix.net/ui/home.html) - verify that it's working by running `bluemix -v` in the command prompt, this should the diplay the CLI version (if not working, make sure to add the bluemix executable to the PATH, instructions on how to do so can be found here for [windows](http://www.computerhope.com/issues/ch000549.htm), [linux](http://www.troubleshooters.com/linux/prepostpath.htm) or [mac](http://architectryan.com/2012/10/02/add-to-the-path-on-mac-os-x-mountain-lion/#.WH9RLbZ96L8))

3. Install the CloudFoundry CLI using the link [here](https://github.com/cloudfoundry/cli/releases) - verify that it's working by running `cf -v` in the command prompt, this should the diplay the CLI version (if not working, see above for how to add to PATH)

4. Login to Bluemix with your username and password by running `bluemix login -a https://api.ng.bluemix.net` in the command prompt

# Deploying the application on Bluemix

1. Clone this repository by running `git clone https://github.com/amirkeren/bluemix-lab1.git` (if you have [git installed](https://git-scm.com/downloads)) or download it as a zip file from [here](https://github.com/amirkeren/bluemix-lab1/archive/master.zip)

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

And then run `cf push`. _Note that APP_NAME.mybluemix.net must be_ **unique** (so it is best to use your *fullname-lab1* for example)

You can view your deployed application on your [dashboard](https://console.ng.bluemix.net/dashboard/apps). If the application fails to start, try renaming your application and run `cf push` again

# Implementing endpoints

1. Edit the file *app.js* and replace the existing TODO code for the two endpoints (lines **44-56**) with the following -

```
//endpoint for retrieving all phrases
app.get('/getPhrases', function(req, res) {
  var result = 'No Phrases Found';
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

//endpoint for adding a new phrase
app.post('/addPhrase', function(req, res) {
  if (db == null) {
    console.log(DATABASE_ERROR);
    res.sendStatus(500);
    return;
  }
  var value = req.body.value;
  if (value == null) {
    console.log(PARAMETER_ERROR);
    res.sendStatus(500);
    return;
  }
  db.insert({ _id: value }, function(err, data) {
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

Wait for the application to redeploy and then try to add a new phrase. 
To view the live application log simply run `cf logs <APP_NAME>`

# Adding Cloudant NoSQL DB service to the application

1. Go to the creation page of the Cloudant NoSQL DB service using [this](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db/) link or search for "cloudant" in the Bluemix catalog

2. Before creating the service make sure it is *bound* to the application you created in the previous step (do this by verifying that the drop-down box on the left under "Connect to:" has your application name selected)

3. Restage the application if prompt to do so

# Adding adapter methods

1. Add the following code to the bottom of the file *app.js* - 

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
  var dbname = 'phrases';
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

Wait for the application to redeploy and then try to add a new phrase
