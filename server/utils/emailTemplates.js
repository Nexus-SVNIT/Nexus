const link = 'https://nexus-svnit.in';
const newPostTemplate = (author, postTitle, id) => ({
    subject: 'Your Interview Experience Post Has Been Created',
    html: `
    <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
            <p>
            <h3 style="color: white;">Dear ${author.fullName},</h3>
            </p>
            <p style="color: #ccc;">
                Your interview experience post "${postTitle}" has been successfully created.Thank you for sharing your experience with the community!You will receive notifications when others ask questions on your post.
            </p>
            <p style="color: #ccc;">Visit <a href="${link}/interview-experiences/post/${id}" style="color: #1a73e8;">this link</a> for more details.</p>
            <p>Thanks,<br>Team NEXUS</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>Contact us: <a href="mailto:nexus@coed.svnit.ac.in" style="color: #1a73e8;">nexus@coed.svnit.ac.in</a></p>
            <p>Follow us on <a href="https://www.linkedin.com/company/nexus-svnit/" style="color: #1a73e8;">LinkedIn</a> <a href="https://www.instagram.com/nexus_svnit/" style="color: #1a73e8;">Instagram</a></p>
        </div>
    </div>
    `
});

const newQuestionTemplate = (author, postTitle, question, askedBy, id) => ({
    subject: 'New Question on Your Interview Experience Post',
    html: `
    <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
            <p>
            <h3 style="color: white;">Dear ${author.fullName},</h3>
            </p>
            <p style="color: #ccc;">
                    <p>Someone has asked a question on your post "${postTitle}"</p>
                    <p><strong>Question by ${askedBy.fullName}:</strong></p>
                    <p style="color:black; padding: 10px; background-color: #f5f5f5; border-left: 4px solid #007bff;">
                    ${question}
                    </p>
                    <p>Login to your account to answer this question.</p>
            </p>
            <p style="color: #ccc;">Visit <a href="${link}/interview-experiences/post/${id}" style="color: #1a73e8;">this link</a> for more details.</p>
            <p>Thanks,<br>Team NEXUS</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>Contact us: <a href="mailto:nexus@coed.svnit.ac.in" style="color: #1a73e8;">nexus@coed.svnit.ac.in</a></p>
            <p>Follow us on <a href="https://www.linkedin.com/company/nexus-svnit/" style="color: #1a73e8;">LinkedIn</a> <a href="https://www.instagram.com/nexus_svnit/" style="color: #1a73e8;">Instagram</a></p>
        </div>
    </div>
  `
});

const newCommentTemplate = (author, postTitle, comment, commentedBy, id) => ({
    subject: 'New Comment on Your Interview Experience Post',
    html: `
    <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
            <p>
            <h3 style="color: white;">Dear ${author.fullName},</h3>
            </p>
            <p style="color: #ccc;">
                <p>Someone has commented on your post "${postTitle}"</p>
                <p><strong>Comment by ${commentedBy.fullName}:</strong></p>
                <p style="color:black; padding: 10px; background-color: #f5f5f5; border-left: 4px solid #007bff;">
                ${comment}
                </p>
            </p>
            <p style="color: #ccc;">Visit <a href="${link}/interview-experiences/post/${id}" style="color: #1a73e8;">this link</a> for more details.</p>
            <p>Thanks,<br>Team NEXUS</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>Contact us: <a href="mailto:nexus@coed.svnit.ac.in" style="color: #1a73e8;">nexus@coed.svnit.ac.in</a></p>
            <p>Follow us on <a href="https://www.linkedin.com/company/nexus-svnit/" style="color: #1a73e8;">LinkedIn</a> <a href="https://www.instagram.com/nexus_svnit/" style="color: #1a73e8;">Instagram</a></p>
        </div>
    </div>
    `
});

