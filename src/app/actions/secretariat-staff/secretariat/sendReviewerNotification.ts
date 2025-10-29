'use server';

import nodemailer from 'nodemailer';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Create admin client
function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function sendReviewerNotification(
  reviewerEmail: string,
  reviewerName: string,
  submissionTitle: string,
  submissionId: string,
  dueDate: string
) {
  try {
    const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    await transporter.sendMail({
      from: `"UMREC - University of Makati" <${process.env.GMAIL_USER}>`,
      to: reviewerEmail,
      subject: 'New Research Submission Assigned for Review - UMREC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #071139; margin: 0;">UMREC</h1>
            <p style="color: #666; margin: 5px 0;">University of Makati Research Ethics Committee</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 30px; border-radius: 10px;">
            <h2 style="color: #071139; margin-top: 0;">New Review Assignment</h2>
            
            <p style="color: #333; line-height: 1.6;">
              Dear <strong>${reviewerName}</strong>,
            </p>
            
            <p style="color: #333; line-height: 1.6;">
              You have been assigned to review a new research submission. Please log in to your UMREC account to access the submission details and begin your review.
            </p>
            
            <div style="background-color: white; padding: 20px; border-left: 4px solid #F0E847; margin: 25px 0;">
              <h3 style="color: #071139; margin-top: 0; font-size: 16px;">Submission Details:</h3>
              <p style="color: #333; margin: 10px 0;">
                <strong>Title:</strong> ${submissionTitle}
              </p>
              <p style="color: #333; margin: 10px 0;">
                <strong>Submission ID:</strong> ${submissionId}
              </p>
              <p style="color: #333; margin: 10px 0;">
                <strong>Review Due Date:</strong> <span style="color: #d32f2f; font-weight: bold;">${formattedDueDate}</span>
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/reviewermodule" 
                 style="background-color: #071139; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Access Reviewer Portal
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Please review the submission thoroughly and submit your evaluation before the due date. If you have any questions or concerns, please contact the UMREC secretariat.
            </p>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Thank you for your valuable contribution to research ethics review.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; margin: 5px 0;">
              © 2025 University of Makati Research Ethics Committee
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Review assignment email sent to ${reviewerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: 'Failed to send email notification' };
  }
}
