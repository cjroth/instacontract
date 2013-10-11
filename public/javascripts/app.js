(function() {

  var vars = {};

  $('.section-list').sortable({ connectWith: '.section-list' });

  $('.modal .btn-submit').click(function() {
    var $modal = $(this).parents('.modal');
    $modal.find('form').submit();
  });

  $('#edit-var form').submit(function() {
    var val = $('#edit-var [name="value"]').val();
    var varname = $('#edit-var [name="var"]').val();
    if (!val.length) return false;
    $('[data-var="' + varname + '"]').text(val);
    var $modal = $(this).parents('.modal');
    $modal.modal('hide');
    vars[varname] = val;
    return false;
  });

  $('.var').click(function() {
    $('#edit-var').find('[name="var"]').val($(this).data('var'));
    var $newInput;
    if (this.tagName.toLowerCase() === 'div') {
      $newInput = $('<textarea class="form-control" name="value"></textarea>');
    } else {
      $newInput = $('<input type="text" class="form-control" name="value"></input>');
    }
    $('#edit-var').find('[name="value"]').replaceWith($newInput);
    $('#edit-var').find('[name="value"]').val($(this).text());
    $('#edit-var').modal('show');
    setTimeout(function() {
      $('[name="value"]').focus();
    }, 500);
  });

  $('.section-list').delegate('.section', 'dblclick', function(e) {
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
      $('.available-sections-search-box .clear').hide();
      return;
    }

    $('.available-sections-search-box .clear').show();

    $('.available-sections .section').each(function() {
      if (!$(this).text().toLowerCase().match(s)) {
        $(this).hide();
        return;
      }
      $(this).show();
    });

  }).trigger('keyup');

  $('[name="new-section"]').click(function() {
    $('#new-section').modal('show');
    setTimeout(function() {
      $('[name="content"]').focus();
    }, 500);
  });

  $('#new-section form').on('submit', function() {
    var content = $(this).find('[name="new-section-content"]').html();
    var title = $(this).find('[name="new-section-title"]').val();
    if (!content || !title) return;
    var t = renderSection({
      title: title,
      content: content
    });
    $(t).appendTo('.contract-sections');
    $(this).parents('.modal').modal('hide');
    return false;
  });

  $('.available-sections-search-box .clear').click(function() {
    $('.available-sections-search-box input').val('').trigger('keyup').focus();
  });

  var renderSection = function(data) {
    var html = $('#section-template').html();
    html = html.replace(/{{id}}/g, data.id || '');
    html = html.replace(/{{title}}/g, data.title || '');
    html = html.replace(/{{content}}/g, data.content || '');
    return html;
  };

  $('[name="new-section-content"]').blur(function() {
    if (!$(this).html().length) {
      $(this).html('Enter section content').addClass('placeholder');
    }
  });

  $('[name="new-section-content"]').focus(function() {
    if ($(this).hasClass('placeholder')) {
      $(this).html('').removeClass('placeholder');
    }
  });

})();