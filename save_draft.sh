#!/bin/bash

# Configurar Git (se necessário, redundância não faz mal)
git config --global user.name "Mateus Costa"
git config --global user.email "omateuosos@gmail.com"

# Navegar para o diretório
cd /Users/omateusosos/Documents/GitHub/beta-english-platform

echo "🧪 Salvando Rascunho (Laboratório)..."

# Garantir que estamos na branch de desenvolvimento
current_branch=$(git branch --show-current)
if [ "$current_branch" != "develop" ]; then
    echo "⚠️  Você não está na branch 'develop'. Mudando agora..."
    git checkout develop || git checkout -b develop
fi

# Adicionar e Commitar
git add .
git commit -m "Rascunho: Atualização de desenvolvimento"

# Enviar para nuvem (apenas código, sem publicar site)
git push origin develop

echo "✅ Rascunho salvo! Seus alunos NÃO verão essas mudanças ainda."
