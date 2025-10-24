function hoverfunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function toggleNav() {
    const nav = document.getElementById("myTopnav");
    nav.classList.toggle("responsive");
}


const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let DPR = Math.max(1, window.devicePixelRatio || 1);
let w = 0, h = 0;
let particles = [];
const NUM = 120;
const SPEED = 0.6;


function resize() {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize, { passive: true });
resize();


particles = [];
for (let i = 0; i < NUM; i++) {
    particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * (0.8 * SPEED),
        vy: (Math.random() - 0.5) * (0.8 * SPEED),
        alpha: 0.08 + Math.random() * 0.22
    });
}


const mouse = { x: w / 2, y: h / 2, active: false };
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
});
window.addEventListener('mouseleave', () => mouse.active = false);


function draw() {
    ctx.clearRect(0, 0, w, h);


    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h));
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);


    ctx.fillStyle = 'rgba(200,200,210,0.9)';
    for (let p of particles) {

        if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const push = (120 - dist) / 120 * 0.8;
                p.x += (dx / (dist || 1)) * push;
                p.y += (dy / (dist || 1)) * push;
            }
        }

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();


        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
    }


    ctx.globalAlpha = 0.035;
    ctx.strokeStyle = 'rgba(200,200,210,1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 9000) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
