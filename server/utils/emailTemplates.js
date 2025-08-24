const link = 'https://www.nexus-svnit.in';
const LINK_COLOR = '#4fc3f7';

const emailWrapperTemplate = (content) => (
    `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            .link {
                color: #4fc3f7;
                text-decoration: none;
            }
            .link:hover {
                text-decoration: underline;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background-color: #00c6fb;
                color: #111 !important;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                margin-top: 12px;
            }
        </style>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0;">
        <div style="max-width: 650px; margin: 40px auto; background: #181818; border-radius: 14px; box-shadow: 0 4px 24px rgba(0,0,0,0.25); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: #1e1e1e; padding: 28px 20px; text-align: center; border-bottom: 1px solid #2c2c2c;">
                <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" alt="Nexus Logo" style="max-height: 70px; margin-bottom: 12px;" />
                <div style="font-size: 15px; color: #bbb;">Departmental Cell of DoCSE & DoAI, SVNIT Surat</div>
            </div>

            <!-- Content -->
            <div style="padding: 30px 28px; color: #ddd; font-size: 16px; line-height: 1.6;">
                ${content}
            </div>

            <!-- Footer -->
            <div style="background: #1e1e1e; color: #aaa; text-align: center; font-size: 14px; padding: 20px; border-top: 1px solid #2c2c2c;">
                <div><strong>Team Nexus</strong> • CSE & AI Departments, SVNIT Surat</div>
                <div style="margin: 6px 0;">
                    Contact: 
                    <a class="link" style="color:${LINK_COLOR};" href="mailto:nexus@coed.svnit.ac.in">nexus@coed.svnit.ac.in</a> |
                    <a class="link" style="color:${LINK_COLOR};" href="https://www.nexus-svnit.in">nexus-svnit.in</a>
                </div>
                <div>
                    Follow us: 
                    <a class="link" style="color:${LINK_COLOR};" href="https://www.linkedin.com/company/nexus-svnit">LinkedIn</a> |
                    <a class="link" style="color:${LINK_COLOR};" href="https://www.instagram.com/nexus.svnit/">Instagram</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `
);

const postCreationTemplate = (author, postTitle, id) => ({
    subject: 'Your Interview Experience Post Is Under Review',
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0;">Dear ${author.fullName || 'Nexus Member'},</h3>
        <p>
            Thank you for sharing your interview experience with the community! Your post titled <strong>"${postTitle}"</strong> has been successfully created and is currently under review by the NEXUS Core Team.
        </p>
        <p>
            Once verified, your post will be visible to all users on the platform. You will receive a notification when your post is approved.
        </p>
        <p>
            You can check your submission status using the button below:
        </p>
        <p>
            <a class="btn" href="${link}/interview-experiences/post/${id}">View Your Post</a>
        </p>
        <p style="margin-top: 28px;">Best regards,<br>Team NEXUS</p>
    `)
});

const newQuestionTemplate = (author, postTitle, question, askedBy, id) => ({
    subject: 'New Question on Your Interview Experience Post',
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0;">Dear ${author.fullName},</h3>
        <p>
            Someone has asked a question on your post <strong>"${postTitle}"</strong>
        </p>
        <p><strong>Question by ${askedBy.fullName}:</strong></p>
        <div style="background-color: #2c2c2c; padding: 15px; border-left: 4px solid #4fc3f7; border-radius: 4px; margin: 15px 0;">
            ${question}
        </div>
        <p>Login to your account to answer this question.</p>
        <p>
            <a class="btn" href="${link}/interview-experiences/post/${id}">View Post & Answer</a>
        </p>
        <p style="margin-top: 28px;">Thanks,<br>Team NEXUS</p>
    `)
});

const newCommentTemplate = (author, postTitle, comment, commentedBy, id) => ({
    subject: 'New Comment on Your Interview Experience Post',
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0;">Dear ${author.fullName},</h3>
        <p>
            Someone has commented on your post <strong>"${postTitle}"</strong>
        </p>
        <p><strong>Comment by ${commentedBy.fullName}:</strong></p>
        <div style="background-color: #2c2c2c; padding: 15px; border-left: 4px solid #4fc3f7; border-radius: 4px; margin: 15px 0;">
            ${comment}
        </div>
        <p>
            <a class="btn" href="${link}/interview-experiences/post/${id}">View Post</a>
        </p>
        <p style="margin-top: 28px;">Thanks,<br>Team NEXUS</p>
    `)
});

const newAnswerTemplate = (author, postTitle, question, answer, answeredBy, id) => ({
    subject: 'New Answer to Your Question',
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0;">Dear ${author.fullName},</h3>
        <p>
            Someone has answered your question on the post <strong>"${postTitle}"</strong>
        </p>
        <p><strong>Your Question:</strong></p>
        <div style="background-color: #2c2c2c; padding: 15px; border-left: 4px solid #4fc3f7; border-radius: 4px; margin: 15px 0;">
            ${question}
        </div>
        <p><strong>Answer by ${answeredBy.fullName}:</strong></p>
        <div style="background-color: #2c2c2c; padding: 15px; border-left: 4px solid #28a745; border-radius: 4px; margin: 15px 0;">
            ${answer}
        </div>
        <p>
            <a class="btn" href="${link}/interview-experiences/post/${id}">View Full Discussion</a>
        </p>
        <p style="margin-top: 28px;">Thanks,<br>Team NEXUS</p>
    `)
});

