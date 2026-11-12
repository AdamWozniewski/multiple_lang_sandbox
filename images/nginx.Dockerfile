FROM nginx:alpine
COPY nginx.conf /etc/nginx/ngninx.conf
EXPOSE 80 443