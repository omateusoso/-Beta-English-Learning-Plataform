#!/bin/bash

# Configurar Git (Global)
git config --global user.name "Mateus Costa"
git config --global user.email "omateuosos@gmail.com"

# Navegar para o diretório do projeto
cd /Users/omateusosos/Documents/GitHub/beta-english-platform

# Adicionar mudanças
echo "Adicionando arquivos..."
git add .

# Commit
echo "Realizando commit..."
git commit -m "backup atualizado"

# Push para o repositório remoto
echo "Enviando para o GitHub..."
git push

# Deploy
echo "Iniciando deploy..."
npm run deploy

echo "✅ Backup e Deploy concluídos com sucesso!"
