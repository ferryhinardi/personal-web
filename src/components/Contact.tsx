import {useState} from 'react';
import {useForm, ValidationError} from '@formspree/react';
import {motion} from 'framer-motion';
import {Send, MapPin, Mail, CheckCircle2, AlertCircle, Sparkles} from 'lucide-react';
import type {MainData} from '@/types/resume.types';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {SectionTransition} from '@/components/ui/section-transition';
import {TiltCard} from '@/components/ui/tilt-card';
import {staggerContainer, staggerItem, viewportOptions} from '@/utils/animations';
import {sendWebhookNotifications, getWebhookConfig, trackFormSubmission} from '@/utils/webhooks';

interface ContactProps {
  data?: MainData;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact({ data }: ContactProps) {
  if (!data) return null;

  const { address, email, contactmessage } = data;
  
  // Formspree hook - Gets form ID from environment variable
  const formspreeId = import.meta.env.VITE_FORMSPREE_FORM_ID || 'YOUR_FORM_ID';
  const [state, handleFormspreeSubmit] = useForm(formspreeId);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Submit to Formspree
    await handleFormspreeSubmit(e);
    
    // If Formspree submission succeeded, send webhook notifications
    if (state.succeeded) {
      // Send to configured webhooks (Slack, Discord, Telegram)
      try {
        const webhookConfig = getWebhookConfig();
        await sendWebhookNotifications(formData, webhookConfig);
      } catch (error) {
        console.error('Webhook notification failed:', error);
        // Don't block user experience if webhooks fail
      }

      // Track analytics
      trackFormSubmission(formData);

      // Clear form on success
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      {/* Section Transition from Portfolio */}
      <SectionTransition
        type="tilt"
        position="top"
        fillColor="rgb(255, 255, 255)"
        backgroundColor="rgb(249, 250, 251)"
        height={80}
        className="dark:hidden"
      />
      <SectionTransition
        type="tilt"
        position="top"
        fillColor="rgb(15, 23, 42)"
        backgroundColor="rgb(30, 41, 59)"
        height={80}
        className="hidden dark:block"
      />

      <section id="contact" className="section-padding bg-white dark:bg-slate-900">
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
                <Send className="w-8 h-8 text-white" />
              </div>
              <h2 className="section-title">Get In Touch</h2>
              <p className="section-subtitle max-w-2xl mx-auto">{contactmessage}</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <motion.div variants={staggerItem} className="lg:col-span-2">
                <TiltCard maxTilt={3} glare={false} shadow>
                  <Card>
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Your full name"
                            className={`transition-all duration-300 focus:ring-2 focus:ring-cyan-500/20 ${errors.name ? 'border-red-500' : ''}`}
                            disabled={state.submitting}
                            required
                          />
                          <ValidationError prefix="Name" field="name" errors={state.errors} />
                          {errors.name && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="your.email@example.com"
                            className={`transition-all duration-300 focus:ring-2 focus:ring-cyan-500/20 ${errors.email ? 'border-red-500' : ''}`}
                            disabled={state.submitting}
                            required
                          />
                          <ValidationError prefix="Email" field="email" errors={state.errors} />
                          {errors.email && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Subject Field */}
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            value={formData.subject}
                            onChange={(e) => handleChange('subject', e.target.value)}
                            placeholder="What is this regarding?"
                            className="transition-all duration-300 focus:ring-2 focus:ring-cyan-500/20"
                            disabled={state.submitting}
                          />
                          <ValidationError prefix="Subject" field="subject" errors={state.errors} />
                        </div>

                        {/* Message Field */}
                        <div className="space-y-2">
                          <Label htmlFor="message">
                            Message <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={(e) => handleChange('message', e.target.value)}
                            placeholder="Your message here..."
                            rows={6}
                            className={`transition-all duration-300 focus:ring-2 focus:ring-cyan-500/20 ${errors.message ? 'border-red-500' : ''}`}
                            disabled={state.submitting}
                            required
                          />
                          <ValidationError prefix="Message" field="message" errors={state.errors} />
                          {errors.message && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.message}
                            </p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                            disabled={state.submitting}
                          >
                            {state.submitting ? (
                              <>
                                <motion.span
                                  animate={{rotate: 360}}
                                  transition={{duration: 1, repeat: Infinity, ease: 'linear'}}
                                  className="mr-2"
                                >
                                  <Sparkles className="w-4 h-4" />
                                </motion.span>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </motion.div>

                        {/* Success Message */}
                        {state.succeeded && (
                          <motion.div
                            initial={{opacity: 0, y: -10, scale: 0.95}}
                            animate={{opacity: 1, y: 0, scale: 1}}
                            transition={{type: 'spring', stiffness: 200, damping: 20}}
                            className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            <p className="font-medium">
                              Your message was sent successfully! I'll get back to you soon.
                            </p>
                          </motion.div>
                        )}

                        {/* Error Message */}
                        {state.errors && Object.keys(state.errors).length > 0 && !state.succeeded && (
                          <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg"
                          >
                            <AlertCircle className="w-5 h-5" />
                            <p className="font-medium">
                              Something went wrong. Please try again later.
                            </p>
                          </motion.div>
                        )}
                      </form>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>

              {/* Contact Info */}
              <motion.div variants={staggerItem} className="space-y-6">
                <TiltCard maxTilt={6} glare={false} shadow>
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Contact Information
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <motion.div
                          className="flex items-start gap-3"
                          whileHover={{x: 4}}
                          transition={{type: 'spring', stiffness: 300}}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Location</p>
                            <p className="text-sm text-gray-700 dark:text-slate-300">
                              {address.street}
                              <br />
                              {address.city}, {address.state} {address.zip}
                            </p>
                          </div>
                        </motion.div>

                        <motion.a
                          href={`mailto:${email}`}
                          className="flex items-start gap-3 group"
                          whileHover={{x: 4}}
                          transition={{type: 'spring', stiffness: 300}}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center group-hover:bg-sky-200 dark:group-hover:bg-sky-900/50 transition-colors">
                            <Mail className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Email</p>
                            <p className="text-sm text-sky-600 dark:text-sky-400 hover:underline break-all">
                              {email}
                            </p>
                          </div>
                        </motion.a>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>

                <TiltCard maxTilt={8} glare shadow>
                  <Card className="bg-gradient-to-br from-sky-400 to-blue-500 border-0">
                    <CardContent className="p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Available for Work</h3>
                      <p className="text-sm text-white/90">
                        I'm currently available for freelance work and full-time opportunities.
                        Let's discuss how I can help with your project!
                      </p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
