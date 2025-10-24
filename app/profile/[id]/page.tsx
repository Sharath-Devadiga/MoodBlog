"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Calendar, 
  TrendingUp, 
  FileText, 
  Settings, 
  ArrowLeft,
  User
} from "lucide-react";
import PostCard from "@/app/components/posts/PostCard";
import Avatar from "@/app/components/ui/Avatar";
import { MOODS } from "@/app/utils/constants";
import { format } from "date-fns";

interface User {
  id: string;
  publicUsername: string;
  avatarId: string | null;
  colorIndex: number | null;
  createdAt: string;
  email?: string;
}

interface Post {
  id: string;
  content?: string;
  imageUrl?: string;
  mood: string;
  createdAt: string;
  user: {
    id: string;
    publicUsername: string;
    avatarId?: string;
    colorIndex?: number;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLikedByUser?: boolean;
}

interface MoodStats {
  mood: string;
  count: number;
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.id as string;
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodStats, setMoodStats] = useState<MoodStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOwnProfile = (session?.user as { id?: string })?.id === userId;

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setUser(data.user);
      setPosts(data.posts);
      setFilteredPosts(data.posts);

      const stats = MOODS.map((mood) => ({
        mood: mood.value,
        count: data.posts.filter((p: Post) => p.mood === mood.value).length,
      }));
      setMoodStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (selectedMood) {
      setFilteredPosts(posts.filter((post) => post.mood === selectedMood));
    } else {
      setFilteredPosts(posts);
    }
  }, [selectedMood, posts]);

  const handleBack = () => {
    router.back();
  };

  const getMostCommonMood = () => {
    if (moodStats.length === 0) return "No posts yet";
    const topMood = moodStats.reduce((prev, current) => 
      current.count > prev.count ? current : prev
    );
    const moodData = MOODS.find((m) => m.value === topMood.mood);
    return moodData ? moodData.label : topMood.mood;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error || "User not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
        
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-xl border border-white/10 p-6 mb-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar 
                username={user.publicUsername}
                animalId={user.avatarId}
                colorIndex={user.colorIndex}
                size="xl" 
              />
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {user.publicUsername}
                </h1>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member since {format(new Date(user.createdAt), "MMMM yyyy")}
                </p>
              </div>
            </div>

            
            {isOwnProfile && (
              <button
                onClick={() => router.push("/settings")}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>

          
          {isOwnProfile && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {getMostCommonMood()}
                </div>
                <div className="text-sm text-gray-400">Most Common Mood</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-rose-400 mb-2">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {posts.length}
                </div>
                <div className="text-sm text-gray-400">Total Posts</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-purple-400 mb-2">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {moodStats.length}
                </div>
                <div className="text-sm text-gray-400">Moods Tracked</div>
              </div>
            </div>
          )}
        </motion.div>

        
        {isOwnProfile && moodStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 rounded-xl border border-white/10 p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              Filter by Mood
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedMood(null)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedMood === null
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                All ({posts.length})
              </button>
              {moodStats.map((stat) => {
                const mood = MOODS.find((m) => m.value === stat.mood);
                return (
                  <button
                    key={stat.mood}
                    onClick={() => setSelectedMood(stat.mood)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedMood === stat.mood
                        ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                    }`}
                  >
                    {mood?.label || stat.mood} ({stat.count})
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isOwnProfile ? 0.2 : 0.1 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            {isOwnProfile ? "Your Posts" : `${user.publicUsername}'s Posts`}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl border border-white/10 p-12 text-center">
              <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {selectedMood
                  ? `No ${selectedMood} posts yet`
                  : isOwnProfile
                  ? "You haven't posted anything yet"
                  : "No posts yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {filteredPosts.map((post, index) => {
                
                const transformedPost = {
                  ...post,
                  title: null,
                  content: post.content || null,
                  imageUrl: post.imageUrl || null,
                  user: {
                    ...post.user,
                    avatarId: String(post.user.avatarId),
                    publicUsername: post.user.publicUsername || null,
                  },
                  _count: post._count || { likes: 0, comments: 0 },
                };

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PostCard post={transformedPost} onDelete={() => fetchUserData()} />
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
