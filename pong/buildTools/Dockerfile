FROM ubuntu:plucky
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y curl git vim zsh && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs # inctall node
RUN apt-get install -y python3 make g++ build-essential libc6-dev
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash # inctall node version manager
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" # inctall oh-my-zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/tarikkudesu/My-configs/refs/heads/main/install.sh)" # install my aliases
RUN echo 'cd /home/data' >> ~/.zshrc
ENTRYPOINT ["bash", "-c", "tail -f /dev/null"]
