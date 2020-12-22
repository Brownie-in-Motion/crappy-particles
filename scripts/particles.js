import { random } from "./util.js"

export class Particles {
    constructor() {
        this.forces = [];
        this.particles = new Set();
    }

    addForce(force) {
        this.forces.push(force);
    }
    
    setLocation(minX, minY, maxX = minX, maxY = minY) {
        this.minPos = new Vector(minX, minY);
        this.maxPos = new Vector(maxX, maxY);
    }
    
    setVelocity(minX, minY, maxX = minX, maxY = minY) {
        this.minVel = new Vector(minX, minY);
        this.maxVel = new Vector(maxX, maxY);
    }
    
    spawnParticles(count = 1) {
        for (let i = 0; i < count; i ++) {
            this.particles.add(new Particle(
                this.minPos,
                this.maxPos,
                this.minVel,
                this.maxVel
            ))
        }
    }
    
    update(timestamp, destroy, render) {
        this.start = this.start ?? timestamp;
        const elapsed = timestamp - this.start;
        this.start = timestamp;

        for (const particle of this.particles) {
            particle.update(elapsed, this.forces, render);
            if (destroy(particle)) {
                this.particles.delete(particle);
            }
        }
    }
    
    resume() {
        this.start = performance.now();
    }
}

class Particle {
    constructor(minPos, maxPos, minVel, maxVel) {
        this.position = Vector.between(minPos, maxPos);
        this.velocity = Vector.between(minVel, maxVel);
    }

    update(elapsed, forces, render) {
        for (const force of forces) {
            this.velocity.add(force(this));
        }
        this.position.add(Vector.scale(this.velocity, elapsed));
        render(this);
    }
}

export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    static between(v1, v2) {
        return new Vector(random(v1.x, v2.x), random(v1.y, v2.y));
    }
    
    static scale(v, c) {
        return new Vector(v.x * c, v.y * c);
    }
    
    static copy(v) {
        return  new Vector(v.x, v.y);
    }
}