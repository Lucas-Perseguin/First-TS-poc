# A fraternity's houseworks management API

This is a Proof of Concept about Typescript, wich uses express to create routes within the server, pg to connect to and use the database and joi to verify if the received requisition body is in the expected format.

Down below is the description and usage of each route in the API.

---

## RESIDENTS

### POST /residents

Route to create a resident  
(Request body must have a name with at least 3 letters and only that)  
:Returns the full object of the created Resident  
The corresponding resident in the database will also have an isActive parameter wich will be set to true and tells if the resident is still part of the fraternity.

### GET /residents

Route to get all the residents or specific ones of them through query string  
Request body is unused  
(name, id and isActive can be used through query strings to filter the result)  
:Returns an array with objects of the selected resident  
-name refers to the residents name, can be used to get residents wich name contains at any position the value passed in the name query string  
-id refers to the residents id, must be a number and will get an specific resident(the response will still come as an array)  
-isActive refres to the residents isActive, a boolean wich describes if the registered resident is still an actual resident of the house, if the value is **true** will return the residents with value true, **any** other passed value will retun residents with value **false**.

### PATCH /residents/:residentId

Route used to set the resident's isActive value to false  
(Request must have a valid resident id in the route param)  
:Response will have the object of the specified resident with the value updated;

### DELETE /residents/:residentId

Route used to delete a specific resident through it's id  
(Request must have a valid resident id in the route param)  
:Response will have the object of the deleted resident

---

## HOUSEWORKS

### POST /houseworks/:residentId

Route to create a housework wich will be linked to the resident wich has the specified  
(Request body must be ion accord to the following model and the id received through the request params must be valid)  
:Returns the object of the created housework  
-Model: HouseworkModel = Joi.object({
name: Joi.string().min(5).required(),
description: Joi.string().required(),
date: Joi.date().required(),
});  
-The date value specifies the expected date of completion for the housework  
-Other than the model specified values, the created housework will also have an id, a responsible wich refers to the id of a resident, a done boolean wich tells if the chore has been completed and a completion date wich tells the date of the chore completion.
The responsible is created through the residentId route param, the done is defaulted as false and the completion is null.

### GET /houseworks

Route to get all the houseworks or specific ones determined by the route param  
(name, id , date, done, deliveredLate, isLate, today and responsible can be used through query strings to filter the result)  
**Only one between isLate, deliveredLate and today can be used at a time**  
:Returns an array with the selected houseworks  
-id selects an specif housework with the specified id, it still returns an array the single housework object inside  
-name selects the houseworks wich the name contains the specified value at any part  
-date returns the houseworks wich the date corresponds to the specified value  
-done if the value is **true** returns the houseworks with done true, **otherwise** will return the ones with done **false**  
-responsible returns the houseworks of the specified respoinsible, the value must be an integer and refers to residents id  
-today returns the houseworks wich the date corresponds to the current date (NOW()::date)  
-isLate returns the houseworks wich have not been completed and the current date (NOW()::date) is after the housework's date value (the houseworks that are pending and late) **will work if is present ate the route query string, the value doesn't matter**  
-deliverdLate returns the houseworks wich are completed but the completion date is later than the housework's own specified date (the ones that got completed but where already late then), **will work if is present ate the route query string, the value doesn't matter**

### POST /houseworks/:houseworkId/complete

Sets the specified housework's done as true and the completion with the value of the current date (NOW()::date)  
(the houseworkId must be valid, no body needed)  
:Returns the object of the housework with the new values

### PATCH /houseworks/:houseworkId

Used to update the values of the specified housework  
(name, description, date and responsible are the available body model values and the ones that can be updated, none of them is required and the update can be done with as many as needed)  
:Returns the updated housework object

### DELETE /houseworks/:houseworkId

Used to delete the specified housework  
(houseworkId must be valid, no body needed)  
:Returns the deleted housework object
