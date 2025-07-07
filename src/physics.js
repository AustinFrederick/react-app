// src/physics.js
/*
 * physics.js
 * A simple 2D physics engine for React components: handles momentum, friction, wall bouncing,
 * and elastic collisions between rectangular bodies, with per-body mass.
 *
 * Enhanced collision logic:
 * - Only resolve collisions when bodies are actually moving toward each other (prevents early pushing).
 * - Splits penetration for realistic bounce with velocity swapping proportional to mass.
 *
 * References:
 *  - requestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 *  - 2D AABB collision detection: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
 */

export default class PhysicsEngine {
    /**
     * @param {{ friction?: number, restitution?: number }} config
     * @param {number} config.friction    - drag factor (0 < friction <= 1)
     * @param {number} config.restitution - elasticity (0 < restitution <= 1)
     */
    constructor({ friction = 1, restitution = 0.9 } = {}) {
        this.bodies = new Map();
        this.friction = friction;
        this.restitution = restitution;

        // minimum per‐axis speed for very low‐mass bodies (your balls)
        this.minBallSpeed = 0.5;
    }

    /**
     * Add or update a body in simulation.
     * @param {string} id       - unique identifier
     * @param {number} x        - x position
     * @param {number} y        - y position
     * @param {number} vx       - velocity along x
     * @param {number} vy       - velocity along y
     * @param {number} width    - body width
     * @param {number} height   - body height
     * @param {number} mass     - body mass (heavier = less affected)
     */
    addBody(id, x, y, vx, vy, width, height, mass = 1) {
        this.bodies.set(id, { x, y, vx, vy, width, height, mass });
    }

    /**
     * Remove a body from simulation.
     * @param {string} id
     */
    removeBody(id) {
        this.bodies.delete(id);
    }

    /**
     * Advance simulation by one step.
     * @param {number} screenW - viewport width
     * @param {number} screenH - viewport height (e.g. top of footer)
     */
    step(screenW, screenH) {
        // 1) Move & wall collisions
        this.bodies.forEach(b => {
            // apply friction
            b.vx *= this.friction;
            b.vy *= this.friction;

            // clamp a minimum speed for very low-mass bodies (balls)
            if (b.mass <= 0.5) {
                if (b.vx !== 0 && Math.abs(b.vx) < this.minBallSpeed) {
                    b.vx = Math.sign(b.vx) * this.minBallSpeed;
                }
                if (b.vy !== 0 && Math.abs(b.vy) < this.minBallSpeed) {
                    b.vy = Math.sign(b.vy) * this.minBallSpeed;
                }
            }

            // update positions
            b.x += b.vx;
            b.y += b.vy;

            // bounce off walls
            if (b.x <= 0) {
                b.x = 0;
                b.vx = -b.vx * this.restitution;
            }
            if (b.x + b.width >= screenW) {
                b.x = screenW - b.width;
                b.vx = -b.vx * this.restitution;
            }
            if (b.y <= 0) {
                b.y = 0;
                b.vy = -b.vy * this.restitution;
            }
            if (b.y + b.height >= screenH) {
                b.y = screenH - b.height;
                b.vy = -b.vy * this.restitution;
            }
        });

        // 2) Body-body collisions
        const entries = Array.from(this.bodies.entries());
        for (let i = 0; i < entries.length; i++) {
            const [ , A ] = entries[i];
            for (let j = i + 1; j < entries.length; j++) {
                const [ , B ] = entries[j];
                // AABB overlap check
                if (
                    A.x < B.x + B.width &&
                    A.x + A.width > B.x &&
                    A.y < B.y + B.height &&
                    A.y + A.height > B.y
                ) {
                    // compute overlap
                    const overlapX = Math.min(A.x + A.width, B.x + B.width) - Math.max(A.x, B.x);
                    const overlapY = Math.min(A.y + A.height, B.y + B.height) - Math.max(A.y, B.y);

                    // choose axis of least penetration
                    if (overlapX < overlapY) {
                        // horizontal collision
                        const relVx = A.vx - B.vx;
                        // only if moving towards each other
                        if ((A.x < B.x && relVx > 0) || (A.x > B.x && relVx < 0)) {
                            const sep = overlapX / 2;
                            if (A.x < B.x) {
                                A.x -= sep;
                                B.x += sep;
                            } else {
                                A.x += sep;
                                B.x -= sep;
                            }
                            // 1D elastic collision along X with masses
                            const mA = A.mass, mB = B.mass;
                            const newVxA = (A.vx*(mA-mB) + 2*mB*B.vx) / (mA + mB);
                            const newVxB = (B.vx*(mB-mA) + 2*mA*A.vx) / (mA + mB);
                            A.vx = newVxA * this.restitution;
                            B.vx = newVxB * this.restitution;
                        }
                    } else {
                        // vertical collision
                        const relVy = A.vy - B.vy;
                        if ((A.y < B.y && relVy > 0) || (A.y > B.y && relVy < 0)) {
                            const sep = overlapY / 2;
                            if (A.y < B.y) {
                                A.y -= sep;
                                B.y += sep;
                            } else {
                                A.y += sep;
                                B.y -= sep;
                            }
                            // 1D elastic collision along Y with masses
                            const mA = A.mass, mB = B.mass;
                            const newVyA = (A.vy*(mA-mB) + 2*mB*B.vy) / (mA + mB);
                            const newVyB = (B.vy*(mB-mA) + 2*mA*A.vy) / (mA + mB);
                            A.vy = newVyA * this.restitution;
                            B.vy = newVyB * this.restitution;
                        }
                    }
                }
            }
        }
    }
}
