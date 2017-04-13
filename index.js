var express = require('express')
var app = express()
var path = require('path')

app.use(express.static(path.join(__dirname,'public')));
app.listen('8050',function(){
	console.log("listening at 8050")
})