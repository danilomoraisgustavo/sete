function GetAlunoFromForm() {
    return {
        "LOC_LATITUDE": $("#reglat").val(), // real
        "LOC_LONGITUDE": $("#reglon").val(), // real
        "LOC_ENDERECO": $("#regend").val(), // string
        "LOC_CEP": $("#regcep").val(), // string
        "MEC_TP_LOCALIZACAO": parseInt($("input[name='areaUrbana']:checked").val()), // int
        "DA_PORTEIRA": $("#temPorteira").is(":checked"), // bool
        "DA_MATABURRO": $("#temMataBurro").is(":checked"), // bool
        "DA_COLCHETE": $("#temColchete").is(":checked"), // bool
        "DA_ATOLEIRO": $("#temAtoleiro").is(":checked"), // bool
        "DA_PONTERUSTICA": $("#temPonte").is(":checked"), // bool

        "NOME": $("#regnome").val(), // string
        "CPF": $("#regcpf").val(), // number
        "DATA_NASCIMENTO": $("#regdata").val(), // string
        "NOME_RESPONSAVEL": $("#regnomeresp").val(), // string
        "TELEFONE_RESPONSAVEL": $("#regtelresp").val(), // string
        "GRAU_RESPONSAVEL": $("#listareggrauresp").val(),
        "SEXO": parseInt($("input[name='modoSexo']:checked").val()), // int
        "COR": parseInt($("input[name='corAluno']:checked").val()), // int
        "DEF_CAMINHAR": $("#temDeCaminhar").is(":checked"), // bool
        "DEF_OUVIR": $("#temDeOuvir").is(":checked"), // bool
        "DEF_ENXERGAR": $("#temDeEnxergar").is(":checked"), // bool
        "DEF_MENTAL": $("#temDefMental").is(":checked"), // bool

        "TURNO": parseInt($("input[name='turnoAluno']:checked").val()), // int
        "NIVEL": parseInt($("input[name='nivelAluno']:checked").val()), // int
    };
}

function PopulateAlunoFromState(estadoAlunoJSON) {
    if (estadoAlunoJSON["LOC_LATITUDE"]) $("#reglat").val(estadoAlunoJSON["LOC_LATITUDE"]);
    if (estadoAlunoJSON["LOC_LONGITUDE"]) $("#reglon").val(estadoAlunoJSON["LOC_LONGITUDE"]);
    if (estadoAlunoJSON["LOC_ENDERECO"]) $("#regend").val(estadoAlunoJSON["LOC_ENDERECO"]);
    if (estadoAlunoJSON["LOC_CEP"]) $("#regcep").val(estadoAlunoJSON["LOC_CEP"]);

    $("input[name='areaUrbana']").filter(`[value="${estadoAlunoJSON["MEC_TP_LOCALIZACAO"]}"]`).prop("checked", true);
    if (estadoAlunoJSON["DA_PORTEIRA"]) $("#temPorteira").prop("checked", estadoAlunoJSON["DA_PORTEIRA"]);
    if (estadoAlunoJSON["DA_MATABURRO"]) $("#temMataBurro").prop("checked", estadoAlunoJSON["DA_MATABURRO"]);
    if (estadoAlunoJSON["DA_COLCHETE"]) $("#temColchete").prop("checked", estadoAlunoJSON["DA_COLCHETE"]);
    if (estadoAlunoJSON["DA_ATOLEIRO"]) $("#temAtoleiro").prop("checked", estadoAlunoJSON["DA_ATOLEIRO"]);
    if (estadoAlunoJSON["DA_PONTERUSTICA"]) $("#temPonte").prop("checked", estadoAlunoJSON["DA_PONTERUSTICA"]);

    $("#regnome").val(estadoAlunoJSON["NOME"]);
    $("#regcpf").val(estadoAlunoJSON["CPF"]);
    $("#regdata").val(estadoAlunoJSON["DATA_NASCIMENTO"]);
    if (estadoAlunoJSON["NOME_RESPONSAVEL"]) $("#regnomeresp").val(estadoAlunoJSON["NOME_RESPONSAVEL"]);
    if (estadoAlunoJSON["TELEFONE_RESPONSAVEL"]) $("#regtelresp").val(estadoAlunoJSON["TELEFONE_RESPONSAVEL"]);
    if (estadoAlunoJSON["GRAU_RESPONSAVEL"]) $("#listareggrauresp").val(estadoAlunoJSON["GRAU_RESPONSAVEL"]);

    $("input[name='modoSexo']").val([estadoAlunoJSON["SEXO"]]);
    $("input[name='corAluno']").val([estadoAlunoJSON["COR"]]);
    if (estadoAlunoJSON["DEF_CAMINHAR"]) $("#temDeCaminhar").prop("checked", estadoAlunoJSON["DEF_CAMINHAR"]);
    if (estadoAlunoJSON["DEF_OUVIR"]) $("#temDeOuvir").prop("checked", estadoAlunoJSON["DEF_OUVIR"]);
    if (estadoAlunoJSON["DEF_ENXERGAR"]) $("#temDeEnxergar").prop("checked", estadoAlunoJSON["DEF_ENXERGAR"]);
    if (estadoAlunoJSON["DEF_MENTAL"]) $("#temDefMental").prop("checked", estadoAlunoJSON["DEF_MENTAL"]);

    $("input[name='turnoAluno']").val([estadoAlunoJSON["TURNO"]]);
    $("input[name='nivelAluno']").val([estadoAlunoJSON["NIVEL"]]);
    
    if (estadoAlunoJSON["ID_ESCOLA"]) {
        $("#listaescola").val(estadoAlunoJSON["ID_ESCOLA"]);
    }

    if (estadoAlunoJSON["ID_ROTA"]) {
        $("#listarota").val(estadoAlunoJSON["ID_ROTA"]);
    }    
}

