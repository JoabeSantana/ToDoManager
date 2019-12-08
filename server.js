const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const constantes = require('./constantes');
const tasks = [];

const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const SEGREDO = 'PosDispMov2019-2';

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

function cobrarTokenJWT(request, response, next) { 
	if (request.url == constantes.barra || request.url == constantes.urlLogin) {
		next();
		return;
	}
	var token = request.headers['x-access-token'];
	console.log(token);
	try {
		var decodificado = jwt.verify(token, SEGREDO);
		console.log(decodificado);
		next();
	} catch (e) {
		response.status(500).send({ message: constantes.msgTokenInvalido });
	}
}
	
app.use(cobrarTokenJWT);

app.get('/', (request, response) => {
	response.send({message : 'ok'});
});

app.get(constantes.urlTasks, (request, response) => {
	response.send(tasks);
});

app.get(constantes.urlTasksParam, (request, response) => {
	let task = getTaskLista(tasks, request.params.idDaQuestao04);
	if(task) {
		response.send(task);
	} else {
		response.send({message: constantes.msgTaskNaoLocalizada});
	}
});

app.post('/login', (request, response) => {
	let {body} = request;
	if (body.username == 'joabe' && body.password == 'user123') {
		var token = jwt.sign(
			{
				username: 'joabe',
				role: 'admin' 
			}, 
			SEGREDO, 
			{ expiresIn: '1h'}
		);
		response.send({ auth: true, token }); 
	} else {
		response.status(403).send({ auth: false, message: constantes.msgUsuarioInvalido });
	}
});

app.post(constantes.urlTasks, (request, response) => {
	let task = getTaskFromRequest(request);
	tasks.push(task);
	response.send(task);
});

app.put(constantes.urlTasksParam, (request, response) => {
	let {body} = request;
	let task = getTaskLista(tasks, request.params.idDaQuestao04);
	if(task) {
		updateTask(task, body);
		response.send(task);
	} else {
		response.send({message: constantes.msgTaskNaoLocalizada});
	}
});

app.delete(constantes.urlTasksParam, (request, response) => {
	let task = getTaskLista(tasks, request.params.idDaQuestao04);
	if(task) {
		let indexTask = tasks.indexOf(task);
		tasks.splice(indexTask, 1);
		response.send(task);
	} else {
		response.send({message: constantes.msgTaskNaoLocalizada});
	}
});

function getTaskLista(lista, idTask){
	return lista.find(task => task.id == idTask);
}

function updateTask(task, body) {
	task.title = body.title;
	task.description = body.description;
	task.isDone = body.isDone;
	task.isPriority = body.isPriority;
}

function getTaskFromRequest(request){
	let {body} = request;
	
	let task = {
		title: body.title,
		description: body.description,
		isDone: body.isDone,
		isPriority: body.isPriority,
		id: uuid()
	};

	return task;
}

app.listen(constantes.porta, () => {
	console.log('Escutando...');
});