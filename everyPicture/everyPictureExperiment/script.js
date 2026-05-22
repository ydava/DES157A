(function () {
    'use strict';

    const layers = document.querySelectorAll('.layer');
    let current = 0;

  
    document.addEventListener('mousemove', function (event) {

    const x = (event.clientX / window.innerWidth - 0.5) * 30;
    const y = (event.clientY / window.innerHeight - 0.5) * 30;

    layers.forEach(function (layer, index) {

        const speed = (index + 1) * 10;

        const moveX = x / speed;
        const moveY = y / speed;

        layer.style.transform =
        `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
    });
});

    // Click = focus on one image
    document.addEventListener('click', function () {

        layers.forEach(layer => {
            layer.style.opacity = 0.2;
            layer.style.filter = 'blur(3px)';
        });

        layers[current].style.opacity = 1;
        layers[current].style.filter = 'none';

        current++;

        if (current >= layers.length) {
            current = 0;
        }
    });

})();