import { Particles, Vector } from './particles.js';

(async () => {
    await new Promise((resolve) => {
        window.addEventListener('load', resolve);
    });

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const snow = new Particles();
    
    snow.setLocation(0, 0, canvas.width, 0);
    snow.setVelocity(-0.008, 0.01, 0.008, 0.05);
    
    snow.addForce((particle) => {
        return new Vector(0, 0.00000001);
    });

    function render(timestamp) {
        requestAnimationFrame(render);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';

        snow.update(
            timestamp,
            // if particle goes below canvas, destroy
            particle => particle.position.y > canvas.height,
            // render particle
            particle => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(
                    particle.position.x,
                    particle.position.y,
                    2, 0, Math.PI * 2, true
                );
                ctx.fill();
                ctx.restore();
            }
        );
        
        snow.spawnParticles(1);
    }
    
    requestAnimationFrame(render);
    
    function resize () {
        const dpi = window.devicePixelRatio;
        canvas.height = window.innerHeight * dpi;
        canvas.width = window.innerWidth * dpi;
        snow.setLocation(0, 0, canvas.width, 0);
    }
    resize();

    window.addEventListener('resize', resize);
    
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            snow.resume();
        }
    })
})()