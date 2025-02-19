
import { AuthMasterComponent } from './auth/auth-master/auth-master.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BuySellMasterComponent } from './user/buy-sell-token/buy-sell-master/buy-sell-master.component';
import { BuyComponent } from './user/buy-sell-token/buy/buy.component';
import { SellComponent } from './user/buy-sell-token/sell/sell.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { DirectsComponent } from './user/directs/directs.component';
import { LevelDividendComponent } from './user/level-dividend/level-dividend.component';
import { RankComponent } from './user/rank/rank.component';
import { RoiDividendComponent } from './user/roi-dividend/roi-dividend.component';
import { TransactionsComponent } from './user/transactions/transactions.component';
import { WithdrawDividendComponent } from './user/withdraw-dividend/withdraw-dividend.component';
import { BoardBinaryIncomeComponent } from './user/board-binary-income/board-binary-income.component';
import { DailyEORComponent } from './user/daily-eor/daily-eor.component';
import { MiningIncomeComponent } from './user/mining-income/mining-income.component';
import { BoardCountComponent } from './user/board-count/board-count.component';
import { WithdrawMtaComponent } from './user/withdraw-mta/withdraw-mta.component';
import { WithdrawalLevelIncomeComponent } from './user/withdrawal-level-income/withdrawal-level-income.component';
import { SalaryIncomeComponent } from './user/salary-income/salary-income.component';
import { DividendIncomeComponent } from './user/dividend-income/dividend-income.component';
import { TeamComponent } from './user/team/team.component';
import { DepositComponent } from './user/deposit/deposit.component';
import { IncomeWithdrawalHistoryComponent } from './user/income-withdrawal-history/income-withdrawal-history.component';
// import { SigninComponent } from './auth/signin/signin.component';
// import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './usershop/home/home.component';
import { NavbarComponent } from './usershop/navbar/navbar.component';
import { SubcategoryComponent } from './usershop/subcategory/subcategory.component';
import { ProductDetailsComponent } from './usershop/product-details/product-details.component';
import { ShoppingCartComponent } from './usershop/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './usershop/checkout/checkout.component';
import { OrderHistoryComponent } from './usershop/order-history/order-history.component';
import { CheckoutConfirmComponent } from './usershop/checkout-confirm/checkout-confirm.component';
import { OrderInvoiceComponent } from './usershop/order-invoice/order-invoice.component';
import { AuthGuard } from './usershop/auth.guard';
import { OrderDetailsComponent } from './usershop/order-details/order-details.component';
import { ShoppingProfileComponent } from './usershop/shopping-profile/shopping-profile.component';

import { ForgotPasswordComponent } from './usershop/forgot-password/forgot-password.component';
import { AffiliateComponent } from './usershop/affiliate/affiliate.component';
import { TopupComponent } from './user/topup/topup.component';
import { TopupDetailsComponent } from './user/topup-details/topup-details.component';
import { EPinComponent } from './user/view-pin/view-pin.component';
import { TransferPinComponent } from './user/transfer-pin/transfer-pin.component';
import { TransferPinDetailsComponent } from './user/transfer-pin-details/transfer-pin-details.component';
import { TransferPinStatisticComponent } from './user/transfer-pin-statistic/transfer-pin-statistic.component';
import { DirectTreeComponent } from './user/direct-tree/direct-tree.component';
import { TopupByEPinComponent } from './user/topup-by-e-pin/topup-by-e-pin.component';
import { GameListComponent } from './games/components/game-list/game-list.component';
import { SpinGameComponent } from './games/components/spin-game/spin-game.component';
import { ColorGamedashboardComponent } from './games/components/color-game/dashboard/color-game-dashboard.component';
import { BetComponent } from './games/components/color-game/bet/bet.component';
import { AddBetComponent } from './games/components/color-game/add-bet-dialog/add-bet.component';
import { PeriodWinModalComponent } from './games/components/color-game/period-win-dialog/period-win-modal.component';
import { periodWinHistory } from './games/models/bet.model';
import { RuleComponent } from './games/components/color-game/rule-dialog/rule.component';
import { BusinessCountComponent } from './user/business-count/business-count.component';

