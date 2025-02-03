export class BetModel {
  id?: Number;
  periodNo?: number;
  memberId?: number;
  amount: number;
  quantity: number;
  betOn: string;
  onDate?: string;
  deduction?: number;
  betAmount?: number;
  amountWinLose?: number;
  winnerStatus?: string;
  won_Number?: number;
  won_Color1?: string;
  won_Color2?: string;
}

export class currentPeriod {
  period: string;
  secRemainings: number;
}

export class userBetDetails {
  walletBalance: number;
  order: BetModel;
}

export class periodWinHistory {
  period: string;
  price: number;
  number: string;
  color1: string;
  color2: string;
}

export class periodWinResponse {
  data: periodWinHistory[];
  total: number;
}

export class userBetOrders {
  walletBalance: number;
  orders: BetModel[];
}
