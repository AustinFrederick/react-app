/*
 * physics.js
 * A simple 2D physics engine for React components: handles momentum, friction, wall bouncing,
 * and elastic collisions between rectangular bodies.
 *
 * Enhanced collision logic:
 * - Only resolve collisions when bodies are actually moving toward each other (prevents early pushing).
 * - Splits penetration for realistic bounce with velocity swapping.
 *
 * References:
 *  - requestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 *  - 2D AABB collision detection: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
 */

export default class PhysicsEngine {
    /**
     * @param {{ friction?: number, restitution?: number }} config
     * @param {number} config.friction - drag factor (0 < friction < 1)
     * @param {number} config.restitution - elasticity (0 < restitution <= 1)
     */
    constructor({ friction = 0.98, restitution = 0.8 } = {}) {
        this.bodies = new Map();
        this.friction = friction;
        this.restitution = restitution;
    }

    addBody(id, x, y, vx, vy, width, height) {
        this.bodies.set(id, { x, y, vx, vy, width, height });
    }

    removeBody(id) {
        this.bodies.delete(id);
    }

    /**
     * Advance simulation by one step.
     * @param {number} screenW
     * @param {number} screenH
     */
    step(screenW, screenH) {
        // Move & wall bounces
        this.bodies.forEach((b) => {
            b.vx *= this.friction;
            b.vy *= this.friction;
            b.x += b.vx;
            b.y += b.vy;
            if (b.x <= 0) { b.x = 0; b.vx = -b.vx * this.restitution; }
            if (b.x + b.width >= screenW) { b.x = screenW - b.width; b.vx = -b.vx * this.restitution; }
            if (b.y <= 0) { b.y = 0; b.vy = -b.vy * this.restitution; }
            if (b.y + b.height >= screenH) { b.y = screenH - b.height; b.vy = -b.vy * this.restitution; }
        });

        // Body-body collisions
        const entries = Array.from(this.bodies.entries());
        for (let i = 0; i < entries.length; i++) {
            const [idA, A] = entries[i];
            for (let j = i + 1; j < entries.length; j++) {
                const [idB, B] = entries[j];
                if (A.x < B.x + B.width && A.x + A.width > B.x && A.y < B.y + B.height && A.y + A.height > B.y) {
                    // overlap
                    const overlapX = Math.min(A.x + A.width, B.x + B.width) - Math.max(A.x, B.x);
                    const overlapY = Math.min(A.y + A.height, B.y + B.height) - Math.max(A.y, B.y);

                    // determine collision axis by smaller overlap
                    if (overlapX < overlapY) {
                        // horizontal collision
                        const relVx = A.vx - B.vx;
                        // only if moving toward each other
                        if ((A.x < B.x && relVx > 0) || (A.x > B.x && relVx < 0)) {
                            const sep = overlapX / 2;
                            if (A.x < B.x) { A.x -= sep; B.x += sep; }
                            else         { A.x += sep; B.x -= sep; }
                            // swap X velocities
                            const vxA = A.vx;
                            A.vx = B.vx * this.restitution;
                            B.vx = vxA * this.restitution;
                        }
                    } else {
                        // vertical collision
                        const relVy = A.vy - B.vy;
                        if ((A.y < B.y && relVy > 0) || (A.y > B.y && relVy < 0)) {
                            const sep = overlapY / 2;
                            if (A.y < B.y) { A.y -= sep; B.y += sep; }
                            else            { A.y += sep; B.y -= sep; }
                            // swap Y velocities
                            const vyA = A.vy;
                            A.vy = B.vy * this.restitution;
                            B.vy = vyA * this.restitution;
                        }
                    }
                }
            }
        }
    }
}
