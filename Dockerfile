FROM node:20-bookworm

# Dependências do canvas
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    git \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia package.json primeiro (cache)
COPY package*.json ./
RUN npm ci

# Copia o resto
COPY . .

# Força a atualização do pacote do GitHub especificamente
# e gera o Prisma Client logo em seguida
RUN npm update mindustry-schematic && npx prisma generate

# Compila TS → dist
RUN npm run build

CMD npx prisma db push && node dist/index.js