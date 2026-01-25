#!/bin/bash

# Navegar para o diretório
cd /Users/omateusosos/Documents/GitHub/beta-english-platform

echo "🚀 Iniciando Lançamento Oficial (Produção)..."

# Verificar se temos mudanças não salvas
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Existem mudanças não salvas. Salvando rascunho primeiro..."
  ./save_draft.sh
fi

# Mudar para main e trazer novidades da develop
echo "📦 Preparando pacote para os alunos..."
git checkout main || git checkout -b main
git pull origin main
git merge develop --no-edit -m "Release: Atualizando plataforma"

# Enviar código estável para o GitHub
echo "cloud: Atualizando repositório principal..."
git push origin main

# Publicar o site
echo "🌍 Publicando site..."
npm run deploy

# Voltar para o modo desenvolvedor
echo "🧪 Voltando para o laboratório..."
git checkout develop

echo "✅ Sucesso! A nova versão está online para os alunos."
