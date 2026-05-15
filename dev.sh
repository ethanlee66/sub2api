#!/bin/bash
# Sub2API 本地开发启动脚本
# 启动 Docker 依赖（PostgreSQL + Redis）+ 后端 + 前端

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
POSTGRES_PORT=15432
REDIS_PORT=6379
POSTGRES_USER=sub2api
POSTGRES_PASSWORD=sub2api_dev
POSTGRES_DB=sub2api
BACKEND_PORT=8080
FRONTEND_PORT=5173

export GOPROXY="${GOPROXY:-https://goproxy.cn,direct}"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

cleanup() {
    echo ""
    echo -e "${YELLOW}[dev] 正在停止服务...${NC}"
    # 杀掉后台进程组
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}[dev] 服务已停止。Docker 依赖仍在运行，如需停止：${NC}"
    echo "  docker stop sub2api-dev-postgres sub2api-dev-redis"
    exit 0
}

trap cleanup SIGINT SIGTERM

# ---- 检查依赖 ----
check_command() {
    if ! command -v "$1" &>/dev/null; then
        echo -e "${RED}[dev] 缺少依赖: $1，请先安装${NC}"
        exit 1
    fi
}

check_command docker
check_command go
check_command pnpm

# ---- 启动 PostgreSQL ----
if docker ps --format '{{.Names}}' | grep -q '^sub2api-dev-postgres$'; then
    echo -e "${CYAN}[dev] PostgreSQL 已在运行${NC}"
else
    echo -e "${CYAN}[dev] 启动 PostgreSQL...${NC}"
    docker rm -f sub2api-dev-postgres 2>/dev/null || true
    docker run -d \
        --name sub2api-dev-postgres \
        -p ${POSTGRES_PORT}:5432 \
        -e POSTGRES_USER=${POSTGRES_USER} \
        -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
        -e POSTGRES_DB=${POSTGRES_DB} \
        postgres:15-alpine >/dev/null
    echo -e "${GREEN}[dev] PostgreSQL 已启动 (端口 ${POSTGRES_PORT})${NC}"
fi

# ---- 启动 Redis ----
if docker ps --format '{{.Names}}' | grep -q '^sub2api-dev-redis$'; then
    echo -e "${CYAN}[dev] Redis 已在运行${NC}"
else
    echo -e "${CYAN}[dev] 启动 Redis...${NC}"
    docker rm -f sub2api-dev-redis 2>/dev/null || true
    docker run -d \
        --name sub2api-dev-redis \
        -p ${REDIS_PORT}:6379 \
        redis:7-alpine >/dev/null
    echo -e "${GREEN}[dev] Redis 已启动 (端口 ${REDIS_PORT})${NC}"
fi

# ---- 等待依赖就绪 ----
echo -e "${CYAN}[dev] 等待数据库就绪...${NC}"
for i in $(seq 1 30); do
    if docker exec sub2api-dev-postgres pg_isready -U ${POSTGRES_USER} &>/dev/null; then
        break
    fi
    sleep 1
done

# ---- 生成开发配置文件 ----
CONFIG_FILE="${ROOT_DIR}/backend/config.yaml"
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${CYAN}[dev] 生成开发配置 backend/config.yaml...${NC}"
    cat > "$CONFIG_FILE" <<EOF
server:
  host: "0.0.0.0"
  port: ${BACKEND_PORT}
  mode: "debug"

database:
  host: "127.0.0.1"
  port: ${POSTGRES_PORT}
  user: "${POSTGRES_USER}"
  password: "${POSTGRES_PASSWORD}"
  dbname: "${POSTGRES_DB}"
  sslmode: "disable"

redis:
  host: "127.0.0.1"
  port: ${REDIS_PORT}
  password: ""
  db: 0
EOF
    echo -e "${GREEN}[dev] 配置已生成${NC}"
else
    echo -e "${CYAN}[dev] 使用已有配置 backend/config.yaml${NC}"
fi

# ---- 安装前端依赖 ----
if [ ! -d "${ROOT_DIR}/frontend/node_modules" ]; then
    echo -e "${CYAN}[dev] 安装前端依赖...${NC}"
    (cd "${ROOT_DIR}/frontend" && pnpm install)
fi

# ---- 启动后端 ----
echo -e "${GREEN}[dev] 启动后端 (端口 ${BACKEND_PORT})...${NC}"
(cd "${ROOT_DIR}/backend" && go run ./cmd/server) &
BACKEND_PID=$!

# ---- 启动前端 ----
echo -e "${GREEN}[dev] 启动前端 (端口 ${FRONTEND_PORT})...${NC}"
(cd "${ROOT_DIR}/frontend" && pnpm run dev) &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Sub2API 开发环境已启动${NC}"
echo -e "${GREEN}  前端: http://localhost:${FRONTEND_PORT}${NC}"
echo -e "${GREEN}  后端: http://localhost:${BACKEND_PORT}${NC}"
echo -e "${GREEN}  Ctrl+C 停止前后端${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 等待任一进程退出。macOS 自带 Bash 3.2 不支持 wait -n。
while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null; do
    sleep 1
done
cleanup
