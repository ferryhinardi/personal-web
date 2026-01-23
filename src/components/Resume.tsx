import {GraduationCap, Briefcase, Award, TrendingUp, Github} from 'lucide-react';
import {lazy, Suspense} from 'react';
import {motion} from 'framer-motion';
import type {ResumeSection} from '@/types/resume.types';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {GitHubActivity} from '@/components/ui/github-activity';
import {SectionTransition} from '@/components/ui/section-transition';
import {ScrollRevealTimeline, TimelineItem} from '@/components/ui/scroll-reveal-timeline';
import {TiltCard} from '@/components/ui/tilt-card';
import {staggerContainer, staggerItem, viewportOptions} from '@/utils/animations';

// Lazy load the heavy recharts component
const SkillsRadar = lazy(() => import('@/components/ui/skills-radar'));

interface ResumeProps {
  data?: ResumeSection;
}

export default function Resume({data}: ResumeProps) {
  if (!data) {
    return (
      <section id="resume" className="section-padding bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="section-title">Resume</h2>
            <p className="text-gray-600 dark:text-gray-400">Loading resume data...</p>
          </div>
        </div>
      </section>
    );
  }

  const {skillmessage, education, work, skills} = data;

  return (
    <>
      {/* Section Transition from About */}
      <SectionTransition
        type="curve"
        position="top"
        fillColor="rgb(255, 255, 255)"
        backgroundColor="rgb(249, 250, 251)"
        height={80}
        className="dark:hidden"
      />
      <SectionTransition
        type="curve"
        position="top"
        fillColor="rgb(15, 23, 42)"
        backgroundColor="rgb(30, 41, 59)"
        height={80}
        className="hidden dark:block"
      />

      <section id="resume" className="section-padding bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            className="max-w-6xl mx-auto"
          >
            {/* Section Title */}
            <motion.div variants={staggerItem} className="text-center mb-16">
              <h2 className="section-title">Resume</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                A journey of continuous learning, innovative solutions, and technical mastery
              </p>
            </motion.div>

            {/* Education Section */}
            <motion.div variants={staggerItem} className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Building the foundation for excellence
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {education && education.length > 0 ? (
                  education.map((edu, index) => (
                    <motion.div
                      key={edu.school}
                      initial={{opacity: 0, y: 30}}
                      whileInView={{opacity: 1, y: 0}}
                      viewport={{once: true, margin: '-50px'}}
                      transition={{
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                        delay: index * 0.15,
                      }}
                    >
                      <TiltCard maxTilt={5} glare={false} shadow>
                        <Card className="hover:shadow-xl transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                  {edu.school}
                                </h4>
                                <p className="text-lg text-cyan-700 dark:text-cyan-300 font-medium mb-2">
                                  {edu.degree}
                                </p>
                              </div>
                              <Badge variant="secondary" className="text-sm self-start">
                                {edu.graduated}
                              </Badge>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {edu.description}
                            </p>
                          </CardContent>
                        </Card>
                      </TiltCard>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No education data available.</p>
                )}
              </div>
            </motion.div>

            <Separator className="my-16" />

            {/* Work Experience Section */}
            <motion.div variants={staggerItem} className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Work Experience
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Where passion meets impact
                  </p>
                </div>
              </div>

              {/* Scroll Reveal Timeline */}
              <ScrollRevealTimeline lineGradient="from-cyan-500 via-blue-500 to-purple-500">
                {work && work.length > 0 ? (
                  work.map((job, index) => (
                    <TimelineItem
                      key={job.company}
                      index={index}
                      dotColor="from-cyan-500 to-blue-600"
                    >
                      <TiltCard maxTilt={4} glare={false} shadow>
                        <Card className="hover:shadow-xl transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                  {job.company}
                                </h4>
                                <p className="text-lg text-cyan-700 dark:text-cyan-300 font-medium">
                                  {job.title}
                                </p>
                              </div>
                              <Badge variant="outline" className="self-start whitespace-nowrap">
                                {job.years}
                              </Badge>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {job.description}
                            </p>
                          </CardContent>
                        </Card>
                      </TiltCard>
                    </TimelineItem>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No work experience data available.
                  </p>
                )}
              </ScrollRevealTimeline>
            </motion.div>

            <Separator className="my-16" />

            {/* GitHub Activity Section */}
            <motion.div variants={staggerItem} className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    GitHub Activity
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Recent contributions and open source work
                  </p>
                </div>
              </div>

              <GitHubActivity username="ferryhinardi" maxEvents={5} showStats={true} />
            </motion.div>

            <Separator className="my-16" />

            {/* Skills Section */}
            <motion.div variants={staggerItem}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Technical Skills
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tools I wield to build amazing things
                  </p>
                </div>
              </div>

              <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{type: 'spring', stiffness: 100, damping: 20}}
              >
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-cyan-700 dark:text-cyan-300 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {skillmessage}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skill Bars */}
              {skills && skills.length > 0 ? (
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      Loading skills visualization...
                    </div>
                  }
                >
                  <SkillsRadar skills={skills} />
                </Suspense>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No skills data available.</p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
