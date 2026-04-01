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



*** Créer fichier pour les transaction (transaction.js et mettre

    const http = require("http");

    function appel(methode, params) {
    return new Promise((resolve, reject) => {
        const corps = JSON.stringify({
        jsonrpc: "2.0", method: methode, params, id: 1
        });
        const req = http.request(
        { hostname: "localhost", port: 8545, path: "/",
            method: "POST", headers: { "Content-Type": "application/json" } },
        (res) => {
            let data = "";
            res.on("data", c => data += c);
            res.on("end", () => resolve(JSON.parse(data).result));
        }
        );
        req.on("error", reject);
        req.write(corps);
        req.end();
    });
    }

    async function main() {
    const comptes      = await appel("eth_accounts", []);
    const expediteur   = comptes[0];
    const destinataire = comptes[1];

    const avant = await appel("eth_getBalance", [expediteur, "latest"]);
    console.log("Solde avant :", parseInt(avant, 16) / 1e18, "ETH");

    const hash = await appel("eth_sendTransaction", [{
        from: expediteur, to: destinataire,
        value: "0x" + (5n * 10n**18n).toString(16)
    }]);
    console.log("Transaction envoyee ! Hash :", hash);

    const apres = await appel("eth_getBalance", [expediteur, "latest"]);
    console.log("Solde apres :", parseInt(apres, 16) / 1e18, "ETH");
    }

    main();

*** Créer le fichier pour l'historique des transactions (historique.js)


    const http = require("http");

    function appel(methode, params) {
    return new Promise((resolve, reject) => {
        const corps = JSON.stringify({
        jsonrpc: "2.0", method: methode, params, id: 1
        });
        const req = http.request(
        { hostname: "localhost", port: 8545, path: "/",
            method: "POST", headers: { "Content-Type": "application/json" } },
        (res) => {
            let data = "";
            res.on("data", c => data += c);
            res.on("end", () => resolve(JSON.parse(data).result));
        }
        );
        req.on("error", reject);
        req.write(corps);
        req.end();
    });
    }

    async function main() {
    const dernierBloc = await appel("eth_blockNumber", []);
    const numero = parseInt(dernierBloc, 16);
    console.log("Nombre de blocs mines :", numero);

    if (numero === 0) {
        console.log("Aucune transaction encore.");
        return;
    }

    for (let i = 1; i <= numero; i++) {
        const bloc = await appel("eth_getBlockByNumber", ["0x" + i.toString(16), true]);
        console.log(`\nBloc #${i} — ${bloc.transactions.length} transaction(s)`);
        bloc.transactions.forEach((tx, j) => {
        console.log(`  Transaction ${j + 1} :`);
        console.log(`    De      : ${tx.from}`);
        console.log(`    Vers    : ${tx.to}`);
        console.log(`    Montant : ${parseInt(tx.value, 16) / 1e18} ETH`);
        console.log(`    Hash    : ${tx.hash}`);
        });
    }
    }

    main();



*** Lancer le docker => docker-compose up -d ***

Vérifier que les 2 conteneurs tournent => docker-compose ps



Lancer une transaction => node transaction.js

Voir l'historique => node historique.js












