PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE Usuarios (
    ID         VARCHAR UNIQUE NOT NULL,
    NOME       VARCHAR NOT NULL,
    CPF        VARCHAR,
    TELEFONE   VARCHAR,
    EMAIL      VARCHAR NOT NULL,
    PASSWORD   VARCHAR NOT NULL,
    CIDADE     VARCHAR NOT NULL,
    COD_CIDADE INTEGER NOT NULL,
    ESTADO     VARCHAR NOT NULL,
    COD_ESTADO INTEGER NOT NULL,
    INIT       BOOLEAN DEFAULT (0),
    PRIMARY KEY (ID)
);
INSERT INTO Usuarios VALUES('suh0mUGvRENA8HP1iYh1ZSB42QD2','Nilson Cardoso Amaral Junior','539.286.951-34','(62) 98165-0662','ncamaraljr@ufg.br','123456','Aparecida de Goiânia',5201405,'Goiás',52,1);
INSERT INTO Usuarios VALUES('CtTVBorFRda66S0F0AbxiTmIpQf2','lucas','036.859.361-40','(23) 23232-3233','golsplacas@gmail.com','123456','Anápolis',5201108,'Goiás',52,1);
INSERT INTO Usuarios VALUES('1','asdf','eqweqweqw','628633','dayse','123','asdf','asdf','asdf','asdf','asdf');
INSERT INTO Usuarios VALUES('avrcVKAhOVdHgpByxtOakSKhLed2','Marcos','014.138.081-07','(62) 98296-5480','ufg@ufg.br','123456','Alvorada do Norte',5200803,'Goiás',52,1);
CREATE TABLE FazTransporte (
    ID_USUARIO         VARCHAR NOT NULL,
    COD_CIDADE_ORIGEM  INTEGER NOT NULL,
    COD_CIDADE_DESTINO INTEGER NOT NULL,
    CIDADE_ORIGEM      VARCHAR,
    CIDADE_DESTINO     VARCHAR,
    COD_ESTADO_ORIGEM  INTEGER,
    ESTADO_ORIGEM      VARCHAR,
    COD_ESTADO_DESTINO INTEGER,
    ESTADO_DESTINO     VARCHAR,

    PRIMARY KEY ( ID_USUARIO, COD_CIDADE_ORIGEM, COD_CIDADE_DESTINO )
);
INSERT INTO FazTransporte VALUES('suh0mUGvRENA8HP1iYh1ZSB42QD2',5201405,5201405,'Aparecida de Goiânia','Aparecida de Goiânia',52,'Goiás',52,'Goiás');
INSERT INTO FazTransporte VALUES('CtTVBorFRda66S0F0AbxiTmIpQf2',5201108,5201108,'Anápolis','Anápolis',52,'Goiás',52,'Goiás');
INSERT INTO FazTransporte VALUES('avrcVKAhOVdHgpByxtOakSKhLed2',5200803,5200803,'Alvorada do Norte','Alvorada do Norte',52,'Goiás',52,'Goiás');
INSERT INTO FazTransporte VALUES('avrcVKAhOVdHgpByxtOakSKhLed2',5200803,5201108,'Alvorada do Norte','Anápolis',52,'Goiás',52,'Goiás');
INSERT INTO FazTransporte VALUES('avrcVKAhOVdHgpByxtOakSKhLed2',5200803,5200852,'Alvorada do Norte','Americano do Brasil',52,'Goiás',52,'Goiás');
CREATE TABLE Municipios (
    ID_USUARIO         VARCHAR NOT NULL,
    COD_CIDADE         INTEGER NOT NULL,
    TEM_RODOVIARIO     BOOLEAN DEFAULT (0),
    TEM_AQUAVIARIO     BOOLEAN DEFAULT (0),
    TEM_BICICLETA      BOOLEAN DEFAULT (0),
    TEM_MONITOR        BOOLEAN DEFAULT (0),
    TEM_OUTRAS_CIDADES BOOLEAN DEFAULT (0),
    DIST_MINIMA        REAL,
    PRIMARY KEY ( ID_USUARIO, COD_CIDADE ),
    FOREIGN KEY ( ID_USUARIO ) REFERENCES Usuarios ( ID )
);
INSERT INTO Municipios VALUES('suh0mUGvRENA8HP1iYh1ZSB42QD2',5201405,1,0,1,1,1,0.0);
INSERT INTO Municipios VALUES('CtTVBorFRda66S0F0AbxiTmIpQf2',5201108,1,0,1,0,0,0.0);
INSERT INTO Municipios VALUES('avrcVKAhOVdHgpByxtOakSKhLed2',5200803,1,0,1,0,1,2.0);
CREATE TABLE IF NOT EXISTS "GaragemTemVeiculo" (
    "ID_VEICULO" INTEGER NOT NULL,
    "ID_GARAGEM" INTEGER NOT NULL,
    FOREIGN KEY("ID_VEICULO") REFERENCES "Veiculo"("ID_VEICULO"),
    FOREIGN KEY("ID_GARAGEM") REFERENCES "Garagem"("ID_GARAGEM"),
	PRIMARY KEY ("ID_VEICULO", "ID_GARAGEM")
);
CREATE TABLE IF NOT EXISTS "EscolaTemAlunos" (
	"ID_ESCOLA"	INTEGER NOT NULL,
	"ID_ALUNO"	INTEGER NOT NULL,
	FOREIGN KEY("ID_VEICULO") REFERENCES "Veiculo"("ID_VEICULO"),
    FOREIGN KEY("ID_GARAGEM") REFERENCES "Garagem"("ID_GARAGEM"),
	PRIMARY KEY ("ID_VEICULO", "ID_GARAGEM")
);
CREATE TABLE IF NOT EXISTS "Veiculo" (
	`ID_VEICULO`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`PLACA`	INTEGER NOT NULL,
	`MODELO`	TEXT NOT NULL,
	`ANO`	INTEGER NOT NULL,
	`TIPO_TRANSPORTE`	BOOLEAN DEFAULT (0),
	`ORIGEM`	INTEGER NOT NULL,
	`AQUISICAO`	INTEGER,
	`POSSUI_GARAGEM`	BOOLEAN DEFAULT (0),
	`KM_VEICULO`	INTEGER,
	`CAPACIDADE_MAX`	INTEGER,
	`CAPACIDADE_ATUAL`	INTEGER
);
INSERT INTO Veiculo VALUES(10,'231-2312','fuscao',2000,'ORE 1','Próprio','Doado','sim',2131231,2131231,4);
CREATE TABLE IF NOT EXISTS "Servidor" (
	`ID_SERVIDOR`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`LATITUDE`	REAL,
	`LONGITUDE`	REAL,
	`ENDERECO`	TEXT,
	`CEP`	INTEGER,
	`NOME`	TEXT,
	`DATA_NASCIMENTO`	INTEGER,
	`TURNO`	TEXT,
	`SEXO`	TEXT,
	`TELEFONE`	INTEGER
);
INSERT INTO Servidor VALUES(2,312312.0,3123123122.9999999998,'dfasadsfs','32342-342','dfasdfasdf','11/11/1999','Matutino','Masculino','(24) 23234-3433');
CREATE TABLE IF NOT EXISTS "Motorista" (
	"ID_MOTORISTA"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"LATITUDE"	REAL NULL,
	"LONGITUDE"	REAL NULL,
	"NOME"	TEXT NOT NULL,
	"DATA_NASCIMENTO"	TEXT NOT NULL,
	"SEXO"	TEXT NOT NULL,
	"NACIONALIDADE"	TEXT,
	"DOC_IDENTIFICACAO"	INTEGER NOT NULL,
	"ORGAO_EMISSOR"	TEXT,
	"CPF"	TEXT,
	"COR"	TEXT NOT NULL,
	"DEF_CAMINHAR"	BOOLEAN DEFAULT (0),
	"DEF_OUVIR"	BOOLEAN DEFAULT (0),
	"DEF_ENXERGAR"	BOOLEAN DEFAULT (0),
	"DEF_MENTAL"	BOOLEAN DEFAULT (0)
);
INSERT INTO Motorista VALUES(2,NULL,NULL,'Lucas Rodrigues','2019-07-15','Feminimo','FASDFASDF','23.423.423','23423423','234.234.234-23','Amarelo',0,1,0,0);
CREATE TABLE IF NOT EXISTS "PrevisaoManutencao" (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`descricao`	TEXT NOT NULL,
	`data_cadastro`	TEXT NOT NULL,
	`data_prevista`	INTEGER NOT NULL,
	`status`	INTEGER,
	`veiculo_id`	INTEGER
);
INSERT INTO PrevisaoManutencao VALUES(0,' ','6/7/2019','2019-07-03',0,NULL);
INSERT INTO PrevisaoManutencao VALUES(20,'Troca de Oléo','0/7/2019','2019-07-18',0,10);
INSERT INTO PrevisaoManutencao VALUES(22,'troca pneu','0/7/2019','2019-08-30',0,10);
INSERT INTO PrevisaoManutencao VALUES(23,'teste','29/7/2019','2019-07-16',0,10);
CREATE TABLE `RelacaoRotaAluno` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`aluno_id`	INTEGER,
	`rota_id`	INTEGER
);
INSERT INTO RelacaoRotaAluno VALUES(26,3,2);
CREATE TABLE IF NOT EXISTS "RotaMotorista" (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`nome_rota`	TEXT,
	`motorista_id`	INTEGER,
	`veiculo_id`	INTEGER,
	`escola_id`	INTEGER,
	`km`	TEXT
);
INSERT INTO RotaMotorista VALUES(9,'Rota do João',2,NULL,2,'55');
INSERT INTO RotaMotorista VALUES(10,'rota da debora',2,NULL,2,'123');
CREATE TABLE IF NOT EXISTS "Aluno" (
	`ID_ALUNO`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`LATITUDE`	REAL NOT NULL,
	`LONGITUDE`	REAL NOT NULL,
	`ENDERECO`	TEXT,
	`CEP`	INTEGER,
	`DA_PORTEIRA`	BOOLEAN DEFAULT (0),
	`DA_MATABURRO`	BOOLEAN DEFAULT (0),
	`DA_COLCHETE`	BOOLEAN DEFAULT (0),
	`DA_ATOLEIRO`	BOOLEAN DEFAULT (0),
	`DA_PONTERUSTICA`	BOOLEAN DEFAULT (0),
	`NOME`	TEXT NOT NULL,
	`DATA_NASCIMENTO`	TEXT NOT NULL,
	`SEXO`	INTEGER NOT NULL,
	`COR`	INTEGER NOT NULL,
	`NOME_RESPONSAVEL`	TEXT NOT NULL,
	`GRAU_RESPONSAVEL`	INTEGER NOT NULL,
	`TELEFONE RESPONSÁVEL`	INTEGER,
	`DEF_CAMINHAR`	BOOLEAN DEFAULT (0),
	`DEF_OUVIR`	BOOLEAN DEFAULT (0),
	`DEF_ENXERGAR`	BOOLEAN DEFAULT (0),
	`DEF_MENTAL`	BOOLEAN DEFAULT (0),
	`ID_ESCOLA`	INTEGER NOT NULL,
	`TURNO`	INTEGER NOT NULL,
	`NIVEL`	INTEGER NOT NULL
);
INSERT INTO Aluno VALUES(3,123122.99999999999999,123122.99999999999999,'rua t-37 qd','12312-123',1,1,0,0,0,'lucas rodrigues','14/10/1995','Masculino','Indígina','Lucas ','testes',NULL,0,0,0,1,2,'Tarde','Médio');
INSERT INTO Aluno VALUES(4,2341233.9999999999999,2134123.0,'perto de casa','74230-901',1,0,1,0,0,'Dayse Cristina','10/10/1999','Feminimo','Branco','Maria dos Anjos','Mãe',NULL,1,0,0,0,2,'Manhã','Superior');
CREATE TABLE `Rota` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`nome`	TEXT NOT NULL,
	`quilometragem`	TEXT,
	`funcionamento`	INTEGER,
	`hora_inicio`	TEXT,
	`hora_retorno`	TEXT,
	`motorista_id`	INTEGER,
	`data_criacao`	TEXT,
	`garagem_id_partida`	INTEGER,
	`garagem_id_terminio`	INTEGER,
	`dificuldade_acesso`	INTEGER
);
INSERT INTO Rota VALUES(2,'Rota Preferida','100','1:2','07:00','11:00',2,'27/8/2019',14,16,3);
INSERT INTO Rota VALUES(4,'Rota Portela','cert',1,'22:22','22:22',2,'27/8/2019',16,16,'1:3');
CREATE TABLE IF NOT EXISTS "Garagem" (
	`ID_GARAGEM`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`LATITUDE`	REAL NOT NULL,
	`LONGITUDE`	REAL NOT NULL,
	`ENDERECO`	TEXT,
	`CEP`	INTEGER,
	`NOME`	TEXT
);
INSERT INTO Garagem VALUES(14,1233123.0,12312.0,'TESTE',74230901,'LUCAS');
INSERT INTO Garagem VALUES(16,1233.9999999999999999,1233.9999999999999999,'Endereço',123456,'Lucas');
CREATE TABLE `RelacaoRotaMotoristaAluno` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`aluno_id`	INTEGER,
	`rota_id`	INTEGER
);
CREATE TABLE `RelacaoRotaEscola` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`escola_id`	INTEGER,
	`rota_id`	INTEGER
);
INSERT INTO RelacaoRotaEscola VALUES(3,NULL,4);
INSERT INTO RelacaoRotaEscola VALUES(4,7,4);

