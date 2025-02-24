# Servidor de Videochamadas Araucaria Meet

Este é o servidor backend para a aplicação de videochamadas Araucaria Meet. Ele fornece funcionalidades de gerenciamento de salas de reunião, comunicação em tempo real via WebSocket e integração com WebRTC.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Socket.IO
- MongoDB
- Docker

## Arquitetura

O projeto segue uma arquitetura baseada em Domain-Driven Design (DDD):

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

## Pré-requisitos

- Node.js (versão 16 ou superior)
- Docker e Docker Compose (para executar o MongoDB)
- npm ou yarn

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   PORT=3000
   MONGODB_URI=mongodb://admin:password@localhost:27017/araucaria-meet?authSource=admin
   NODE_ENV=development
   JWT_SECRET=your-secret-key
   CORS_ORIGIN=http://localhost:5173
   ```

## Desenvolvimento

### Iniciando o MongoDB

Para iniciar o MongoDB usando Docker Compose:

```bash
docker compose up -d
```

Isso iniciará o MongoDB na porta 27017 e o MongoDB Express (interface web) na porta 8081.

### Iniciando o servidor

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor será iniciado na porta 3000 (ou na porta especificada no arquivo .env).

## Build e Produção

Para criar uma build de produção:

```bash
npm run build
```

Para iniciar o servidor em produção:

```bash
npm start
```

## API Endpoints

### Salas

- `POST /api/rooms` - Criar uma nova sala
- `GET /api/rooms/:roomId` - Obter detalhes de uma sala
- `POST /api/rooms/:roomId/end` - Finalizar uma sala

## Eventos WebSocket

### Cliente -> Servidor

- `join-room` - Entrar em uma sala
- `leave-room` - Sair de uma sala
- `toggle-media` - Alternar estado de áudio/vídeo
- `send-message` - Enviar mensagem no chat

### Servidor -> Cliente

- `participant-joined` - Novo participante entrou
- `participant-left` - Participante saiu
- `room-participants` - Lista de participantes
- `participant-media-toggle` - Alteração de estado de mídia
- `new-message` - Nova mensagem no chat
- `room-error` - Erro na sala

## Funcionalidades

- Criação de salas de reunião com IDs únicos
- Gerenciamento de participantes
- Chat em tempo real
- Controle de mídia (áudio/vídeo)
- Restrição de acesso (5 minutos antes do início)
- Finalização automática de reuniões
