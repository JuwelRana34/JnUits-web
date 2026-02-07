import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, twoFactor } from 'better-auth/plugins'

import prisma from './prismadb'
import transporter from './sendmail'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  emailAndPassword: { enabled: true, requireEmailVerification: true },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const mailOptions = {
        from: `"JnU it Society" <${process.env.SMTP_EMAIL}>`,
        to: user.email,
        subject: 'Email Verification - Verify Your Account',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #4F46E5; text-align: center;">Verify Your Membership</h2>
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Welcome to our University Club! To complete your registration and ensure security, please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
            <p style="font-size: 13px; color: #666; line-height: 1.5;">This link will expire soon. If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;">
            <p style="font-size: 11px; color: #999; text-align: center;">© 2026 University Club Team</p>
          </div>
        `,
      }

      try {
        await transporter.sendMail(mailOptions)
        console.log(`✅ Verification email sent to ${user.email}`)
      } catch (error) {
        console.error('❌ Error sending email:', error)
      }
    },
  },

  plugins: [
    admin(),
    twoFactor({
      issuer: 'JnUIts',
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          try {
            await transporter.sendMail({
              from: `"JnU IT Society" <${process.env.SMTP_EMAIL}>`,
              to: user.email,
              subject: 'Your Verification Code - JnUIts',
              html: `
            <div style="font-family: sans-serif; text-align: center; padding: 20px;">
              <h2>Security Verification</h2>
              <p>Your one-time password (OTP) is:</p>
              <h1 style="letter-spacing: 5px; color: #4F46E5;">${otp}</h1>
              <p>This code will expire in 10 minutes.</p>
            </div>
          `,
            })
            console.log(`✅ OTP sent successfully to ${user.email}`)
          } catch (error) {
            console.error('❌ Nodemailer Error:', error)
          }
        },
      },
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minute por por database check korbe, majhkhaner somoy cache use hobe
    },
  },
})
