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
  // Numéro du dernier bloc
  const dernierBloc = await appel("eth_blockNumber", []);
  const numero = parseInt(dernierBloc, 16);
  console.log("Nombre de blocs minés :", numero);

  if (numero === 0) {
    console.log("Aucune transaction encore.");
    return;
  }

  // Parcourt chaque bloc et affiche les transactions
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
