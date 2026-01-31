import {motion} from 'framer-motion';
import {Code2, ExternalLink, Rocket} from 'lucide-react';
import type {Project} from '@/types/resume.types';
import {Button} from '@/components/ui/button';
import {TechStack} from '@/components/ui/tech-badge';
import OptimizedImage from '@/components/ui/optimized-image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

// Animation variants for staggered content
const containerVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const imageVariants = {
  hidden: {opacity: 0, scale: 0.95},
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 20,
      duration: 0.5,
    },
  },
};

const metricVariants = {
  hidden: {opacity: 0, scale: 0.8, y: 10},
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 15,
      delay: i * 0.05,
    },
  }),
};

const buttonVariants = {
  hidden: {opacity: 0, y: 10},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 150,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    transition: {type: 'spring' as const, stiffness: 400, damping: 10},
  },
  tap: {scale: 0.98},
};

export function ProjectModal({project, onClose}: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <DialogHeader>
            <motion.div variants={itemVariants}>
              <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
            </motion.div>
          </DialogHeader>

          {/* Project Image with zoom animation */}
          <motion.div
            variants={imageVariants}
            className="relative overflow-hidden rounded-lg aspect-video"
          >
            <motion.div
              className="w-full h-full"
              whileHover={{scale: 1.05}}
              transition={{duration: 0.4, ease: 'easeOut'}}
            >
              <OptimizedImage
                src={`/images/portfolio/${project.image}`}
                alt={project.title}
                width={800}
                height={450}
                responsive={false}
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>

          {/* Project Metadata */}
          {(project.role || project.team || project.duration) && (
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400"
            >
              {project.role && (
                <motion.div
                  whileHover={{scale: 1.05}}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800"
                >
                  <span className="font-semibold">Role:</span> {project.role}
                </motion.div>
              )}
              {project.team && (
                <motion.div
                  whileHover={{scale: 1.05}}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800"
                >
                  <span className="font-semibold">Team:</span> {project.team}
                </motion.div>
              )}
              {project.duration && (
                <motion.div
                  whileHover={{scale: 1.05}}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800"
                >
                  <span className="font-semibold">Duration:</span> {project.duration}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Short Description */}
          {project.description && (
            <motion.div variants={itemVariants}>
              <DialogDescription className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {project.description}
              </DialogDescription>
            </motion.div>
          )}

          {/* Challenge Section */}
          {project.challenge && (
            <motion.div variants={itemVariants} className="space-y-2">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <motion.span
                  initial={{rotate: -10, scale: 0}}
                  animate={{rotate: 0, scale: 1}}
                  transition={{type: 'spring', stiffness: 300, delay: 0.3}}
                  className="text-amber-500"
                >
                  🎯
                </motion.span>{' '}
                Challenge
              </h4>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {project.challenge}
              </p>
            </motion.div>
          )}

          {/* Solution Section */}
          {project.solution && (
            <motion.div variants={itemVariants} className="space-y-2">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <motion.span
                  initial={{rotate: -10, scale: 0}}
                  animate={{rotate: 0, scale: 1}}
                  transition={{type: 'spring', stiffness: 300, delay: 0.4}}
                  className="text-blue-500"
                >
                  💡
                </motion.span>{' '}
                Solution
              </h4>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {project.solution}
              </p>
            </motion.div>
          )}

          {/* Impact Section */}
          {project.impact && (
            <motion.div variants={itemVariants} className="space-y-2">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <motion.span
                  initial={{rotate: -10, scale: 0}}
                  animate={{rotate: 0, scale: 1}}
                  transition={{type: 'spring', stiffness: 300, delay: 0.5}}
                  className="text-green-500"
                >
                  📈
                </motion.span>{' '}
                Impact
              </h4>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {project.impact}
              </p>
            </motion.div>
          )}

          {/* Project Metrics Section */}
          {project.metrics && Object.keys(project.metrics).length > 0 && (
            <motion.div variants={itemVariants} className="space-y-3">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <motion.span
                  initial={{rotate: -10, scale: 0}}
                  animate={{rotate: 0, scale: 1}}
                  transition={{type: 'spring', stiffness: 300, delay: 0.6}}
                  className="text-purple-500"
                >
                  📊
                </motion.span>{' '}
                Key Metrics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {project.metrics.users && (
                  <motion.div
                    custom={0}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Users</div>
                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {project.metrics.users}
                    </div>
                  </motion.div>
                )}
                {project.metrics.revenueIncrease && (
                  <motion.div
                    custom={1}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Revenue Increase
                    </div>
                    <div className="text-lg font-bold text-green-700 dark:text-green-300">
                      {project.metrics.revenueIncrease}
                    </div>
                  </motion.div>
                )}
                {project.metrics.performanceScore && (
                  <motion.div
                    custom={2}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Performance
                    </div>
                    <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                      {project.metrics.performanceScore}/100
                    </div>
                  </motion.div>
                )}
                {project.metrics.conversionIncrease && (
                  <motion.div
                    custom={3}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Conversion Increase
                    </div>
                    <div className="text-lg font-bold text-amber-700 dark:text-amber-300">
                      {project.metrics.conversionIncrease}
                    </div>
                  </motion.div>
                )}
                {project.metrics.loadTimeReduction && (
                  <motion.div
                    custom={4}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Load Time Saved
                    </div>
                    <div className="text-lg font-bold text-teal-700 dark:text-teal-300">
                      {project.metrics.loadTimeReduction}
                    </div>
                  </motion.div>
                )}
                {project.metrics.toolsCount && (
                  <motion.div
                    custom={5}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Tools Available
                    </div>
                    <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                      {project.metrics.toolsCount}
                    </div>
                  </motion.div>
                )}
                {project.metrics.userSatisfaction && (
                  <motion.div
                    custom={6}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200 dark:border-rose-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      User Satisfaction
                    </div>
                    <div className="text-lg font-bold text-rose-700 dark:text-rose-300">
                      {project.metrics.userSatisfaction}
                    </div>
                  </motion.div>
                )}
                {project.metrics.activeUsers && (
                  <motion.div
                    custom={7}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Active Users
                    </div>
                    <div className="text-lg font-bold text-violet-700 dark:text-violet-300">
                      {project.metrics.activeUsers}
                    </div>
                  </motion.div>
                )}
                {project.metrics.bookingTimeReduction && (
                  <motion.div
                    custom={8}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 border border-lime-200 dark:border-lime-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Booking Time Saved
                    </div>
                    <div className="text-lg font-bold text-lime-700 dark:text-lime-300">
                      {project.metrics.bookingTimeReduction}
                    </div>
                  </motion.div>
                )}
                {project.metrics.sellers && (
                  <motion.div
                    custom={9}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-200 dark:border-sky-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Sellers</div>
                    <div className="text-lg font-bold text-sky-700 dark:text-sky-300">
                      {project.metrics.sellers}
                    </div>
                  </motion.div>
                )}
                {project.metrics.transactions && (
                  <motion.div
                    custom={10}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Transactions
                    </div>
                    <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                      {project.metrics.transactions}
                    </div>
                  </motion.div>
                )}
                {project.metrics.verifiedProperties && (
                  <motion.div
                    custom={11}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 border border-fuchsia-200 dark:border-fuchsia-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Verified Properties
                    </div>
                    <div className="text-lg font-bold text-fuchsia-700 dark:text-fuchsia-300">
                      {project.metrics.verifiedProperties}
                    </div>
                  </motion.div>
                )}
                {project.metrics.safetyRating && (
                  <motion.div
                    custom={12}
                    variants={metricVariants}
                    whileHover={{scale: 1.05, y: -2}}
                    className="p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 cursor-default"
                  >
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Safety Rating
                    </div>
                    <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                      {project.metrics.safetyRating}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Fallback to category if no new fields */}
          {!project.description && !project.challenge && (
            <motion.div variants={itemVariants}>
              <DialogDescription className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {project.category}
              </DialogDescription>
            </motion.div>
          )}

          {/* Technologies Used */}
          {project.technologies && project.technologies.length > 0 && (
            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Technologies Used
              </h4>
              <TechStack technologies={project.technologies} />
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex gap-3 pt-4">
            {project.liveUrl && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex-1"
              >
                <Button
                  onClick={() => window.open(project.liveUrl, '_blank')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  View Live Demo
                </Button>
              </motion.div>
            )}
            {project.url !== '#' && project.url !== project.liveUrl && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex-1"
              >
                <Button
                  onClick={() => window.open(project.url, '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  More Info
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
