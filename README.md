# projet-maitenance-systeme

ludovic




Créer le projet "blockchain" sur le VPS


*** INSTALLER DOCKER ***


    sudo apt update
    sudo apt install docker.io -y
    sudo apt install docker-compose -y
    sudo usermod -aG docker $USER
    newgrp docker
    sudo systemctl enable --now docker


Vérifier avec docker run hello-world



*** Faire nano blockchain/docker-compose.yml


    version: "3.9"

    services:

    ganache:
        image: trufflesuite/ganache:latest
        container_name: ganache
        ports:
        - "8545:8545"
        command: >
        --networkId 1337
        --accounts 10
        --defaultBalanceEther 100
        --deterministic
        --host 0.0.0.0
        --verbose
        restart: always

    explorer:
        image: alethio/ethereum-lite-explorer:latest
        container_name: explorer
        ports:
        - "8080:80"
        environment:
        - APP_NODE_URL=http://localhost:8545
        depends_on:
        - ganache
        restart: always


*** Créer fichier .env  et mettre

    GANACHE_PORT=8545
    EXPLORER_PORT=8080
    NETWORK_ID=1337
    ACCOUNTS=10
    BALANCE=100


























