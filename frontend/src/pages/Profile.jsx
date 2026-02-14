import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
    User,
    Mail,
    GraduationCap,
    Code2,
    Target,
    Calendar,
    Edit2,
    Save,
    X,
    LogOut,
    Shield,
    Trash2
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        university: user?.university || '',
        career_goal: user?.career_goal || '',
        skill_level: user?.skill_level || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                university: user.university || '',
                career_goal: user.career_goal || '',
                skill_level: user.skill_level || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            // TODO: Implement profile update API
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.info('Logged out successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-hero-pattern">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-white">Profile</h1>
                        {!isEditing ? (
                            <motion.button
                                onClick={() => setIsEditing(true)}
                                className="btn-secondary flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </motion.button>
                        ) : (
                            <div className="flex gap-2">
                                <motion.button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="btn-primary flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Save className="w-4 h-4" />
                                    {loading ? 'Saving...' : 'Save'}
                                </motion.button>
                                <motion.button
                                    onClick={() => setIsEditing(false)}
                                    className="btn-secondary flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </motion.button>
                            </div>
                        )}
                    </div>

                    {/* Profile Card */}
                    <div className="card-glass p-8">
                        <div className="flex flex-col md:flex-row items-start gap-8">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center text-3xl font-bold text-white">
                                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4 w-full">
                                {/* Name */}
                                <div className="space-y-1">
                                    <label className="flex items-center gap-2 text-sm text-deep-blue-400">
                                        <User className="w-4 h-4" />
                                        Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 bg-deep-blue-800/50 border border-deep-blue-600 rounded-lg text-white focus:border-neon-purple-500 focus:outline-none"
                                        />
                                    ) : (
                                        <p className="text-xl font-semibold text-white">{user.name || 'Not set'}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                    <label className="flex items-center gap-2 text-sm text-deep-blue-400">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </label>
                                    <p className="text-white">{user.email}</p>
                                </div>

                                {/* University */}
                                <div className="space-y-1">
                                    <label className="flex items-center gap-2 text-sm text-deep-blue-400">
                                        <GraduationCap className="w-4 h-4" />
                                        University
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.university}
                                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                            className="w-full px-4 py-2 bg-deep-blue-800/50 border border-deep-blue-600 rounded-lg text-white focus:border-neon-purple-500 focus:outline-none"
                                            placeholder="Enter your university"
                                        />
                                    ) : (
                                        <p className="text-white">{user.university || 'Not set'}</p>
                                    )}
                                </div>

                                {/* Career Goal */}
                                <div className="space-y-1">
                                    <label className="flex items-center gap-2 text-sm text-deep-blue-400">
                                        <Target className="w-4 h-4" />
                                        Career Goal
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.career_goal}
                                            onChange={(e) => setFormData({ ...formData, career_goal: e.target.value })}
                                            className="w-full px-4 py-2 bg-deep-blue-800/50 border border-deep-blue-600 rounded-lg text-white focus:border-neon-purple-500 focus:outline-none"
                                            placeholder="e.g., ML Engineer, Data Scientist"
                                        />
                                    ) : (
                                        <p className="text-white">{user.career_goal || 'Not set'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Projects Started', value: '0', icon: Code2 },
                            { label: 'Projects Completed', value: '0', icon: Target },
                            { label: 'Days Active', value: '1', icon: Calendar },
                            { label: 'Skill Level', value: user.skill_level || 'Beginner', icon: Shield },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="card-glass p-4 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <stat.icon className="w-6 h-6 mx-auto mb-2 text-neon-purple-400" />
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-sm text-deep-blue-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Account Actions */}
                    <div className="card-glass p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-deep-blue-700/50 hover:bg-deep-blue-600/50 text-deep-blue-200 rounded-lg transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </motion.button>

                            <motion.button
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Profile;
