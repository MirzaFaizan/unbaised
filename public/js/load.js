$('article').ready(function () {
  // if the user is authenticated, load the users comment states and post states
  if ($('#auth').text() == 'true') {
    //load the users posts states which include vote state and save state
    $.ajax({
      type: 'get',
      url: `/check/states/posts/`
    }).done(function (data) {
      $('.post').each(function (index) {
        for (let ele of data) {
          if (ele.ref == $(this).data('ref')) {
            if (ele.vote == 'up') {
              $(this)
                .find('.fa-chevron-right')
                .addClass('red');
            } else if (ele.vote == 'down') {
              $(this)
                .find('.fa-chevron-left')
                .addClass('down-enabled');
            } else if (ele.vote == 'down-neutral') {
              $(this)
                .find('.fa-chevron-up')
                .addClass('up-enabled');
            }
            else if (ele.vote == 'up-slight') {
              $(this)
                .find('.fa-chevron-circle-right')
                .addClass('red');
            }
            else if (ele.vote == 'down-slight') {
              $(this)
                .find('.fa-chevron-circle-left')
                .addClass('down-enabled');
            }
            if (ele.saved == true) {
              $(this)
                .find('.save-post')
                .text('unsave');
            }
          }
        }
      });
    });
    //load the users comments states which include vote state and save state
    $.ajax({
      type: 'get',
      url: `/check/states/comments/`
    }).done(function (data) {
      $('.comment').each(function (index) {
        for (let ele of data) {
          if (ele.ref == $(this).data('ref')) {
            if (ele.vote == 'up') {
              $(this)
                .find('.upvote-comment')
                .addClass('up-enabled');
            } else if (ele.vote == 'down') {
              $(this)
                .find('.downvote-comment')
                .addClass('down-enabled');
            }

            if (ele.saved == true) {
              $(this)
                .find('.save-comment')
                .text('unsave');
            }
          }
        }
      });
    });
  }
});