import { UpdateAccountDetailsComponent } from './usershop/update-account-details/update-account-details.component';
import { TransactionsDetailsComponent } from './user/transactions-details/transactions-details.component';
import { WithdrawAmountMlmComponent } from './user/withdraw-amount-mlm/withdraw-amount-mlm.component';
import { BinaryTreeComponent } from './user/binary-tree/binary-tree.component';
import { SentTicketsComponent } from './user/sent-tickets/sent-tickets.component';
import { ComposeTicketsComponent } from './user/compose-tickets/compose-tickets.component';
import { InboxTicketsComponent } from './user/inbox-tickets/inbox-tickets.component';
import { DepositCryptoComponent } from './user/deposit-crypto/deposit-crypto.component';
import { DepositCryptoDeatilsComponent } from './user/deposit-crypto-deatils/deposit-crypto-deatils.component';

import { ReferralDashboardComponent } from './admin/referral-dashboard/referral-dashboard.component';
import { AdminDashboardComponent } from './admin/color-dashboard/admin-dashboard.component';
import { DirectIncomeComponent } from './user/direct-income/direct-income.component';
import { MatrixIncomeComponent } from './user/matrix-income/matrix-income.component';
import { MatchingIncomeComponent } from './user/matching-income/matching-income.component';
import { LevelRoiComponent } from './user/level-roi/level-roi.component';
import { UpdateProfileComponent } from './user/update-profile/update-profile.component';
import { UpdateUsdtAddressComponent } from './user/update-usdt-address/update-usdt-address.component';
import { UpdateKycComponent } from './user/update-kyc/update-kyc.component';
import { RequestForInvestmentComponent } from './user/request-for-investment/request-for-investment.component';
import { UserSearchComponent } from './user/user-search/user-search.component';
import { PinGenerateComponent } from './user/pin-generate/pin-generate.component';
import { RequestForInvestmentAdminSideComponent } from './user/request-for-investment-admin-side/request-for-investment-admin-side.component';
import { RequestForWithdrawlAdminSideComponent } from './user/request-for-withdrawl-admin-side/request-for-withdrawl-admin-side.component';
import { CreditDebitComponent } from './user/credit-debit/credit-debit.component';
import { ChangePasswordComponent } from './usershop/change-password/change-password.component';
import { teambonusComponent } from './user/team-bonus/team-bonus.component';
import { LeadershipBonusComponent } from './user/leadership-bonus/leadership-bonus.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { Routes } from '@angular/router';
import { LeaderShipIncomeDetailsComponent } from './user/leader-ship-income-details/leader-ship-income-details.component';
import { CommunityIncomeComponent } from './user/community-income/community-income.component';
import { RoyaltyIncomeComponent } from './user/royalty-income/royalty-income.component';
import { ClubIncomeComponent } from './user/club-income/club-income.component';
import { PoolIncomeComponent } from './user/pool-income/pool-income.component';

