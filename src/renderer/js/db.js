// db.js
// Este arquivo centraliza as chamadas ao banco de dados, permitindo assim
// utilizar diferentes implementações. Atualmente, suportamos as seguintes
// base de dados: ElectronStore (cache), Firebase (remota) e SQLite (local)

// Tabelas (coleções) do banco de dados
var DB_TABLES = ["alunos", "escolas", "escolatemalunos", "fornecedores",
    "faztransporte", "garagem", "garagemtemveiculo", "motoristas", "municipios",
    "ordemdeservico", "rotas", "rotaatendealuno", "rotadirigidapormotorista",
    "rotapassaporescolas", "rotapossuiveiculo", "veiculos"]

const DB_TABLE_ALUNO = "alunos";
const DB_TABLE_ESCOLA = "escolas";
const DB_TABLE_CENSO = "censo";
const DB_TABLE_CUSTO = "custo";
const DB_TABLE_FORNECEDOR = "fornecedores";
const DB_TABLE_GARAGEM = "garagens";
const DB_TABLE_MONITOR = "monitores";
const DB_TABLE_MOTORISTA = "motoristas";
const DB_TABLE_ORDEM_DE_SERVICO = "ordemdeservico";
const DB_TABLE_ROTA = "rotas";
const DB_TABLE_VEICULO = "veiculos";
const DB_TABLE_USUARIOS = "users/sete";

var DB_TABLE_ESCOLA_TEM_ALUNOS = "escolatemalunos";
var DB_TABLE_ROTA_ATENDE_ALUNO = "rotaatendealuno";
var DB_TABLE_ROTA_PASSA_POR_ESCOLA = "rotapassaporescolas";
var DB_TABLE_ROTA_DIRIGIDA_POR_MOTORISTA = "rotadirigidapormotorista";
var DB_TABLE_ROTA_POSSUI_VEICULO = "rotapossuiveiculo";

var DB_TABLE_PARAMETROS = "parametros";

var DB_TABLE_REALTIME_VIAGENSPERCURSO = "viagenspercurso";
var DB_TABLE_REALTIME_VIAGENSALERTA = "viagensalertas";

////////////////////////////////////////////////////////////////////////////////
// Local Database (cache)
////////////////////////////////////////////////////////////////////////////////
var Store = require("electron-store");
var userconfig = new Store();


////////////////////////////////////////////////////////////////////////////////
// INIT REST 
////////////////////////////////////////////////////////////////////////////////
// Carrega a implementação do banco no Firebase
var restImpl = require("./js/db_rest.js");


////////////////////////////////////////////////////////////////////////////////
// INIT FIREBASE 
////////////////////////////////////////////////////////////////////////////////
// Carrega a implementação do banco no Firebase
var firebaseImpl = require("./js/db_firebase.js");

// Usuário do Firebase (começa como vazio)
var firebaseUser = null;

// Instancia o banco Firebase
var remotedb = firebase.firestore();


////////////////////////////////////////////////////////////////////////////////
// INIT SQLITE /////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Carrega a implementação do banco no SQLite
var sqliteImpl = require("./js/db_sqlite.js");
var knex = sqliteImpl.knex;


// Variável que controla a implementação a ser utilizada, por padrão é o Firebase
var dbImpl = firebaseImpl;


////////////////////////////////////////////////////////////////////////////////
// FUNÇÕES DE CONSULTA
////////////////////////////////////////////////////////////////////////////////

function dbObterPerfilUsuario(uid) {
    return dbImpl.dbObterPerfilUsuario(uid);
}

function dbInserirPromise(colecao, dado, id = "", merge = false) {
    return dbImpl.dbInserirPromise(colecao, dado, id, merge);
}

function dbAtualizarPromise(colecao, dado, id) {
    return dbImpl.dbAtualizarPromise(colecao, dado, id);
}

function dbRemoverDadoPorIDPromise(colecao, coluna, id) {
    return dbImpl.dbRemoverDadoPorIDPromise(colecao, coluna, id);
}

function dbRemoverDadoSimplesPromise(colecao, coluna, id) {
    return dbImpl.dbRemoverDadoSimplesPromise(colecao, coluna, id);
}

