# Cuidar_backend

---

## Iniciando a aplicação
> Clone do projeto
```shell
$ git clone https://github.com/thaynnara007/Cuidar_backend.git
```
> Entre no diretório do projeto
```shell
$ cd Cuidar_backend
```
> Em ambiente de desenvolvimento, criei o diretório de logs
```shell
$ mkdir logs
```
> Em ambiente de desenvolvimento, criei o diretório do node_modules
```shell
$ mkdir node_modules
```
> Em ambiente de desenvolvimento, instale as dependências de desenvolvimento
```shell
$ npm install --only=dev
```
> Copie e renomei o arquivo .env-example
```shell
$ cp .env-example .env
```
> Coloque os valores corretos nas variáveis de ambientes definidas no arquivo .env

> Criando as imagens
```shell
$ docker-compose build
```
> Subindo os containers
```shell
$ docker-compose up
```
> Execute as migrations, se houver
```shell
$ docker-compose run cuidar_api npm run migrate
```
> Execute as seeds, se houver
```shell
$ docker-compose run cuidar_api npm run seed
```
> Pronto, agora você poderá acessar:
```
    * A aplicação na porta 3030
    * O banco de dados na porta 5432
    * PgAdmin na porta 5051
```
---
### Algums comandos úteis

#### Docker

> Listar containers em execução
```shell
$ docker ps
```
> Listar todos os containers
```shell
$ docker ps -a
```
> Para descer os containers em execução
```shell
$ docker-compose down
```
> Para parar algum container
```shell
$ docker stop <nome_container>
```
> Para remover algum container
```shell
$ docker rm <nome_conatiner>
```
> Listar todas as imagens
```shell
$ docker images -a
```
> Listar todos os volumes
```shell
$ docker volume ls
```
> Para executar um serviço expecífico
```shell
$ docker-compose up <nome_do_serviço>
```
> Para executar algum comando dentro do contexto de um serviço
```shell
$ docker-compose run <nome_do_serviço> <comando>
```
> Apagar os  volumes sem uso do docker
```shell
$ docker volume prune -f 
```
> Apagar as imagens sem uso do docker
```shell
$ docker system prune -a
```
> Forçar a recriação de algum serviço
```shell
$ docker-compose up --build -V --force-recreate <nome_do_serviço> 
```

#### Sequelize

> Roda as migrations
```shell
$ npm run migrate
```
> Desfaz a última migration
```shell
$ npm run migrate:undo
```
> Roda as seeds
```shell
$ npm run seed
```