export const routes: Routes = [
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthMasterComponent,
    children: [{
      path: '',
      component: LoginComponent
    }]
  },
  {
    path: 'auth',
    component: AuthMasterComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'register/:id',
        component: RegisterComponent
      }
    ]
  },
  // { path: 'home', component: HomeComponent, title: 'Home' },
  {
    path: 'usershop-navbar',
    component: NavbarComponent,
    title: 'User Shop Navbar',
  },
  {
    path: 'subcategory/:id',
    component: SubcategoryComponent,
    title: 'Subcategory',
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    title: 'Product Details',
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
    title: 'Shopping Cart',
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Forgot Password',
  },
  {
    path: 'directs',
    component: DirectsComponent,
    title: 'Directs',
  },
  {
    path: 'usershop',
    canActivate: [AuthGuard],
    children: [
      { path: 'checkout', component: CheckoutComponent, title: 'Checkout' },
      {
        path: 'confirm',
        component: CheckoutConfirmComponent,
        title: 'Confirm Order',
      },
      {
        path: 'order-invoice',
        component: OrderInvoiceComponent,
        title: 'Order Invoice',
      },
      {
        path: 'order-history',
        component: OrderHistoryComponent,
        title: 'Order History',
      },
      {
        path: 'order-details/:orderId',
        component: OrderDetailsComponent,
        title: 'Order Details',
      },
      {
        path: 'profile',
        component: ShoppingProfileComponent,
        title: 'Profile',
      },

      { path: 'affiliate', component: AffiliateComponent, title: 'Affiliate' },
    ],
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    component: AffiliateComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        title: 'Dashboard',
      },
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
      {
        path: 'profile',
        component: ShoppingProfileComponent,
        title: 'Profile',
      },

      { path: 'directs', component: DirectsComponent, title: 'Directs' },
      { path: 'team', component: TeamComponent, title: 'Team' },
      { path: 'royalty', component: RankComponent, title: 'Royalty' },
      {
        path: 'boardIncome',
        component: BoardBinaryIncomeComponent,
        title: 'Board Income',
      },
      {
        path: 'withdraw-mta',
        component: WithdrawMtaComponent,
        title: 'Withdraw MTA',
      },
      { path: 'dailyeor', component: DailyEORComponent, title: 'Daily EOR' },
      {
        path: 'miningIncome',
        component: MiningIncomeComponent,
        title: 'Mining Income',
      },
      {
        path: 'boardCount',
        component: BoardCountComponent,
        title: 'Board Count',
      },
      { path: 'deposit', component: DepositComponent, title: 'Deposit' },
      {
        path:'token',
        component:BuySellMasterComponent,
        children:[
          {
            path:'',
            component:BuyComponent
          },
          {
            path:'buy',
            component:BuyComponent
          },
          {
            path:'sell',
            component:SellComponent
          }
        ]
      },
      {
        path: 'withdraw-dividend',
        component: WithdrawDividendComponent,
        title: 'Withdraw Dividend',
      },
      {
        path: 'level-dividend',
        component: LevelDividendComponent,
        title: 'Level Dividend',
      },
      {
        path: 'salary-income',
        component: SalaryIncomeComponent,
        title: 'Salary Income',
      },
      {
        path: 'apr-withdrawal-level',
        component: WithdrawalLevelIncomeComponent,
        title: 'Withdrawal Level Income',
      },
      {
        path: 'dividend-income',
        component: DividendIncomeComponent,
        title: 'Dividend Income',
      },
      {
        path: 'roi-dividend',
        component: RoiDividendComponent,
        title: 'ROI Dividend',
      },
      {
        path: 'Team-bonus',
        component: teambonusComponent,
        title: 'Team-Bonus',
      },
      {
        path: 'Leadership-Bonus',
        component: LeadershipBonusComponent,
        title: 'Leadership-Bonus',
      },
      {
        path: 'mining-income',
        component: MiningIncomeComponent,
        title: 'Mining Income',
      },
      {
        path: 'direct-income',
        component: DirectIncomeComponent,
        title: 'Direct Income',
      },
      {
        path: 'matrix-income',
        component: MatrixIncomeComponent,
        title: 'Matrix Income',
      },
      {
        path: 'LeaderShip-Income-Details',
        component: LeaderShipIncomeDetailsComponent,
        title: 'LeaderShip Income Details',
      },
      {
        path: 'community-income',
        component: CommunityIncomeComponent,
        title: 'Community Income',
      },
      {
        path: 'matching-income',
        component: MatchingIncomeComponent,
        title: 'Matching Income',
      },
      { path: 'rank', component: RankComponent, title: 'Rank' },
      {
        path: 'transactions',
        component: TransactionsComponent,
        title: 'Transactions',
      },
      {
        path: 'transactions-details',
        component: TransactionsDetailsComponent,
        title: 'Transaction Details',
      },
      {
        path: 'income-withdrawal-history',
        component: IncomeWithdrawalHistoryComponent,
        title: 'Income Withdrawal History',
      },
      { path: 'topup', component: TopupComponent, title: 'Top Up' },
      { path: 'view-pin', component: EPinComponent, title: 'View E-Pin' },
      {
        path: 'topup-details',
        component: TopupDetailsComponent,
        title: 'Top Up Details',
      },
      {
        path: 'transfer-pin',
        component: TransferPinComponent,
        title: 'Transfer Pin',
      },
      {
        path: 'transfer-pin-details',
        component: TransferPinDetailsComponent,
        title: 'Transfer Pin Details',
      },
      {
        path: 'Pin-Statistic',
        component: TransferPinStatisticComponent,
        title: 'Pin Statistic',
      },
      {
        path: 'direct-tree',
        component: DirectTreeComponent,
        title: 'Direct Tree',
      },
      {
        path: 'topup-by-e-pin',
        component: TopupByEPinComponent,
        title: 'Top Up by E-Pin',
      },
      {
        path: 'business-count-details',
        component: BusinessCountComponent,
        title: 'Business Count Details',
      },
      {
        path: 'update-account-details',
        component: UpdateAccountDetailsComponent,
        title: 'Update Account Details',
      },
      {
        path: 'withdraw-amount-mlm',
        component: WithdrawAmountMlmComponent,
        title: 'Withdraw Amount MLM',
      },
      {
        path: 'binary-tree',
        component: BinaryTreeComponent,
        title: 'Binary Tree',
      },
      {
        path: 'transfer-pin',
        component: TransferPinComponent,
        title: 'Transfer Pin',
      },
      {
        path: 'transfer-pin-statistic',
        component: TransferPinStatisticComponent,
        title: 'Transfer Pin Statistic',
      },
      {
        path: 'compose-tickets',
        component: ComposeTicketsComponent,
        title: 'Compose Tickets',
      },
      {
        path: 'sent-tickets',
        component: SentTicketsComponent,
        title: 'Sent Tickets',
      },
      {
        path: 'inbox-tickets',
        component: InboxTicketsComponent,
        title: 'Inbox Tickets',
      },
      {
        path: 'deposit-crypto',
        component: DepositCryptoComponent,
        title: 'Deposit Crypto',
      },
      {
        path: 'deposit-crypto-deatils',
        component: DepositCryptoDeatilsComponent,
        title: 'Deposit Crypto Details',
      },
      {
        path: 'level-roi',
        component: LevelRoiComponent,
        title: 'Level ROI Income',
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        title: 'Change Password',
      },
      {
        path: 'update-profile',
        component: UpdateProfileComponent,
        title: 'Update Profile',
      },
      {
        path: 'update-kyc',
        component: UpdateKycComponent,
        title: 'Update KYC',
      },
      {
        path: 'user-search',
        component: UserSearchComponent,
        title: 'User Search',
      },
      {
        path: 'update-usdt-address',
        component: UpdateUsdtAddressComponent,
        title: 'Update USDT Address',
      },
      {
        path: 'request-for-investment',
        component: RequestForInvestmentComponent,
        title: 'Request For Investment',
      },
      {
        path: 'request-for-investment-admin-side',
        component: RequestForInvestmentAdminSideComponent,
        title: 'Request For Investment Admin Side',
      },
      {
        path: 'generate-pin',
        component: PinGenerateComponent,
        title: 'Generate Pin',
      },
      {
        path: 'request-for-withdrawl-admin-side',
        component: RequestForWithdrawlAdminSideComponent,
        title: 'Request For Withdrawl Admin Side',
      },
      {
        path: 'Credit-Debit',
        component: CreditDebitComponent,
        title: 'Amount-Wallet',
      },
      {
        path: 'royalty-income',
        component: RoyaltyIncomeComponent,
        title: 'royalty-income',
      },
      {
        path: 'club-income',
        component: ClubIncomeComponent,
        title: 'club-income',
      },
      {
        path: 'pool-income',
        component: PoolIncomeComponent,
        title: 'pool-income',
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'referral-dashboard',
        component: ReferralDashboardComponent,
        title: 'Referral-dashboard',
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        title: 'Admin Dashboard',
      },
    ],
  },

  {
    path: 'games',
    canActivate: [AuthGuard],
    children: [
      { path: 'spingame', component: SpinGameComponent, title: 'Spin Game' },
      { path: 'gamelist', component: GameListComponent, title: 'Game List' },
      {
        path: 'color-game-dashboard',
        component: ColorGamedashboardComponent,
        title: 'Color Game Dashboard',
      },
      { path: 'spin-game', component: SpinGameComponent, title: 'Spin Game' },
      { path: 'bet', component: BetComponent, title: 'Bet' },
      { path: 'addbet', component: AddBetComponent, title: 'Add Bet' },
      {
        path: 'periodwin',
        component: PeriodWinModalComponent,
        title: 'Period Win',
      },
      {
        path: 'periodhistory',
        component: periodWinHistory,
        title: 'Period History',
      },
      { path: 'rulegame', component: RuleComponent, title: 'Game Rules' },
    ],
  },

  { path: '**', component: PageNotFoundComponent, title: 'Page Not Found' },
];
