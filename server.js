const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

const schema = buildSchema(`
  type User {
    id: ID!
    email: String!
    role: String!
  }

  type AuthPayload {
    success: Boolean!
    token: String
    message: String
    user: User
  }

  type Query {
    hello: String
    getMe(token: String!): User
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`);

const rootResolver = {
  hello: () => 'GraphQL сервер успешно работает с Prisma и MySQL!',

  register: async ({ email, password }) => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Некорректный формат email' };
      }

      if (password.length < 6) {
        return { success: false, message: 'Пароль должен быть не менее 6 символов' };
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return { success: false, message: 'Пользователь уже существует' };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { email, password: hashedPassword, role: 'user' }
      });

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        token,
        user: { id: newUser.id, email: newUser.email, role: newUser.role }
      };
    } catch (error) {
      return { success: false, message: 'Ошибка сервера при регистрации' };
    }
  },

  login: async ({ email, password }) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return { success: false, message: 'Неверный email или пароль' };
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        token,
        user: { id: user.id, email: user.email, role: user.role }
      };
    } catch (error) {
      return { success: false, message: 'Ошибка сервера при входе' };
    }
  },

  getMe: async ({ token }) => {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) return null;
      return { id: user.id, email: user.email, role: user.role };
    } catch (error) {
      return null;
    }
  }
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: rootResolver,
  graphiql: true,
}));

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let activeSessions = 0;

io.on('connection', (socket) => {
  activeSessions++;
  console.log(`[Socket] New connection: ${socket.id}. Active sessions: ${activeSessions}`);
  io.emit('sessions_count', activeSessions);

  socket.on('disconnect', (reason) => {
    activeSessions = Math.max(0, activeSessions - 1);
    console.log(`[Socket] Disconnect: ${socket.id} (reason: ${reason}). Active sessions: ${activeSessions}`);
    io.emit('sessions_count', activeSessions);
  });

  socket.on('error', (err) => {
    console.error(`[Socket Error] Error in socket ${socket.id}:`, err);
  });
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`[Server Error] Port ${PORT} is already in use by another process!`);
  } else {
    console.error('[Server Error] Error while server start:', error);
  }
  process.exit(1);
});

const shutdown = () => {
  console.log('\n[Server] Shutting down the server...');
  io.close(() => {
    server.close(() => {
      console.log('[Server] The server has been successfully stopped.');
      process.exit(0);
    });
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(PORT, () => {
  console.log(`🚀 API & WebSocket Server started on http://localhost:${PORT}`);
  console.log(`graphql endpoint ready at http://localhost:${PORT}/graphql`);
});