function dbRemoverDadoCompostoPromise(colecao, c1, id1, c2, id2) {
    return dbImpl.dbRemoverDadoCompostoPromise(colecao, c1, id1, c2, id2);
}

function dbBuscarTodosDadosPromise(colecao) {
    return dbImpl.dbBuscarTodosDadosPromise(colecao);
}

function dbBuscarTodosDadosNoServidorPromise(colecao) {
    return dbImpl.dbBuscarTodosDadosNoServidorPromise(colecao);
}


function dbBuscarDadosEspecificosPromise(colecao, coluna, valor, operador = "==") {
    return dbImpl.dbBuscarDadosEspecificosPromise(colecao, coluna, valor, operador);
}

function dbLeftJoinPromise(colecao1, coluna1, colecao2, coluna2) {
    return dbImpl.dbLeftJoinPromise(colecao1, coluna1, colecao2, coluna2)
}


////////////////////////////////////////////////////////////////////////////////
// FUNÇÕES DE CONSULTA LOCAL
////////////////////////////////////////////////////////////////////////////////

function dbLocalBuscarDadoEspecificoPromise(tabela, coluna, id) {
    return sqliteImpl.BuscarDadoEspecificoPromise(tabela, coluna, id)
}

////////////////////////////////////////////////////////////////////////////////
// FUNÇÕES DE SINCRONIZAÇÃO
////////////////////////////////////////////////////////////////////////////////

async function dbEstaSincronizado() {
    let ultimaAtualizacao = userconfig.get("LAST_UPDATE");
    if (ultimaAtualizacao == undefined) {
        return false;
    } else {
        return dbImpl.dbEstaSincronizado(ultimaAtualizacao);
    }
}

function dbAtualizaVersao(lastUpdate = new Date().toJSON()) {
    dbImpl.dbFonteDoDado = "server";
    return dbImpl.dbInserirPromise("status", { LAST_UPDATE: lastUpdate }, "atualizacao")
        .then(() => {
            dbImpl.dbFonteDoDado = "cache";
            userconfig.set("LAST_UPDATE", lastUpdate);
            return Promise.resolve(lastUpdate)
        })
        .catch((err) => Promise.reject(err))
}

function dbSalvaVersao(versao) {
    dbImpl.dbFonteDoDado = "cache";
    userconfig.set("LAST_UPDATE", versao);
    return Promise.resolve(versao)
}

function dbRecebeVersao() {
    dbImpl.dbFonteDoDado = "server";
    return dbImpl.dbBuscarUltimaVersaoSincronizacao()
        .then((lastUpdate) => {
            if (!lastUpdate) { // Não tem nenhuma versão!!!!
                return dbAtualizaVersao()
                    .then(primeiraVersao => dbSalvaVersao(primeiraVersao))
            } else { // Salva ultima versao recebida
                return dbSalvaVersao(lastUpdate["LAST_UPDATE"]);
            }
        })
        .catch((err) => Promise.reject(err))
}

function dbSincronizar() {
    dbImpl.dbFonteDoDado = "server";

    var sincPromisses = new Array();
    DB_TABLES.forEach(db => sincPromisses.push(dbImpl.dbBuscarTodosDadosPromise(db)))

    return Promise.all(sincPromisses)
        .then(() => dbRecebeVersao())
        .catch((err) => Promise.reject(err))
}


// Clear database
function clearDBPromises() {
    var dbs = ["alunos", "escolas", "escolatemalunos", "fornecedores", "faztransporte",
        "garagem", "garagemtemveiculo", "motoristas", "municipios", "ordemdeservico",
        "rotas", "rotaatendealuno", "rotadirigidapormotorista", "rotapassaporescolas",
        "rotapossuiveiculo", "veiculos"]

    var clearPromises = new Array();
    for (let i = 0; i < dbs.length; i++) {
        clearPromises.push(knex(dbs[i]).del());
    }

    return clearPromises;
}

// Sync data with Firestore
function fbSync() {
    loadingFn("Sincronizando os dados com a nuvem...", "Espere um minutinho...");

    dbSincronizar()
        .then(() => successDialog("Sucesso!", "Dados sincronizados com sucesso. Clique em OK para voltar ao painel de gestão."))
        .then(() => navigateDashboard("./dashboard-main.html"))
        .catch(err => errorFn("Erro ao sincronizar, tente mais tarde", err))
}

