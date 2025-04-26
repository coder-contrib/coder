FROM ubuntu:jammy

ARG USER=coder

RUN apt-get update && apt-get install -y \
    curl \
    git \
    jq \
    sudo \
    vim \
    wget

# Add a user `coder` with sudo access
RUN useradd --groups sudo --shell /bin/bash ${USER} \
    && echo "${USER} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${USER} \
    && chmod 0440 /etc/sudoers.d/${USER}

USER ${USER}
WORKDIR /home/${USER}