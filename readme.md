# Araucaria Meet - Plataforma de Videochamadas

Araucaria Meet é uma plataforma completa de videoconferência que permite a realização de reuniões virtuais em tempo real, com funcionalidades como chat integrado, agendamento de salas e configuração de dispositivos de áudio e vídeo.

![Tela de Lobby](.github/docs/meet-lobby.png)

## 🚀 Funcionalidades

- **Criação de salas** com IDs únicos para reuniões imediatas
- **Agendamento de reuniões** com data/hora específicas
- **Gerenciamento de participantes** com controle de entrada e saída
- **Chat em tempo real** integrado à chamada
- **Controle de mídia** (ativar/desativar áudio e vídeo)
- **Listagem de salas** existentes no sistema
- **Acesso direto via URL** com autenticação automática
- **Persistência de dados** em MongoDB
- **Interface responsiva** para diferentes dispositivos

![Sala de Reunião](.github/docs/meet-room.png)

## 🛠️ Tecnologias Utilizadas

### Backend (Server)

- Node.js
- TypeScript
- Express
- Socket.IO para comunicação em tempo real
- MongoDB para persistência de dados
- Docker para containerização
- Arquitetura baseada em Domain-Driven Design (DDD)

### Frontend (Webview)

- React.js
- TypeScript
- Vite
- React Router
- Socket.IO Client
- Context API para gerenciamento de estado
- TailwindCSS para estilização

## 📂 Estrutura do Projeto

O projeto está dividido em duas partes principais:

### Servidor (server/)

```
server/
├── src/
│   ├── config/               # Configurações globais
│   ├── modules/              # Módulos da aplicação
│   │   └── rooms/            # Módulo de salas
│   │       ├── dto/          # Data Transfer Objects
│   │       ├── entities/     # Entidades do domínio
│   │       ├── interfaces/   # Interfaces e contratos
│   │       ├── functions/    # Funções utilitárias
│   │       ├── room.controller.ts  # Controlador
│   │       ├── room.service.ts     # Serviço
│   │       └── room.useCases.ts    # Casos de uso
│   ├── infra/                # Infraestrutura
│   │   ├── db/               # Banco de dados
│   │   │   ├── config/       # Configuração do banco
│   │   │   ├── models/       # Modelos do MongoDB
│   │   │   └── repositories/ # Implementações de repositórios
│   │   └── websocket/        # Implementação WebSocket
│   ├── routes/               # Rotas da API
│   └── index.ts              # Ponto de entrada
```

### Cliente (webview/)

```
webview/
├── src/
│   ├── assets/               # Recursos estáticos
│   ├── components/           # Componentes reutilizáveis
│   ├── contexts/             # Contextos React
│   ├── infra/                # Infraestrutura
│   │   ├── httpRequest/      # Cliente HTTP
│   │   └── services/         # Serviços (API, Socket)
│   ├── pages/                # Páginas da aplicação
│   │   ├── lobby/            # Página inicial
│   │   └── meeting-room/     # Sala de reunião
│   ├── routes/               # Configuração de rotas
│   └── App.tsx               # Componente principal
```

## 🔧 Configuração e Execução

### Pré-requisitos

- Node.js (versão 16 ou superior)
- Docker e Docker Compose (para MongoDB)
- npm ou yarn

### Ambiente de Banco de Dados (MongoDB)

O projeto utiliza Docker Compose para configurar o ambiente de banco de dados MongoDB e o Mongo Express (interface web para administração do MongoDB).

1. Verifique se o Docker e o Docker Compose estão instalados:

   ```bash
   docker --version
   docker compose --version
   ```

2. Inicie os serviços do MongoDB e Mongo Express com o seguinte comando na pasta raiz do projeto:
   ```bash
   docker compose up -d
   ```

Após a execução, você terá:

- MongoDB rodando na porta 27017
- Mongo Express (interface web) disponível em: `http://localhost:8081`

Credenciais de acesso do Mongo Express:

- Usuário: admin
- Senha: password

### Backend (Server)

1. Acesse a pasta do servidor:

   ```bash
   cd server
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env` com as configurações:

   ```
   PORT=3000
   MONGODB_URI=mongodb://admin:password@localhost:27017/araucaria-meet?authSource=admin
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. Inicie o servidor em desenvolvimento:
   ```bash
   npm run dev
   ```

#### Scripts Disponíveis (Backend)

- `npm run dev` - Inicia o servidor em modo de desenvolvimento com hot reload
- `npm run start` - Inicia o servidor a partir dos arquivos compilados
- `npm run build` - Compila o projeto TypeScript
- `npm run db:up` - Inicia os containers do MongoDB
- `npm run db:down` - Para os containers do MongoDB
- `npm run dev:full` - Inicia o banco de dados e o servidor em uma única etapa

### Frontend (Webview)

1. Acesse a pasta do frontend:

   ```bash
   cd webview
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env.local` com as configurações:

   ```
   VITE_API_URL=http://localhost:3000/api
   VITE_SOCKET_URL=http://localhost:3000
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse a aplicação em `http://localhost:5173`

#### Scripts Disponíveis (Frontend)

- `npm run dev` - Inicia o servidor de desenvolvimento Vite
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza a versão de produção localmente
- `npm run lint` - Executa o linter para verificar problemas no código
- `npm run gen` - Executa o gerador de componentes Plop para criar arquivos a partir de templates

## 📋 API Endpoints

### Salas

