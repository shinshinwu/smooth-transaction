$.ajax({
  type: 'POST',
  url: 'https://mandrillapp.com/api/1.0/messages/send.json',
  data: {
    'key': 'EQdF2EFMRC04ciDfefm1fw',
    'message': {
      'from_email': 'smoothtransaction@smooth.com',
      'to': [
          {
            'email': 'azorius07@yahoo.com',
            'name': 'Testing...',
            'type': 'to'
          },
        ],
      'autotext': 'true',
      'subject': 'Testing Text',
      'html': 'Did this shit work?'
    }
  }
}).done(function(response) {
    console.log(response);
});