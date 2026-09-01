import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Chart02Icon,
  SparklesIcon,
  LoginCircle01Icon,
  LogoutCircle01Icon,
  Wallet02Icon,
  FireIcon,
  FileDownloadIcon,
  VegetarianFoodIcon,
  MoneyBag02Icon,
  TransactionHistoryIcon,
  BadgePlusIcon,
  ArrowBigRightDashIcon,
  MenuRestaurantIcon,
  Notification01Icon,
  WavingHand02Icon,
} from '@hugeicons/core-free-icons';

interface IconProps {
  className?: string;
  size?: number;
}

export function IconAI({ className = 'text-kg-gold', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={SparklesIcon} size={size} className={className} />;
}

export function IconTransactionHistory({ className = 'text-kg-green', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={TransactionHistoryIcon} size={size} className={className} />;
}

export function IconBadePlus({ className = 'text-kg-green', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={BadgePlusIcon} size={size} className={className} />;
}

export function IconLogin({ className = 'text-kg-coral', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={LoginCircle01Icon} size={size} className={className} />;
}

export function IconLogout({ className = 'text-kg-coral', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={LogoutCircle01Icon} size={size} className={className} />;
}

export function IconBudget({ className = 'text-kg-green', size = 24 }: IconProps) {
  return <HugeiconsIcon icon={Wallet02Icon} size={size} className={className} />;
}

export function IconFire({ className = 'text-kg-coral', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={FireIcon} size={size} className={className} />;
}

export function IconPDF({ className = 'text-kg-ink', size = 18 }: IconProps) {
  return <HugeiconsIcon icon={FileDownloadIcon} size={size} className={className} />;
}

export function IconArrowRight({ className = '', size = 16 }: IconProps) {
  return <HugeiconsIcon icon={ArrowBigRightDashIcon} size={size} className={className} />;
}

export function IconChart({ className = 'text-kg-gold', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={Chart02Icon} size={size} className={className} />;
}

export function IconVegetarionFood({ className = 'text-kg-gold', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={VegetarianFoodIcon} size={size} className={className} />;
}

export function IconMoneyBag({ className = 'text-kg-gold', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={MoneyBag02Icon} size={size} className={className} />;
}

export function IconMenu({ className = 'text-kg-gold', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={MenuRestaurantIcon} size={size} className={className} />;
}

export function IconNotification({ className = 'text-kg-gold', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={Notification01Icon} size={size} className={className} />;
}

export function IconWavingHand({ className = 'text-kg-gold', size = 20 }: IconProps) {
  return <HugeiconsIcon icon={WavingHand02Icon} size={size} className={className} />;
}
