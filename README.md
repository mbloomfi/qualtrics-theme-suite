# Qualtrics Theme Suite (QTS)
An OS X app for managing, creating, editing, and uploading Qualtrics survey themes.

<br>

##Eve API  
###About the Eve API  
Eve is a Pub/Sub system used internally to react to events (e.g. when a user clicks a button or saves their preferences).

There are 2 main methods of note within the Eve library. 
- `on` - creates an event listener (subscribes to the Pub/Sub)  
- `emit` - emits an event (publishes a Pub/Sub event)  

For debugging purposes, there is another method called `probeListners`, which will return the location of all of the locations of matching `on` methods.  
Example
```javascript
Eve.on("select brand", function(){});

Eve.probeListeners("select brand"); //returns the location of the previous 'on' method
```

###Eve API List
####Brand Related
Eve String | Description | Expected Parameter
---------- | ----------- | -------------------
`Create Brand` | Description | -
`Brand Created` | Description | -
`Click Brand Menu Button` | Description | -
`Brand Selected` | Description | -

####User Preferences
Eve String | Description | Expected Parameter
---------- | ----------- | -------------------
`Preferences Saved` | Description | -


<br>

<sub>Built with ❤ on [Electron](https://github.com/atom/electron) using node.js / io.js</sub>
