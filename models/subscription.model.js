import mongoose, { mongo } from "mongoose"

const subscriptionSchema = new mongoose.Schema({

    name:{
        type:String,
        required : [true, 'Subscription Name is required'],
        trim : true,
        minLength : 2 ,
        maxLength : 100 ,
    },

    price:{
        type:Number,
        required : [true, 'Subscription Price is required'],
        min: [0,'Price cannot be negative'],

    },

    currency:{
        type:String,
        enum: ['USD', 'EUR', 'GBP', 'INR'],
        default: 'USD',
    },

    frequency:{
        type:String,
        enum: ['monthly', 'yearly', 'weekly', 'daily'],
    },

    category:{
        type:String,
        enum: ['entertainment', 'utilities', 'food', 'health', 'education', 'other'],
        required: [true, 'Subscription Category is required'],
    },

    paymentMethod:{
        type:String,
        required: [true, 'Payment Method is required'],
        trim : true,
    },

    status:{
        type:String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'active',
    },

    startDate : {
        type: Date,
        required: [true, 'Start Date is required'],
        validate : {
            validator : (value)=> value <= new Date(),
            message : 'Start Date cannot be in the future'
        }
    },

     renewalDate : {
        type: Date,
        validate : {
            validator : function(value){ return value > this.startDate },
            message : 'Renewal Date must be after Start Date'
        }
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true,
        index:true, 
    }

    
},{timestamps:true});



// auto calculate renewelDate based on frequency
subscriptionSchema.pre('save', function(next) {

    if(!this.renewalDate){
        const renewalPeriods = {
            daily :1,
            weekly : 7,
            monthly : 30,
            yearly : 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }


    // auto update the status based on renewalDate
    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }

    next();


});



const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;