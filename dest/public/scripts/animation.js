// window.onload = () => {
//   anime({
//     targets: 'svg path', // Specifically target paths within the SVG
//     strokeDashoffset: [anime.setDashoffset, 0],
//     easing: 'easeInOutSine',
//     duration: 2000,
//     delay: (el, i) => i * 250, // Stagger each letter path
//     complete: () => {
//       const contentContainer = document.getElementById('content');
//       if (contentContainer) {
//         contentContainer.style.display = 'block';
//         anime({
//           targets: '#content',
//           opacity: [0, 1],
//           translateY: [50, 0],
//           easing: 'easeOutQuad',
//           duration: 1000
//         });
//       }
//     }
//   });
// };

window.onload = () => {
  anime({
    targets: 'svg path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 5000, // Increase duration for better visibility
    delay: (el, i) => i * 250,
    complete: () => {
      const contentContainer = document.getElementById('content');
      if (contentContainer) {
        contentContainer.style.display = 'block';
        anime({
          targets: '#content',
          opacity: [0, 1],
          translateY: [50, 0],
          easing: 'easeOutQuad',
          duration: 1000,
        });
      }
    },
  });
};
