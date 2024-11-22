# Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:18

# パッケージリストを更新し、必要なツールをインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    ca-certificates \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /

# アプリケーションのソースコードをコンテナにコピー
COPY . .

# 必要なパッケージをインストール
RUN npm install

# Next.js で必要なポートを開放
EXPOSE 3000

# 環境変数の設定（Next.js のテレメトリー機能を無効化）
ENV NEXT_TELEMETRY_DISABLED 1

# コンテナ起動時に実行するコマンドを設定
CMD ["npm", "run", "dev"]