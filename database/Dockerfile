FROM mysql:8.4

RUN microdnf update -y && \
    microdnf install -y unzip && \
    microdnf clean all

COPY my.cnf /etc/mysql/conf.d/my.cnf