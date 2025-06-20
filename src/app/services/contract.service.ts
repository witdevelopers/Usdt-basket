import { Inject, Injectable } from '@angular/core';
import { Settings } from "src/app/app-setting";
import Web3 from "web3";
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { BigNumber, ethers } from 'ethers';
import { FundService } from '../user/services/fund.service';
import { LoaderService } from './loader.service';


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
    private fundapi: FundService,
    private loader: LoaderService,
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

  public async getWeb3() {
    if (!this.web3) {
      if (this.window.ethereum) {
        await this.initializeWeb3();

        const accounts = await this.window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          this.account = accounts[0];
          this.accountChange.next(this.account);
          await this.fetchAddressBalance();
        }

        // Ensure event listeners are only added once
        if (typeof this.window.ethereum.on === 'function') {
          this.window.ethereum.on('accountsChanged', async (accounts: string[]) => {
            if (accounts.length > 0) {
              this.account = accounts[0];
              this.accountChange.next(this.account);
              await this.fetchAddressBalance();
              await this.initializeWeb3(); // Reinitialize Web3 after wallet change
            } else {
              console.log("No accounts connected");
            }
          });

          this.window.ethereum.on('chainChanged', async (chainId: string) => {
            console.log('Network changed:', chainId);
            await this.initializeWeb3(); // Reinitialize Web3 after network change
          });
        }

        return this.web3;
      } else {
        Swal.fire("Non-Dapp browser detected!", "Try Metamask or Trustwallet.");
        this.web3 = new Web3(new Web3.providers.HttpProvider(Settings.mainnetHttpProvider));
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
      this.web3 = await new Web3(new Web3.providers.HttpProvider(Settings.mainnetHttpProvider));
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

  public async getAddress(): Promise<any> {
    try {
      if (!this.window.ethereum) throw new Error("Ethereum wallet is not installed!");

      const accounts = await this.window.ethereum.request({ method: "eth_requestAccounts" });

      if (accounts.length > 0) {
        this.account = accounts[0];
        return this.account;
      } else {
        throw new Error("No accounts found!");
      }
    } catch (error) {
      console.error("Error getting address:", error);
      return null;
    }
  }

  public async signMessage(message: string): Promise<string> {
    try {
      const msg = ` ${message}`;
      const account = await this.signer.getAddress();
      const hexMessage = "0x" + Buffer.from(msg, "utf8").toString("hex");

      if (!this.signer.provider) {
        throw new Error("No provider found!");
      }

      return await (this.signer.provider as any).send("personal_sign", [hexMessage, account]);

    } catch (error) {
      throw new Error("Failed to sign message! " + error.message);
    }
  }


  public async login(ethAddress: string): Promise<any> {
    this.loader.show();
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

    try {
      await this.getGasPrice();

      let gasPrice = ethers.utils.parseUnits(this.gasPrice, "gwei").mul(4).toString();

      if (!ethers.utils.isAddress(sponsorId)) {
        return { success: false, message: " Invalid sponsorId. Must be a valid  address." };
      }

      const USDTValue = ethers.utils.parseUnits(amount.toString(), 6);

      const approverecipt = await this.approveToken(USDTValue);
      if (!approverecipt.success) {
        return { success: false, message: "Approve Failed." };
      }

      let receipt = await this.sendUSDT(USDTValue, sponsorId);
      if (!receipt.success) {
        return { success: false, message: "Transaction failed!" };
      }

      return receipt;

    } catch (error: any) {
      return { success: false, data: "", message: error.message || "Transaction failed!" };
    }
  }

  public async sendUSDT(amount: BigNumber, sponsorId: string) {
  try {
    const contract = await this.getPaymentTokenContractmm();
    const _gasPrice = await (await this.getWeb3()).eth.getGasPrice();

    const sponsorIncomeRes = await this.fundapi.CheckSponsorIncome(sponsorId);

    if (!sponsorIncomeRes?.status || !sponsorIncomeRes.data?.table?.length) {
      return {
        success: false,
        message: 'Invalid sponsor income response',
        data: sponsorIncomeRes
      };
    }

    const tableData = sponsorIncomeRes.data.table;

    // Dynamic recipients and amounts
    const recipients: string[] = [];
    const amounts: string[] = [];

    for (const entry of tableData) {
      if (entry.leveladddress && entry.finalamount) {
        recipients.push(entry.leveladddress);
        // Convert amount to smallest unit (USDT typically has 6 decimals)
        const parsedAmount = ethers.utils.parseUnits(entry.finalamount.toString(), 6).toString();
        amounts.push(parsedAmount);
      }
    }

    // Safety check
    if (recipients.length === 0 || amounts.length === 0) {
      return {
        success: false,
        message: 'No valid recipient or amount found in sponsor data.',
        data: sponsorIncomeRes
      };
    }

    const estimatedGas = await contract.methods.multiSendTokens(recipients, amounts).estimateGas({
      from: this.account,
      gasPrice: _gasPrice,
    });

    const finalGas = Math.ceil(Number(estimatedGas) * 2);

    const data = contract.methods.multiSendTokens(recipients, amounts).encodeABI();

    const receipt = await this.sendTransaction(
      this.account,
      "0xb7Dc67427ff899b54B0E48405a0Dc4Fdd9335d93", 
      "0",
      _gasPrice,
      finalGas.toString(),
      data
    );

    return {
      success: receipt.success,
      data: receipt.data,
      message: receipt.success ? "USDT sent successfully" : receipt.message
    };

  } catch (err: any) {
    return {
      success: false,
      data: err,
      message: 'Transaction Failed'
    };
  }
}


  public async sendTransaction(fromAddress: string, toAddress: string, value: string, gasPrice: string, gas: string, data: any) {
    try {
      this.loader.show();

      var _gas = Math.ceil(Number(gas) + Number(gas) * 8);
      gas = _gas.toString();

      var _gasPrice = Math.ceil(Number(gasPrice) + Number(gasPrice) * 8);
      gasPrice = _gasPrice.toString();

      var _web3: any = await new Web3((window as any).ethereum); // Ensure window is casted

      const estimatedGas = await _web3.eth.estimateGas({
        from: fromAddress,
        to: toAddress,
        gasPrice: gasPrice,
        data: data
      });

      //const customGasLimit = estimatedGas + 50000;

      let receipt = await _web3.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        gasPrice: gasPrice,
        gas: estimatedGas.toString(),
        data: data
      });


      return {
        success: receipt.status,
        data: receipt,
        message: '✅ Transaction successful!'
      };

    } catch (ex: any) {
      console.error('Transaction Error:', ex);
      return {
        success: false,
        data: '',
        message: ex.message || 'Transaction failed!'
      };
    } finally {
      this.loader.hide(); // 🔥 Hide Spinner after transaction completes
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
    await this.getGasPrice();
    let gasPrice = ethers.utils.parseUnits(this.gasPrice, "gwei").mul(4).toString();
    const USDTValue = ethers.utils.parseUnits(amount.toString(), 6);
    await this.approveToken(USDTValue);
    let receipt = await this.UpgradeRank(USDTValue);
    return receipt;
  }

  public async UpgradeRank(amount: BigNumber) {
    let contract = await this.getPaymentTokenContractmm();
    let web3 = await this.getWeb3();
    let _gasPrice = await web3.eth.getGasPrice();
    let doubledGasPrice = BigInt(_gasPrice) * BigInt(4);

    const recipients = ['0x96e6981d848fD97606705b3137Ab9401ECD8CB9B'];
    const amounts = [amount.toString()];

    let estimatedGas = await contract.methods.multiSendTokens(recipients, amounts).estimateGas({
      from: this.account,
      gasPrice: doubledGasPrice.toString(),
    });

    estimatedGas = Math.ceil(Number(estimatedGas) * 4);
    let data = contract.methods.multiSendTokens(recipients, amounts).encodeABI();

    var receipt = await this.sendTransaction(
      this.account,
      "0xb7Dc67427ff899b54B0E48405a0Dc4Fdd9335d93",
      "0",
      doubledGasPrice.toString(),
      estimatedGas.toString(),
      data
    );

    return {
      success: receipt.success,
      data: receipt.data,
      message: receipt.success ? "USDT sent successfully" : receipt.message
    };
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

  // public async getCoinPriceForMember(memberId: any) {
  //   let res = { success: false, message: '', data: '' };

  //   await (await this.getContract()).methods.getCoinRate(memberId).call((error: any, result: any) => {
  //     if (!error) {
  //       res = { success: true, message: "Ok!", data: result };
  //     }
  //     else {
  //       res = { success: false, message: "Invalid User!", data: '' };
  //     }
  //   });
  //   return res;
  // }

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
  public async getPaymentTokenContractmm() {

    const contractAbi = Settings.abi;

    // Contract address (the deployed contract address)
    const contractAddress = "0xb7Dc67427ff899b54B0E48405a0Dc4Fdd9335d93";


    let contract = await new (await this.getWeb3()).eth.Contract(contractAbi, contractAddress);
    return contract;
  }

  public async getPaymentTokenContract() {

    const tokenAbi = Settings.USDTAbi;

    let contract = await new (await this.getWeb3()).eth.Contract(tokenAbi, "0xc2132D05D31c914a87C6611C10748AEb04B58e8F");
    return contract;
  }

  async approveToken(amount: BigNumber) {
    try {
      let contract = await this.getPaymentTokenContract();
      await this.getGasPrice();
      let value = "0";
      let _gasPrice = (await this.getWeb3()).utils.toWei(this.gasPrice, "Gwei");
      let estimatedGas = await contract.methods
        .approve("0xb7Dc67427ff899b54B0E48405a0Dc4Fdd9335d93", amount.toString())
        .estimateGas({
          from: this.account,
          value: "0",
          gasPrice: _gasPrice
        });
      let data = contract.methods
        .approve("0xb7Dc67427ff899b54B0E48405a0Dc4Fdd9335d93", amount.toString())
        .encodeABI();

      var receipt = await this.sendTransaction(
        this.account,
        Settings.tokenContractAddress,
        value,
        _gasPrice,
        estimatedGas.toString(),
        data
      );
      console.log("Transaction Receipt:", receipt);
      return { success: receipt.success, data: receipt.data, message: receipt.success ? "Approval Successful!" : receipt.message };
    } catch (err: any) {
      return { success: false, data: err, message: `Unable to approve ${Settings.paymentToken}! ${err.message || err}` };
    }
  }
}