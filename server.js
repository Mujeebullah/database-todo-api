var express = require( 'express');
var bodyParser = require( 'body-parser' );
var __ = require('underscore');
var app = express();
var jsonParser = bodyParser.json();
app.use( jsonParser );

var todos = [];
var todosNextId = 1;

app.get( '/', function( rew, res){
	res.send( 'Welcomt to home page' );
});

//GET /todos
app.get( '/todos', function( req, res){
	res.json( todos );
});

//GET /todos/:id
app.get( '/todos/:id', function( req, res){
	var todoId = parseInt( req.params.id, 10 );
	var matchedtodo = __.findWhere( todos, { "id": todoId} );
	if (matchedtodo){
		res.status(200).json( todos );
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
		return res.status(200).json( todos );	
	}
	res.status(400).send( 'Bad Request / Not found any todos list' );	
});

// PUT /todos/:id
app.put( 'todos/:id', function( req, res) {
	var body = req.body;
	var todoId = body.params.id;
	var validateTodo;

	if ( !__.isNumber( todoId ) ){
		return res.staus( 400 ).send( 'Bad Request' ); 
	}
	var matchedtodo = __.findWhere( todos, {"id": todoId } );
	if( body.hasOwnPropery('completed') && __.isBoolean( body.completed ) ){
		validateTodo.completed = body.completed;
	}
	if( body.hasOwnProperty('description') && __.isString( body.description ) && body.description.trim().length > 0 ){
		validateTodo.description = body.description.trim();
	}
	__.extend( matchedtodo, validateTodo );
	res.status( 200 ).json( matchedtodo );
});