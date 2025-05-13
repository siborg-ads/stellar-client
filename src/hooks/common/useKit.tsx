import { useEffect, useState } from "react";
import {
  AlbedoModule,
  FreighterModule,
  HanaModule,
  HotWalletModule,
  LobstrModule,
  StellarWalletsKit,
  WalletNetwork,
  XBULL_ID,
  xBullModule,
  RabetModule,
} from "@creit.tech/stellar-wallets-kit/index";
import { LedgerModule } from "@creit.tech/stellar-wallets-kit/modules/ledger.module";
import {
  WalletConnectAllowedMethods,
  WalletConnectModule,
} from "@creit.tech/stellar-wallets-kit/modules/walletconnect.module";

export const useKit = (version: string, selectedWallet: string) => {
  const [walletKit, setWalletKit] = useState<StellarWalletsKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, _] = useState(null);

  useEffect(() => {
    // Initialize walletKit regardless of connected state
    setLoading(true);
    try {
      let kit = new StellarWalletsKit({
        network:
          version == "testnet"
            ? WalletNetwork.TESTNET
            : (WalletNetwork.PUBLIC as WalletNetwork),
        selectedWalletId: XBULL_ID,
        modules: [
          new xBullModule(),
          new RabetModule(),
          new FreighterModule(),
          new LobstrModule(),
          new AlbedoModule(),
          new HanaModule(),
          new LedgerModule(),
          new WalletConnectModule({
            url: "https://subsprotocol.com",
            projectId: "a0fd1483122937b5cabbe0d85fa9c34e",
            method: WalletConnectAllowedMethods.SIGN,
            description: `Subs is a decentralized subscripiton protocol that allow you to have reccuring payments and revenue streams.`,
            name: "Subs",
            icons: [
              "https://subsprotocol.com/assets/log-d474c84b.png",
            ],
            network: version == "testnet" ? WalletNetwork.TESTNET : WalletNetwork.PUBLIC as WalletNetwork,
          }),
          new HotWalletModule(),
        ],
      });
      setWalletKit(kit);
      selectedWallet == "false" ? null :  kit.setWallet(selectedWallet);
    } catch (err) {
      console.error("Error initializing wallet kit:", err);
    } finally {
      setLoading(false);
    }
  }, [version]); // Only depend on version, not connected state

  return { walletKit, loading, error };
};
