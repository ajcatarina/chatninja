import {Messages} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
// import {check} from 'meteor/check';

export default function () {
  Meteor.methods({
    'messagesSend'(messageData) {
     check(messageData, Object);

     Messages.insert(messageData);

     // const bulkOp = Messages.rawCollection().initializeUnorderedBulkOp();
     //
     // messageData.forEach(function(data){
     //  bulkOp.insert(data);
     // });
     //
     // bulkOp.execute()
    },
    'getMessagedUsers'(userId){
     check(userId, String);

     return Messages.aggregate([{$sort:{createdAt: -1}}, {$match: {$or: [{fromUser: userId},{toUser:userId}]}}, {$group: {_id:"$toUser", fromUser:{$first:"$fromUser"},toUser:{$first:"$toUser"}, message:{$first:"$message"}}}]);
    },

    'deleteMessage'(messageId, userId){
     check(messageId, String);
     check(userId, String);


     Messages.update({_id:messageId}, {$addToSet: {deleted: userId}});

    },

    'userUnreadMessages'(userId){
     check(userId, String);

     return Messages.aggregate([{$match: {$and:[{toUser: userId}, {read: false}]}},{$group: {_id:"$fromUser", total: {$sum: 1}}}]);

    },

    'messagesMarkRead'(currentUserId, senderId){
     check(currentUserId, String);
     check(senderId, String);

     Messages.update({fromUser: senderId,toUser: currentUserId}, {$set: {read: true}},{multi: true});

    },
  });
}
