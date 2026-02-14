import { Vector3, Euler } from 'three';
import { RocketState, EnvironmentState } from '../types';

export class RocketPhysics {
  private state: RocketState;
  private dt: number;

  constructor(initialState: RocketState, _environment: EnvironmentState) {
    this.state = initialState;
    this.dt = 1 / 60;
  }

  update(deltaTime: number): RocketState {
    this.dt = deltaTime;

    const gravity = this.calculateGravity(this.state.altitude);
    const atmosphereDensity = this.calculateAtmosphereDensity(this.state.altitude);
    const drag = this.calculateDrag(atmosphereDensity);
    const thrust = this.calculateThrust();

    const forces = new Vector3();
    forces.y -= gravity * this.state.mass;

    if (this.state.isEngineOn) {
      const thrustDirection = new Vector3(0, 1, 0);
      thrustDirection.applyEuler(new Euler(this.state.pitch, this.state.yaw, this.state.roll));
      thrustDirection.multiplyScalar(thrust);
      forces.add(thrustDirection);
    }

    forces.sub(drag);

    const acceleration = forces.clone().divideScalar(this.state.mass);

    this.state.velocity.add(acceleration.clone().multiplyScalar(this.dt));
    this.state.position.add(this.state.velocity.clone().multiplyScalar(this.dt));

    this.state.speed = this.state.velocity.length();
    this.state.altitude = this.state.position.y;

    if (this.state.altitude <= 0) {
      this.state.altitude = 0;
      this.state.position.y = 0;
      this.state.isLanded = true;
      if (this.state.speed > 10) {
        this.state.hullIntegrity -= (this.state.speed - 10) * 0.5;
      }
      this.state.velocity.set(0, 0, 0);
    } else {
      this.state.isLanded = false;
    }

    if (this.state.isEngineOn && this.state.fuel > 0) {
      this.state.fuel -= thrust * this.dt * 0.001;
      if (this.state.fuel < 0) this.state.fuel = 0;
    }

    this.updateTemperature(atmosphereDensity);
    this.updateRotationalDynamics();

    return { ...this.state };
  }

  private calculateGravity(altitude: number): number {
    const earthRadius = 6371000;
    const standardGravity = 9.81;
    return standardGravity * Math.pow(earthRadius / (earthRadius + altitude), 2);
  }

  private calculateAtmosphereDensity(altitude: number): number {
    const scaleHeight = 8500;
    const seaLevelDensity = 1.225;
    if (altitude > 100000) return 0;
    return seaLevelDensity * Math.exp(-altitude / scaleHeight);
  }

  private calculateDrag(density: number): Vector3 {
    const dragCoefficient = 0.3;
    const crossSectionalArea = 10;
    const velocity = this.state.velocity.clone();

    if (velocity.length() === 0) return new Vector3(0, 0, 0);

    const dragMagnitude = 0.5 * density * dragCoefficient * crossSectionalArea * velocity.lengthSq();
    return velocity.normalize().multiplyScalar(-dragMagnitude);
  }

  private calculateThrust(): number {
    if (!this.state.isEngineOn || this.state.fuel <= 0) return 0;
    return this.state.maxThrust * this.state.throttle;
  }

  private updateTemperature(density: number): number {
    const ambientTemp = 288 - 0.0065 * Math.min(this.state.altitude, 11000);
    const heatingRate = this.state.speed * this.state.speed * 0.00001 * density;
    const coolingRate = (this.state.temperature - ambientTemp) * 0.1;

    this.state.temperature += (heatingRate - coolingRate) * this.dt;
    this.state.temperature = Math.max(ambientTemp, this.state.temperature);

    if (this.state.temperature > 1500) {
      this.state.hullIntegrity -= (this.state.temperature - 1500) * 0.001 * this.dt;
    }

    return this.state.temperature;
  }

  private updateRotationalDynamics(): void {
    const angularDrag = 0.1;
    this.state.angularVelocity.multiplyScalar(1 - angularDrag * this.dt);

    this.state.pitch += this.state.angularVelocity.x * this.dt;
    this.state.yaw += this.state.angularVelocity.y * this.dt;
    this.state.roll += this.state.angularVelocity.z * this.dt;

    this.state.rotation.set(this.state.pitch, this.state.yaw, this.state.roll);
  }

  applyThrust(thrustAmount: number): void {
    this.state.throttle = Math.max(0, Math.min(1, thrustAmount));
  }

  applyPitch(rate: number): void {
    this.state.angularVelocity.x = rate;
  }

  applyYaw(rate: number): void {
    this.state.angularVelocity.y = rate;
  }

  applyRoll(rate: number): void {
    this.state.angularVelocity.z = rate;
  }

  getState(): RocketState {
    return { ...this.state };
  }

  setState(newState: Partial<RocketState>): void {
    this.state = { ...this.state, ...newState };
  }
}
