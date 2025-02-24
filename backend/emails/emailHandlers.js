import { mailtrapclient, sender } from './../lib/mailtrap';
import { createWelcomeEmailTemplate , createConnectionAcceptedEmailTemplate, createCommentNotificationEmailTemplate } from './emailTemplates';

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