const postEditTemplate = (user, postTitle, postId) => ({
    subject: 'Your Interview Experience Post Has Been Updated',
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0;">Post Update Under Review</h3>
        <h4>Dear ${user.fullName},</h4>
        <p>
            Your edited interview experience post <strong>"${postTitle}"</strong> has been submitted for review. You will be notified once it is verified.
        </p>
        <p>
            Your post will be visible to others after verification by our team.
        </p>
        <p>
            <a class="btn" href="${link}/interview-experiences/post/${postId}">View Post</a>
        </p>
        <p style="margin-top: 28px;">Thanks,<br>Team NEXUS</p>
    `)
});

const signupEmailTemplate = ({ fullName, verificationUrl }) => {
    const content = `
        <div>
            <div>Dear ${fullName},</div>
            <p>Thank you for registering on NEXUS portal. Please verify your email using following link.</p>
            <a href="${verificationUrl}" class="btn">Verify Your Email</a>
            <p>If you can't click the button, copy and paste this link in your browser:</p>
            <a href="${verificationUrl}" class="link">${verificationUrl}</a>
            <p>Thanks,<br/>Team NEXUS</p>
        </div>
    `;
    return {
        subject: 'Verify your NEXUS Account',
        html: emailWrapperTemplate(content)
    };
};

const forgotPasswordTemplate = ({ fullName, resetUrl }) => {
    const content = `
        <div>
            <div>Dear ${fullName},</div>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}" class="btn">Reset Password</a>
            <p>If you can't click the button, copy and paste this link in your browser:</p>
            <a href="${resetUrl}" class="link">${resetUrl}</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thanks,<br/>Team NEXUS</p>
        </div>
    `;
    return {
        subject: 'Nexus - Password Reset Request',
        html: emailWrapperTemplate(content)
    };
};

const alumniEmailVerificationTemplate = ({fullName, verificationUrl}) => ({
    subject: 'Verify Your Alumni Email - NEXUS',
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0;">Dear ${fullName},</h3>
        <p>
            Thank you for registering on the NEXUS alumni portal.
        </p>
        <p>
            Please verify your email address by clicking the button below:
        </p>
        <p>
            <a class="btn" href="${verificationUrl}">Verify Email</a>
        </p>
        <p>
            This verification is required to review and approve your alumni profile.
        </p>
        <p style="margin-top: 28px;">Thanks,<br>Team NEXUS</p>
    `)
});

const alumniEmailVerifiedTemplate = ({fullName}) => ({
    subject: 'Email Verified - Alumni Account Under Review',
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0;">Dear ${fullName},</h3>
        <p>
            Thank you for verifying your email address.
        </p>
        <p>
            As an alumni member, your account requires additional verification from our team. Your account is currently under review.
        </p>
        <p>
            Once approved, you will be able to log in to the NEXUS portal. We will notify you via email once the verification is complete.
        </p>
        <p style="margin-top: 28px;">Thanks,<br>Team NEXUS</p>
    `)
});

const achievementSubmissionTemplate = (name) => ({
    subject: 'Achievement Submission Under Review',
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0;">Dear ${name},</h3>
        <p>
            Thank you for submitting your achievement on the NEXUS portal.
        </p>
        <p>
            Your submission is currently under review by our team. Once verified, your achievement will be displayed on the website's achievement bulletin section.
        </p>
        <p>
            We appreciate your contributions and look forward to sharing your success with the community!
        </p>
        <p>
            <a class="btn" href="${link}/achievements">View Achievement Bulletin</a>
        </p>
        <p style="margin-top: 28px;">Thanks,<br>Team NEXUS</p>
    `)
});

module.exports = { 
    newQuestionTemplate, 
    newCommentTemplate,
    newAnswerTemplate,
    postCreationTemplate,
    postEditTemplate,
    alumniEmailVerificationTemplate,
    alumniEmailVerifiedTemplate,
    achievementSubmissionTemplate,
    forgotPasswordTemplate,
    signupEmailTemplate
};