import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';
import type { Portfolio as PortfolioData } from '@/types/resume.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/ui/optimized-image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { staggerContainer, staggerItem, viewportOptions } from '@/utils/animations';

interface PortfolioProps {
  data?: PortfolioData;
}

interface Project {
  title: string;
  category: string;
  image: string;
  url: string;
  technologies?: string[];
}

export default function Portfolio({ data }: PortfolioProps) {
  if (!data) return null;

  const { projects } = data;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="portfolio" className="section-padding bg-gray-50 dark:bg-slate-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
        >
          {/* Section Title */}
          <motion.div variants={staggerItem} className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 mb-4">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              A showcase of impactful projects that solve real-world problems and delight users
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const projectImage = `images/portfolio/${project.image}`;
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOptions}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative overflow-hidden aspect-video">
                      <OptimizedImage
                        src={projectImage}
                        alt={project.title}
                        width={600}
                        height={400}
                        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setSelectedProject(project)}
                            className="flex-1 bg-white/90 hover:bg-white text-slate-900"
                          >
                            View Details
                          </Button>
                          {project.url !== '#' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(project.url, '_blank')}
                              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                        {project.category}
                      </p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="text-xs bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-300 hover:from-cyan-500/20 hover:to-blue-500/20 transition-colors"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedProject.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-lg aspect-video">
                  <OptimizedImage
                    src={`images/portfolio/${selectedProject.image}`}
                    alt={selectedProject.title}
                    width={800}
                    height={450}
                    className="w-full h-full"
                  />
                </div>
                <DialogDescription className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {selectedProject.category}
                </DialogDescription>
                {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedProject.url !== '#' && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => window.open(selectedProject.url, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Project
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
