## Se é sua primeira vez, fazer esses 2 passos antes de continuar:

> login no heroku
```sh
$ heroku login
```

> login no sistema de registro de containers do heroku
```sh
$ heroku container:login
```

## Fazendo o deploy

> subindo o container (estar no mesmo diretorio que o Dockerfile da aplicação)
```sh
$ heroku container:push web
```

> criando database
```sh
$ heroku addons:create heroku-postgresql:hobby-dev
```

> adicione as variaveis de ambiente
```sh
$ heroku config:set <variavel>=<valor>
```

> fazendo o release da aplicação
```sh
$ heroku container:release web <image_name>
```

> Abrindo a aplicação no browser
```sh
$ heroku open
```


## migrations

> entrar no bash do container
```sh
$ heroku run sh --app <aplicação_nome>
```

> rode as migrations e seeds (NODE_ENV deve estar como production)
```sh
$ npm run migrate && npm run seed
```


## Logs

```sh
$ heroku logs --tail
```