import {
  GraduationCap, Landmark, Globe, BookOpen, House, Users, User, Wifi, Briefcase, ListChecks, Trophy, Trees,
  Heart, Star, Award, Shield, Lightbulb, Music, Dumbbell, Bus, Microscope, Palette, Laptop, Stethoscope,
  Leaf, Target, Handshake, Medal, School, Building2, Sparkles, Utensils, Camera, Calculator, FlaskConical, ShieldCheck,
} from 'lucide-react';

// Icons selectable in the admin (stored by name in page_items.subtitle for the Why AVM block).
export const ICONS = {
  GraduationCap, Landmark, Globe, BookOpen, House, Users, User, Wifi, Briefcase, ListChecks, Trophy, Trees,
  Heart, Star, Award, Shield, ShieldCheck, Lightbulb, Music, Dumbbell, Bus, Microscope, Palette, Laptop, Stethoscope,
  Leaf, Target, Handshake, Medal, School, Building2, Sparkles, Utensils, Camera, Calculator, FlaskConical,
};

export const iconByName = (name) => ICONS[name] || GraduationCap;
