import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Copy, Share, Check } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: string;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const fixedCode = "6726";

  const inviteText = `Join my SANDHYĀ Circle using this code: ${fixedCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join my SANDHYĀ Circle",
          text: inviteText,
        });
      } else {
        await navigator.clipboard.writeText(inviteText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to share', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-sm"
          >
            <Card premium className="p-6 relative overflow-hidden bg-[#FDFCF8] dark:bg-brand-darkBg text-center">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-display font-bold text-brand-primary dark:text-brand-darkPrimaryText mb-2 pt-2">
                Invite Friends
              </h2>
              <p className="text-gray-500 font-medium mb-6">
                Give your friends this Circle code:
              </p>

              <div className="flex justify-center mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 border-2 border-brand-saffron/20 rounded-2xl p-6 w-full max-w-[240px]">
                  <p className="font-mono font-bold tracking-[0.4em] text-4xl text-brand-charcoal dark:text-white ml-2">
                    {fixedCode}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  <Share size={18} />
                  Share Code
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  {copied ? 'Copied' : 'Copy Code'}
                </Button>
              </div>

              <p className="text-sm text-gray-400 mt-6 max-w-xs mx-auto">
                Share this code with your friends and ask them to join your Circle.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
