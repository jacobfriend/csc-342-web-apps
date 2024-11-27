const darkModeToggle = document.querySelector('#darkModeToggle');

darkModeToggle.addEventListener('click', e => {
  // Solution via CSS class
  if (document.querySelector('html').classList.contains('invert')) {
    document.querySelector('html').classList.remove('invert');
  }
  else {
    document.querySelector('html').classList.add('invert');
  }

  // if (darkModeToggle.checked) {
  //   document.querySelector('html').classList.add('invert');
  // } else {
  //   document.querySelector('html').classList.remove('invert');
  // }

  // Solution via CSS filter
  //document.querySelector('html').style.filter = `invert(${darkModeToggle.checked ? 1 : 0})`;
});
