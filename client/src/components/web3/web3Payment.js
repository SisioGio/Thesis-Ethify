import { useEffect, useState, React } from "react";

import * as Utils from "web3-utils";
import ConnectWallet from "./connectButton";
import contract from "./contract.json";
import axios from "axios";
import apiService from "../../services/apiService";
import LoadingScreen from "../loadingScreen";

const ethers = require("ethers");

const contractAddress = "0x3F4d84a7F5C9f282CEd2C45265F815e4d5484596";

function Web3Payment({ getSum, invoices, getPurchaseInvoices }) {
  const [account, setCurrentAccount] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const getEtherExchangeRate = async () => {
    console.log("Retrieving exchange rate for eth");
    const res = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR"
    );

    return res.data.EUR;
  };
  const executePayment = async () => {
    try {
      console.log("TEST");
      // Initialize ethereum provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Authenticate connected user
      const signer = provider.getSigner();
      // Deinfe contract
      const smartContract = new ethers.Contract(
        contractAddress,
        contract,
        signer
      );
      // Define exchange rate EUR/ETH
      const exchangeRate = await getEtherExchangeRate();
      const amountToPayEUR = getSum();
      var amountToPayETH = amountToPayEUR / exchangeRate;

      setProcessing(true);

      amountToPayETH = 0.0001;
      // TEST ARGUMENTS
      const exampleArgs = [
        {
          wallet: "0xa1957172504f85A086C15401e7c1c2D44f8c9de9",
          amount: ethers.utils.parseEther(amountToPayETH.toString()),
        },
      ];
      // Call smart contract function
      let transaction = await smartContract.sendPayments(exampleArgs, {
        value: ethers.utils.parseEther(amountToPayETH.toString()),
      });
      // Wait for response
      await transaction.wait();
      setFeedback(`Congrats! The payment has been completed`);
      setProcessing(false);
      setSuccess(true);

      setTransactionHash(transaction["hash"]);
      // Save payment data to database
      const transactionHash = transaction["hash"];
      var formData = {
        transactionHash: transactionHash,
        transactionAmount: getSum(),
        invoices: invoices,
      };
      await apiService.savePaymentDetails(formData);
      getPurchaseInvoices();
    } catch (err) {
      setSuccess(false);
      setFeedback("Something went wrong...");
      setProcessing(false);
    }
  };

  return (
    <div className=" d-flex justify-content-between">
      {processing && <LoadingScreen />}

      <div className="d-flex flex-column">
        <ConnectWallet
          invoices={invoices}
          setCurrentAccount={setCurrentAccount}
          executePayment={executePayment}
        />
        <small className={success ? "text-success" : "text-danger"}>
          {feedback ?? feedback}
        </small>
      </div>
    </div>
  );
}
export default Web3Payment;
