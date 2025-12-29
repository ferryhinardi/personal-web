import parser from 'html-react-parser';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, User } from 'lucide-react';
import type { MainData } from '@/types/resume.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { staggerContainer, staggerItem, viewportOptions } from '@/utils/animations';

interface AboutProps {
  data?: MainData;
}

export default function About({ data }: AboutProps) {
  if (!data) return null;

  const { name, image, bio, address, email, resumedownload } = data;
  const profilepic = `images/${image}`;

  const contactDetails = [
    {
      icon: MapPin,
      label: 'Location',
      value: `${address.city}, ${address.state}`,
      fullAddress: `${address.street}, ${address.city} ${address.state}, ${address.zip}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
    },
  ];

  return (
    <section id="about" className="section-padding bg-gray-50 dark:bg-slate-800/50">
      <div id="main-content" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="max-w-6xl mx-auto"
        >
          {/* Section Title */}
          <motion.div variants={staggerItem} className="text-center mb-12">
            <h2 className="section-title">About Me</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The story behind the code—my journey, passion, and what makes me tick as a developer
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Profile Image & Quick Info */}
            <motion.div variants={staggerItem} className="lg:col-span-1">
              <Card className="overflow-hidden sticky top-24">
                <CardContent className="p-6">
                  {/* Profile Image */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                  >
                    <OptimizedImage
                      src={profilepic}
                      alt={`${name} - Software Engineer`}
                      className="w-full h-auto aspect-square rounded-2xl shadow-xl"
                      priority={true}
                      responsive={true}
                      useWebP={true}
                    />
                  </motion.div>

                  {/* Name */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      Software Engineer & Problem Solver
                    </p>
                  </div>

                  <Separator className="my-6" />

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Let's Connect
                    </h4>
                    {contactDetails.map((detail) => {
                      const Icon = detail.icon;
                      const content = (
                        <div className="flex items-start gap-3 group">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/40 transition-colors">
                            <Icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              {detail.label}
                            </p>
                            <p
                              className="text-sm text-gray-900 dark:text-white font-medium break-words"
                              title={detail.fullAddress}
                            >
                              {detail.value}
                            </p>
                          </div>
                        </div>
                      );

                      return detail.href ? (
                        <a
                          key={detail.label}
                          href={detail.href}
                          className="block hover:bg-gray-50 dark:hover:bg-slate-700/50 -mx-3 px-3 py-2 rounded-lg transition-colors"
                        >
                          {content}
                        </a>
                      ) : (
                        <div
                          key={detail.label}
                          className="block -mx-3 px-3 py-2"
                        >
                          {content}
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="my-6" />

                  {/* Download Resume Button */}
                  <Button
                    asChild
                    className="w-full btn-primary"
                    size="lg"
                  >
                    <a href={resumedownload} download>
                      <Download className="w-5 h-5 mr-2" />
                      Get My Resume
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Bio */}
            <motion.div variants={staggerItem} className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <span className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
                      My Story
                    </h3>
                    
                    {bio && (
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                        {parser(bio)}
                      </div>
                    )}

                    {/* Key Highlights */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        By The Numbers
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          {
                            number: '5+',
                            label: 'Years of Excellence',
                            color: 'from-cyan-500 to-blue-600',
                          },
                          {
                            number: '10+',
                            label: 'Successful Projects',
                            color: 'from-blue-500 to-purple-600',
                          },
                          {
                            number: '95%',
                            label: 'React.js Mastery',
                            color: 'from-purple-500 to-pink-600',
                          },
                          {
                            number: '∞',
                            label: 'Always Evolving',
                            color: 'from-pink-500 to-red-600',
                          },
                        ].map((stat) => (
                          <motion.div
                            key={stat.label}
                            whileHover={{ scale: 1.05 }}
                            className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border border-gray-200 dark:border-gray-600"
                          >
                            <div
                              className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
                            >
                              {stat.number}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {stat.label}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack Preview */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        My Tech Arsenal
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'React.js',
                          'TypeScript',
                          'Next.js',
                          'React Native',
                          'JavaScript',
                          'GraphQL',
                          'AWS',
                          'GitHub Actions',
                        ].map((tech) => (
                          <motion.span
                            key={tech}
                            whileHover={{ scale: 1.1 }}
                            className="px-4 py-2 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 text-sm font-medium border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors cursor-default"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
