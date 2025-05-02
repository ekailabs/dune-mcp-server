# Dockerfile
FROM oven/bun:1.0.0

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port for HTTP-based transports
EXPOSE 3003

# Set default port
ENV PORT=3003

# Use ENTRYPOINT to handle the command properly
ENTRYPOINT ["bun", "src/index.ts"]

# Default to SSE mode if no argument is provided
CMD ["http"]
