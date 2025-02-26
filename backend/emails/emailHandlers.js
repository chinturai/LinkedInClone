import { mailtrapclient, sender } from './../lib/mailtrap.js';
import { createWelcomeEmailTemplate , createConnectionAcceptedEmailTemplate, createCommentNotificationEmailTemplate } from './emailTemplates.js';

export const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapclient.send({
            from: sender,
            to: recipient,
            subject:"Welcome to LinkedIn Clone - By Chintu Rai",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category:"welcome"
        })

        console.log("Welcome Email sent successfully");
    } catch (error) {
        throw error;
    }
};

export const sendCommentNotificationEmail = async(recipientEmail, recipientName, commenterName, postUrl, commentContent ) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapclient.send({
            from: sender,
            to: recipient,
            subject:"New comment on your post 👀 (LinkedIn By Chintu Rai)",
            html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
            category:"comment_notification"  
        })

        console.log("Comment Notification Email sent successfully ! ");
    } catch (error) {
        throw error;
    }
}