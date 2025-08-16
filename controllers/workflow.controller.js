import dayjs from 'dayjs';
import {createRequire} from 'module';
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';
const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express');



const REMINDERS = [7,5,2,1]; // days before renewal date

export const sendReminders = serve(async (context)=>{
     console.log("Workflow triggered with payload:", context.requestPayload);

    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);
    console.log("Fetched subscription:", subscription);

    if(!subscription || subscription.status !== 'active') return; 


    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())){
        console.log(`Renweal data has passed for subscription ${subscriptionId} , Stopping workflow`);
        return;
    }

    for(const daysBefore of REMINDERS){
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        // const reminderDate = dayjs().add((i + 1) * 10, "second");
        // renwel date =. 22 feb , reminder date 15 feb , 17 feb 

        if(reminderDate.isAfter(dayjs())){
           
            await sleeepUntilReminder(context, `reminder-${daysBefore} days before`, reminderDate);
           
        }

        if(dayjs().isSame(reminderDate, 'day')){
            await triggerReminder(context, `${daysBefore} days before reminder`,subscription);
        }

        // "5 days before reminder"
      

      
    }


});

const fetchSubscription = async (context, subscriptionId) => {

    return await context.run('get subscription', async ()=>{
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    });

};

const sleeepUntilReminder = async (context,label, date)=>{
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

// this could be not always reminder, but also some other action
// like something taht you want to run periodically , based on some algorithm, or some logic

const triggerReminder = async (context,label,subscription)=>{
    return await context.run(label,async()=>{
        console.log(`Triggering ${label} reminder`);

        // Here you would send the actual reminder, e.g., via email or notification

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })


    })
}