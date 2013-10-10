(function() {

  $('.section-list').sortable({ connectWith: '.section-list' });

  $('.modal .btn-submit').click(function() {
    var $modal = $(this).parents('.modal');
    $modal.find('form').submit();
  });

  $('#edit-var form').submit(function() {
    var val = $('#edit-var [name="value"]').val();
    if (!val.length) return false;
    $('[data-var="' + $('#edit-var [name="var"]').val() + '"]').text(val);
    var $modal = $(this).parents('.modal');
    $modal.modal('hide');
    return false;
  });

  $('.var').click(function() {
    $('#edit-var').find('[name="var"]').val($(this).data('var'));
    $('#edit-var').find('[name="value"]').val($(this).text());
    $('#edit-var').modal('show');
    setTimeout(function() {
      $('[name="value"]').focus();
    }, 500);
  });

  $('.section').dblclick(function(e) {
    var $section = $(this);
    var $modal = $('#edit-section');
    var $input = $modal.find('[name="section"]');
    $modal.modal('show');
    $input.html($section.find('.content').html());
    $modal.find('[name="section-id"]').val($section.attr('id'));
    setTimeout(function() {
      $input.focus();
    }, 500);
  });

  $('#edit-section form').on('submit', function() {
    var sectionId = $(this).find('[name="section-id"]').val();
    var html = $(this).find('[name="section"]').html();
    $('#' + sectionId).find('.content').html(html);
    $(this).parents('.modal').modal('hide');
    return false;
  });

  $('.available-sections-search-box input').on('keyup', function() {

    var s = $(this).val().toLowerCase();

    if (!s) {
      $('.available-sections .section').show();
    }

    $('.available-sections .section').each(function() {

      if (!$(this).text().toLowerCase().match(s)) {
        $(this).hide();
        return;
      }

      $(this).show();

    });

  });

  $('.available-sections-search-box .clear').click(function() {
    $('.available-sections-search-box input').val('').trigger('keyup').focus();
  });

})();