// Load required modules
const http = require("http"); // http server core module
const path = require("path");
const express = require("express"); // web framework external module

function doSomeMagicToMakeExpressParseJsonBodyAsYoudExpectItDidOutOfTheBox() {
  var bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({
      extended: true
  }));
  app.use(bodyParser.json());
}

// Set process name
process.title = "networked-aframe-server";

// Get port or default to 8080
const port = process.env.PORT || 8080;

// Setup and configure Express http server.
const app = express();
app.use(express.static('public'))

app.get('/space/:spaceId', function(req, res){
  let spaceId = req.params.spaceId
  console.log(`responding with space ${spaceId}`)
  res.sendFile(__dirname + '/public/index.html');
})

// Start Express http server
const webServer = http.createServer(app)

var defaultPlan = { items: [
  '<a-box position="4 0 0.6" scale="2 2 2" color="blue"></a-box>',
  '<a-box position="2 5 3" scale="5 5 5" color="black"></a-box>',
  '<a-box position="1 1 -3" scale="1 1 1" color="orange"></a-box>'
]}

let plans = {
  a: Object.assign({}, defaultPlan)
}

app.get('/plan/:planId', function (req, res) {
  let planId = req.params.planId
  let plan = plans[planId] || {}
  console.log(`giving plan ${planId} (${plan.items.length} items)`)
  res.send(plan)
})

doSomeMagicToMakeExpressParseJsonBodyAsYoudExpectItDidOutOfTheBox()
app.put('/plan/:planId', function (req, res) {
  let planId = req.params.planId
  console.log(`receiving plan ${planId}:`, req.body)
  if (req.body.items && req.body.items.length >= 0) {
    console.log('saving plan:', req.body)
    plans[planId] = req.body
    res.json({success:true})
  }
  else {
    res.status(400).json({success:false, message: 'plan did not contain items'})
  }
})

webServer.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});

