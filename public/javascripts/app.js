(function() {


  $('.section-list').sortable({ connectWith: '.section-list' });

  $('.modal .btn-submit').click(function() {
    var $modal = $(this).parents('.modal');
    $modal.find('form').submit();
  });

  $('.company').text('Company');

  $('#edit-company form').submit(function() {
    var val = $('#edit-company [name="company"]').val();
    if (!val.length) return false;
    $('.company').text(val);
    var $modal = $(this).parents('.modal');
    $modal.modal('hide');
    return false;
  });

  $('.company').click(function() {
    $('#edit-company').modal('show');
    setTimeout(function() {
      $('#name').focus();
    }, 500);
  });

  var insideSectionClick, outsideSectionClick;

  var startEditing = function($e, event) {
    $('.section-list').removeClass('sortable').addClass('editing');
    $e.addClass('editing');
    $('.section-list').sortable('disable');
    $e.attr('contentEditable', 'true');
    $e.focus();
    insideSectionClick = function(e) {
      e.stopPropagation();
    };
    outsideSectionClick = function(e) {
      stopEditing($e, e);
    };
    $e.on('click', insideSectionClick);
    $('body').on('click', outsideSectionClick);
  };

  var stopEditing = function($e, event) {
    $('.section-list').addClass('sortable').removeClass('editing');
    $e.removeClass('editing');
    $('.section-list').sortable('enable');
    $e.attr('contentEditable', 'false');
    $('body').off('click', outsideSectionClick);
    $e.off('click', insideSectionClick);
  };

  $('.section').dblclick(function(e) {
    startEditing($(this), e);
  });

})();