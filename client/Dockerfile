FROM node:16 as builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --legacy-peer-deps
COPY . .

# EXPOSE 3000

RUN npm run build


# NGINX 
FROM nginx:1.20.1

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

# from: https://javascript.plainenglish.io/how-to-serve-a-react-app-with-nginx-in-a-non-root-docker-container-cbc4c6acc177
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER nginx


EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

