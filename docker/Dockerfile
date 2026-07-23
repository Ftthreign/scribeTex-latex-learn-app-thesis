FROM alpine:3.19

# Pasang paket TeXLive lengkap (texlive-full) agar semua paket TeX (titlesec, biblatex, caption, dll) tersedia
RUN apk add --no-cache \
    texlive-full \
    ghostscript \
    bash \
    coreutils

# Membuat user non-root latexuser (UID 10001) demi keamanan
RUN addgroup -S -g 10001 latexgroup && \
    adduser -S -u 10001 -G latexgroup -h /home/latexuser -s /bin/bash latexuser

WORKDIR /workspace

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh
RUN chown -R latexuser:latexgroup /workspace

USER latexuser
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
