import { User, Settings, FileText, HelpCircle, LogOut, ChevronLeft, Shield, Bell, Globe, Star, Moon, Sun, MapPin, Lock, Camera, Edit3, Mail, Phone, Calendar, Save, Volume2, VolumeX, Trash2, Info, MessageSquare, ShoppingBag, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useCallback } from 'react';
import { ProfileLocationSetup } from './ProfileLocationSetup';
import { useUser } from '../../utils/UserContext';
import { SubscriptionsScreen } from './SubscriptionsScreen';
import { AIToolsDashboard } from './AIToolsDashboard';
import { toast } from 'sonner@2.0.3';