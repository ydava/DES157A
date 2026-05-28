const markers = document.querySelectorAll('.marker');

markers.forEach((marker) => {
  const card = marker.querySelector('.zoom-card');

  marker.addEventListener('mouseenter', () => {
    card.style.opacity = '1';
    card.style.pointerEvents = 'auto';
  });

  marker.addEventListener('mousemove', (e) => {
    const rect = marker.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });

  marker.addEventListener('mouseleave', () => {
    card.style.opacity = '0';
    card.style.pointerEvents = 'none';
    card.style.transform = 'translateY(10px)';
  });
});