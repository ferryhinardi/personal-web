import { Code2, ExternalLink, Rocket } from 'lucide-react';
import type { Project } from '@/types/resume.types';
import { Button } from '@/components/ui/button';
import { TechStack } from '@/components/ui';
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

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {project.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-lg aspect-video">
            <OptimizedImage
              src={`/images/portfolio/${project.image}`}
              alt={project.title}
              width={800}
              height={450}
              responsive={false}
              className="w-full h-full"
            />
          </div>
          
          {/* Project Metadata */}
          {(project.role || project.team || project.duration) && (
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
              {project.role && (
                <div>
                  <span className="font-semibold">Role:</span> {project.role}
                </div>
              )}
              {project.team && (
                <div>
                  <span className="font-semibold">Team:</span> {project.team}
                </div>
              )}
              {project.duration && (
                <div>
                  <span className="font-semibold">Duration:</span> {project.duration}
                </div>
              )}
            </div>
          )}

          {/* Short Description */}
          {project.description && (
            <DialogDescription className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {project.description}
            </DialogDescription>
          )}

          {/* Challenge Section */}
          {project.challenge && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-amber-500">🎯</span> Challenge
              </h4>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {project.challenge}
              </p>
            </div>
          )}

          {/* Solution Section */}
          {project.solution && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-500">💡</span> Solution
              </h4>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {project.solution}
              </p>
            </div>
          )}

          {/* Impact Section */}
          {project.impact && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-green-500">📈</span> Impact
              </h4>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {project.impact}
              </p>
            </div>
          )}

          {/* Project Metrics Section */}
          {project.metrics && Object.keys(project.metrics).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-purple-500">📊</span> Key Metrics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {project.metrics.users && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Users</div>
                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{project.metrics.users}</div>
                  </div>
                )}
                {project.metrics.revenueIncrease && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Revenue Increase</div>
                    <div className="text-lg font-bold text-green-700 dark:text-green-300">{project.metrics.revenueIncrease}</div>
                  </div>
                )}
                {project.metrics.performanceScore && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Performance</div>
                    <div className="text-lg font-bold text-purple-700 dark:text-purple-300">{project.metrics.performanceScore}/100</div>
                  </div>
                )}
                {project.metrics.conversionIncrease && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Conversion Increase</div>
                    <div className="text-lg font-bold text-amber-700 dark:text-amber-300">{project.metrics.conversionIncrease}</div>
                  </div>
                )}
                {project.metrics.loadTimeReduction && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Load Time Saved</div>
                    <div className="text-lg font-bold text-teal-700 dark:text-teal-300">{project.metrics.loadTimeReduction}</div>
                  </div>
                )}
                {project.metrics.toolsCount && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Tools Available</div>
                    <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{project.metrics.toolsCount}</div>
                  </div>
                )}
                {project.metrics.userSatisfaction && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200 dark:border-rose-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">User Satisfaction</div>
                    <div className="text-lg font-bold text-rose-700 dark:text-rose-300">{project.metrics.userSatisfaction}</div>
                  </div>
                )}
                {project.metrics.activeUsers && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Active Users</div>
                    <div className="text-lg font-bold text-violet-700 dark:text-violet-300">{project.metrics.activeUsers}</div>
                  </div>
                )}
                {project.metrics.bookingTimeReduction && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 border border-lime-200 dark:border-lime-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Booking Time Saved</div>
                    <div className="text-lg font-bold text-lime-700 dark:text-lime-300">{project.metrics.bookingTimeReduction}</div>
                  </div>
                )}
                {project.metrics.sellers && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-200 dark:border-sky-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Sellers</div>
                    <div className="text-lg font-bold text-sky-700 dark:text-sky-300">{project.metrics.sellers}</div>
                  </div>
                )}
                {project.metrics.transactions && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Transactions</div>
                    <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{project.metrics.transactions}</div>
                  </div>
                )}
                {project.metrics.verifiedProperties && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 border border-fuchsia-200 dark:border-fuchsia-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Verified Properties</div>
                    <div className="text-lg font-bold text-fuchsia-700 dark:text-fuchsia-300">{project.metrics.verifiedProperties}</div>
                  </div>
                )}
                {project.metrics.safetyRating && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Safety Rating</div>
                    <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{project.metrics.safetyRating}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fallback to category if no new fields */}
          {!project.description && !project.challenge && (
            <DialogDescription className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {project.category}
            </DialogDescription>
          )}

          {/* Technologies Used */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Technologies Used
              </h4>
              <TechStack technologies={project.technologies} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {project.liveUrl && (
              <Button
                onClick={() => window.open(project.liveUrl, '_blank')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Rocket className="w-4 h-4 mr-2" />
                View Live Demo
              </Button>
            )}
            {project.url !== '#' && project.url !== project.liveUrl && (
              <Button
                onClick={() => window.open(project.url, '_blank')}
                variant="outline"
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                More Info
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
