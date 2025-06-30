# Usar imagem Node
FROM node:20

# criar diretório de trabalho
WORKDIR /app

# copiar arquivos
COPY package*.json ./

# instalar dependências
RUN npm install

# copiar todo restante
COPY . .

# expor porta
EXPOSE 3000

# comando de inicialização
CMD ["npm", "run", "dev"]
