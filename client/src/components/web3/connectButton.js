import { useEffect, useState, React } from "react";

function ConnectWallet(props) {
  const [isConnected, setIsConnected] = useState(false);
  const setWalletAccount = (currentAccount) => {
    props.setCurrentAccount(currentAccount);
  };

  const checkWalletIsConnected = async () => {
    if (!window.ethereum) {
      console.log("Make sure you have Metamask installed!");
    } else {
      console.log("Wallet exists! We're ready!");
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account :", account);
      setIsConnected(true);
      setWalletAccount(account);
    } else {
      setIsConnected(false);
      console.log("No authorized account");
    }
  };
  const connectWalletHandler = async () => {
    // Check if Metamask extension is installed
    if (!window.ethereum) {
      alert("Please install Metamask!");
    }
    try {
      // Get first available Metamask account
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setWalletAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        checkWalletIsConnected();
      });
      window.ethereum.on("accountsChanged", () => {
        checkWalletIsConnected();
      });
    }
  }, []);

  return (
    <button
      id="metamask-button"
      // disabled={!props.invoices.length > 0}

      onClick={isConnected ? props.executePayment : connectWalletHandler}
      className={
        isConnected
          ? "btn btn-success wallet-connected"
          : "btn btn-info pulsing wallet-disconnected"
      }
    >
      {isConnected ? "Proceed with ETH payment" : "Connect to Metamask"}
    </button>
  );
}
export default ConnectWallet;
