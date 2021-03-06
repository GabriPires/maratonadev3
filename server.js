//Configurando o servidor
const express = require("express")
const server = express()

//Arquivos estaticos
server.use(express.static('public'))
server.use(express.urlencoded({
    extended: true
}))

//Configurar a conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//Vetor de doadores
// const donors = [{
//         name: "Diego Fernandes",
//         blood: "AB+"
//     },
//     {
//         name: "Robson Marques",
//         blood: "B+"
//     },
//     {
//         name: "Cleiton Almeida",
//         blood: "A+"
//     },
//     {
//         name: "Janaina Souza",
//         blood: "O+"
//     },
// ]

//Apresentação da página
server.get("/", function (req, res) {
    //return res.send("Ok, nodemon")
    db.query("SELECT * FROM donors", function (err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", {
            donors
        })
    })

})

server.post("/", function (req, res) {
    //Pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    //Adicionando valores no vetor
    // donors.push({
    //     name: name,
    //     blood: blood
    // })

    //Adicionando valores no banco de dados
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
    const values = [name, email, blood]

    db.query(query, values, function (err) {
        //Fluxo de erro
        if (err) return res.send("Erro no banco de dados.")

        //Fluxo ideal
        return res.redirect("/")
    })
})

//Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log("Started")
})