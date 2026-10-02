import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { previewCircle, validateAndJoinCircle } from '../../lib/db';
import { useAuth } from '../../store/AuthContext';
import { Users, X } from 'lucide-react';

interface JoinCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinCircleModal: React.FC<JoinCircleModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [preview, setPreview] = useState<{ id: string; name: string; memberCount: number } | null>(null);
  const [success, setSuccess] = useState(false);

  const resetState = () => {
    setJoinCode('');
    setError(null);
    setPreview(null);
    setSuccess(false);
    setLoading(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetState, 300);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim().length !== 4) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const circleData = await previewCircle(joinCode.trim());
      setPreview(circleData);
    } catch (e: any) {
      console.error('previewCircle error:', e.message);
      if (e.message === 'invalid_code') {
        setError('Invalid Circle code. Please check the code and try again.');
      } else if (e.message === 'circle_not_configured') {
        setError('The Circle has not been set up yet. Please ask the admin to create a Circle first.');
      } else if (e.message === 'circle_not_found') {
        setError('Circle not found. Please contact your admin.');
      } else {
        setError(`Failed to find Circle: ${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinConfirm = async () => {
    if (!currentUser || !preview) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await validateAndJoinCircle(joinCode.trim(), currentUser.uid);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (e: any) {
      console.error('validateAndJoinCircle error:', e.message);
      if (e.message === 'already_member') {
        setError("You're already a member of this Circle.");
      } else if (e.message === 'circle_not_configured') {
        setError('Circle not configured. Please contact the admin.');
      } else {
        setError(`Failed to join: ${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="relative w-full max-w-sm bg-white dark:bg-brand-darkElevated rounded-3xl shadow-2xl overflow-hidden p-6 text-center"
          >
            <button 
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">You're in!</h2>
                <p className="text-gray-500 dark:text-gray-400">Redirecting to your Circle...</p>
              </div>
            ) : preview ? (
              <div className="space-y-6 pt-4">
                <div className="w-16 h-16 bg-brand-saffron/10 text-brand-saffron rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wider text-brand-saffron uppercase mb-1">Circle Found</h3>
                  <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">{preview.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">{preview.memberCount} member{preview.memberCount !== 1 ? 's' : ''}</p>
                </div>
                
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                
                <div className="pt-2">
                  <Button 
                    onClick={handleJoinConfirm} 
                    disabled={loading}
                    className="w-full h-14 text-lg"
                  >
                    {loading ? 'Joining...' : 'Join Circle'}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCodeSubmit} className="space-y-6 pt-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">Join a Circle</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your Circle code</p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => {
                      setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 4));
                      setError(null);
                    }}
                    placeholder="6726"
                    className="w-full h-16 text-center text-4xl font-mono tracking-[0.3em] rounded-2xl border-2 border-brand-saffron/20 bg-gray-50 dark:bg-gray-800/50 focus:border-brand-saffron focus:ring-4 focus:ring-brand-saffron/10 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700"
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Ask your friend for their 4-digit Circle code.
                  </p>
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <Button 
                  type="submit" 
                  disabled={joinCode.length !== 4 || loading}
                  className="w-full h-14 text-lg"
                >
                  {loading ? 'Checking...' : 'Continue'}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
