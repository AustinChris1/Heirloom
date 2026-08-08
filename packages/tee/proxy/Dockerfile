# Self-contained build of tee-proxy. Clones tee-proxy from GitHub at build time
# so no local sibling repos are needed.
#
# TEE_PROXY_VERSION MUST stay aligned with the extension's Go-module pins
# (go/tools/go.mod): tee-proxy v0.0.18. tee-proxy's own go.mod transitively pins
# the matching tee-node and go-flare-common line, so building it with
# `go mod download` pulls the exact governance-aware node code the extension-tee
# image uses — no separate tee-node clone or replace directive is needed.
# Override via build arg when bumping both sides together.

# Default bumped from v0.0.18 to develop: the Coston2 redeploy notice requires
# a current proxy/node pair, and data providers reject votes from older builds.
ARG TEE_PROXY_VERSION=develop

# Go bumped from 1.25.1 to 1.25.8. tee-proxy's develop go.mod declares
# `go >= 1.25.8`, and the base image sets GOTOOLCHAIN=local, so 1.25.1 fails at
# `go mod download` with "go.mod requires go >= 1.25.8" rather than fetching a
# newer toolchain. Keep this at or above whatever develop's go.mod declares.
FROM golang:1.25.8-alpine AS builder

RUN apk add --no-cache git

ARG TEE_PROXY_VERSION

WORKDIR /app
RUN git clone --depth 1 --branch ${TEE_PROXY_VERSION} https://github.com/flare-foundation/tee-proxy.git

WORKDIR /app/tee-proxy
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -a -o main ./cmd/proxy

# Final stage
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/tee-proxy/main .
# On develop the template moved from the repo root into config/. This path is
# only a placeholder anyway — docker-compose bind-mounts the real Coston2 config
# over /app/config/config.toml at run time.
COPY --from=builder /app/tee-proxy/config/config.example.toml ./config/config.toml

RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 6661
EXPOSE 6662

CMD ["./main"]
