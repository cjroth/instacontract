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

  $('.company').on('keyup', function() {
    console.log('changed');
  });

  var insideEditableClick, outsideEditableClick;

  var startEditing = function($e, event) {
    $('.section-list').removeClass('sortable').addClass('editing');
    $e.addClass('editing');
    $('.section-list').sortable('disable');
    $e.attr('contentEditable', 'true');
    $e.focus();
    insideEditableClick = function(e) {
      e.stopPropagation();
    };
    outsideEditableClick = function(e) {
      stopEditing($e, e);
    };
    $e.on('click', insideEditableClick);
    $('body').on('mousedown', outsideEditableClick);
  };

  var stopEditing = function($e, event) {
    $('.section-list').addClass('sortable').removeClass('editing');
    $e
      .removeClass('editing')
      .attr('contentEditable', 'false')
      .off('click', insideEditableClick)
      ;
    $('.section-list').sortable('enable');
    $('body').off('click', outsideEditableClick);
  };

  $('.editable').dblclick(function(e) {
    startEditing($(this), e);
  });

})();