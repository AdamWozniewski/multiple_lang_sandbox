FROM nginx:alpine
COPY nginx.conf /etc/nginx/ngnix.conf
LABEL authors="Adam"

ENTRYPOINT ["top", "-b"]