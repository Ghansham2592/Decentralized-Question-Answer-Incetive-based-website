var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic ="casual tent october favorite swarm eagle genius media note fly creek conduct";



module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },

    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/qNjs8vdB2KGt3QSe53cG")
      },
      network_id: 3,
      gas: 6612388,
      gasPrice: 20000000000
  },
// test network
  ganache:
  {
    host: "127.0.0.1",
    port: 8545,
    network_id: "*" // matching any id
    },
    rpc:
     {
        host: 'localhost',
        post:8080
    },
    solc:
    {
        optimizer: {
        enabled: true,
        runs: 200
                    }
    }

}
}
