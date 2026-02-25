import { Metadata } from 'next'

import { MailIcon, MapPinIcon, PhoneIcon, SendIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const metadata: Metadata = {
  title: 'Contact Us | JNUITS',
  description: 'Get in touch with the Jagannath University IT Society',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Have questions about our events, membership, or collaborations?
            We&apos;d love to hear from you. Reach out to the Jagannath
            University IT Society using the details below.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column: Contact Info */}
          <div className="space-y-8">
            <Card className="border-slate-200 bg-white/50 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-500/10">
                  <MapPinIcon className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Our Location
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">
                    Science Faculty Building,
                    <br />
                    Jagannath University,
                    <br />
                    Dhaka, Bangladesh
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/50 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10">
                  <MailIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Email Us
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    jnuits@gmail.com
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    support@jnuits.org
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/50 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/10">
                  <PhoneIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Call Us
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    +880 1700-000000
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Available Sun-Thu, 9am - 5pm
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Contact Form */}
          <Card className="border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-3xl font-bold dark:text-white">
                Send a Message
              </CardTitle>
              <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                Fill out the form below and our team will get back to you as
                soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="dark:text-slate-300">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="dark:text-slate-300">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="dark:text-slate-300">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    className="bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="dark:text-slate-300">
                    Message
                  </Label>
                  <textarea
                    id="message"
                    rows={5}
                    className="flex w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:ring-offset-slate-950 dark:placeholder:text-slate-500 dark:focus-visible:ring-slate-300"
                    placeholder="Your message here..."
                  />
                </div>

                <Button
                  className="w-full bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                  size="lg"
                >
                  <SendIcon className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
