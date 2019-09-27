$('document').ready(function() {
  if (!sessionStorage.getItem('firstTime')) {
    // swal({
    //   title: 'For the People By the People!',
    //   text:
    //     'User post links to Articles from your common news sources.\n \n Other vote whether it swings Left Right or Neutral',
    //   icon: 'success',
    //   button: 'View Articles'
    // });
    Swal.fire({
      html: ` <video src="/js/welcome.mp4" onloadedmetadata="this.muted = true" playsinline autoplay muted controls></video>`,
      showCloseButton: true,
      showCancelButton: true
    });
    sessionStorage.setItem('firstTime', 'done');
  }
});
