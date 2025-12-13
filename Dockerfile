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

# Copia só package.json primeiro (cache)
COPY bot/package*.json ./
RUN npm install

# Copia o resto
COPY bot .

CMD ["npm", "run", "start"]