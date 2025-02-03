import * as _setting from './settings.json';

let x = _setting;

export class Settings {
  static AppName: string = x.AppName;
  static isDevelopment: boolean = x.IsDevelopment;
  static IsTestNetworkSupported: boolean = x.IsTestNetworkSupported;

  static contractAddress: string = this.IsTestNetworkSupported
    ? x.TestNetContractAddress
    : x.MainNetContractAddress;
  static DefaultSponsor: string = x.DefaultSponsor;
  static abi: any = x.Abi;
  static XPRAbi: any = x.XPRAbi;

  static tokenContractAddress: string = x.TokenContractAddress;

  static paymentToken: string = x.PaymentToken;

  static coinName: string = x.CoinName;
  static coinSymbol: string = x.CoinSymbol;
  static website: string = x.Website;
  static logo: string = x.Logo;
  static explorer: string = this.IsTestNetworkSupported
    ? x.TestNetExplorer
    : x.MainNetExplorer;
  static mainnetHttpProvider: string = x.MainNetHttpProvider;
  static apiUrl: string = this.isDevelopment ? x.ApiUrl : x.ApiUrlLive;
  static wsUrl: string = this.isDevelopment ? x.ApiUrl : x.ApiUrlLive;
  static roiRecordsLimit: number = 10;
  static ApiUrlLive: string = this.isDevelopment ? x.ApiUrl : x.ImageUrl;
  static imageBaseUrl: string = x.ImageUrl;
  static ImageUrl: string;
}
