import {motion} from 'framer-motion';
import {Card, CardContent} from '@/components/ui/card';
import {staggerItem} from '@/utils/animations';
import type {LucideIcon} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-500',
  description,
}: StatCardProps) {
  return (
    <motion.div variants={staggerItem}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div
              className={`flex-shrink-0 rounded-lg bg-gray-100 dark:bg-slate-600 p-3 ${iconColor}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </p>
              <p className="text-2xl font-bold">{value}</p>
              {description && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