CREATE TABLE IF NOT EXISTS "Escolas" (
	`ID_ESCOLA`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`nome`	TEXT,
	`MEC_CO_ENTIDADE`	INTEGER,
	`MEC_CO_UF`	INTEGER NOT NULL,
	`MEC_CO_MUNICIPIO`	INTEGER NOT NULL,
	`MEC_NO_ENTIDADE`	VARCHAR NOT NULL,
	`MEC_NU_ANO_CENSO`	INTEGER,
	`MEC_TP_SITUACAO_FUNCIONAMENTO`	INTEGER DEFAULT (1),
	`MEC_TP_DEPENDENCIA`	INTEGER NOT NULL,
	`MEC_TP_LOCALIZACAO`	INTEGER NOT NULL,
	`MEC_TP_LOCALIZACAO_DIFERENCIADA`	INTEGER DEFAULT (0),
	`MEC_TP_CATEGORIA_ESCOLA_PRIVADA`	INTEGER,
	`MEC_DT_ANO_LETIVO_INICIO`	DATE,
	`MEC_DT_ANO_LETIVO_TERMINO`	DATE,
	`MEC_IN_REGULAR`	BOOLEAN DEFAULT (0),
	`MEC_IN_EJA`	BOOLEAN DEFAULT (0),
	`MEC_IN_PROFISSIONALIZANTE`	BOOLEAN DEFAULT (0),
	`MEC_IN_ESPECIAL_EXCLUSIVA`	BOOLEAN DEFAULT (0),
	`MEC_IN_COMUM_CRECHE`	BOOLEAN DEFAULT (0),
	`MEC_IN_COMUM_PRE`	BOOLEAN DEFAULT (0),
	`MEC_IN_COMUM_FUND_AI`	BOOLEAN DEFAULT (0),
	`MEC_IN_COMUM_FUND_AF`	BOOLEAN DEFAULT (0),
	`MEC_IN_COMUM_MEDIO_MEDIO`	BOOLEAN DEFAULT (0),
	`MEC_IN_COMUM_MEDIO_INTEGRADO`	BOOLEAN DEFAULT (0),
	`MEC_IN_COMUM_MEDIO_NORMAL`	BOOLEAN DEFAULT (0),
	`LOC_LATITUDE`	REAL,
	`LOC_LONGITUDE`	REAL,
	`LOC_CEP`	VARCHAR,
	`LOC_ENDERECO`	VARCHAR,
	`CONTATO_RESPONSAVEL`	VARCHAR,
	`CONTATO_TELEFONE`	VARCHAR,
	`HORARIO_MATUTINO`	BOOLEAN DEFAULT (0),
	`HORARIO_VERSPERTINO`	BOOLEAN DEFAULT (0),
	`HORARIO_NOTURNO`	BOOLEAN DEFAULT (0),
	`IN_SUPERIOR`	BOOLEAN DEFAULT (0),
	`TEM_TRANSPORTE`	BOOLEAN DEFAULT (0),
	`ATIVA`	BOOLEAN DEFAULT (0)
);
INSERT INTO Escolas VALUES(1,'Escola Joaquim Tomê','',0,0,'',NULL,1,0,0,0,NULL,NULL,NULL,0,0,0,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0);
INSERT INTO Escolas VALUES(2,'Colêgio Portela',NULL,0,0,'',NULL,1,0,0,0,NULL,NULL,NULL,0,0,0,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0);
INSERT INTO Escolas VALUES(7,'Universidade UF',NULL,0,0,'',NULL,1,0,0,0,NULL,NULL,NULL,0,0,0,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('Veiculo',10);
INSERT INTO sqlite_sequence VALUES('Servidor',2);
INSERT INTO sqlite_sequence VALUES('Motorista',2);
INSERT INTO sqlite_sequence VALUES('PrevisaoManutencao',23);
INSERT INTO sqlite_sequence VALUES('RotaMotorista',10);
INSERT INTO sqlite_sequence VALUES('Aluno',4);
INSERT INTO sqlite_sequence VALUES('RelacaoRotaAluno',26);
INSERT INTO sqlite_sequence VALUES('Garagem',16);
INSERT INTO sqlite_sequence VALUES('Rota',4);
INSERT INTO sqlite_sequence VALUES('Escolas',7);
INSERT INTO sqlite_sequence VALUES('RelacaoRotaEscola',5);
COMMIT;