- `GET /api/rooms` - Listar todas as salas
- `POST /api/rooms` - Criar uma nova sala
- `POST /api/rooms/test` - Criar uma sala de teste com acesso imediato
- `POST /api/rooms/schedule` - Agendar uma nova sala
- `GET /api/rooms/:roomId` - Obter detalhes de uma sala
- `POST /api/rooms/:roomId/join` - Entrar em uma sala
- `POST /api/rooms/:roomId/leave` - Sair de uma sala
- `POST /api/rooms/:roomId/end` - Finalizar uma sala
- `GET /api/rooms/:roomId/messages` - Obter mensagens de uma sala

## 🔌 Eventos WebSocket

### Cliente → Servidor

- `join-room` - Entrar em uma sala
- `leave-room` - Sair de uma sala
- `toggle-media` - Alternar estado de áudio/vídeo
- `send-message` - Enviar mensagem no chat

### Servidor → Cliente

- `participant-joined` - Novo participante entrou
- `participant-left` - Participante saiu
- `room-participants` - Lista de participantes
- `participant-media-toggle` - Alteração de estado de mídia
- `new-message` - Nova mensagem no chat
- `room-messages` - Todas as mensagens da sala
- `room-error` - Erro na sala

## 💡 Como Usar

### Credenciais de Acesso (Demo)

Para testar a aplicação, você pode usar as seguintes credenciais:

- Email: admin@admin.com
- Senha: 123456

### Criar uma Sala

1. Acesse a página inicial
2. Digite seu nome
3. Clique em "Criar Sala"
4. Compartilhe o ID da sala com outros participantes

### Entrar em uma Sala

1. Acesse a página inicial
2. Digite seu nome e o ID da sala
3. Clique em "Entrar na Sala"

### Agendar uma Reunião

1. Acesse a página inicial
2. Clique em "Agendar Reunião"
3. Preencha os dados do formulário (título, descrição, data, etc.)
4. Adicione os participantes por e-mail
5. Clique em "Agendar"

### Acesso Direto via URL

É possível acessar diretamente uma sala usando o formato:

```
http://localhost:5173/room-meeting?roomId=ID_DA_SALA
```

## 🔍 Detalhes de Implementação

### Arquitetura do Backend

O backend foi implementado seguindo princípios de Domain-Driven Design (DDD) para manter o código organizado e desacoplado. Isso permite:

1. **Separação clara de responsabilidades** - Cada módulo tem componentes específicos (controllers, services, use cases).
2. **Independência de infraestrutura** - A lógica de negócios não depende diretamente do banco de dados ou do framework web.
3. **Testabilidade** - Componentes podem ser testados isoladamente.

### Persistência de Dados

O sistema utiliza dois tipos de repositórios:

- **InMemoryRepository** - Usado para testes e desenvolvimento rápido
- **MongoRepository** - Implementação para produção com persistência em MongoDB

A escolha do repositório é feita durante a inicialização da aplicação, permitindo alternar facilmente entre eles.

### WebSockets e Comunicação em Tempo Real

A comunicação em tempo real é gerenciada pelo Socket.IO, que:

- Mantém conexões persistentes entre clientes e servidor
- Gerencia salas e participantes
- Transmite eventos como entrada/saída de participantes e novas mensagens
- Implementa reconexão automática em caso de falhas de rede

### Fluxos de Acesso ao Meeting Room

O sistema suporta dois fluxos principais de acesso às salas:

1. **Fluxo normal via lobby**:

   - Usuário fornece nome e ID da sala
   - Sistema verifica se a sala existe e se está disponível
   - Usuário é redirecionado para a sala de reunião

2. **Acesso direto via URL**:
   - Sistema extrai o ID da sala da URL
   - Verifica se o usuário já é participante
   - Se não for, tenta juntar-se automaticamente
   - Redireciona para a página inicial em caso de erro

## ❗ Resolução de Problemas Comuns

### Problemas de Conexão com o MongoDB

**Sintoma**: Erro "MongoNetworkError: failed to connect to server"

**Soluções**:

1. Verifique se o Docker está em execução
2. Certifique-se de que os containers MongoDB estão ativos:
   ```bash
   docker ps | grep mongo
   ```
3. Reinicie os containers:
   ```bash
   docker compose down
   docker compose up -d
   ```
4. Verifique as configurações de string de conexão no arquivo `.env`

### Erros de CORS

**Sintoma**: Mensagens de erro no console relacionadas a CORS

**Soluções**:

1. Verifique se a variável `CORS_ORIGIN` no `.env` do servidor corresponde à URL do frontend
2. Certifique-se de que o protocolo (http/https) está correto
3. Reinicie o servidor após alterar as configurações

### Problemas com WebSocket

**Sintoma**: Falha na conexão WebSocket ou mensagens não entregues

**Soluções**:

1. Verifique se o servidor está em execução
2. Certifique-se de que a URL do Socket no frontend está correta no arquivo `.env.local`
3. Verifique o console do navegador para mensagens de erro
4. Tente abrir uma nova instância do navegador (problemas de cache)

### Problemas de Roteamento/Redirecionamento

**Sintoma**: Redirecionamentos incorretos ou página não encontrada

**Soluções**:

1. Verifique se as rotas no React Router estão configuradas corretamente
2. Certifique-se de que os nomes das rotas são consistentes entre front-end e back-end
3. Limpe o cache do navegador ou use modo anônimo para testes

## 🚧 Estado do Projeto

O projeto está em desenvolvimento ativo, com as seguintes funcionalidades já implementadas:

- ✅ Criação e gerenciamento de salas
- ✅ Chat em tempo real
- ✅ Controle de áudio e vídeo
- ✅ Agendamento de reuniões
- ✅ Persistência de dados em MongoDB
- ✅ Acesso direto via URL

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
