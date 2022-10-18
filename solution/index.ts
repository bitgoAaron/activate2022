import { BitGoAPI } from '@bitgo/sdk-api';
import { Tbtc } from '@bitgo/sdk-coin-btc';
import { password } from './password';

// Get From generate token step
const accessToken = '';

const bitgo = new BitGoAPI({ env: 'test', accessToken });

bitgo.register('tbtc', Tbtc.createInstance);

const getAccessToken = async () => {
  await bitgo.authenticate({
    username: '<< YOUR USERNAME HERE >>',
    password,
    otp: '000000',
  });
  const { token } = await bitgo.addAccessToken({
    otp: '000000',
    label: 'Admin Access Token',
    scope: [
      'metamask_institutional',
      'openid',
      'pending_approval_update',
      'portfolio_view',
      'profile',
      'trade_trade',
      'trade_view',
      'wallet_approve_all',
      'wallet_create',
      'wallet_edit_all',
      'wallet_manage_all',
      'wallet_spend_all',
      'wallet_view_all',
    ],
    // Optional: Set a spending limit.
    spendingLimits: [
      {
        coin: 'tbtc',
        txValueLimit: '1000000000', // 10 TBTC (10 * 1e8)
      },
    ],
  });

  console.log(`API Access Token: ${token}`);
};

const generateWallet = async () => {
  const response = await bitgo.coin('tbtc').wallets().generateWallet({
    label: 'My demo wallet',
    passphrase: password,
    enterprise: '<< YOUR ENTERPRISE ID HERE >>',
  });
  console.log(response);
  console.log(`Receive Address: ${response.wallet.receiveAddress()}`);
};

const fundWallet = async () => {
  const destinationWallet = await bitgo
    .coin('tbtc')
    .wallets()
    .get({ id: '<< GENEREATED WALLET ID HERE >>' });

  const fundedWallet = await bitgo
    .coin('tbtc')
    .wallets()
    .get({ id: '<< FUNDED WALLET ID HERE >>' });

  const txResponse = await fundedWallet.send({
    address: destinationWallet.receiveAddress(),
    amount: `${100000 / 2}`,
    walletPassphrase: password,
  });

  console.log(txResponse);
};
