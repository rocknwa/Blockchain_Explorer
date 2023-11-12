import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetails, setBlockDetails] = useState();
  const [selectedTransaction, setSelectedTransaction] = useState();

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);

  async function getBlockDetails() {
    if (blockNumber) {
      const block = await alchemy.core.getBlockWithTransactions(blockNumber);
      setBlockDetails(block);
    }
  }

  async function getTransactionDetails(txHash) {
    const transaction = await alchemy.core.getTransactionReceipt(txHash);
    setSelectedTransaction(transaction);
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>Ethereum Block Explorer</h1>
      </div>
      <div className="Button-container">
        <button className="Button" onClick={getBlockDetails}>Fetch Block Details</button>
      </div>
      {blockDetails && (
        <div className="BlockInfo">
          <h2>Block Number: {blockNumber}</h2>
          <h3>Block Hash: {blockDetails.hash}</h3>
          <h3>Block Timestamp: {new Date(blockDetails.timestamp * 1000).toLocaleString()}</h3>
          <h3>Number of Transactions: {blockDetails.transactions.length}</h3>
          <h3>Transactions:</h3>
          <ul className="Transaction-list">
            {blockDetails.transactions.map((txHash, index) => (
              <li key={index}>
                <button className="Transaction-list-item" onClick={() => getTransactionDetails(txHash)}>
                  Transaction {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedTransaction && (
        <div className="TransactionDetails">
          <h2>Transaction Details</h2>
          <p>Transaction Hash: {selectedTransaction.hash}</p>
          <p>Block Number: {selectedTransaction.blockNumber}</p>
          <p>Gas Used: {selectedTransaction.gasUsed}</p>
          <p>Status: {selectedTransaction.status ? 'Successful' : 'Failed'}</p>
          {/* Add more transaction details here */}
        </div>
      )}
    </div>
  );
}

export default App;
