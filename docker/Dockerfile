FROM alpine:3.19

RUN apk add --no-cache \
    texlive-full \
    ghostscript \
    bash \
    coreutils && \
    addgroup -S -g 10001 latexgroup && \
    adduser -S -u 10001 -G latexgroup -h /home/latexuser -s /bin/bash latexuser

WORKDIR /workspace

COPY --chmod=755 entrypoint.sh /usr/local/bin/entrypoint.sh

RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && \
    chown -R latexuser:latexgroup /workspace

USER latexuser
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
