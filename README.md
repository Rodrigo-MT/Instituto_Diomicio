# Instituto Diomício Freitas - Website Oficial

## 🔎 Visão Geral

Este projeto foi desenvolvido como um trabalho acadêmico na ESUCRI para a Instituição Diomício Freitas, que buscava um novo website com presença digital profissional e funcional. A aplicação é dividida em dois principais módulos:

- 💻 **Frontend:** Aplicação React, responsável pela interface visual e interação com o usuário.  
- 🖥️ **Backend:** API desenvolvida em NestJS, responsável pela lógica de negócios, integração com banco de dados e segurança.

---

## 🛠️ Tecnologias Utilizadas

- ⚛️ **Frontend:** React 19, React Router, Styled Components, Axios, entre outros.  
- 🏗️ **Backend:** NestJS (Node.js + TypeScript), arquitetura modular com Controllers, Services, DTOs e Entities.  
- 🗄️ **Banco de Dados:** PostgreSQL (banco relacional).  
- 🔐 **Autenticação & Segurança:** Criptografia para senhas (bcrypt) e dados sensíveis, uso de variáveis de ambiente para gerenciamento de segredos.  
- ☁️ **Hospedagem:** Configuração via `.env` para portas e conexões.

---

## 📁 Estrutura do Projeto

```
/root
  /backend
    ├── src/
    ├── .env
    └── package.json
  /frontend
    ├── src/
    ├── .env
    ├── public/
    └── package.json
README.md (arquivo principal do projeto)
```

---

## ⚙️ Funcionalidades Principais

### Backend

- 🧩 Arquitetura modular: Controllers, Services, DTOs e Entities.  
- 🔄 API REST para gerenciamento de parceiros, eventos, notícias e outras entidades, com rotas seguras.  
- 🔒 Proteção das rotas de criação, edição e exclusão com autenticação JWT e AuthGuard.  
- 🗃️ Integração com PostgreSQL para persistência de dados.  
- 🔐 Criptografia de dados sensíveis com bcrypt.  
- 🛠️ Configuração via variáveis de ambiente (.env).  
- 📋 Integração do Swagger para documentação e testes interativos da API.  
- 🧪 Preparado para testes unitários e de integração.

### Frontend

- 📱 Interface responsiva e moderna em React.  
- 🌐 Consumo da API backend via Axios.  
- 🛣️ Rotas gerenciadas com React Router.  
- 🎨 Estilização com Styled Components.  
- 🔔 Notificações toast para feedback.  
- ⚙️ Configuração via `.env` para porta.

---

## 🌱 Configuração de Variáveis de Ambiente (`.env`)

### 📦 Frontend (`/frontend/.env`)

Crie um arquivo `.env` na raiz da pasta `frontend` com o seguinte conteúdo:

```dotenv
# URL base da API
REACT_APP_API_BASE_URL=http://localhost:3000

# Porta onde o frontend será servido
PORT=3001

# Tempo limite para requisições (em milissegundos)
REACT_APP_API_TIMEOUT=10000
```

---

### 🧠 Backend (`/backend/.env`)

Crie um arquivo `.env` na raiz da pasta `backend` e defina as variáveis conforme a sua configuração local ou de produção.

⚠️ **Importante:** Tokens, senhas e chaves de segurança **devem ser configurados por você**, de acordo com seu ambiente.  
Nunca deixe informações sensíveis no código.

```dotenv
# Uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
UPLOAD_PATH=./uploads
BASE_URL=http://localhost:3000

# Email SMTP
MAIL_USER=seuemail@gmail.com
MAIL_PASS=suasenhaaplicativo
SMTP_SECRET_KEY=

# Servidor
PORT=3000

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=instituto_diomicio

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=  # ← veja abaixo como gerar

# JWT
JWT_SECRET=

# Criptografia de e-mails
ENCRYPTION_KEY=     # 32 caracteres
ENCRYPTION_IV=      # 16 caracteres
```

### 🔐 Como gerar o hash da senha do admin

Para definir a senha do usuário admin com segurança, você precisa gerar o hash da senha (ex: `admin`) usando o `bcrypt`.

Se você tem o Node.js instalado, execute o seguinte comando no terminal:

```bash
node -e "require('bcrypt').hash('admin', 10).then(console.log)"
```

> Copie o hash gerado e cole no campo `ADMIN_PASSWORD_HASH=` do seu `.env`.

---

## 🛡️ Segurança e Boas Práticas

- 🔑 Senhas e dados sensíveis criptografados com bcrypt.  
- 🔐 Arquivos `.env` separados para frontend e backend.  
- 🚫 Nunca armazenar segredos diretamente no código em produção.  
- ☁️ Uso recomendado de gerenciadores de segredos (AWS Secrets Manager, Vault).  
- ✅ Validações em DTOs para garantir dados válidos.  
- 👥 Controle de acesso baseado em papéis (roles) disponível para futuras melhorias.

---

## ▶️ Como Rodar o Projeto

### Importante

> Para o site funcionar perfeitamente, você deve rodar o backend e o frontend **em terminais separados**, garantindo que cada um esteja com seu respectivo arquivo `.env` configurado corretamente.

Além disso, para instalar as dependências de cada parte do projeto, use os seguintes comandos depois de estar na pasta projeto:

### Backend

1. ⚙️ Configure `.env` com variáveis necessárias (`PORT`, conexão com PostgreSQL, chaves).  
2. 📥 Instale dependências:  
   ```bash
   # No terminal 1 (Backend)
   cd backend
   npm install
   ```  
3. 🚀 Rode em modo desenvolvimento:  
   ```bash
   npm run start
   ```

### Frontend

1. ⚙️ Configure `.env` para porta e URLs da API.  
2. 📥 Instale dependências:  
   ```bash
   # No terminal 2 (Frontend)
   cd frontend
   npm install
   ```  
3. 🚀 Inicie o frontend:  
   ```bash
   npm start
   ```

---

## 🤝 Considerações Finais

Este projeto foi desenvolvido com foco em escalabilidade, segurança e experiência do usuário. Arquitetura modular, criptografia e configuração via `.env` garantem confiabilidade e facilidade de manutenção.

---

## 📬 Contato

- 📧 institutoeduc.especialdf@gmail.com  
- 🌐 Parceira ESUCRI: [https://www.esucri.com.br](https://www.esucri.com.br)

---

## 👨‍💻 Contato do Desenvolvedor

- 👤 Rodrigo Martinhago Tachinski  
- 📧 rodrigomartinhago.contato@gmail.com  
- 🔗 https://www.linkedin.com/in/rodrigo-martinhago-tachinski/

---

## 📜 Licença

Licenciado sob MIT. Consulte o arquivo LICENSE para detalhes.
