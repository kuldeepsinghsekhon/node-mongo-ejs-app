module.exports = {

    'facebookAuth' : {
        'clientID'      : '3277607222310088', // your App ID
        'clientSecret'  : 'fbbb533affb6db426acea7c62113b5cd', // your App Secret
        'callbackURL'   : 'https://aquatecinnovative.herokuapp.com/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email,name,id',
        'profileFields' : ['id', 'email', 'name','displayName'] // For requesting permissions from Facebook API
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:5000/auth/twitter/callback'
    },
    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:5000/auth/google/callback'
    }

};