const newAnswerTemplate = (author, postTitle, question, answer, answeredBy, id) => ({
    subject: 'New Answer to Your Question',
    html: `
    <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
            <p>
            <h3 style="color: white;">Dear ${author.fullName},</h3>
            </p>
            <p style="color: #ccc;">
                <p>Someone has answered your question on the post "${postTitle}"</p>
                <p><strong>Your Question:</strong></p>
                <p style="color:black; padding: 10px; background-color: #f5f5f5; border-left: 4px solid #007bff;">
                ${question}
                </p>
                <p><strong>Answer by ${answeredBy.fullName}:</strong></p>
                <p style="color:black; padding: 10px; background-color: #f5f5f5; border-left: 4px solid #28a745;">
                ${answer}
                </p>
            </p>
            <p style="color: #ccc;">Visit <a href="${link}/interview-experiences/post/${id}" style="color: #1a73e8;">this link</a> for more details.</p>
            <p>Thanks,<br>Team NEXUS</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>Contact us: <a href="mailto:nexus@coed.svnit.ac.in" style="color: #1a73e8;">nexus@coed.svnit.ac.in</a></p>
            <p>Follow us on <a href="https://www.linkedin.com/company/nexus-svnit/" style="color: #1a73e8;">LinkedIn</a> <a href="https://www.instagram.com/nexus_svnit/" style="color: #1a73e8;">Instagram</a></p>
        </div>
    </div>
    `
});

const postVerificationTemplate = (author, postTitle, id) => ({
    subject: 'Your Interview Experience Post Has Been Verified',
    html: `
    <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
            <p>
            <h3 style="color: white;">Dear ${author.fullName},</h3>
            </p>
            <p style="color: #ccc;">
                Your interview experience post "${postTitle}" has been verified and is now live on the platform. Thank you for contributing to the community!
            </p>
            <p style="color: #ccc;">Visit <a href="${link}/interview-experiences/post/${id}" style="color: #1a73e8;">this link</a> to view your post.</p>
            <p>Thanks,<br>Team NEXUS</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>Contact us: <a href="mailto:nexus@coed.svnit.ac.in" style="color: #1a73e8;">nexus@coed.svnit.ac.in</a></p>
            <p>Follow us on <a href="https://www.linkedin.com/company/nexus-svnit/" style="color: #1a73e8;">LinkedIn</a> <a href="https://www.instagram.com/nexus_svnit/" style="color: #1a73e8;">Instagram</a></p>
        </div>
    </div>
    `
});

const postCreationTemplate = (author, postTitle, id) => ({
    subject: 'Your Interview Experience Post Is Under Review',
    html: `
    <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
            <p>
            <h3 style="color: white;">Dear ${author.fullName},</h3>
            </p>
            <p style="color: #ccc;">
                Thank you for sharing your interview experience with the community! Your post "${postTitle}" has been successfully created and is currently under review by the NEXUS Core Team.
            </p>
            <p style="color: #ccc;">
                Once verified, your post will be visible to all users on the platform. You will receive a notification when your post is approved.
            </p>
            <p style="color: #ccc;">Visit <a href="${link}/interview-experiences/post/${id}" style="color: #1a73e8;">this link</a> to view your post after verification.</p>
            <p>Thanks,<br>Team NEXUS</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>Contact us: <a href="mailto:nexus@coed.svnit.ac.in" style="color: #1a73e8;">nexus@coed.svnit.ac.in</a></p>
            <p>Follow us on <a href="https://www.linkedin.com/company/nexus-svnit/" style="color: #1a73e8;">LinkedIn</a> <a href="https://www.instagram.com/nexus_svnit/" style="color: #1a73e8;">Instagram</a></p>
        </div>
    </div>
    `
});

const postEditTemplate = (user, postTitle, postId) => ({
  subject: 'Your Interview Experience Post Has Been Updated',
  html: `
  <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
            <p>
            <h2>Post Update Under Review</h2>
            <h3 style="color: white;">Dear ${user.fullName},</h3>
            </p>
            <p style="color: #ccc;">
                Your edited interview experience post "${postTitle}" has been submitted for review. You will be notified once it is verified.F            </p>
            <p style="color: #ccc;">
                Your post will be visible to others after verification by our team.
            </p>
            <p style="color: #ccc;">Visit <a href="${link}/interview-experiences/post/${postId}" style="color: #1a73e8;">this link</a> to view your post after verification.</p>
            <p>Thanks,<br>Team NEXUS</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>Contact us: <a href="mailto:nexus@coed.svnit.ac.in" style="color: #1a73e8;">nexus@coed.svnit.ac.in</a></p>
            <p>Follow us on <a href="https://www.linkedin.com/company/nexus-svnit/" style="color: #1a73e8;">LinkedIn</a> <a href="https://www.instagram.com/nexus_svnit/" style="color: #1a73e8;">Instagram</a></p>
        </div>
    </div>
  `
});

