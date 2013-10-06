(function() {


  $('.contract-sections, .available-sections').sortable({ connectWith: '.section-list' });

  $('.modal .btn-submit').click(function() {
    var $modal = $(this).parents('.modal');
    $modal.find('form').submit();
    $modal.modal('hide');
  });

  $('.company').text('Company');

  $('#edit-company form').submit(function() {
    var val = $('#edit-company [name="company"]').val();
    if (!val.length) return false;
    $('.company').text(val);
    return false;
  });

  $('.company').click(function() {
    $('#edit-company').modal('show');
  });

})();