////////////////////////////////////////////////////////////////////////////////
// DADOS LOCAIS
////////////////////////////////////////////////////////////////////////////////

// Esta função pega o codigo da cidade na base de dado remota
function getCodigoCidadeUsuario() {
    let uidFirebase = userconfig.get("ID");
    console.log(uidFirebase);
    var data = remotedb.collection("users").doc(uidFirebase);
    data.get().then(function (doc) {
        if (doc.exists) {
            let arData = doc.data();
            return arData.COD_CIDADE;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

var cidadeLatitude = userconfig.get("LATITUDE");
var cidadeLongitude = userconfig.get("LONGITUDE");
var codCidade = userconfig.get("COD_CIDADE");
var codEstado = userconfig.get("COD_ESTADO");
var minZoom = 15;

if (codCidade != null) {
    knex("IBGE_Municipios")
        .select()
        .where("codigo_ibge", userconfig.get("COD_CIDADE"))
        .then(res => {
            cidadeLatitude = res[0]["latitude"];
            cidadeLongitude = res[0]["longitude"];
        });
}


function Inserir(table, data, cb) {
    InserirPromise(table, data)
        .then(res => cb(false, res))
        .catch(err => cb(err));
}

function InserirIgnorarConflitoPromise(table, data) {
    return knex.raw(
        knex(table)
            .insert(data)
            .toString()
            .replace('insert', 'INSERT OR IGNORE')
    );
}

function AtualizarPromise(table, data, column, id) {
    return knex(table).where(column, '=', id).update(data);
}

function Atualizar(table, column, data, id, cb) {
    AtualizarPromise(table, column, data, id)
        .then(res => cb(false, res))
        .catch(err => cb(err)); w
}

function RemoverComposedPromise(table, c1, id1, c2, id2) {
    return knex(table).where(c1, id1).andWhere(c2, id2).del();
}

function RemoverPromise(table, column, id) {
    return knex(table).where(column, "=", id).del();
}

function Remover(table, column, id, cb) {
    RemoverPromise(table, column, id)
        .then(res => cb(false, res))
        .catch(err => cb(err));
}

function BuscarTodosDadosPromise(table) {
    return knex.select('*').from(table);
}

function BuscarTodosDados(table, cb) {
    BuscarTodosDadosPromise(table)
        .then(res => cb(false, res))
        .catch(err => cb(err));
}

function BuscarDadoDiferentePromise(table, column, id) {
    return knex.select('*').where(column, '<>', id).from(table);
}

function BuscarDadoDiferente(table, column, id, cb) {
    BuscarDadoDiferentePromise(table, column, id)
        .then(res => cb(false, res))
        .catch(err => cb(err));
}

function BuscarDadoEspecificoPromise(table, column, id) {
    return knex.select('*').where(column, '=', id).from(table);
}

function BuscarDadoEspecifico(table, column, id, cb) {
    BuscarDadoEspecificoPromise(table, column, id)
        .then(res => cb(false, res))
        .catch(err => cb(err));
}

////////////////////////////////////////////////////////////////////////////////
// Realtime
////////////////////////////////////////////////////////////////////////////////
class SeteRealTime {
    constructor(colecaoInteressada) {
        this.colecao = colecaoInteressada;
        this.dataFiltrar = new Date().toISOString().split("T")[0];
        this.observer = null;
    }

    subscribe(obs) {
        this.observer = obs;
    }

    unsubscribe() {
        this.observer = null;
    }

    notify(dado) {
        if (this.observer) {
            this.observer.handle(dado);
        }
    }
}

var realtimePercurso = new SeteRealTime(DB_TABLE_REALTIME_VIAGENSPERCURSO);
var realtimeAlerta = new SeteRealTime(DB_TABLE_REALTIME_VIAGENSALERTA);
var dataDeHoje = new Date().toISOString().split("T")[0];

if (firebaseImpl) {
    firebaseImpl.dbAcessarDados(DB_TABLE_REALTIME_VIAGENSPERCURSO).where("DATA", "==", dataDeHoje)
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log("Aqui")
                console.log(doc.data())
            });
        });
}

// Indica que o script terminou seu carregamento
window.loadedDBJS = true;
