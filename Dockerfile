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

# Compila TS → dist
RUN npm run build

CMD ["node", "dist/index.js"]