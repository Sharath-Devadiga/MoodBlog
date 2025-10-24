"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Save, 
  Trash2, 
  User, 
  Mail,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import Avatar from "@/app/components/ui/Avatar";
import { AVATAR_ANIMALS, AVATAR_COLORS } from "@/app/utils/constants";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [savingAvatar, setSavingAvatar] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
    if (session && (session.user as { avatarId?: string })?.avatarId) {
      setSelectedAnimal((session.user as { avatarId?: string }).avatarId as string);
    }
    if (session && (session.user as { colorIndex?: number })?.colorIndex !== undefined && (session.user as { colorIndex?: number })?.colorIndex !== null) {
      setSelectedColorIndex((session.user as { colorIndex?: number }).colorIndex as number);
    }
  }, [status, router, session]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your posts will be permanently deleted."
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      "This is your last chance. Are you absolutely sure you want to delete your account?"
    );

    if (!doubleConfirm) return;

    try {
      setLoading(true);
      const response = await fetch("/api/users/delete", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete account");
      }

      toast.success("Account deleted successfully");
      router.push("/api/auth/signout");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      setSavingAvatar(true);
      const response = await fetch("/api/users/update-avatar", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          animalId: selectedAnimal,
          colorIndex: selectedColorIndex 
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update avatar");
      }

      await update();
      toast.success("Avatar updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update avatar");
    } finally {
      setSavingAvatar(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-xl border border-white/10 p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            Profile Avatar
          </h2>
          
          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
              Choose an animal avatar or keep your default letter avatar with a unique color!
            </p>
            
            <div className="mb-4">
              <p className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Current Avatar:</p>
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-zinc-800 rounded-lg border border-white/10">
                <Avatar 
                  username={(session?.user as { publicUsername?: string })?.publicUsername}
                  animalId={selectedAnimal}
                  colorIndex={selectedColorIndex}
                  size="lg" 
                />
                <div>
                  <p className="text-sm sm:text-base text-white font-medium">
                    {selectedAnimal ? AVATAR_ANIMALS.find(a => a.id === selectedAnimal)?.name : 'Letter Avatar'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedAnimal ? 'Animal Avatar' : 'Default with unique color'}
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">Choose Animal Avatar:</p>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3 mb-4">
              {AVATAR_ANIMALS.map((animal) => (
                <button
                  key={animal.id}
                  onClick={() => setSelectedAnimal(animal.id)}
                  className={`relative group transition-all p-1.5 sm:p-2 rounded-lg ${
                    selectedAnimal === animal.id
                      ? "ring-2 ring-orange-500 scale-105 bg-orange-500/10"
                      : "hover:scale-105 hover:bg-white/5"
                  }`}
                  title={animal.name}
                >
                  <Avatar 
                    username={(session?.user as { publicUsername?: string })?.publicUsername}
                    animalId={animal.id}
                    colorIndex={selectedColorIndex}
                    size="md" 
                  />
                  {selectedAnimal === animal.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <p className="text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3 mt-4 sm:mt-6">Choose Background Color:</p>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3 mb-4">
              {AVATAR_COLORS.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColorIndex(index)}
                  className={`relative group transition-all p-2 sm:p-3 rounded-lg ${
                    selectedColorIndex === index
                      ? "ring-2 ring-white scale-105"
                      : "hover:scale-105 opacity-80 hover:opacity-100"
                  }`}
                  title={`Color ${index + 1}`}
                >
                  <div className={`${color} w-full h-10 sm:h-12 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg`}>
                    {(session?.user as { publicUsername?: string })?.publicUsername?.charAt(0).toUpperCase() || '?'}
                  </div>
                  {selectedColorIndex === index && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedAnimal(null)}
              className={`w-full p-2.5 sm:p-3 rounded-lg border transition-all text-sm sm:text-base ${
                selectedAnimal === null
                  ? "border-orange-500 bg-orange-500/10 text-white"
                  : "border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
              }`}
            >
              Use Default Letter Avatar
            </button>
          </div>

          <Button
            onClick={handleSaveAvatar}
            disabled={savingAvatar || (selectedAnimal === (session?.user as { avatarId?: string })?.avatarId && selectedColorIndex === (session?.user as { colorIndex?: number })?.colorIndex)}
            className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-sm sm:text-base"
          >
            <Save className="w-4 h-4 mr-2" />
            {savingAvatar ? "Saving..." : "Save Avatar"}
          </Button>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-xl border border-white/10 p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Account Information</h2>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-400 mb-2">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Public Username
              </label>
              <div className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-gray-300 text-sm sm:text-base">
                {(session?.user as { publicUsername?: string })?.publicUsername}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This is your anonymous username that others see. It cannot be changed.
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-400 mb-2">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Email
              </label>
              <div className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-gray-300 blur-sm select-none text-sm sm:text-base">
                {session?.user?.email}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your email is private and hidden for your security.
              </p>
            </div>
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 rounded-xl border border-red-500/20 p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-red-400 mb-3 sm:mb-4">Danger Zone</h2>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Delete Account</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
              Once you delete your account, there is no going back. All your posts, comments, 
              and data will be permanently deleted. This action cannot be undone.
            </p>
            
            <Button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {loading ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