const alumniVerificationTemplate = (name) => ({
    subject: 'Alumni Status Verified',
    html: `
    <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
            <p>
            <h3 style="color: white;">Dear ${name},</h3>
            </p>
            <p style="color: #ccc;">
                Your alumni status has been verified by the NEXUS team. You now have full access to the alumni features on the platform.
            </p>
            <p>Thanks,<br>Team NEXUS</p>
        </div>
    </div>
    `
});

const alumniRejectionTemplate = (name) => ({
    subject: 'Alumni Status Update',
    html: `
    <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
            <p>
            <h3 style="color: white;">Dear ${name},</h3>
            </p>
            <p style="color: #ccc;">
                Your alumni verification request has been reviewed and could not be verified at this time. Please ensure you meet all eligibility criteria and try again.
            </p>
            <p>Thanks,<br>Team NEXUS</p>
        </div>
    </div>
    `
});

const alumniEmailVerificationTemplate = ({fullName, verificationUrl}) => ({
  subject: 'Verify Your Alumni Email - NEXUS',
  html: `
    <div style="background-color: black; color: white; font-size: 14px; padding: 20px;">
      <div style="margin-bottom: 25px; display:flex; justify-content: center;">
        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width:350px"/>
      </div>
      <p>Dear ${fullName},</p>
      <p>Thank you for registering on the NEXUS alumni portal.</p>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" style="display:inline-block; padding:10px 20px; background-color:skyblue; color:black; border-radius:5px; text-decoration:none;">Verify Email</a>
      <p>This verification is required to review and approve your alumni profile.</p>
      <p>Thanks,<br/>Team NEXUS</p>
    </div>
  `,
});

const alumniEmailVerifiedTemplate = ({fullName}) => ({
  subject: 'Email Verified - Alumni Account Under Review',
  html: `
    <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
      <div style="margin-bottom: 25px; display:flex; justify-content: center;">
        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width:350px"/>
      </div>
      <div>Dear ${fullName},</div>
      <p>Thank you for verifying your email address. As an alumni member, your account requires additional verification from our team.</p>
      <p>Your account is currently under review. Once approved, you will be able to log in to the NEXUS portal.</p>
      <p>We will notify you via email once the verification is complete.</p>
      <p>Thanks,<br>Team NEXUS</p>
    </div>
  `,
});

const formEmailTemplate=({name,desc,deadline})=>({
    subject: `New Form Released: ${form.name}`,
        text: `New Form Released: ${form.name}. Apply before deadline.`,
        html: `
            <div style="background-color: black; color: white; font-size: 12px; padding: 20px;">
                <div style="margin-bottom: 40px; margin-left:20%; margin-right:20%; width: 60%; display: flex; justify-content: center;">
                    <img style="width:100%" src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" alt="Nexus Logo"/>
                </div>
                <div>Dear Devesh,</div>
                <p>A new form has been released:</p>
                <div style="margin-bottom: 20px;">
                    <strong>Name:</strong> ${form.name}
                </div>
                <div style="margin-bottom: 20px;">
                    <strong>Description:</strong> ${form.desc}
                </div>
                <div style="margin-bottom: 20px;">
                    <strong>Deadline:</strong> ${form.deadline}
                </div>
                <div style="margin-bottom: 20px;">
                    <strong>Link to apply:</strong> <a href="https://nexus-svnit.in/forms" style="color: #1a73e8;">Apply Now</a>
                </div>
                <p>Thanks,<br>Team NEXUS</p>
            </div>
        `,
    });



module.exports = { 
    newPostTemplate, 
    newQuestionTemplate, 
    newCommentTemplate,
    newAnswerTemplate,
    postVerificationTemplate,
    postCreationTemplate,
    postEditTemplate,
    alumniVerificationTemplate,
    alumniRejectionTemplate,
    alumniEmailVerificationTemplate,
    alumniEmailVerifiedTemplate,
    formEmailTemplate
};
