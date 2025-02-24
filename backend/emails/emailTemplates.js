export function createWelcomeEmailTemplate(name, profileUrl) {
	return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to LinkedIn Clone - By Chintu Rai</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f4f4f4;
      }
      .header {
        background: linear-gradient(to right, #0077B5, #00A0DC);
        padding: 30px;
        text-align: center;
        border-radius: 10px 10px 0 0;
      }
      .content {
        background-color: #ffffff;
        padding: 30px;
        border-radius: 0 0 10px 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      .button {
        background-color: #0077B5;
        color: white;
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 30px;
        font-weight: bold;
        font-size: 16px;
        display: inline-block;
        transition: background-color 0.3s;
      }
      .highlight {
        background-color: #f3f6f8;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="LinkedIn Clone Logo" style="width: 150px; margin-bottom: 20px; border-radius: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to LinkedIn Clone - By Chintu Rai!</h1>
    </div>
    <div class="content">
      <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${name},</strong></p>
      <p>We're thrilled to have you join our professional community! LinkedIn Clone is your platform to connect, learn, and grow in your career. This is an exact replica of LinkedIn made by Chintu Rai.</p>
      <div class="highlight">
        <p style="font-size: 16px; margin: 0;"><strong>Here's how to get started:</strong></p>
        <ul style="padding-left: 20px;">
          <li>Complete your profile</li>
          <li>Connect with colleagues and friends</li>
          <li>Join groups relevant to your interests</li>
          <li>Explore job opportunities</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${profileUrl}" class="button">Complete Your Profile</a>
      </div>
      <p>If you have any questions or need assistance, our support team is always here to help.</p>
      <p>Best regards,<br>The LinkedIn Clone Team</p>
    </div>
  </body>
  </html>
  `;
}

export const createConnectionAcceptedEmailTemplate = (senderName, recipientName, profileUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connection Request Accepted</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .header {
      background: linear-gradient(to right, #0077B5, #00A0DC);
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 0 0 10px 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .button {
      background-color: #0077B5;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 30px;
      font-weight: bold;
      font-size: 16px;
      display: inline-block;
      transition: background-color 0.3s;
    }
    .highlight {
      background-color: #f3f6f8;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="LinkedIn Clone Logo" style="width: 150px; margin-bottom: 20px; border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">Connection Accepted!</h1>
  </div>
  <div class="content">
    <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${senderName},</strong></p>
    <p>Great news! <strong>${recipientName}</strong> has accepted your connection request on LinkedIn Clone.</p>
    <div class="highlight">
      <p style="font-size: 16px; margin: 0;"><strong>What's next?</strong></p>
      <ul style="padding-left: 20px;">
        <li>Check out ${recipientName}'s full profile</li>
        <li>Send a message to start a conversation</li>
        <li>Explore mutual connections and interests</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${profileUrl}" class="button">View ${recipientName}'s Profile</a>
    </div>
    <p>Expanding your professional network opens up new opportunities. Keep connecting!</p>
    <p>Best regards,<br>The LinkedIn Clone Team</p>
  </div>
</body>
</html>
`;

export const createCommentNotificationEmailTemplate = (recipientName, commenterName, postUrl, commentContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Comment on Your Post</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .header {
      background: linear-gradient(to right, #0077B5, #00A0DC);
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .header img {
      width: 150px;
      margin-bottom: 20px;
      border-radius: 10px;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
    }
    .content {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 0 0 10px 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .greeting {
      font-size: 18px;
      color: #0077B5;
      font-weight: bold;
    }
    .comment-box {
      background-color: #f3f6f8;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      font-style: italic;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      background-color: #0077B5;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 30px;
      font-weight: bold;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #005f8b;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="UnLinked Logo" />
    <h1>New Comment on Your Post</h1>
  </div>
  <div class="content">
    <p class="greeting">Hello ${recipientName},</p>
    <p>${commenterName} has commented on your post:</p>
    <div class="comment-box">
      <p>"${commentContent}"</p>
    </div>
    <div class="button-container">
      <a href="${postUrl}" class="button">View Comment</a>
    </div>
    <p>Stay engaged with your network by responding to comments and fostering discussions.</p>
    <p>Best regards,<br>The UnLinked Team</p>
  </div>
</body>
</html>
`;

