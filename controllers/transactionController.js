const User = require("../models/User")
const Account = require("../models/Account")
const Transaction = require("../models/Transaction")
const AuditLog = require("../models/Audit")
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
            sender_iban: "Master/Visa Card",
            receiver_iban:account.iban,
            amount,
            type: 'deposit',
            status: 'Accepted',
            note: 'Mock card deposit'
        }],{ session });

        //  audit log
        await AuditLog.create([{
            user_id: userId,
            action: 'DEPOSIT',
            description: `User deposited ${amount}`,
        }], { session });

        await session.commitTransaction();

        res.status(200).json({
            msg: 'Deposit successful',
            data:account,
            new_balance: account.balance
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ msg: 'Deposit failed',data:error.message });
    }finally{
        await session.endSession()
    }
}
//send money
const sendController = async (req,res)=>{
    try{
        
        //validate receiver
        const {receiver_iban, amount, note} = req.body
        const token = req.headers.authorization.split(" ")[1]
        console.log(receiver_iban, amount, note)
        const receiver = await Account.findOne({iban:receiver_iban})
        if(!receiver) return res.status(404).json({msg:"receiver not fount"})
        
        //validate not self transfer
        const sender = await Account.findOne({user_id:req.user._id})
        const isSelfTransfer = await Account.findOne({iban:receiver.iban})
        if(isSelfTransfer.iban==sender.iban) return res.status(400).json({msg:"Self transfer is forbidden"})
        
        //validate active account
        if(sender.status != "active") {
            if(sender.status == "closed") return res.status(400).json({msg:"Sorry account is closed"})
            return res.status(400).json({msg:`Transfer failed cause account is ${sender.status}`})
        }
        
        // check daily/transaction limit = 3
        const limit = 3
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0)

        const todayCount = await Transaction.countDocuments({
            sender_iban:sender.iban,
            type:'transfer',
            createdAt:{$gte: startOfDay},
        });
        if (todayCount >= limit) return res.status(403).json({msg:'Daily transaction limit reached'});

        // check transaction amount limit = 10,000
        if(amount > 10000) return res.status(403).json({msg:"Transaction amount exceed transfer limit (10,000)"})
        
        // check suffecient balance
        if(sender.amount < amount) return res.status(403).json({msg:"Transfer failed",data:"Insuffecient balance"})
        
        session.startTransaction()
        
        //debit from sender
        await Account.findOneAndUpdate(
            {user_id: sender.user_id},
            { $inc: { balance: -amount}},
            {returnDocument: 'after'},
            {session}
        );
        //credit to receiver
        await Account.findOneAndUpdate(
            {user_id: receiver.user_id },
            { $inc: {balance:amount}},
            {returnDocument: 'after'},
            {session }
        );

        //record transaction
        const transaction = await Transaction.create([{
            sender_iban: sender.iban,      // null = external/system
            receiver_iban: receiver.iban,
            amount,
            type: 'transfer',
            status: 'Accepted',
            note
        }], { session });

        //  audit log
        await AuditLog.create([{
            user_id: sender.user_id,
            action: 'TRANSFER',
            description: `User transfered amount:${amount} to Account ${receiver.iban}`,
        }], { session });

        await session.commitTransaction();

        res.status(201).json({msg:"Transfer is Successful",data:transaction})

    }catch(error){
        await session.abortTransaction()
        res.status(400).json({
            message:"Sending Failed",
            data:error.message
        })
    }finally{
        session.endSession()
    }
}
//view transactions
const readController = async(req,res)=>{
    try {
        const account = await Account.findOne({user_id:req.user._id})
        // const transactions = await Transaction.find({sender_iban:account.iban})
        const transactions = await Transaction.find({
        $or: [
            { sender_iban: account.iban },
            { receiver_iban: account.iban }
        ]
        }).sort({ createdAt: -1 });  // latest first
        // return console.log(account.iban)
        if(!transactions) return res.status(404).json({msg:"No transactions found", data:account})
        return res.status(200).json({
            msg:"transactions retrieved successfully",
            data:transactions
        })
    } catch (error) {
        res.status(500).json({ msg: 'Transaction view failed',data:error.message });
    }
}
module.exports = {
    depositController,
    sendController,
    readController
}