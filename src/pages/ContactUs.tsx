import { useState, useEffect } from 'react';
import GamingHeader from "@/components/GamingHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Bug, Paperclip, Send, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Helmet } from 'react-helmet-async';
import emailjs from '@emailjs/browser';
import { supabase } from "../integrations/supabase/client";
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";

const titleVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const cardVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
  },
};

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', attachment: null as File | null, });
  const [isLoading, setIsLoading] = useState(false);
  const [showBouncyLoader, setShowBouncyLoader] = useState(true);

  useEffect(() => {
    const bouncyTimer = setTimeout(() => {
      setShowBouncyLoader(false);
    }, 800);
    return () => clearTimeout(bouncyTimer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        if (e.target.files[0].size > 5 * 1024 * 1024) { // 5MB limit
            toast({ title: "File Too Large", description: "Please upload a file smaller than 5MB.", variant: "destructive", });
            e.target.value = '';
            return;
        }
        setFormData(prev => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        toast({ title: "Please fill all required fields.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    let attachmentUrl = "No attachment provided.";
    if (formData.attachment) {
        const file = formData.attachment;
        const fileName = `${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from('contact-attachments').upload(fileName, file);
        if (error) {
            console.error("Supabase Upload Error:", error);
            toast({ title: "Failed to upload attachment.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        const { data: { publicUrl } } = supabase.storage.from('contact-attachments').getPublicUrl(fileName);
        attachmentUrl = publicUrl;
    }
    const templateParams = { name: formData.name, email: formData.email, subject: formData.subject, message: formData.message, attachment_url: attachmentUrl, };
    // IMPORTANT: Replace with your actual EmailJS credentials
    const serviceId = "YOUR_SERVICE_ID";
    const templateId = "YOUR_TEMPLATE_ID";
    const publicKey = "YOUR_PUBLIC_KEY";
    try {
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
        toast({ title: "Message Sent!", description: "Thanks for reaching out. We'll get back to you soon.", });
        setFormData({ name: '', email: '', subject: '', message: '', attachment: null });
        const fileInput = document.getElementById('attachment') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    } catch (error) {
        console.error("EmailJS Error:", error);
        toast({ title: "Failed to send message.", description: "Please try again later.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>Contact Us - DSY Studio</title>
        <meta name="description" content="Get in touch with DSY Studio. Send us a message, report a bug, or just say hello. We'd love to hear from you." />
      </Helmet>
      <BouncyLoader isLoading={showBouncyLoader} />
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div className="text-center mb-12" variants={titleVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Get In Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Have a question, a bug to report, or an idea to share? We'd love to hear from you.</p>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="gaming-card max-w-2xl mx-auto">
                <CardHeader><CardTitle className="flex items-center"><Mail className="mr-2"/>Contact Form</CardTitle><CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" placeholder="Your Name" required value={formData.name} onChange={handleInputChange} /></div>
                            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="your.email@example.com" required value={formData.email} onChange={handleInputChange} /></div>
                        </div>
                        <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" placeholder="e.g., Bug Report for Antim Yatra" required value={formData.subject} onChange={handleInputChange} /></div>
                        <div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" placeholder="Describe your issue or question in detail..." className="min-h-[120px]" required value={formData.message} onChange={handleInputChange} /></div>
                        <div className="space-y-2"><Label htmlFor="attachment" className="flex items-center"><Bug className="mr-2 h-4 w-4"/>Report a Bug/Glitch (Optional)</Label><div className="relative border border-dashed border-primary/30 rounded-lg p-4 text-center hover:border-primary/50 transition-colors"><Paperclip className="w-6 h-6 mx-auto mb-2 text-muted-foreground"/><p className="text-sm text-muted-foreground">{formData.attachment ? `File: ${formData.attachment.name}` : "Attach a screenshot or video (Max 5MB)"}</p><Input id="attachment" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,video/*" onChange={handleFileChange}/></div></div>
                        <Button type="submit" variant="gaming" size="lg" className="w-full" disabled={isLoading}>{isLoading ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Sending...</> ) : ( <><Send className="mr-2 h-4 w-4"/> Send Message</> )}</Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;