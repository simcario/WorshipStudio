
const SimpleCrypto = require("simple-crypto-js").default;
const time = new Date().getTime();


exports.synchronize = (req, res) => {
  console.log("Synchronization ");
  const organizationID = req.body.organizationID;
  const email = req.body.userEmail;
console.log(email)
  //Syncronize for online content
  database
    .collection("songs")
    .get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {

        let onlineDoc = doc.data();
        console.log(onlineDoc.title)
        //For any document find in local database, if not document was insert
        db.findOne({ _id: onlineDoc._id }, function(err, document) {
          if (document) {
            document.user = email;
            document.organizationID = organizationID;
            if (document.time === onlineDoc.time) {
              console.log("Online Sync - ONLINE AND LOCAL IS IDENTICAL");
            } else if (document.time < onlineDoc.time) {
              console.log("Online Sync -LOCAL DOCUMENT WAS UPDATED");
              db.update({ _id: onlineDoc._id }, onlineDoc, {}, function(
                err,
                numReplaced
              ) {});
            } else if (document.time > onlineDoc.time) {
              console.log("Online Sync - ONLINE DOCUMENT WAS UPDATED");
              database
                .collection("songs")
                .doc(doc.id)
                .update(document);
            }
          } else {
            console.log(
              "Online Sync - DOCUMENT NOT FOUNT - INSERT IN LOCAL DB"
            );
            db.insert(onlineDoc, function(err, newDoc) {});
          }
        });
      });
    });

  db.find({})
    .sort({ title: 1 })
    .exec(function(err, docs) {
      docs.forEach(doc => {
        doc.user = email
        doc.organizationID = organizationID;
        database
          .collection("songs")
          .where("_id", "==", doc._id)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              console.log(
                "Local Sync - DOCUMENT NOT FOUNT - INSERT IN ONLINE DB"
              );
              database.collection("songs").add(doc);
            } else {
              snapshot.forEach(document => {
                let onlineDoc = document.data();
                if (onlineDoc.time === doc.time) {
                  console.log("Local Sync - ONLINE AND LOCAL IS IDENTICAL");
                } else if (onlineDoc.time < doc.time) {
                  console.log("Local Sync - ONLINE DOCUMENT WAS UPDATED");
                  database
                    .collection("songs")
                    .doc(document.id)
                    .update(doc);
                } else if (onlineDoc.time > doc.time) {
                  console.log("Local Sync -LOCAL DOCUMENT WAS UPDATED");
                  db.update({ _id: onlineDoc._id }, onlineDoc, {}, function(
                    err,
                    numReplaced
                  ) {});
                }
              });
            }
          });
      });
    });
    res.send({
      result:'ok'
    })
};

