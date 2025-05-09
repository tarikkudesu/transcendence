FROM node:current-bookworm-slim
RUN apt-get update -y && apt-get upgrade -y && apt-get install -y curl git vim zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" # inctall oh-my-zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/tarikkudesu/My-configs/refs/heads/main/install.sh)" # install my aliases
RUN echo 'cd /home/data' >> ~/.zshrc
ENTRYPOINT ["bash", "-c", "tail -f /dev/null"]

