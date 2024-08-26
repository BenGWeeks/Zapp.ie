export function getUserName(wallet: Wallet | null): string {
  let userName = null;
  try {
    if (!wallet) {
      return 'Unknown';
    }

    if (!wallet.name) {
      return 'Unknown';
    }

    if (wallet.name.includes(' - ')) {
      userName = wallet.name.split(' - ')[0];
      console.log('User name: ', userName);
      return userName;
    } else {
      return 'Unknown';
    }
  } catch (e) {
    console.log('Error in getUserName: ', e);
    return 'Unknown';
  }
}

export function getAadObjectId(wallet: Wallet): string {
  throw new Error('Not yet implemented.');
}

export function getWalletType(wallet: Wallet): string {
  throw new Error('Not yet implemented.');
}
