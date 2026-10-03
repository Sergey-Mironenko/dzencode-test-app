FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build 
RUN npm run build

EXPOSE 3000

# Start Application
CMD ["npm", "run", "start"]