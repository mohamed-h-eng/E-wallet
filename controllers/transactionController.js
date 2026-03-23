const Account = require("../models/Account")
const Transaction = require("../models/Transaction")
const Audit = require("../models/Audit")
const mongoose= require("mongoose")

const depositController = async(req,res)=>{
    const { amount } = req.body;
    const userId = req.user.id;

    // Validate amount
    if (!amount || amount <= 0)
        return res.status(400).json({ message: 'Invalid amount' });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // credit account
        const account = await Account.findOneAndUpdate(
            { user_id: userId },
            { $inc: { balance: amount } },
            {returnDocument: 'after', session }
        );

        //record transaction
        await Transaction.create([{
            sender_iban: null,      // null = external/system
            receiver_iban: account.iban,
            amount,
            type: 'deposit',
            status: 'Accepted',
            note: 'Mock card deposit'
        }], { session });

        //  audit log
        await AuditLog.create([{
            user_id: userId,
            action: 'DEPOSIT',
            description: `User deposited ${amount}`,
        }], { session });

        await session.commitTransaction();

        res.status(200).json({
            msg: 'Deposit successful',
            new_balance: account.balance
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ msg: 'Deposit failed',data:error.message });
    }
}
//send money
const sendController = async (req,res)=>{
    try{
        //validate user
        
        // // const{name, email} = req.body;
        // let user = await User.findOne({email})
        // if(!user) {
        //     return res.status(201).json({
        //         message:"User Is Not Registered",
        //         data:""
        //     })
        // }
        
        //validate receiver

        //validate not self transfer
        // check daily/transaction limit
        // check transaction amount limit
        // check suffecient balance
    }catch(error){
        res.status(400).json({
            message:"Sending Failed"
        })
    }
}
//view transactions

module.exports = {
    depositController,
    sendController
}