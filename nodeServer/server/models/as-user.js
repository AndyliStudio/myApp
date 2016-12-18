'use strict';

module.exports = function(Asuser) {
  Asuser.afterRemote('login', function (context, result, next) {
      var res = context.res;
      if ( result && result.id ) {
          res.cookie('authorization', result.id, { maxAge: 1000*60*60*24*14*6, httpOnly: true
                  ,signed: false, domain: '.andylistudio.com' });
      }
      return next();
    });
};
