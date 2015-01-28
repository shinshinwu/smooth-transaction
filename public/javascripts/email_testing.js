
$.ajax({
  type: 'POST',
  url: 'https://mandrillapp.com/api/1.0/messages/send.json',
  data: {
    'key': 'EQdF2EFMRC04ciDfefm1fw',
    'message': {
      'from_email': 'smoothmailer@smooth.com',
      'to': [
          {
            'email': 'rhoxiodbc@gmail.com',
            'name': 'Testing...',
            'type': 'to'
          },
        ],
      'autotext': 'true',
      'subject': 'Receipt from Smooth Transaction',
      'html': 'Thank you for your contribution of $10000000000000000!!!' 
    }
  }
}).done(function(response) {
    console.log(response);
});