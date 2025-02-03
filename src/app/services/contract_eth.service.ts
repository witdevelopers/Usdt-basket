import { Inject, Injectable } from '@angular/core';
import { Settings } from 'src/app/app-setting';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ContractService1 {
  public account: any = null;
  public web3: any;
  public gasPrice: string = '50';
  public contract: any;
  public abi: any;
  public contractAddress: any;
  accountChange: Subject<string> = new Subject<string>();

  constructor(
    @Inject('Window') private window: any,
    private router: Router,
  ) {
    this.initialize();
  }

  async initialize() {
    this.abi = Settings.abi;
    this.contractAddress = Settings.contractAddress;
    await this.getContract();

    if (
      this.web3 != undefined &&
      this.web3 != null &&
      (this.account == undefined || this.account == null)
    ) {
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
        this.window.ethereum.on(
          'networkChanged',
          async function (networkId: any) {
            console.log('networkChanged', networkId);
            await that.initializeWeb3();
          },
        );
        return this.web3;
      } else {
        Swal.fire('Non-Dapp browser detected!', 'Try Metamask or Trustwallet.');

        this.web3 = await new Web3(
          new Web3.providers.HttpProvider(Settings.mainnetHttpProvider),
        );
        return this.web3;
      }
    }
    return this.web3;
  };

  private async initializeWeb3() {
    if (
      (this.window.ethereum.networkVersion == 137 &&
        !Settings.IsTestNetworkSupported) ||
      (this.window.ethereum.networkVersion == 80001 &&
        Settings.IsTestNetworkSupported)
    ) {
      //this.web3 = await new Web3(this.window.ethereum);
      this.web3 = await new Web3(
        new Web3.providers.HttpProvider(Settings.mainnetHttpProvider),
      ); //'https://polygon-rpc.com'
      //alert(this.web3);
    } else {
      if (!Settings.IsTestNetworkSupported) {
        this.addPolygonMainNetwork();
      } else {
        this.addPolygonTestnetNetwork();
      }
      //this.web3 = await new Web3(this.window.ethereum);
      this.web3 = await new Web3(
        new Web3.providers.HttpProvider(Settings.mainnetHttpProvider),
      );

      //Swal.fire("Change to Polygon network!");
      //this.web3 = undefined;
    }
    //console.log(this.web3)
  }

  async addPolygonTestnetNetwork() {
    try {
      await this.window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // Hexadecimal version of 80001, prefixed with 0x
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await this.window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881', // Hexadecimal version of 80001, prefixed with 0x
                chainName: 'POLYGON Mumbai',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: [
                  'https://speedy-nodes-nyc.moralis.io/cebf590f4bcd4f12d78ee1d4/polygon/mumbai',
                ],
                blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/'],
                iconUrls: [''],
              },
            ],
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
        params: [{ chainId: '0x89' }], // Hexadecimal version of 80001, prefixed with 0x
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await this.window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x89', // Hexadecimal version of 80001, prefixed with 0x
                chainName: 'Polygon',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-mainnet.matic.quiknode.pro/'], //"https://rpc-mainnet.maticvigil.com/",
                blockExplorerUrls: ['https://polygonscan.com/'],
                iconUrls: [''],
              },
            ],
          });
        } catch (addError) {
          console.log('Did not add network');
        }
      }
    }
  }

  public async getContract() {
    if (this.contract == undefined || this.contract == null) {
      this.contract = await new (await this.getWeb3()).eth.Contract(
        Settings.abi,
        Settings.contractAddress,
      );
      return this.contract;
    }
    return this.contract;
  }

  public getAddress = async () => {
    if (
      this.account == null ||
      this.account == undefined ||
      this.account == ''
    ) {
      let addresses = null;
      try {
        addresses = await this.window.ethereum.request({
          method: 'eth_requestAccounts',
        });
      } catch (exception) {
        try {
          addresses = await this.window.ethereum.enable();
        } catch (innerEx) {
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
  };

  public async signMessage(message) {
    let msg = ` ${message}`;
    console.log(msg);

    const sign = await this.window.ethereum.request({
      method: 'personal_sign',
      params: [msg, this.account, ''],
    });

    return sign;
  }

  public login = async (ethAddress: string) => {
    if (ethAddress.match(/^[0-9]+$/)) {
      var res = await this.getAddressById(ethAddress);
      if (res.success) {
        ethAddress = res.data;
      } else {
        return res;
      }
    }

    try {
      if ((await this.getWeb3()).utils.isAddress(ethAddress)) {
        var exists = await (await this.getContract()).methods
          .doesUserExist(ethAddress)
          .call();
        if (exists) {
          return { success: exists, message: 'Ok', data: ethAddress };
        }
        return { success: exists, message: 'Invalid Address!', data: '' };
      } else {
        return { success: false, message: 'Invalid address format!', data: '' };
      }
    } catch (ex: any) {
      //alert(ex.message);
      return { success: false, message: ex.message, data: '' };
    }
  };

  public async getAddressById(ethAddress: string) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .map_Users(ethAddress)
      .call((error: any, result: any) => {
        if (!error) {
          if (result.Address != '0x0000000000000000000000000000000000000000') {
            ethAddress = result.Address;
            res = { success: true, message: 'Ok', data: ethAddress };
          } else {
            res = { success: false, message: 'Invalid Id!', data: '' };
          }
        } else {
          res = { success: false, message: 'Invalid Id!', data: '' };
        }
      });

    return res;
  }

  public async register(sponsorId: string, amount: number) {
    try {
      await this.getGasPrice();

      let value = (await this.getWeb3()).utils.toWei(
        amount.toString(),
        'ether',
      );
      let _gasPrice = (await this.getWeb3()).utils.toWei(this.gasPrice, 'Gwei');
      let estimatedGas = '0';

      await (await this.getContract()).methods.Deposit(sponsorId).estimateGas(
        {
          from: this.account,
          value: value,
          gasPrice: _gasPrice,
        },
        function (error: any, _estimatedGas: any) {
          //console.log(error, _estimatedGas);
          estimatedGas = _estimatedGas;
        },
      );

      let data = (await this.getContract()).methods
        .Deposit(sponsorId)
        .encodeABI();
      var receipt = await this.sendTransaction(
        this.account,
        this.contractAddress,
        value,
        _gasPrice,
        estimatedGas,
        data,
      );
      return {
        success: receipt.success,
        data: receipt.data,
        message: receipt.success ? 'Ok!' : receipt.message,
      };
    } catch (ex: any) {
      console.log(ex);

      return { success: false, data: '', message: 'Some error occurred!' };
    }
  }

  private async getGasPrice() {
    try {
      await (await this.getWeb3()).eth.getGasPrice().then((gPrice: any) => {
        ///console.log("Gas price: " + this.web3.utils.fromWei(gPrice, "Gwei"));
        this.gasPrice = this.web3.utils.fromWei(gPrice, 'Gwei');
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  private async sendTransaction(
    fromAddress: string,
    toAddress: string,
    value: string,
    gasPrice: string,
    gas: string,
    data: any,
  ) {
    try {
      //console.log(this.window.ethereum);
      //this.window.ethereum.rpc.rpcUrl = "My new URL";

      //alert(JSON.stringify(this.window.ethereum));

      var _gas = Math.ceil(Number(gas) + Number(gas) * 0.1);

      gas = _gas.toString();

      //console.log(gasPrice);
      var _gasPrice = Math.ceil(Number(gasPrice) + Number(gasPrice) * 0.1);

      gasPrice = _gasPrice.toString();

      //console.log("new", gasPrice);

      if (
        this.window.ethereum.networkVersion == 137 ||
        this.window.ethereum.chainId == 137
      ) {
        var _web3: any = await new Web3(this.window.ethereum);

        //console.log(_web3);

        let receipt = await _web3.eth.sendTransaction({
          from: fromAddress,
          to: toAddress,
          value: value,
          gasPrice: gasPrice,
          gas: gas,
          data: data,
        });
        return { success: receipt.status, data: receipt, message: 'Ok' };
      } else {
        return {
          success: false,
          data: '',
          message: 'Please switch to polygon network!',
        };
      }
    } catch (ex: any) {
      console.log(ex);
      return { success: false, data: '', message: ex.message };
    }
  }

  public async getMemberId(userAddress: string) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .map_UserIds(userAddress)
      .call((error: any, result: any) => {
        if (!error) {
          if (result > 0) {
            res = { success: true, message: 'Ok!', data: result };
          } else {
            res = {
              success: false,
              message: 'Invalid User Address!',
              data: '',
            };
          }
        } else {
          res = { success: false, message: 'Invalid User Address!', data: '' };
        }
      });
    return res;
  }

  public async getUserDashboardInfo(memberId: number) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .getUserInfo(memberId)
      .call((error: any, result: any) => {
        if (!error) {
          //console.log(result)
          res = { success: true, message: 'Ok!', data: result };
        } else {
          res = { success: false, message: 'Invalid User!', data: '' };
        }
      });
    return res;
  }

  public async getUserDirectsInfo(
    memberId: any,
    pageNo: number,
    pageSize: number,
  ) {
    let res = {
      success: false,
      message: '',
      data: '',
      pageNation: {
        IsPaginated: false,
        pageSize: 20,
        pageNo: pageNo,
        pageCount: 0,
        hasNextPage: false,
      },
    };

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

    let directIds = info_res.data['UserInfo']['DirectIds'];

    directIds = directIds.slice().reverse();

    // console.log(info_res)
    // console.log(directIds)

    if (directIds.length <= 20) {
      await (await this.getContract()).methods
        .getDirects(memberId)
        .call((error: any, result: any) => {
          if (!error) {
            result = result.slice().reverse();
            res = {
              success: true,
              message: 'Ok!',
              data: result,
              pageNation: {
                IsPaginated: false,
                pageSize: 20,
                pageNo: pageNo,
                pageCount: 1,
                hasNextPage: false,
              },
            };
          } else {
            res = {
              success: false,
              message: 'Invalid User!',
              data: '',
              pageNation: {
                IsPaginated: false,
                pageSize: 20,
                pageNo: pageNo,
                pageCount: 0,
                hasNextPage: false,
              },
            };
          }
        });
    } else {
      let result: any = [];
      // debugger;
      let maxI =
        pageNo * pageSize <= directIds.length
          ? pageNo * pageSize
          : directIds.length;

      let hasNextPage = maxI != directIds.length;

      let IsPaginated = !(pageNo == 1 && maxI == directIds.length);
      let pageCount = Math.ceil(directIds.length / pageSize);

      for (let i = (pageNo - 1) * pageSize; i < maxI; i++) {
        let directInfo: any = await this.getUserDashboardInfo(directIds[i]);
        result.push(directInfo.data);

        // if ((i + 1) % 20 == 0) {
        //   await this.delay(1)
        // }
      }
      res = {
        success: true,
        message: 'Ok!',
        data: result,
        pageNation: {
          IsPaginated: IsPaginated,
          pageSize: 20,
          pageNo: pageNo,
          pageCount: pageCount,
          hasNextPage: hasNextPage,
        },
      };
    }
    // }
    return res;
  }

  delay(ms: any) {
    new Promise((res) => setTimeout(res, ms));
  }

  public async getUserRanks(memberId: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .getUserRanks(memberId)
      .call((error: any, result: any) => {
        if (!error) {
          res = { success: true, message: 'Ok!', data: result };
        } else {
          res = { success: false, message: 'Invalid User!', data: '' };
        }
      });
    return res;
  }

  public async buyToken(amount: number) {
    try {
      await this.getGasPrice();

      let value = this.web3.utils.toWei(amount.toString(), 'ether');
      let _gasPrice = this.web3.utils.toWei(this.gasPrice, 'Gwei');
      let estimatedGas = '0';

      await this.contract.methods.Reinvest().estimateGas(
        {
          from: this.account,
          value: value,
          gasPrice: _gasPrice,
        },
        function (error: any, _estimatedGas: any) {
          //console.log(error, _estimatedGas);
          estimatedGas = _estimatedGas;
        },
      );

      let data = this.contract.methods.Reinvest().encodeABI();
      var receipt = await this.sendTransaction(
        this.account,
        this.contractAddress,
        value,
        _gasPrice,
        estimatedGas,
        data,
      );
      return {
        success: receipt.success,
        data: receipt.data,
        message: receipt.success ? 'Ok!' : receipt.message,
      };
    } catch (ex: any) {
      console.log(ex);

      return { success: false, data: '', message: 'Some error occurred!' };
    }
  }

  public async sellToken(amount: number) {
    try {
      var isRegistered = await this.login(await this.getAddress());

      if (isRegistered.success) {
        await this.getGasPrice();

        let value = '0';
        let _gasPrice = this.web3.utils.toWei(this.gasPrice, 'Gwei');
        let estimatedGas = '0';

        await this.contract.methods.withdrawHolding(amount).estimateGas(
          {
            from: this.account,
            value: value,
            gasPrice: _gasPrice,
          },
          function (error: any, _estimatedGas: any) {
            //console.log(error, _estimatedGas);
            estimatedGas = _estimatedGas;
          },
        );

        let data = this.contract.methods.withdrawHolding(amount).encodeABI();
        var receipt = await this.sendTransaction(
          this.account,
          this.contractAddress,
          value,
          _gasPrice,
          estimatedGas,
          data,
        );
        return {
          success: receipt.success,
          data: receipt.data,
          message: receipt.success ? 'Ok!' : receipt.message,
        };
      } else {
        return { success: false, data: '', message: 'You are not registered!' };
      }
    } catch (ex: any) {
      console.log(ex);

      return { success: false, data: '', message: ex.toString() };
    }
  }

  public async getCoinPriceForMember(memberId: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .getCoinRate(memberId)
      .call((error: any, result: any) => {
        if (!error) {
          res = { success: true, message: 'Ok!', data: result };
        } else {
          res = { success: false, message: 'Invalid User!', data: '' };
        }
      });
    return res;
  }

  public async getCoinBuyPrice() {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .coinRate()
      .call((error: any, result: any) => {
        if (!error) {
          res = { success: true, message: 'Ok!', data: result };
        } else {
          res = { success: false, message: 'Invalid User!', data: '' };
        }
      });
    return res;
  }

  public async getTokenBalance(address: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .balanceOf(address)
      .call((error: any, result: any) => {
        if (!error) {
          res = { success: true, message: 'Ok!', data: result };
        } else {
          res = { success: false, message: 'Invalid User!', data: '' };
        }
      });
    return res;
  }

  public async fetchAddressBalance() {
    let accountBalance = await (
      await this.getWeb3()
    ).eth.getBalance(await this.getAddress());
    return this.web3.utils.fromWei(accountBalance, 'ether');
  }

  public async getMemberBalanceDividend(memberId: number) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .getUserBalanceDividend(memberId)
      .call((error: any, result: any) => {
        if (!error) {
          res = { success: true, message: 'Ok!', data: result };
        } else {
          res = { success: false, message: 'Invalid User!', data: '' };
        }
      });
    return res;
  }

  public async withdrawDividend(amount: number) {
    try {
      var isRegistered = await this.login(await this.getAddress());

      if (isRegistered.success) {
        await this.getGasPrice();

        let value = '0';
        let _gasPrice = this.web3.utils.toWei(this.gasPrice, 'Gwei');
        let estimatedGas = '0';
        let withdrawAmount = this.web3.utils.toWei(amount.toString(), 'Ether');

        await this.contract.methods
          .withdrawDividend(withdrawAmount)
          .estimateGas(
            {
              from: this.account,
              value: value,
              gasPrice: _gasPrice,
            },
            function (error: any, _estimatedGas: any) {
              //console.log(error, _estimatedGas);
              let x = parseInt(_estimatedGas) + parseInt(_estimatedGas) * 0.1;
              estimatedGas = x.toString();
            },
          );

        let data = this.contract.methods
          .withdrawDividend(withdrawAmount)
          .encodeABI();
        var receipt = await this.sendTransaction(
          this.account,
          this.contractAddress,
          value,
          _gasPrice,
          estimatedGas,
          data,
        );
        return {
          success: receipt.success,
          data: receipt.data,
          message: receipt.success ? 'Ok!' : receipt.message,
        };
      } else {
        return { success: false, data: '', message: 'You are not registered!' };
      }
    } catch (ex: any) {
      console.log(ex);

      return { success: false, data: '', message: 'Some error occurred!' };
    }
  }

  public async getLevelIncomeInfo(memberId: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .getMemberLevelDividend(memberId)
      .call((error: any, result: any) => {
        if (!error) {
          res = { success: true, message: 'Ok!', data: result };
        } else {
          res = { success: false, message: 'Invalid User!', data: '' };
        }
      });
    return res;
  }

  public async getROIIncomeRecords(memberId: any, limit: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .getMemberROIDividendInfo(memberId, limit)
      .call((error: any, result: any) => {
        if (!error) {
          res = { success: true, message: 'Ok!', data: result };
        } else {
          res = { success: false, message: 'Invalid User!', data: '' };
        }
      });
    return res;
  }

  public async archiveROI(memberId: any, endId: any) {
    let res = { success: false, message: '', data: '' };

    try {
      await this.getGasPrice();

      debugger;
      let value = '0';
      let _gasPrice = this.web3.utils.toWei(this.gasPrice, 'Gwei');
      let estimatedGas = '0';

      await this.contract.methods.archiveROI(memberId, endId).estimateGas(
        {
          from: this.account,
          value: value,
          gasPrice: _gasPrice,
        },
        function (error: any, _estimatedGas: any) {
          //console.log(error, _estimatedGas);
          estimatedGas = _estimatedGas;
        },
      );

      let data = this.contract.methods.archiveROI(memberId, endId).encodeABI();
      var receipt = await this.sendTransaction(
        this.account,
        this.contractAddress,
        value,
        _gasPrice,
        estimatedGas,
        data,
      );
      res = {
        success: receipt.success,
        data: receipt.data,
        message: receipt.success ? 'Ok!' : receipt.message,
      };
    } catch (ex: any) {
      console.log(ex);
      res = { success: false, message: ex, data: '' };
    } finally {
      return res;
    }
  }

  public async getUserTransactionHistory(memberId: any) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .getUserTransactions(memberId)
      .call((error: any, result: any) => {
        if (!error) {
          res = { success: true, message: 'Ok!', data: result };
        } else {
          res = { success: false, message: 'Invalid User!', data: '' };
        }
      });
    return res;
  }

  public async getCoinRateHistory(days: number, cnt: number) {
    let res = { success: false, message: '', data: '' };

    await (await this.getContract()).methods
      .getRateHistory(days, cnt)
      .call((error: any, result: any) => {
        if (!error) {
          res = { success: true, message: 'Ok!', data: result };
        } else {
          res = { success: false, message: 'Invalid User!', data: '' };
        }
      });
    return res;
  }
}
