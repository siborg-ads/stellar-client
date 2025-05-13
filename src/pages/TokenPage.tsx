import React, { useState } from 'react';
import { Navbar } from '../Components';
import styles from '../styles/style';
import TokenAdValidationSection from '../Components/offer/OfferAdValidationSection';
import TokenDetailsSection from '../Components/offer/OfferDetailsSection';
import { Button, Modal, TextInput } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import { Client } from "soroban-dsponsor";
import {
  getChainDatas,
} from "../utils";
import { useWallet } from "../web3";
import { useDispatch, useSelector } from 'react-redux';
import Notifications from '../Components/common/Notif';
import { setNotification } from '../stores/common';

const TokenPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenData = JSON.parse(decodeURIComponent(searchParams.get('data') || '{}'));
  const [modalOpened, setModalOpened] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const { walletAddress , createAssembledTransaction} = useWallet();
  const { notification } = useSelector((state: any) => state.common);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submit logic here
    await handleSubmitAdProposal(imageUrl, externalLink);
    setModalOpened(false);
  };

  const handleSubmitAdProposal = async (imageUrl: string, externalLink: string) => {
    try {
      // Step 1: Create NFT
      let client = new Client({
        rpcUrl: getChainDatas("stellart").rpc,
        networkPassphrase: getChainDatas("stellart").networkPassphrase,
        contractId: getChainDatas("stellart").address,
        publicKey: walletAddress,
      });
      let assembledSubmitAdProposalTx = await client.submit_ad_proposal({
        caller: walletAddress,
        offer_id: Number(tokenData.offerId),
        token_id: Number(tokenData.id),
        ad_parameter: "link",
        data: JSON.stringify({
          imageUrl: imageUrl,
          externalLink: externalLink,
        }),
      });
      console.log("assembledSubmitAdProposalTx", assembledSubmitAdProposalTx);
      
      await createAssembledTransaction(assembledSubmitAdProposalTx);
      dispatch(
        setNotification({
          isNotified: true,
          type: "Success",
          message: "Ad proposal submitted successfully, waiting for review",
        })
      );
    } catch (e) {
      console.log("error submit ad proposal", e);
      dispatch(
        setNotification({
          isNotified: true,
          type: "Error",
          message: e.message,
        })
      );
      // Optionally handle error and close modal
      // setProgressModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181926] py-10 px-4">
      {notification.isNotified && (
        <Notifications
          type={notification.type}
          message={notification.message}
        />
      )}
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-10">
        {/* NFT image and info card */}
        <div className="flex flex-col items-center bg-[#23243a]/80 rounded-3xl shadow-2xl p-8 md:p-12 border border-purple-900/40 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg border border-gray-800 bg-white">
            <img src={tokenData.imageUrl} alt={tokenData.name} className="w-full h-48 object-cover" />
          </div>
          <div className="mt-4 text-center text-lg font-semibold text-white/90">{tokenData.name}</div>
          <div className="mt-2 text-sm text-gray-400">Token ID: {tokenData.id}</div>
          <div className="mt-2 text-xs text-purple-400">Owner: {tokenData.owner}</div>
          {tokenData.owner == walletAddress && (
          <Button
            color="violet"
            size="lg"
            radius="xl"
            fullWidth
            leftIcon={<IconSend size={22} />}
            className="font-bold text-lg py-3 mt-8"
            onClick={() => setModalOpened(true)}
          >
            Submit ad
          </Button>
          )}
        </div>
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title={null}
          centered
          overlayProps={{ blur: 4 }}
          classNames={{ content: 'custom-modal-content' }}
          withCloseButton={false}
        >
          <div className="bg-[#181926]/90 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] max-w-md mx-auto">
            <button
              onClick={() => setModalOpened(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10"
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <div className="w-full flex flex-col items-center gap-1 mb-2">
              <div className="text-2xl font-extrabold text-white text-center mb-2">Submit Ad</div>
            </div>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              <TextInput
                label={<span className="text-white font-semibold">Image to show URL</span>}
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.currentTarget.value)}
                required
                classNames={{ input: 'bg-[#23243a] text-white border-purple-500/30 focus:border-purple-400', label: '' }}
              />
              <TextInput
                label={<span className="text-white font-semibold">External link</span>}
                placeholder="https://..."
                value={externalLink}
                onChange={(e) => setExternalLink(e.currentTarget.value)}
                required
                classNames={{ input: 'bg-[#23243a] text-white border-purple-500/30 focus:border-purple-400', label: '' }}
              />
              <Button type="submit" color="violet" radius="xl" size="md" fullWidth className="font-bold mt-2">
                Submit
              </Button>
            </form>
          </div>
        </Modal>
        <div className="mt-10">
          <TokenAdValidationSection offerId={Number(tokenData.offerId)} tokenId={Number(tokenData.id)} nftContract={tokenData.contractAddress} offerProposals={[]} />
        </div>
        <div className="mt-8">
          <TokenDetailsSection offer={tokenData} />
        </div>
      </div>
    </div>
  );
};

export default TokenPage; 