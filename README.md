
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
    ├── README.md (opcional, informações específicas backend)
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

## 🛡️ Segurança e Boas Práticas

- 🔑 Senhas e dados sensíveis criptografados com bcrypt.  
- 🔐 Arquivos `.env` separados para frontend e backend.  
- 🚫 Nunca armazenar segredos diretamente no código em produção.  
- ☁️ Uso recomendado de gerenciadores de segredos (AWS Secrets Manager, Vault).  
- ✅ Validações em DTOs para garantir dados válidos.  
- 👥 Controle de acesso baseado em papéis (roles) disponível para futuras melhorias.

---

## ▶️ Como Rodar o Projeto

### Backend

1. ⚙️ Configure `.env` com variáveis necessárias (`PORT`, conexão com PostgreSQL, chaves).  
2. 📥 Instale dependências:  
   ```bash
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

- 📧 contato@institutodiomicio.com.br  
- 🌐 Parceira ESUCRI: [https://www.esucri.com.br](https://www.esucri.com.br)

---

## 👨‍💻 Contato do Desenvolvedor

- 👤 Rodrigo Martinhago Tachinski  
- 📧 rodrigomartinhago.contato@gmail.com
- 🔗 https://www.linkedin.com/in/rodrigo-martinhago-tachinski/

## 📜 Licença

Licenciado sob MIT. Consulte o arquivo LICENSE para detalhes.

