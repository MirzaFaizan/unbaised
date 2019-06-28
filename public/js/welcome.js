$('document').ready(function() {
  if (localStorage.getItem('firstTime') != null) {
    swal({
      title: 'For the People By the People!',
      text:
        'User post links to Articles from your common news sources.\n \n Other vote whether it swings Left Right or Neutral',
      icon: 'success',
      button: 'View Articles'
    });
    localStorage.setItem('firstTime', 'done');
  }
});
