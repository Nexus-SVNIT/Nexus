const nodemailer = require('nodemailer');

const EMAIL_ID = process.env.EMAIL_ID;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_ID,
        pass: EMAIL_PASSWORD
    }
});

function emailHeader() {
    return `
    <div class='header'>
        <img class='logo' src='https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC' alt='Nexus Logo' />
        <div class='subtitle'>Departmental Cell of DoCSE & DoAI, SVNIT Surat</div>
    </div>
    `;
}

function emailFooter() {
    return `
    <div class='footer'>
        <div><b>Team Nexus</b> &bull; CSE & AI Departments, SVNIT Surat</div>
        <div>Contact: <a href='mailto:nexus@coed.svnit.ac.in' style='color:#00c6fb;text-decoration:none;'>nexus@coed.svnit.ac.in</a> | <a href='https://www.nexus-svnit.in' style='color:#00c6fb;text-decoration:none;'>nexus-svnit.in</a></div>
        <div>Follow us: <a href='https://www.linkedin.com/company/nexus-svnit' style='color:#00c6fb;text-decoration:none;'>LinkedIn</a> | <a href='https://www.instagram.com/nexus.svnit/' style='color:#00c6fb;text-decoration:none;'>Instagram</a></div>
    </div>
    `;
}

function emailWrapper(contentHtml) {
    return `
    <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <style>
                body { background: #111; color: #fff; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; }
                .container { max-width: 650px; margin: 40px auto; background: #181818; border-radius: 14px; box-shadow: 0 2px 16px rgba(0,0,0,0.18); overflow: hidden; }
                .header { background: #000; color: #fff; padding: 32px 0 18px 0; text-align: center; }
                .logo { max-height: 70px; margin-bottom: 10px; }
                .title { font-size: 26px; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.5px; }
                .subtitle { font-size: 16px; color: #bbb; }
                .content { padding: 38px 30px 30px 30px; color: #fff; }
                .button-link { display:inline-block; padding:10px 15px; background-color:#0078d4; color:#fff; border-radius:8px; text-decoration:none; font-weight:600; margin: 12px 8px; font-size: 14px; transition: background 0.2s; border:none; }
                .button-link:hover { background-color:#005fa3; }
                .footer { background: #181818; color: #aaa; text-align: center; font-size: 14px; padding: 22px 12px; border-top: 1px solid #222; }
                ul { margin: 18px 0 26px 0; padding-left: 22px; }
                .mandatory { color: #ff5252; font-weight: bold; }
                .section-title { font-size: 18px; color: #00c6fb; font-weight: 600; margin-top: 30px; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class='container'>
                ${emailHeader()}
                ${contentHtml}
                ${emailFooter()}
            </div>
        </body>
    </html>
    `;
}

async function sendAlumniWelcomeEmail(user) {
    const contentHtml = `
        <div class='content'>
            <p>Dear ${user.fullName || 'Alumnus'},</p>
            <p>Congratulations on achieving this important milestone. As you step into the next chapter of your journey, we are pleased to welcome you to the <b><span style='color: #00c6fb;'>Nexus Alumni Network</span></b> – the official alumni community for the <i>CSE & AI Departments of SVNIT</i>.</p>
            <p>Your time at SVNIT has contributed to the legacy of our department, and now, as an alumnus, you become an integral part of the Nexus community that connects students, faculty, and alumni. Through this network, we aim to create opportunities for mentorship, collaboration, and sharing expertise with the batches to come.</p>
            <div>To include you in our alumni directory and ensure smooth communication, we request you to share the following details:</div>
            <ul>
                <li><span class='mandatory'>Branch*</span></li>
                <li><span class='mandatory'>LinkedIn Profile*</span> (URL)</li>
                <li><span class='mandatory'>Company Name*</span></li>
                <li><span class='mandatory'>Designation*</span></li>
                <li><span class='mandatory'>Expertise*</span> (Areas you excel in – e.g., AI/ML, Software Development, Cloud, etc.)</li>
                <li>GitHub Profile (URL)</li>
                <li>LeetCode Profile (ID – e.g., <code>neal_wu</code>)</li>
                <li>Codeforces Profile (ID – e.g., <code>tourist</code>)</li>
                <li>CodeChef Profile (ID)</li>
            </ul>
            <div>To get started:</div>
            <div style='margin: 28px 0 18px 0; text-align: center;'>
                <a href='https://www.nexus-svnit.in/alumni' class='button-link'>Visit Alumni Network Page</a><br>
                <a href='https://www.nexus-svnit.in/profile' class='button-link'>Update Your Profile</a><br>
                <a href='https://www.nexus-svnit.in/interview-experience' class='button-link'>Share Interview Experience</a>
            </div>
            <p>This information will help us build a comprehensive alumni network and allow current students to connect with you for guidance and mentorship.</p>
            <p>We look forward to your continued involvement and support as part of the Nexus community.</p>
            <p>Warm Regards,<br>Team Nexus</p>
        </div>
    `;
    const html = emailWrapper(contentHtml);
    await transporter.sendMail({
        from: EMAIL_ID,
        to: user.personalEmail,
        subject: "Congratulations – You’re Now Part of the Nexus Alumni Network",
        html
    });
}

module.exports = { sendAlumniWelcomeEmail, emailHeader, emailFooter };
