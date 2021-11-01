/*
    Projeto: TCC - Smart Home
    Nome: Arquivo Node.JS referente ao Broker MQTT
    Autor: Lucas de Oliveira Pereira
    Descrição: código fonte da aplicação Broker referente ao servidor MQTT elaborado para o trabalho de 
    conclusão de curso para o curso de Engenharia Eletrônica para a Universidade Tecnológica Federal do Paraná
    Campus Campo Mourão.

*/

var mosca = require('mosca');
var express = require('express');
var app = express(); //NECESSARIO PARA O ROTEAMENTO DO SERVIDOR
const axios = require('axios'); //NECESSÁRIO PARA REALIZAR A COMUNICAÇÃO COM A API
const serverURL = 'http://localhost:3000';

//import Mosca Server MQTT
var log = false; //habilita ou desabilita o log de pactotes enviados no Mosca

var settings = {
    port: 21494,
    http: {
        port: 21500,
        bundle: true,
        static: './mqtt'
    }
};

var server = new mosca.Server(settings);

server.on('clientConnected', function (client) {

    //.log('client connected', client.id);
    //console.log(client);

});

// disparado quando uma mensagem é recebida
server.published = function (packet, client) {

    if (log) console.log('Published', packet.payload.toString("utf-8"))

    if (client) {

        let data = packet.payload.toString("utf-8");

        if (data != "liga" && data != "desliga") {

            if (data != null) {

                dado = JSON.parse(packet.payload.toString("utf-8"));

                try {


                    if (log) {

                        console.log("entrou no try")
                        console.log(dado)
                    }

                    //Caso eu queira gravar somente os dados diferentes de 0, basta deixar if(dado.corrente)
                    //Todavia, se eu desejo gravar inclusive os dados 0, basta colocar dado.corrente != null

                    if (dado.corrente != null) {


                        axios.put(serverURL + '/api/corrente', {
                            corrente: dado.corrente,
                            carga: dado.carga,
                            uid: dado.uidDispositivo,
                        })

                        return;

                    }

                    if (dado.sync != null) {


                        console.log("sincronizado com sucesso")

                        axios.post(serverURL + '/api/acionamento/sync?dispositivoUid=' + dado.uidDispositivo)

                        return;
                    }



                } catch (err) {

                    if (log) console.log('Nenhum pacote JSON recebido')
                }

            }



        } else {


            return;

        }


    }

};

//Configuração de autenticação
var authenticate = function (client, username, password, callback) {

    if (!username || !password) {

        callback(null, false);

        console.log("Usuário MQTT não fornecido.")

    } else {


        client.username = username;

        console.log("Cliente " + username + " logado com sucesso.")

        callback(null, true);

    }



}


var authorizePublish = function (client, topic, payload, callback) {
    //TODO: o correto é que fique "clienteId/*"
    //o segundo parâmetro da função abaixo é o Tópico a ser permitido para o usuário subscrever-se
    callback(null, "*");
}


var authorizeSubscribe = function (client, topic, callback) {
    console.log('Cliente ' + client.id + ' subscreveu-se no tópico: ' + topic)

    callback(null, "*");
}

function setup() {

    console.log('O servidor Mosca está instalado e funcionando');
    server.authenticate = authenticate;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;

}

server.on('ready', setup);
global.server = server;

