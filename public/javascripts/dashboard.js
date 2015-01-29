(function() {

  $(document).ready(function(){

    bindEvents('#account-info');
    bindEvents('#graphs');
    bindEvents('#org-data');

    // automatically show account info when page renders
    getPage('#account-info');

  });


  function bindEvents(nodeID) {
    $(nodeID).on('click', function(e) {
      e.preventDefault();
      getPage(nodeID);
    });
  }

  function getPage(nodeID) {
    $.ajax({
      type: 'GET',
      url: $(nodeID).attr('href')
    }).done(function(data) {
      $('#dashboard-display').empty();
      $('#dashboard-display').append(data);
    });
  }

})();