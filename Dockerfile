# Base image for Node.js
FROM node:18.20.3-bookworm-slim

# Install k6
RUN apt-get update
RUN apt-get upgrade
RUN apt-get install -y ca-certificates gnupg2 gpg curl
# RUN gpg -k
# RUN gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
# RUN echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | tee /etc/apt/sources.list.d/k6.list
# RUN apt-get update
# RUN apt-get install k6

WORKDIR /usr/local/bin

# RUN curl -fSL "https://go.dev/dl/go1.22.4.linux-amd64.tar.gz" | tar -C /usr/local -xz
# ENV PATH="$PATH:/usr/local/go/bin:/root/go/bin"
# RUN go install go.k6.io/xk6/cmd/xk6@latest && \
#     /root/go/bin/xk6 build --with github.com/grafana/xk6-dashboard@latest

RUN curl -JLO https://github.com/grafana/xk6-dashboard/releases/download/v0.7.4/xk6-dashboard_v0.7.4_linux_amd64.tar.gz
RUN tar -xzf xk6-dashboard_v0.7.4_linux_amd64.tar.gz

# Create and set the working directory
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/reports

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for the frontend
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
