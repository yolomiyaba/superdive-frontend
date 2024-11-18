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
WORKDIR /workspace

# Next.js で必要なポートを開放
EXPOSE 3000

# 環境変数の設定（必要に応じて）
ENV NEXT_TELEMETRY_DISABLED 1

# コンテナ内で実行するコマンド（コンテナ起動時に実行）
CMD ["bash"]
