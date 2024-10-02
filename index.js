const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { getAuthSheets } = require('./auth'); // Importe a função getAuthSheets do seu arquivo de autenticação
const router = express.Router();
const registradosRouter = require('./www/js/registros');




const port = 3030;
var path = require('path');
const app = express();
const sql = require('mssql');

var loginAdriano = "adriano";
var passwordAdriano = "762018";
var loginDurval = "durval";
var passwordDurval = "142027";
var loginOscar = "oscar";
var passwordOscar = "230277";
var loginWendson = "wendson";
var passwordWendson = "4444";
var usuario;


const config = {
    user: 'comite',
    password: 'D1gna@comite123',
    server: '192.168.0.216',
    database: 'DW_Digna',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

app.use(session({
    secret: '09r78cn82b3r89x1@38xy4184',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));
app.use('/', router); // Use o roteador express
app.use('/registrados', registradosRouter);


/*** 
app.listen(port, '172.30.5.4', () => {
   console.log(`Server running at http://172.30.5.4:${port}`);
});*/
// Inicia o servidor
app.listen(process.env.PORT || port, () => {
    console.log('SERVIDOR RODANDO')
});


app.use(express.static(path.join(__dirname, 'www')));
app.use('/lib', express.static(path.join(__dirname, 'lib')));
app.use('/css', express.static(path.join(__dirname, 'css')));



app.post('/', (req, res) => {
    let errorMessage = ""; // Inicializa a mensagem de erro como uma string vazia

    if (req.body.password == passwordAdriano && req.body.login.toLowerCase().trim() == loginAdriano) {
        req.session.login = loginAdriano;
        usuario = loginAdriano.charAt(0).toUpperCase() + loginAdriano.slice(1).toLowerCase();
        res.render('home', { login: usuario });

    } else if (req.body.password == passwordDurval && req.body.login.toLowerCase().trim() == loginDurval) {
        req.session.login = loginDurval;
        usuario = loginDurval.charAt(0).toUpperCase() + loginDurval.slice(1).toLowerCase();
        res.render('home', { login: usuario });
    }
    else if (req.body.password == passwordOscar && req.body.login.toLowerCase().trim() == loginOscar) {
        req.session.login = loginOscar;
        usuario = loginOscar.charAt(0).toUpperCase() + loginOscar.slice(1).toLowerCase();
        res.render('home', { login: usuario });
    } else if (req.body.password == passwordWendson && req.body.login.toLowerCase().trim() == loginWendson) {
        req.session.login = loginWendson;
        usuario = loginWendson.charAt(0).toUpperCase() + loginWendson.slice(1).toLowerCase();
        res.render('controle-registros', { login: usuario });
    }
    else {
        errorMessage = "Login ou senha incorretos. Por favor, tente novamente."; // Define a mensagem de erro
        res.render('index', { errorMessage: errorMessage }); // Passa a mensagem de erro para o modelo
    }

});
// Middleware para proteger rotas que requerem autenticação
function checkAuth(req, res, next) {
    if (req.session && req.session.login) {
        next();
    } else {
        res.redirect('/');
    }
}

// Rota protegida de exemplo
app.get('/home', checkAuth, (req, res) => {
    const usuario = req.session.login.charAt(0).toUpperCase() + req.session.login.slice(1).toLowerCase();
    res.render('home', { login: usuario });
});
app.get('/', (req, res) => {
    const errorMessage = req.query.error || ""; // Obtém a mensagem de erro da query string ou define como uma string vazia se não houver erro
    res.render('index', { errorMessage: errorMessage });
});

app.get('/', (req, res) => {
    res.render('index', { errorMessage: "" }); // Passa uma mensagem de erro vazia para o modelo
});
app.get('/', (req, res) => {
    if (req.session.login) {
        res.render('home', { login: usuario });

    } else {
        res.render('index');
    }

});

app.get('/registrados', (req, res) => {
    if (req.session.login) {
        res.render('registrados', { login: usuario });
    } else {
        res.render('index');
    }

});
app.get('/home', (req, res) => {
    res.render('home', { login: usuario });
});




app.post("/addRow", async (req, res) => {
    try {
        const { googleSheets, auth, spreadsheetId } = await getAuthSheets('1qANHDNI6jSHg5JX1hWzLKqW5I2Hohe792ZNOjhcDOQM');

        const values = req.body; // Receba os valores diretamente do corpo da solicitação

        if (!values) {
            res.status(400).send('Valores ausentes no corpo da solicitação');
            return;
        }
        console.log('Recebendo valores:', values);

        const row = await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Consolidado",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [values], // Certifique-se de que os dados estão no formato esperado
            },
        });

        console.log('Nova linha adicionada:', row.data);

        res.send(row.data);
    } catch (error) {
        console.error('Erro ao adicionar nova linha:', error.message);
        res.status(500).send('Erro interno do servidor');
    }
});
app.use(express.static('css', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
    }
}));
// Serve arquivos estáticos do diretório 'js'
app.use(express.static(path.join(__dirname, 'js'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        }
    }
}));
// Rota para buscar o contrato pelo número
app.get('/buscar-contrato', async (req, res) => {
    const numeroContrato = req.query.numero;

    try {
        // Conectar ao SQL Server
        const pool = await sql.connect(config);

        /**const startTime_01 = new Date(); // Captura o tempo inicial
        // Consultar o Cont rato pelo número
        const result_01 = await pool.request()
            .input('CONTRATO', sql.VarChar, numeroContrato)
            .query('SELECT * FROM VIEW_INADIMPLENCIA_DADOS WHERE CONTRATO = @CONTRATO');
        const endTime_01 = new Date(); // Captura o tempo final
        const timeTaken_01 = endTime_01 - startTime_01; // Calcula o tempo em milissegundos
        console.log(timeTaken_01);**/

        const startTime_02 = new Date(); // Captura o tempo inicial
        // Consultar o Contrato pelo número
        const result_02 = await pool.request()
            .input('CONTRATO', sql.VarChar, numeroContrato)
            .query('SELECT * FROM INADIMPLENCIA WHERE CONTRATO = @CONTRATO');
        const endTime_02 = new Date(); // Captura o tempo final
        const timeTaken_02 = endTime_02 - startTime_02; // Calcula o tempo em milissegundos
        console.log(timeTaken_02);

        const startTime_03 = new Date(); // Captura o tempo inicial
        // Consultar o Contrato pelo número
        const result_03 = await pool.request()
            .input('CONTRATO', sql.VarChar, numeroContrato)
            .query('SELECT * FROM CATEGORIZACAO_DA_CARTEIRA WHERE CONTRATO = @CONTRATO');
        const endTime_03 = new Date(); // Captura o tempo final
        const timeTaken_03 = endTime_03 - startTime_03; // Calcula o tempo em milissegundos
        console.log(timeTaken_03);

        // Verificar se o Contrato foi encontrado
        if (result_02.recordset.length === 0) {
            res.status(404).json({ erro: 'Contrato não encontrado' });
            return;
        }
        if (result_03.recordset.length === 0) {
            res.status(404).json({ erro: 'Contrato não encontrado' });
            return;
        }

        // Preparar a resposta com os contratos encontrados
        const response = {
            contrato_01: result_02.recordset.length > 0 ? result_02.recordset[0] : null,
            contrato_02: result_03.recordset.length > 0 ? result_03.recordset[0] : null
        };
        // Enviar o Contrato encontrado como resposta
        res.json(response);
    } catch (error) {
        console.error('Erro ao buscar Contrato:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    } finally {
        // Certifique-se de fechar a conexão com o SQL Server
        await sql.close();
    }
});

// Rota para buscar todos os contratos
app.get('/contratos', async (req, res) => {
    try {
        // Conectar ao SQL Server
        const pool = await sql.connect(config);

        // Consultar todos os contratos
        const result = await pool.request().query('SELECT * FROM VIEW_INADIMPLENCIA_DADOS');

        // Enviar todos os contratos como resposta
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar contratos:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    } finally {
        // Certifique-se de fechar a conexão com o SQL Server
        await sql.close();
    }
});
