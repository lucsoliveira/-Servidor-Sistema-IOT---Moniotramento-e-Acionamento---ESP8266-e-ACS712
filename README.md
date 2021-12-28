<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />

   <h1 align="center">
       Aplicação Web do Sistema IoT</h1>
  <p align="center">
    Aplicação web do sistema IoT microcontrolado para controle e monitoramento em tempo real de consumo de corrente elétrica aplicado a equipamentos de baixa potência. Desenvolvido em Node.JS, Vue.JS, HTML, CSS e JavaScript.
  </p>
<!-- TABLE OF CONTENTS -->

<details open="open">
  <summary>Sumário</summary>
  <ol>
    <li>
      <a href="#about-the-project">Sobre</a>
      <ul>
        <li><a href="#built-with">Feito com</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Instruções</a>
      <ul>
        <li><a href="#prerequisites">Pré requisitos</a></li>
        <li><a href="#installation">Instalação</a></li>
        <li><a href="#understanding">Entendendo o código</a></li>
      </ul>
    </li>
    <li><a href="#usage">Uso</a></li>
    <li><a href="#license">Licença</a></li>
    <li><a href="#contact">Contato</a></li>
    <li><a href="#acknowledgements">Créditos</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
<a id="about-the-project"></a>

## Sobre

Este repositório faz parte do projeto desenvolvido para o trabalho de conclusão de curso de bacharel em Engenharia Eletrônica pela Universidade Tecnológica Federal do Paraná. Neste repositório está presente o código fonte da aplicação web desenvolvida para o projeto. Essa aplicação possui as seguintes características:

* Dashboard com linha do tempo dos acionamentos, histórico de consumo, estimativa de custos e botões de controle de carga;
* Banco de dados para persistência e análise posterior dos dados de acionamento e de consumo de corrente elétrica;
* Componentes desenvolvidos em Vue.js que atualizam em tempo real mostrando dados coletados po sensor do hardware projetado no trabalho;
* Aplicação web desenvolvida sob o padrão de projetos MVC;
* Comunicação com o protocolo MQTT;
* O sistema suporta vários usuários e estes podem possuir vários dispositivos para controle e monitoramento;
* Sistema API para obtenção dos dados que pode ser reutilizado em várias outras aplicações.

A tela inicial da Dashboard possui todos os componentes necessários para o controle e o monitoramento.

![Tela Inicial - Dashboard][dashboard-screenshot]

<!-- BUILT WITH -->
<a id="built-with"></a>

### Feito com

* [Node.Js](https://nodejs.org/en/)
* [Vue.Js](https://vuejs.org/)
* [Semantic UI](https://semantic-ui.com/)
* [Sequelize](https://sequelize.org/master/)

<!-- GETTING STARTED -->
<a id="getting-started"></a>

## Instalação

Comece a instalação verificando e instalando os softwares que são pré-requisitos deste projeto. Após isso, clone o repositório em sua máquina e, depois, efetue todas as configurações necessárias seguindo o tópico "Configurando o projeto".

<!-- PREREQUISITES -->
<a id="prerequisites"></a>

### Pré requisitos

O projeto necessita dos seguintes softwares:

* Node.js;
* NPM;
* Banco de dado MySQL.

<!-- INSTALLATION -->
<a id="installation"></a>

### Configurando o projeto

O primeiro passo é clonar este repositório em seu computador. Comece rodando o comando:

```sh
git clone https://github.com/lucsoliveira/-Servidor-Sistema-IOT---Monitoramento-e-Acionamento---ESP8266-e-ACS712
```

Após clonar este repositório em seu *workspace*, é necessário instalar as dependências do sistema. Basta rodar o seguinte comando:

```sh
npm install
```

Com todas as dependências instaladas, faça a alteração do banco de dados MySQL: basta editar o arquivo "appServidor.js" e preencher com seu host, banco, usuário e senha. 

Como se trata da primeira vez que se roda o sistema, é necessário criar as tabelas no banco de dados. Após o preenchimento anterior, altere a variável "configuracaoIniciao" da linha 30 do mesmo arquivo para o valor "true". Assim será criado as tabelas necessárias no banco. As próximas utilizações podem ser efetuadas com esta variável com valor "false".

### Entendendo o código

O sistema foi desenvolvido tendo como base o padrão MVC. Os models do sistema estão dentro da pasta "models". Ja as "views", os templates, estão dentro da pasta "public". E, por fim, o "controller" se trata do arquivo "appServidor.js", responsável pelo controle da aplicação web, e o do "appBroker.js", responsável pelo controle da ponte de comunicação do protocolo MQTT com o hardware.

As views foram desenvolvidas utilizando de HTML, Vue.JS, JavaScript, EJS e CSS. Os componentes Vue.JS criados para a aplicação podem ser acessados dentro da pasta "public/vue".

As rotas do sistema (aplicação web e API) foram todas programas no arquivo "appServidor.js".

<!-- USAGE -->
<a id="usage"></a>

## Executando o projeto

Após realizar o passo-a-passo do tópico anterior, é necessário executar dois comandos. Um para executar a aplicação "appServidor"; o outro, para executar a aplicação "appBroker", necessária para ponte de comunicação MQTT com o hardware.

Comece executando a aplicação web com o comando:

```sh
node appServidor.js
```

Após isso, abra uma nova aba no terminal e execute o comando para iniciar a aplicação Broker MQTT:

```sh
node appBroker.js
```

Com as duas aplicações rodando e com o hardware configurado, este passará a se comunicar com a aplicação web e enviará dados de corrente elétrica para o servidor e poderá ser controlado para acionar ou desligar a carga conectada ao protótipo.

<!-- LICENSE -->
<a id="license"></a>

## Licença

Distribuído sob a MIT License.

<!-- CONTACT -->
<a id="contact"></a>

## Contato

Lucas de Oliveira | [LinkedIn](https://www.linkedin.com/in/engenheiro-lucas-oliveira/) 

<!-- ACKNOWLEDGEMENTS -->
<a id="acknowledgements"></a>

## Créditos

* [Node.Js](https://nodejs.org/en/)
* [Vue.Js](https://vuejs.org/)
* [Semantic UI](https://semantic-ui.com/)
* [Sequelize](https://sequelize.org/master/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-url]: https://github.com/lucsoliveira/NotificaB3/graphs/contributors

[forks-url]: https://github.com/lucsoliveira/NotificaB3/network/members

[stars-url]: https://github.com/lucsoliveira/NotificaB3/stargazers

[issues-url]: https://github.com/lucsoliveira/NotificaB3/issues

[linkedin-url]: https://github.com/lucsoliveira/NotificaB3

[dashboard-screenshot]: ./ReadMe/dashboard.png
