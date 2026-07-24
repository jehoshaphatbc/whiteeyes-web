FROM golang:1.22-alpine AS builder

WORKDIR /app

RUN apk add --no-glibc-compat gcc musl-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o whiteeyes-api main.go

FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/whiteeyes-api .
COPY --from=builder /app/.env.example .env

EXPOSE 8080

CMD ["./whiteeyes-api"]
