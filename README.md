<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src="https://raw.githubusercontent.com/Rocketseat/bootcamp-gostack-desafio-02/master/.github/logo.png" width="300px" />
</h1>

<span align="center">
  Trata-se de uma aplicação back-end densevolvida com NodeJS para uma transportadora fictícia, o FastFeet.
</span>

# Instruções para executar a aplicação.

Faça o download do repositório e siga as instruções:

## Ambiente 

Este procedimento foi testado usando o Windows 10.

Para criação das bases de dados foi utilizado o docker. Com o docker configurado na sua máquina, abra o terminal e rode os seguintes comandos

Nesse caso criei com a senha docker, mas você pode alterar a senha, e configurá-la depois no arquivo .env na raiz do backend;

```
  docker run --name fastfeetDataBase -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```
Utilize o postbird para se conectar ao postgress e crie uma base de dados com o nome fastfeet (Você pode utilizar outro nome, mas lembre de alterar no arquivo .env);

Agora vamos criar a base redis para tarefas de envio de emails.

```
  docker run --name redisFastFeet -p 6379:6379 -d -t redis:alpine 
```

## Backend

duplique o arquivo .env.example que se encontra na raiz da pasta backend salve com o nome .env e preencha as variáveis de acordo com a configuração utilizada na preparaçÃo do ambiente.

utilizando o terminal acesse a pasta backend e rode o seguinte comando para instalar as dependências do projeto.

```
  yarn
```
Para criação das tabelas utilize o comando:

```
yarn sequelize db:migrate
```

Para criar um usuário administrador padrão utilize o comando abaixo. Esse comando vai criar um usuário com o email `admin@fastfeet.com` e senha `123456`. Caso queria um usuário e senha diferentes configure na pasta /src/database/seeds.

```
yarn sequelize db:seed:all
```

É hora de subir o servidor rode o seguinte comando na raiz da pasta backend:
```
yarn dev
```

Agora vamos subir o servidor responsável pelo gerenciamento de filas de envio de emails. Abra uma nova janela do terminal e na raiz da pasta backend rode:

```
yarn queue
```

Pronto o backend já está pronto para o uso.

### tecnologias aprendidas e aplicadas

- Node
- Express
- Sequelize
- Docker
- Redis
- Bequeue
- Nodemailer
- handlebars
- eslint
- prettier
- nodemon

## WEB

https://github.com/JRCouto4D/frontend_fastfeet

## Mobile

https://github.com/JRCouto4D/mobile_fastfeet
