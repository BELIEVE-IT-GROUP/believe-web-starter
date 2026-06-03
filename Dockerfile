# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG NEXT_PUBLIC_PAYLOAD_URL
ARG NEXT_PUBLIC_TENANT_SLUG
ARG NEXT_PUBLIC_PREVIEW_SECRET
ENV NEXT_PUBLIC_PAYLOAD_URL=$NEXT_PUBLIC_PAYLOAD_URL
ENV NEXT_PUBLIC_TENANT_SLUG=$NEXT_PUBLIC_TENANT_SLUG
ENV NEXT_PUBLIC_PREVIEW_SECRET=$NEXT_PUBLIC_PREVIEW_SECRET
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]
