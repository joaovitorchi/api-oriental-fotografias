# 🚀 Backend da Aplicação

Bem-vindo ao backend da nossa aplicação! Este projeto foi desenvolvido utilizando **Node.js** e segue um padrão arquitetural baseado em uma variação de **MVC**.

![Node.js](https://img.shields.io/badge/Node.js-20.15.0-339933?style=for-the-badge&logo=node.js)
![Postgres](https://img.shields.io/badge/Postgres-16.0-336791?style=for-the-badge&logo=postgresql)


## 🛠️ Tecnologias utilizadas

- **[Node.js](https://nodejs.org/download/release/v20.15.0/):** v20.15.0
- **[Express](https://expressjs.com/pt-br/)**
- **[Compression](https://www.npmjs.com/package/compression)**
- **[Cors](https://www.npmjs.com/package/cors)**
- **[Dotenv](https://www.npmjs.com/package/dotenv)**
- **[Swagger](https://swagger.io/docs/)**
- **[Winston](https://github.com/winstonjs/winston/tree/2.x)**
- **[Postgres](https://www.postgresql.org/docs/)**


## 🚧 Estrutura do Projeto

Este projeto utiliza uma variação do padrão MVC:

- **Routes:** Responsável por definir cada rota.
- **Controller:** Responsável por definir as regras de negócio e configurações.
- **Repository:** Responsável pelas **transações com o banco de dados**.
- **Model:** Local onde definimos os **DTOs (Data Transfer Objects)**, padronizando a estrutura dos objetos da aplicação.

A estrutura das pastas é a seguinte:

```plaintext
📂 src
├── 📂 controllers
├── 📂 models
├── 📂 repositories
├── 📂 routes
```


## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto e configure-o de acordo com o arquivo `.env.example` fornecido. Este arquivo deve conter as configurações necessárias para conectar ao banco de dados e outras variáveis de ambiente.


## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/joaovitorchi/api-oriental-fotografias
```

Entre no diretório do projeto

```bash
  cd api-oriental-fotografias/backend
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm run dev
```


## 📚 Documentação

A documentação do swagger pode ser acessada através da rota `dev`


## 📬 Contato

Em caso de dúvidas ou sugestões, entre em contato através do email: joaochi77@hotmail.com
## Autores

- [@joaovitorchi](https://github.com/joaovitorchi)

