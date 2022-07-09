const express = require("express");

const server = express(); //criando do servidor

server.use(express.json()); //serve para o servidor aceitar requisição com json

const cursos = ["NodeJS", "JavaScript", "TypeScript"];

//Middleware Global
server.use((req, res, next) => {
  console.log(`Requisição chamada: ${req.url}`);

  return next();
});

//Middleware para checar se o usuário insirou o nome antes da requisição
function checkCurso(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json({ error: "Nome do curso é obrigatório!" });
  }

  return next();
};

function checkIndexCurso(req, res, next) {
  const curso = cursos[req.params.index];

  if(!curso) {
    return res.status(400).json({ error: "Usuário não encontrado!" });
  }

  req.curso = curso; //depois de verificar se existe o curso, atribui esse curso a variável req.curso, podendo assim usá-la nas requisição sem precisar chamar o req.params

  return next();
}

server.get("/cursos", (req, res) => {
  //lista todos os cursos
  return res.json(cursos);
});

//localhost:3000/cursos
//lista um curso específico
server.get("/cursos/:index", checkIndexCurso, (req, res) => {

  return res.json(req.curso);
});

server.post("/cursos", checkCurso, (req, res) => {
  //cria um novo curso
  const { name } = req.body;
  cursos.push(name);

  return res.json(cursos);
});

//Atualiza um curso
server.put("/cursos/:index", checkCurso, checkIndexCurso, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  cursos[index] = name;

  return res.json(cursos);
});

//Exclui um curso
server.delete("/cursos/:index", checkIndexCurso, (req, res) => {
  const { index } = req.params;

  cursos.splice(index, 1);

  return res.send();
});

//servidor ouvindo na porta 3000
server.listen(3000);
