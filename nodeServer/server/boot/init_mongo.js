// module.exports = function(app) {
//   var mongoDs = app.dataSources.mongodb;
//   mongoDs.automigrate('as_accesstoken', function(err){
//     if(err) throw err;
//   });
//   mongoDs.automigrate('as_user', function(err){
//     if(err) throw err;

//     var as_user = app.models.as_user;
//     var as_role = app.models.as_role;
//     var as_rolemapping = app.models.as_rolemapping;

//     as_user.create([
//       {username: 'admin', email: 'andyliwr@outlook.com', password: '121960425myapp', emailVerified: true, phone_number: '18883339779', birthday: '1995-03-20', signature: '我就是主宰', sex: 'male'}
//       ], function(err, users) {
//       if (err) throw err;
//       mongoDs.automigrate('as_role', function(err){
//         if(err) throw err;
//         mongoDs.automigrate('as_rolemapping', function(err){
//           if(err) throw err;
//           var userid = users[0].id;
//           as_role.create({
//           name: 'admin'
//           }, function(err, role) {
//             console.log('Created role:', role);

//             role.principals.create({
//             principalType: as_rolemapping.USER
//             , principalId: userid
//             }, function(err, principal) {
//             if (err) throw err;
//               console.log('Created principal:', principal);
//             });
//           });
//         });
//       });
//     });
//   });
// };