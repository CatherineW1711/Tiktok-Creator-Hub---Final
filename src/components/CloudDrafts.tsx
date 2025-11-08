import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trash2, Plus, Smartphone, Laptop, Tablet } from 'lucide-react';
import { Button } from './ui/button';
import BottomNav from './BottomNav';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface CloudDraftsProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

interface Draft {
  id: string;
  title: string;
  device: 'iPhone' | 'Laptop' | 'iPad';
  duration: string;
  date: string;
  progress: number; // 0-100
}

export default function CloudDrafts({ onBack, onNavigate }: CloudDraftsProps) {
  const [drafts, setDrafts] = useState<Draft[]>([
    { id: '1', title: 'Dance Tutorial - Hip Hop Basics', device: 'iPhone', duration: '2:15', date: '2025-10-17', progress: 75 },
    { id: '2', title: 'Math Concept Explanation', device: 'Laptop', duration: '4:32', date: '2025-10-16', progress: 100 },
    { id: '3', title: 'Role Play - Customer Service', device: 'iPad', duration: '3:48', date: '2025-10-15', progress: 45 },
    { id: '4', title: 'Dance Challenge Response', device: 'iPhone', duration: '1:03', date: '2025-10-14', progress: 30 },
    { id: '5', title: 'Science Experiment Demo', device: 'Laptop', duration: '5:21', date: '2025-10-13', progress: 90 },
  ]);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDrafts(drafts.filter((draft) => draft.id !== id));
    setDeleteId(null);
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'iPhone':
        return Smartphone;
      case 'Laptop':
        return Laptop;
      case 'iPad':
        return Tablet;
      default:
        return Smartphone;
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black border-b border-gray-900 px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white">Cloud Drafts</h2>
          <div className="w-6" />
        </div>
        <p className="text-gray-500 text-sm text-center mt-1">
          {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}
        </p>
      </div>

      {/* Drafts List */}
      <div className="absolute top-36 left-0 right-0 bottom-20 overflow-y-auto px-6">
        <div className="space-y-3 pb-6">
          <AnimatePresence>
            {drafts.map((draft) => {
              const DeviceIcon = getDeviceIcon(draft.device);
              
              return (
                <motion.div
                  key={draft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#121212] rounded-xl border border-gray-800 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white mb-2">{draft.title}</h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1 text-gray-400">
                            <DeviceIcon className="w-4 h-4" />
                            <span>{draft.device}</span>
                          </div>
                          <span className="text-[#00F5FF]">{draft.duration}</span>
                          <span className="text-gray-600">{draft.date}</span>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => setDeleteId(draft.id)}
                        className="text-gray-600 hover:text-[#FF0050] transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">
                          {draft.progress === 100 ? 'Complete' : 'In Progress'}
                        </span>
                        <span className="text-xs text-[#00F5FF]">{draft.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#FF0050] to-[#00F5FF]"
                          initial={{ width: 0 }}
                          animate={{ width: `${draft.progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Add Button */}
      <motion.button
        className="absolute bottom-32 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #FF0050 0%, #00F5FF 100%)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(255, 0, 80, 0.5)',
            '0 0 30px rgba(0, 245, 255, 0.5)',
            '0 0 20px rgba(255, 0, 80, 0.5)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Bottom Navigation */}
      <BottomNav active="drafts" onNavigate={onNavigate} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#121212] border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your draft from cloud storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-[#FF0050] text-white hover:bg-[#FF0050]/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
