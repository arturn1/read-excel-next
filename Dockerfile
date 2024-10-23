# Etapa 1: Build
FROM node:18-alpine AS builder

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para o container
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o código da aplicação para o diretório de trabalho no container
COPY . .

# Execute o build da aplicação Next.js
RUN npm run build

# Etapa 2: Run
FROM node:18-alpine AS runner

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie as dependências da primeira etapa
COPY --from=builder /app/node_modules ./node_modules

# Copie o build da aplicação para o container
COPY --from=builder /app/.next ./.next

# Copie arquivos estáticos
COPY --from=builder /app/public ./public

# Copie o restante dos arquivos do projeto
COPY --from=builder /app/package*.json ./

# Defina as variáveis de ambiente
ENV NODE_ENV=production

# Exponha a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
