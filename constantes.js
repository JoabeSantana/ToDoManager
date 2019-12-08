const porta = 3000;
const barra = '/';
const urlTasks = barra.concat('tasks');
const urlLogin = barra.concat('login');
const urlTasksParam = urlTasks.concat(barra).concat(':idDaQuestao04');
const msgTaskNaoLocalizada = 'Task não localizada';
const msgTokenInvalido = 'Token inválido';
const msgUsuarioInvalido = 'Error in username or password';

module.exports = {
	porta,
	barra,
	urlTasks,
	urlTasksParam,
	urlLogin,
	msgTaskNaoLocalizada,
	msgTokenInvalido,
	msgUsuarioInvalido
};