var express = require( 'express');
var bodyParser = require( 'body-parser' );
var __ = require('underscore');
var PORT = process.env.PORT || 3000;
var app = express();
var jsonParser = bodyParser.json();
app.use( jsonParser );

var todos = [];
var todosNextId = 1;

app.get( '/', function( rew, res){
	res.send( 'Welcomt to home page' );
});

//GET /todos?completed=true&q=work
app.get( '/todos', function( req, res){
	var queryParams = req.query;
	var filteredTodo = todos;
	if ( queryParams.hasOwnProperty( 'completed' ) && queryParams.completed.trim() == 'true' && queryParams.completed.trim().length > 0 ){
		filteredTodo = __.where( filteredTodo, { completed: true } );
	}else if( queryParams.hasOwnProperty( 'completed') && queryParams.completed.trim() == 'false' && queryParams.completed.trim().length > 0  ){
		filteredTodo = __.where( filteredTodo, { completed: false} );
	}

	if( queryParams.hasOwnProperty( 'q') && queryParams.q.trim().length > 0 ){
		filteredTodo =  __.filter( filteredTodo, function( todo ){
			return todo.description.toLowerCase().indexOf( queryParams.q.toLowerCase() ) > -1;
		});
	}
	res.json( filteredTodo );
});

//GET /todos/:id
app.get( '/todos/:id', function( req, res){
	var todoId = parseInt( req.params.id, 10 );
	var matchedtodo = __.findWhere( todos, { "id": todoId} );
	if (matchedtodo){
		res.status(200).json( matchedtodo );
	}else{
		res.status(400).json( "Bad Request / todo element with give id not found" );
	}	
});

//POST /todos
app.post( '/todos', function( req, res){
	var body = __.pick( req.body, "completed", "description" );
	if( __.isBoolean( body.completed ) && __.isString( body.description ) && body.description.trim().length > 0 ){
		body.id = todosNextId++;
		body.description = body.description.trim();
		todos.push( body );
		return res.status(200).json( body );	
	}
	res.status(400).send( 'Bad Request / Not found any todos list' );	
});

// PUT /todos/:id
app.put( '/todos/:id', function( req, res) {
	var body = req.body;
	var todoId = parseInt( req.params.id );
	var validateTodo={};

	if ( !__.isNumber( todoId ) ){
		return res.staus( 400 ).send( 'Bad Request' ); 
	}
	var matchedtodo = __.findWhere( todos, {"id": todoId } );
	if( body.hasOwnProperty('completed') && __.isBoolean( body.completed ) ){
		validateTodo.completed = body.completed;
	}
	if( body.hasOwnProperty('description') && __.isString( body.description ) && body.description.trim().length > 0 ){
		validateTodo.description = body.description.trim();
	}
	__.extend( matchedtodo, validateTodo );
	res.status( 200 ).json( matchedtodo );
});

// DELETE /todos/:id
app.delete( '/todos/:id', function( req, res ){
	var todoId = parseInt( req.params.id );
	if ( __.isNumber( todoId)){
		var matchedtodo = __.findWhere( todos, {"id": todoId } );
		todos = __.without( todos, matchedtodo );
		res.json( todos );
	}else{
		res.status( 400 ).send( 'Bad Request / id is not number' );
	}
});

app.listen( PORT, function(){
	console.log( 'Database todo api server running at port :' + PORT );
});