// Transformar linha do DB para JSON
var parseAlunoDB = function (alunoRaw) {
    var alunoJSON = Object.assign({}, alunoRaw);
    alunoJSON["ESCOLA"] = "Sem escola cadastrada";
    alunoJSON["ROTA"] = "Sem rota cadastrada";
    alunoJSON["ID_ESCOLA"] = 0;

    if (alunoRaw["NOME_RESPONSAVEL"] == undefined ||
        alunoRaw["NOME_RESPONSAVEL"] == null) {
        alunoJSON["NOME_RESPONSAVEL"] = "Não informado";
    }

    if (alunoRaw["LOC_LONGITUDE"] != "" && alunoRaw["LOC_LONGITUDE"] != undefined &&
        alunoRaw["LOC_LATITUDE"] != "" && alunoRaw["LOC_LATITUDE"] != undefined) {
        alunoJSON["GEOREF"] = "Sim";
    } else {
        alunoJSON["GEOREF"] = "Não";
    }
    
    switch (alunoRaw["MEC_TP_LOCALIZACAO"]) {
        case 1:
            alunoJSON["LOCALIZACAO"] = "Urbana";
            break;
        case 2:
            alunoJSON["LOCALIZACAO"] = "Rural";
            break;
        default:
            alunoJSON["LOCALIZACAO"] = "Urbana";
    }

    switch (alunoRaw["SEXO"]) {
        case 1:
            alunoJSON["SEXOSTR"] = "Masculino";
            break;
        case 2:
            alunoJSON["SEXOSTR"] = "Feminino";
            break;
        default:
            alunoJSON["SEXOSTR"] = "Não Informado";
    }

    switch (alunoRaw["COR"]) {
        case 1:
            alunoJSON["CORSTR"] = "Branco";
            break;
        case 2:
            alunoJSON["CORSTR"] = "Preto";
            break;
        case 3:
            alunoJSON["CORSTR"] = "Pardo";
            break;
        case 4:
            alunoJSON["CORSTR"] = "Amarelo";
            break;
        case 5:
            alunoJSON["CORSTR"] = "Indígena";
            break;
        default:
            alunoJSON["CORSTR"] = "Não informado";
            break;
    }

    switch (alunoRaw["GRAU_RESPONSAVEL"]) {
        case 0:
            alunoJSON["GRAUSTR"] = "Pai, Mãe, Padrasto ou Madrasta";
            break;
        case 1:
            alunoJSON["GRAUSTR"] = "Avô ou Avó";
            break;
        case 2:
            alunoJSON["GRAUSTR"] = "Irmão ou Irmã";
            break;
        case 3:
            alunoJSON["GRAUSTR"] = "Outro Parente";
            break;
        case 4:
            alunoJSON["GRAUSTR"] = "Outro Parente";
            break;
        default:
            alunoJSON["GRAUSTR"] = "Não informado";
            break;
    }

    switch (alunoRaw["TURNO"]) {
        case 1:
            alunoJSON["TURNOSTR"] = "Manhã";
            break;
        case 2:
            alunoJSON["TURNOSTR"] = "Tarde";
            break;
        case 3:
            alunoJSON["TURNOSTR"] = "Integral";
            break;
        case 4:
            alunoJSON["TURNOSTR"] = "Noturno";
            break;
        default:
            alunoJSON["TURNOSTR"] = "Manhã";
    }

    switch (alunoRaw["NIVEL"]) {
        case 1:
            alunoJSON["NIVELSTR"] = "Infantil";
            break;
        case 2:
            alunoJSON["NIVELSTR"] = "Fundamental";
            break;
        case 3:
            alunoJSON["NIVELSTR"] = "Médio";
            break;
        case 4:
            alunoJSON["NIVELSTR"] = "Superior";
            break;
        case 5:
            alunoJSON["NIVELSTR"] = "Outro";
            break;
        default:
            alunoJSON["NIVELSTR"] = "Fundamental";
    }

    return alunoJSON;
};

