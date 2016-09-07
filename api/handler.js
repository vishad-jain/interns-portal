var DOC = require('dynamodb-doc');
var docClient = new DOC.DynamoDB();

var table = "interns";
/*
set user details
*/
module.exports.postUser = function(event, context) {
    console.log(JSON.stringify(event, null, ' '));
    var datetime = new Date().getTime().toString();
    var params = {};
    params.TableName = "interns";
    params.Item = {
        "id": event.id,
        "username": event.username,
        "firstname": event.firstname,
        "fullname": event.fullname,
        "lastname": event.lastname,
        "mobile": event.mobile,
        "tel": event.tel,
        "address": event.address,
        "nic": event.nic,
        "email": event.email,
        "instInfo": event.instInfo,
        "intshpInfo": event.intshpInfo,
        "startdate": event.startdate,
        "enddate": event.enddate,
        "projects": event.projects,
        "lastUpdated": datetime
    };

    console.log(params.Item);

    var pfunc = function(err, data) {
        if (err) {
            console.log(err, err.stack);
            context.fail('ERROR: ' + err);
        } else {
            context.succeed('It worked!');
        }
    };

    docClient.putItem(params, pfunc);
};

////////////////////////////////////////////////////////////////////////////////
module.exports.updateUser = function(event, context) {
    var AWS = require("aws-sdk");
    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log(JSON.stringify(event, null, ' '));

    var params = {
        TableName: "interns",
        Key: {
            "id": event.id
        },
        UpdateExpression: "set firstname = :f, lastname= :l, fullname= :fn, nic= :nic, email= :e, mobile= :m, tel= :tel, address= :a, goals= :g, social= :s, techs= :t ",
        ExpressionAttributeValues: {
            ":f": event.firstname,
            ":l": event.lastname,
            ":fn": event.fullname,
            ":nic": event.NIC,
            ":e": event.email,
            ":m": event.mobile,
            ":tel": event.tel,
            ":a": event.address,
            ":g": event.goals,
            ":s": event.social,
            ":t": event.techs

        },
        ReturnValues: "UPDATED_NEW"

    };

    console.log("Updating the item...");


    var pf = function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            context.fail('ERROR: ' + err);
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            context.succeed('It worked!');
        }
    };

    docClient.update(params, pf);

};
///////////////////////////////////////////////////////////////////////////////////
module.exports.getUsers = function(event, context) {

    docClient.scan({
            TableName: "interns",
            Limit: 50
        },
        function(err, data) {
            if (err) {
                console.log(err, err.stack);
                context.fail('ERROR: ' + err);
            } else {
                var response = {};
                response.records = [];
                for (var i in data.Items) {
                    console.log(data.Items[i]);
                    response.records.push(data.Items[i]);
                }
                console.log(response);
                context.succeed(response);
            }
        }
    );
};
////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.getUser = function(event, context) {

    console.log(event.id);
    var params = {
        "TableName": "interns",
        "Key": {
            "id": event.id,
        }
    };

    docClient.getItem(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            context.succeed(err);
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            console.log(data);
            context.succeed(data);
            //context.succeed(JSON.stringify(data, null, 2));
        }
    });
};

///////////////////////////////////Task Related/////////////////////////////////

//get all active task

module.exports.getAllActiveTask = function(event,context){
  var params = {
    TableName: "config",
    Key: {
        "id": "activeTask",
    },
    ProjectionExpression: "Task"
  };

  docClient.getItem(params, function(err, data) {
      if (err)
          console.error(JSON.stringify(err, null, 2));
      else
          //data = data.Item.Task;
          console.log(JSON.stringify(data, null, 2));
          context.succeed(data);
  });
};
////////////////////////////////////////////////////////////////////////////////

// get user's task
module.exports.getUserTask = function(event,context){
  console.log(event.id);

  var params = {
    TableName: "interns",
    Key: {
        "id": event.id
    },
    ProjectionExpression: "Task"
  };

  docClient.getItem(params, function(err, data) {
      if (err)
          console.error("ERROR" + JSON.stringify(err, null, 2));
      else
          //data = data.Item.Task;
          console.log("OK" + JSON.stringify(data, null, 2));
          context.succeed(data);
  });
};

////////////////////////////////////////////////////////////////////////////////
module.exports.updateTaskAdmin = function(event,context){
  var AWS = require("aws-sdk");
  var docClient = new AWS.DynamoDB.DocumentClient();

  console.log(event.taskArray);
  var params = {
      TableName: "config",
      Key: {
          "id":"activeTask"
          },
      UpdateExpression: "SET Task = :Task",
      ExpressionAttributeValues: {
          ":Task": event.taskArray
      },
      ReturnValues: "ALL_NEW"
  };

console.log("Updating.........");
  docClient.update(params, function(err, data) {
      if (err)
          console.error("ERROR" + JSON.stringify(err, null, 2));
      else
          console.log("OK" + JSON.stringify(data, null, 2));
          context.succeed(data);
  });
};
