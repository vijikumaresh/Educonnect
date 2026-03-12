#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="/home/pc3/Desktop/Educonnect"
ENV_FILE="${ROOT_DIR}/.env"
EXAMPLE_FILE="${ROOT_DIR}/env.example"

mkdir -p "${ROOT_DIR}"

if [[ -f "${ENV_FILE}" ]] && grep -q '^JWT_SECRET=' "${ENV_FILE}"; then
  echo "JWT_SECRET already exists in ${ENV_FILE}"
  exit 0
fi

if command -v openssl >/dev/null 2>&1; then
  SECRET="$(openssl rand -base64 48 | tr -d '\n')"
else
  SECRET="$(head -c 64 /dev/urandom | base64 | tr -d '\n')"
fi

if [[ -f "${ENV_FILE}" ]]; then
  if grep -q '^JWT_SECRET=' "${ENV_FILE}"; then
    sed -i 's|^JWT_SECRET=.*$|JWT_SECRET='"${SECRET}"'|' "${ENV_FILE}"
  else
    printf '\nJWT_SECRET=%s\n' "${SECRET}" >> "${ENV_FILE}"
  fi
else
  printf 'JWT_SECRET=%s\n' "${SECRET}" > "${ENV_FILE}"
fi

if [[ ! -f "${EXAMPLE_FILE}" ]]; then
  printf 'JWT_SECRET=replace-with-a-strong-random-secret-at-least-32-characters\n' > "${EXAMPLE_FILE}"
fi

chmod 600 "${ENV_FILE}" || true
echo "JWT_SECRET written to ${ENV_FILE}"