function InserirAlunoPromise(alunoJSON) {
    return knex("Alunos").insert(alunoJSON);
}

function InserirAlunoEscolaPromise(alunoJSON) {
    return knex("Alunos").insert(alunoJSON);
}

function BuscarTodosAlunosPromise() {
    return knex("Alunos").select()
}

function BuscarTodosAlunos(callbackFn) {
    return BuscarTodosAlunosPromise()
        .then((res) => {
            callbackFn(false, res);
        })
        .catch((err) => {
            callbackFn(err);
        });
}

function NumeroDeAlunosAtendidosPromise() {
    return knex("EscolaTemAlunos").count("ID_ALUNO AS NUMALUNOS");
}

function ListarEscolasDeAlunosPromise() {
    return knex("Escolas")
        .join("EscolaTemAlunos", "Escolas.ID_ESCOLA", "=", "EscolaTemAlunos.ID_ESCOLA")
}

function ListarRotasDeAlunosPromise() {
    return knex("Rotas AS R")
        .join("RotaAtendeAluno AS RA", "R.ID_ROTA", "=", "RA.ID_ROTA")
}


function ListarEscolasDeAlunos(callbackFn) {
    return ListarEscolasDeAlunosPromise()
        .then((res) => {
            callbackFn(false, res);
        })
        .catch((err) => {
            callbackFn(err);
        });
}

function RemoverAluno(idAluno, callbackFn) {
    knex("Alunos")
        .where("ID_ALUNO", idAluno)
        .del()
        .then((res) => {
            callbackFn(false, res);
        })
        .catch((err) => {
            callbackFn(err);
        })
}

function AtualizarEscolaPromise(idAluno, alunoJSON) {
    return knex("Alunos")
        .where('ID_ALUNO', '=', idAluno)
        .update(alunoJSON)
}


function GetAlunoForm() {
    return {
        "ID_ALUNO": _aluno.ID_ALUNO, //int primary key
        "LATITUDE": $("#reglat").val(), //real
        "LONGITUDE": $("#reglon").val(), //real
        "ENDERECO": $("#regend").val(), //string
        "CEP": $("#regcep").val(), //int
        "DA_PORTEIRA": $("#temPorteira").is(":checked"), //bool
        "DA_MATABURRO": $("#temMataBurro").is(":checked"), //bool
        "DA_COLCHETE": $("#temColchete").is(":checked"), //bool
        "DA_ATOLEIRO": $("#temAtoleiro").is(":checked"), //bool
        "DA_PONTERUSTICA": $("#temPonte").is(":checked"), //bool
        "NOME": $("#regnome").val(), //string
        "DATA_NASCIMENTO": $("#regdata").val(), //string
        "SEXO": $("input[name=sexo]:checked").val(), //int
        "COR": $("input[name=cor]:checked").val(), //$("#regemail").val(), //int
        "NOME_RESPONSAVEL": $("#regnomeresp").val(), //string
        "GRAU_RESPONSAVEL": $("#reggrau").val(), //int
        "TELEFONE RESPONSÁVEL": $("#regfoneresponsavel").val(), //int
        "DEF_CAMINHAR": $("#temDeCaminhar").is(":checked"), //bool
        "DEF_OUVIR": $("#temDeOuvir").is(":checked"), //bool
        "DEF_ENXERGAR": $("#temDeEnxergar").is(":checked"), //bool
        "DEF_MENTAL": $("#temDeMentalIntelec").is(":checked"), //bool
        "ID_ESCOLA": $("#regescola").val(), //int
        "TURNO": $("input[name=turno]:checked").val(), //int
        "NIVEL": $("input[name=nivel]:checked").val() //int
    };
}


function ObterAlunos() {
    return knex.select('*').from('Aluno');
}

function ObterAluno(id) {
    return knex.select('*').from('Aluno').where('ID_ALUNO', '=', id);
}

function InserirAluno(aluno) {
    if (aluno.ID_ALUNO > 0)
        AtualizarAluno(aluno);
    else {
        aluno.ID_ALUNO = undefined;
        const alunos = [aluno];
        knex('Aluno').insert(alunos).then(() => { SuccessAluno(); })
            .catch((err) => { console.log(err); throw err })
            .finally(() => { });
    }
}

function AtualizarAluno(aluno) {
    knex('Aluno')
        .where('ID_ALUNO', '=', aluno.ID_ALUNO)
        .update(aluno).then(() => { SuccessAluno(); })
        .catch((err) => { console.log(err); throw err })
        .finally(() => { });
}

function DeleteAluno(row, id) {
    knex('Aluno')
        .where('ID_ALUNO', '=', id)
        .del().then(() => { DeleteRow(row); })
        .catch((err) => { console.log(err); throw err })
        .finally(() => { });
}