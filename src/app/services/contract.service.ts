import { Inject, Injectable } from '@angular/core';
import { Settings } from "src/app/app-setting";
import Web3 from "web3";
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { BigNumber, ethers } from 'ethers';


@Injectable({
  providedIn: 'root'
})
export class ContractService {
  public provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
  public signer: ethers.Signer;
  public account: any = null;
  public web3: any;
  public gasPrice: string = "50";
  public contract: any;
  public abi: any;
  public contractAddress: any;
  accountChange: Subject<string> = new Subject<string>();

  constructor(@Inject('Window') private window: any,
    private router: Router) {
    this.initialize();
    this.getWeb3();
    this.initializeWeb3();

    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      const rpcUrls = "https://polygon-rpc.com";
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrls);
    }

    if ((this.web3 != undefined && this.web3 != null) && (this.account == undefined || this.account == null)) {
      this.getAddress();
    }
  }

  async initialize(): Promise<void> {
    // Load the contract ABI and address from your settings
    this.abi = Settings.abi;
    this.contractAddress = Settings.contractAddress;

    // Initialize ethers.js provider, signer, and contract
    this.provider = new ethers.providers.Web3Provider((window as any).ethereum);
    this.signer = this.provider.getSigner();
    this.contract = new ethers.Contract(this.contractAddress, this.abi, this.signer);

    if ((this.web3 != undefined && this.web3 != null) && (this.account == undefined || this.account == null)) {
      await this.getAddress();
    }
  }

  public getWeb3 = async () => {
    if (this.web3 == undefined || this.web3 == null) {
      if (this.window.ethereum) {
        await this.initializeWeb3();
        var that = this;
        this.window.ethereum.on('accountsChanged', function (accounts: any) {
          that.account = accounts[0];

          that.accountChange.next(that.account);
          that.fetchAddressBalance();
        });
        this.window.ethereum.on('networkChanged', async function (networkId: any) {

          console.log('networkChanged', networkId);
          await that.initializeWeb3();
        });
        return this.web3;
      }
      else {
        Swal.fire("Non-Dapp browser detected!", "Try Metamask or Trustwallet.");

        this.web3 = await new Web3(new Web3.providers.HttpProvider(Settings.mainnetHttpProvider));
        return this.web3;
      }
    }
    return this.web3;
  }

  public async initializeWeb3() {
    if ((this.window.ethereum.networkVersion == 137 && !Settings.IsTestNetworkSupported)
      ||
      (this.window.ethereum.networkVersion == 80001 && Settings.IsTestNetworkSupported)) {
      //this.web3 = await new Web3(this.window.ethereum);
      this.web3 = await new Web3(new Web3.providers.HttpProvider(Settings.mainnetHttpProvider));//'https://polygon-rpc.com'
      //alert(this.web3);
    }
    else {
      if (!Settings.IsTestNetworkSupported) {
        this.addPolygonMainNetwork();
      }
      else {
        this.addPolygonTestnetNetwork();
      }
      //this.web3 = await new Web3(this.window.ethereum);
      this.web3 = await new Web3(new Web3.providers.HttpProvider(Settings.mainnetHttpProvider));

      //Swal.fire("Change to Polygon network!");
      //this.web3 = undefined;
    }
    //console.log(this.web3)
  }

  async addPolygonTestnetNetwork() {
    try {
      await this.window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await this.window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x13881',
              chainName: "POLYGON Mumbai",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: ["https://speedy-nodes-nyc.moralis.io/cebf590f4bcd4f12d78ee1d4/polygon/mumbai"],
              blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com/"],
              iconUrls: [""],

            }],
          });
        } catch (addError) {
          console.log('Did not add network');
        }
      }
    }
  }

  async addPolygonMainNetwork() {
    try {
      await this.window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await this.window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: "Polygon",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: ["https://rpc-mainnet.matic.quiknode.pro/"],
              blockExplorerUrls: ["https://polygonscan.com/"],
              iconUrls: [""],

            }],
          });
        } catch (addError) {
          console.log('Did not add network');
        }
      }
    }
  }

  public async getContract() {
    if (this.contract == undefined || this.contract == null) {
      this.contract = await new (await this.getWeb3()).eth.Contract(Settings.abi, Settings.contractAddress);
      return this.contract;
    }
    return this.contract;
  }

  public getAddress = async () => {

    if (this.account == null || this.account == undefined || this.account == '') {
      let addresses = null;
      try {
        addresses = await this.window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      catch (exception) {
        try {
          addresses = await this.window.ethereum.enable();
        }
        catch (innerEx) {
          console.log(innerEx);
        }
        console.log(exception);
      }

      if (addresses != null && addresses != undefined && addresses.length > 0) {
        this.account = addresses.length ? addresses[0] : null;
        return this.account;
      }

      return undefined;
    }
    return this.account;
  }

  public async signMessage(message: string): Promise<string> {
    const msg = ` ${message}`;
    console.log(msg);
    const signedMessage = await this.signer.signMessage(msg);
    return signedMessage;
  }

  public async login(ethAddress: string): Promise<any> {
    if (/^[0-9]+$/.test(ethAddress)) {
      const res = await this.getAddressById(ethAddress);
      if (res.success) {
        ethAddress = res.data;
      } else {
        return res;
      }
    }

    try {
      if (ethers.utils.isAddress(ethAddress)) {
        const exists = await this.contract.doesUserExist(ethAddress);
        if (exists) {
          return { success: exists, message: 'Ok', data: ethAddress };
        }
        return { success: exists, message: 'Invalid Address!', data: '' };
      } else {
        return { success: false, message: 'Invalid address format!', data: '' };
      }
    } catch (ex: any) {
      return { success: false, message: ex.message, data: '' };
    }
  }

  public async getAddressById(ethAddress: string): Promise<any> {
    try {
      const result = await this.contract.map_Users(ethAddress);
      if (result.Address !== '0x0000000000000000000000000000000000000000') {
        return { success: true, message: 'Ok', data: result.Address };
      } else {
        return { success: false, message: 'Invalid Id!', data: '' };
      }
    } catch (error) {
      return { success: false, message: 'Invalid Id!', data: '' };
    }
  }

  public async register(sponsorId: string, amount: number): Promise<any> {
    debugger;
    try {
      await this.getGasPrice();

      let value = ethers.utils.parseEther(amount.toString()).toString();
      let gasPrice = ethers.utils.parseUnits(this.gasPrice, "gwei").mul(2).toString();

      if (!ethers.utils.isAddress(sponsorId)) {
        return { success: false, message: "Invalid sponsorId. Must be a valid Ethereum/Polygon address." };
      }

      const USDTValue = ethers.utils.parseUnits(amount.toString(), 6);

      const [approveResponse, usdtTransferReceipt] = await Promise.all([
        this.approveToken(USDTValue),
        this.sendUSDTToPolygonContract(USDTValue)
      ]);

      if (!approveResponse.success) {
        return { success: false, message: "USDT approval failed: " + approveResponse.message };
      }
      if (!usdtTransferReceipt.success) {
        return { success: false, message: "USDT transfer failed: " + usdtTransferReceipt.message };
      }

      const estimatedGas = await this.contract.estimateGas.multiSendTokens([sponsorId], [USDTValue]);
      const manualGasLimit = estimatedGas.mul(1.2);

      const gasFeeInMATIC = estimatedGas.mul(gasPrice);
      const maticBalance = await this.provider.getBalance(this.account);
      if (maticBalance.lt(gasFeeInMATIC)) {
        return { success: false, message: "Insufficient MATIC balance for gas fees." };
      }

      const tx = await this.contract.multiSendTokens([sponsorId], [USDTValue.toString()], {
        value: "0",
        gasPrice,
        gasLimit: manualGasLimit.toString(),
      });

      const receipt = await tx.wait();
      return { success: receipt.status === 1, data: receipt, message: "Transaction successful" };
    } catch (error: any) {
      return { success: false, data: "", message: error.message || "Transaction failed!" };
    }
  }

  public async sendUSDTToPolygonContract(amount: BigNumber) {
    try {
      let contract = await this.getPaymentTokenContract();

      let _gasPrice = await (await this.getWeb3()).eth.getGasPrice();

      let estimatedGas = await contract.methods.transfer(Settings.contractAddress, amount.toString()).estimateGas({
        from: this.account,
        gasPrice: _gasPrice,
      });

      estimatedGas = Math.ceil(Number(estimatedGas) * 0.1); // 10% buffer

      let data = contract.methods.transfer(Settings.contractAddress, amount.toString()).encodeABI();

      var receipt = await this.sendTransaction(this.account, Settings.tokenContractAddress, "0", _gasPrice, estimatedGas, data);
      console.log(receipt);
      return { success: receipt.success, data: receipt.data, message: receipt.success ? "USDT sent successfully on Polygon!" : receipt.message };
    } catch (err: any) {
      return { success: false, data: err, message: 'Unable to send USDT to Polygon contract!' };
    }
  }


  public async sendTransaction(fromAddress: string, toAddress: string, value: string, gasPrice: string, gas: string, data: any) {
    try {
      var _gas = Math.ceil(Number(gas) + (Number(gas) * 0.1));
      gas = _gas.toString();

      var _gasPrice = Math.ceil(Number(gasPrice) + (Number(gasPrice) * 0.1));
      gasPrice = _gasPrice.toString();

      var _web3: any = await new Web3(this.window.ethereum);

      const estimatedGas = await _web3.eth.estimateGas({
        from: fromAddress,
        to: toAddress,
        value: value,
        gasPrice: gasPrice,
        data: data
      });

      let receipt = await _web3.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        value: value,
        gasPrice: gasPrice,
        gas: estimatedGas.toString(),
        data: data
      });

      return { success: receipt.status, data: receipt, message: 'Transaction successful' };

    } catch (ex: any) {
      console.error(ex);
      return { success: false, data: '', message: ex.message || 'Some error occurred!' };
    }
  }


  public async getMemberId(userAddress: string) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods.map_UserIds(userAddress).call((error: any, result: any) => {
      if (!error) {
        if (result > 0) {
          res = { success: true, message: "Ok!", data: result };
        }
        else {
          res = { success: false, message: "Invalid User Address!", data: '' };
        }
      }
      else {
        res = { success: false, message: "Invalid User Address!", data: '' };
      }
    });
    return res;
  }

  public async getUserDashboardInfo(memberId: number) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods.getUserInfo(memberId).call((error: any, result: any) => {
      if (!error) {
        //console.log(result)
        res = { success: true, message: "Ok!", data: result };
      }
      else {
        res = { success: false, message: "Invalid User!", data: '' };
      }
    });
    return res;
  }

  public async getUserDirectsInfo(memberId: any, pageNo: number, pageSize: number) {

    let res = { success: false, message: '', data: '', pageNation: { IsPaginated: false, pageSize: 20, pageNo: pageNo, pageCount: 0, hasNextPage: false } };

    // try {
    //   await (await this.getContract()).methods.getDirects(memberId).call((error: any, result: any) => {
    //     if (!error) {
    //       res = { success: true, message: "Ok!", data: result, pageNation: { IsPaginated: false, pageSize: 20, pageNo: pageNo } };
    //     }
    //     else {
    //       res = { success: false, message: "Invalid User!", data: '', pageNation: { IsPaginated: false, pageSize: 20, pageNo: pageNo }  };
    //     }
    //   });
    // }
    // catch (e) {
    // console.log("Got an error")
    let info_res: any = await this.getUserDashboardInfo(memberId);

    let directIds = info_res.data["UserInfo"]["DirectIds"]

    directIds = directIds.slice().reverse();

    // console.log(info_res)
    // console.log(directIds)

    if (directIds.length <= 20) {
      await (await this.getContract()).methods.getDirects(memberId).call((error: any, result: any) => {
        if (!error) {
          result = result.slice().reverse();
          res = { success: true, message: "Ok!", data: result, pageNation: { IsPaginated: false, pageSize: 20, pageNo: pageNo, pageCount: 1, hasNextPage: false } };
        }
        else {
          res = { success: false, message: "Invalid User!", data: '', pageNation: { IsPaginated: false, pageSize: 20, pageNo: pageNo, pageCount: 0, hasNextPage: false } };
        }
      });
    }
    else {
      let result: any = []
      // ;
      let maxI = pageNo * pageSize <= directIds.length ? pageNo * pageSize : directIds.length

      let hasNextPage = maxI != directIds.length;

      let IsPaginated = !(pageNo == 1 && maxI == directIds.length)
      let pageCount = Math.ceil(directIds.length / pageSize);

      for (let i = (pageNo - 1) * pageSize; i < maxI; i++) {
        let directInfo: any = await this.getUserDashboardInfo(directIds[i]);
        result.push(directInfo.data)

        // if ((i + 1) % 20 == 0) {
        //   await this.delay(1)
        // }
      }
      res = { success: true, message: "Ok!", data: result, pageNation: { IsPaginated: IsPaginated, pageSize: 20, pageNo: pageNo, pageCount: pageCount, hasNextPage: hasNextPage } };
    }
    // }
    return res;
  }

  public async delay(ms: any) {
    new Promise(res => setTimeout(res, ms));
  }

  public async getUserRanks(memberId: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods.getUserRanks(memberId).call((error: any, result: any) => {
      if (!error) {
        res = { success: true, message: "Ok!", data: result };
      }
      else {
        res = { success: false, message: "Invalid User!", data: '' };
      }
    });
    return res;
  }

  public async buyToken(amount: number) {
    try {
      await this.getGasPrice();

      const value = this.web3.utils.toWei(amount.toString(), "ether");
      const _gasPrice = this.web3.utils.toWei(this.gasPrice, "Gwei");

      const sendXPRReceipt = await this.sendUSDTToPolygonContract(value);
      if (!sendXPRReceipt.success) {
        return { success: false, data: '' };
      }

      const estimatedGas = await this.contract.estimateGas.Reinvest({ from: this.account, value: '0', gasPrice: _gasPrice });
      const data = this.contract.interface.encodeFunctionData('Reinvest', []);

      const receipt = await this.sendTransaction(this.account, this.contractAddress, '0', _gasPrice, estimatedGas, data);

      return { success: receipt.success, data: receipt.data, message: receipt.success ? "Ok!" : receipt.message };
    } catch (ex: any) {
      return { success: false, data: '', message: 'Some error occurred!' };
    }
  }

  private async getGasPrice() {
    try {
      await (await this.getWeb3()).eth.getGasPrice()
        .then((gPrice: any) => {
          this.gasPrice = this.web3.utils.fromWei(gPrice, "Gwei");
        });
    }
    catch (ex) {
      console.log(ex);
    }
  }

  public async sellToken(amount: number) {
    try {
      var isRegistered = await this.login((await this.getAddress()));

      if (isRegistered.success) {
        await this.getGasPrice();

        let value = "0";
        let _gasPrice = this.web3.utils.toWei(this.gasPrice, "Gwei");
        let estimatedGas = "0";

        await this.contract.methods.withdrawHolding(amount).estimateGas({
          from: this.account,
          value: value,
          gasPrice: _gasPrice
        }, function (error: any, _estimatedGas: any) {
          //console.log(error, _estimatedGas);
          estimatedGas = _estimatedGas;
        });

        let data = this.contract.methods.withdrawHolding(amount).encodeABI();
        var receipt = await this.sendTransaction(this.account, this.contractAddress, value, _gasPrice, estimatedGas, data);
        return { success: receipt.success, data: receipt.data, message: receipt.success ? "Ok!" : receipt.message };

      }
      else {
        return { success: false, data: '', message: 'You are not registered!' };
      }
    }
    catch (ex: any) {
      console.log(ex);

      return { success: false, data: '', message: ex.toString() };
    }
  }

  public async getCoinPriceForMember(memberId: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods.getCoinRate(memberId).call((error: any, result: any) => {
      if (!error) {
        res = { success: true, message: "Ok!", data: result };
      }
      else {
        res = { success: false, message: "Invalid User!", data: '' };
      }
    });
    return res;
  }

  public async getCoinBuyPrice() {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods.coinRate().call((error: any, result: any) => {
      if (!error) {
        res = { success: true, message: "Ok!", data: result };
      }
      else {
        res = { success: false, message: "Invalid User!", data: '' };
      }
    });
    return res;
  }

  public async getTokenBalance(address: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods.balanceOf(address).call((error: any, result: any) => {
      if (!error) {
        res = { success: true, message: "Ok!", data: result };
      }
      else {
        res = { success: false, message: "Invalid User!", data: '' };
      }
    });
    return res;
  }

  public async fetchAddressBalance() {
    let accountBalance = await (await this.getWeb3()).eth.getBalance((await this.getAddress()));
    return this.web3.utils.fromWei(accountBalance, "ether");

  }

  public async fetchUSDTBalance() {
    try {
      const walletAddress = await this.getAddress();
      const web3 = await this.getWeb3();
      const contract = new web3.eth.Contract(Settings.USDTAbi, Settings.tokenContractAddress);
      const balance = await contract.methods.balanceOf(walletAddress).call();
      const balanceInUSDT = web3.utils.fromWei(balance, "mwei");
      console.log(`USDT Balance for ${walletAddress}: ${balanceInUSDT}`);
      return balanceInUSDT;
    } catch (error) { }
  }

  public async getMemberBalanceDividend(memberId: number) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods.getUserBalanceDividend(memberId).call((error: any, result: any) => {
      if (!error) {
        res = { success: true, message: "Ok!", data: result };
      }
      else {
        res = { success: false, message: "Invalid User!", data: '' };
      }
    });
    return res;
  }

  public async withdrawDividend(amount: number) {

    try {
      var isRegistered = await this.login((await this.getAddress()));

      if (isRegistered.success) {
        await this.getGasPrice();

        let value = "0";
        let _gasPrice = this.web3.utils.toWei(this.gasPrice, "Gwei");
        let estimatedGas = "0";
        let withdrawAmount = this.web3.utils.toWei(amount.toString(), "Ether");

        await this.contract.methods.withdrawDividend(withdrawAmount).estimateGas({
          from: this.account,
          value: value,
          gasPrice: _gasPrice
        }, function (error: any, _estimatedGas: any) {
          //console.log(error, _estimatedGas);
          let x = parseInt(_estimatedGas) + parseInt(_estimatedGas) * 0.1;
          estimatedGas = x.toString();
        });

        let data = this.contract.methods.withdrawDividend(withdrawAmount).encodeABI();
        var receipt = await this.sendTransaction(this.account, this.contractAddress, value, _gasPrice, estimatedGas, data);
        return { success: receipt.success, data: receipt.data, message: receipt.success ? "Ok!" : receipt.message };

      }
      else {
        return { success: false, data: '', message: 'You are not registered!' };
      }
    }
    catch (ex: any) {
      console.log(ex);

      return { success: false, data: '', message: 'Some error occurred!' };
    }
  }

  public async getLevelIncomeInfo(memberId: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods.getMemberLevelDividend(memberId).call((error: any, result: any) => {
      if (!error) {
        res = { success: true, message: "Ok!", data: result };
      }
      else {
        res = { success: false, message: "Invalid User!", data: '' };
      }
    });
    return res;
  }

  public async getROIIncomeRecords(memberId: any, limit: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods.getMemberROIDividendInfo(memberId, limit).call((error: any, result: any) => {
      if (!error) {
        res = { success: true, message: "Ok!", data: result };
      }
      else {
        res = { success: false, message: "Invalid User!", data: '' };
      }
    });
    return res;
  }

  public async archiveROI(memberId: any, endId: any) {
    let res = { success: false, message: '', data: '' };

    try {
      await this.getGasPrice();


      let value = "0";
      let _gasPrice = this.web3.utils.toWei(this.gasPrice, "Gwei");
      let estimatedGas = "0";

      await this.contract.methods.archiveROI(memberId, endId).estimateGas({
        from: this.account,
        value: value,
        gasPrice: _gasPrice
      }, function (error: any, _estimatedGas: any) {
        //console.log(error, _estimatedGas);
        estimatedGas = _estimatedGas;
      });

      let data = this.contract.methods.archiveROI(memberId, endId).encodeABI();
      var receipt = await this.sendTransaction(this.account, this.contractAddress, value, _gasPrice, estimatedGas, data);
      res = { success: receipt.success, data: receipt.data, message: receipt.success ? "Ok!" : receipt.message };
    }
    catch (ex: any) {
      console.log(ex);
      res = { success: false, message: ex, data: '' };
    }
    finally {
      return res;
    }
  }

  public async getUserTransactionHistory(memberId: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods.getUserTransactions(memberId).call((error: any, result: any) => {
      if (!error) {
        res = { success: true, message: "Ok!", data: result };
      }
      else {
        res = { success: false, message: "Invalid User!", data: '' };
      }
    });
    return res;
  }

  public async getCoinRateHistory(days: number, cnt: number) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods.getRateHistory(days, cnt).call((error: any, result: any) => {
      if (!error) {
        res = { success: true, message: "Ok!", data: result };
      }
      else {
        res = { success: false, message: "Invalid User!", data: '' };
      }
    });
    return res;
  }

  public async getPaymentTokenContract() {
    let contract = await new (await this.getWeb3()).eth.Contract(Settings.USDTAbi, Settings.tokenContractAddress);
    return contract;
  }

  async approveToken(amount: BigNumber) {
    try {
      let contract = await this.getPaymentTokenContract();

      await this.getGasPrice();

      let value = "0";
      let _gasPrice = (await this.getWeb3()).utils.toWei(this.gasPrice, "Gwei");
      let estimatedGas = "0";

      await contract.methods.approve(Settings.tokenContractAddress, amount.toString()).estimateGas({
        from: this.account,
        value: "0",
        gasPrice: _gasPrice
      }, function (error: any, _estimatedGas: any) {
        estimatedGas = _estimatedGas;
      });

      let data = contract.methods.approve(Settings.tokenContractAddress, amount.toString()).encodeABI();
      var receipt = await this.sendTransaction(this.account, Settings.tokenContractAddress, value, _gasPrice, estimatedGas, data);
      console.log(receipt);
      return { success: receipt.success, data: receipt.data, message: receipt.success ? "Ok!" : receipt.message };
    } catch (err: any) {
      return { success: false, data: err, message: "Unable to approve " + Settings.paymentToken + "!" + err };
    }
  }
}