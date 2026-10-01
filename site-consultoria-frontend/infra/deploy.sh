#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "1/4 — instalando dependências..."
npm install

echo "2/4 — gerando build de produção..."
npm run build

BUCKET=$(terraform -chdir=infra/terraform output -raw bucket_name)
DISTRIBUTION_ID=$(terraform -chdir=infra/terraform output -raw cloudfront_distribution_id)
SITE_URL=$(terraform -chdir=infra/terraform output -raw site_url)

echo "3/4 — enviando arquivos para o bucket $BUCKET..."
aws s3 sync dist/ "s3://$BUCKET" --delete

echo "4/4 — invalidando o cache do CloudFront ($DISTRIBUTION_ID)..."
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" > /dev/null

echo ""
echo "Deploy concluído! Site disponível em: $SITE_URL"