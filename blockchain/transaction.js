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
