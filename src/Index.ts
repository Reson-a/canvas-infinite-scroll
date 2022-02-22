export class Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

interface IOption {
  posX?: number;
  posY?: number;
  width?: number;
  height?: number;
}

export default abstract class InfiniteScrollCtx {
  ctx: CanvasRenderingContext2D;
  bufferCtx: CanvasRenderingContext2D;
  width: number;
  height: number;
  posX: number;
  posY: number;
  constructor(canvas: HTMLCanvasElement, option: IOption = {}) {
    let {
      posX = 0,
      posY = 0,
      width = canvas.width || 300,
      height = canvas.height || 150,
    } = option;
    const buffer = OffscreenCanvas
      ? new OffscreenCanvas(width, height)
      : document.createElement("canvas");
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.bufferCtx = buffer.getContext("2d") as CanvasRenderingContext2D;
    this.width = buffer.width = canvas.width = width;
    this.height = buffer.height = canvas.height = height;
    this.posX = posX;
    this.posY = posY;
  }
  get minPosX() {
    return 0;
  }
  get minPosY() {
    return 0;
  }
  get maxPosX() {
    return Number.MAX_VALUE;
  }
  get maxPosY() {
    return Number.MAX_VALUE;
  }
  abstract paintContent(
    ctx: CanvasRenderingContext2D,
    rect: Rect,
    posX: number,
    posY: number
  ): void;

  paint(rect = new Rect(0, 0, this.width, this.height)) {
    this.bufferCtx.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.bufferCtx.save();
    this.paintContent(this.bufferCtx, rect, this.posX, this.posY);
    this.bufferCtx.restore();
    this.copyRectFrom(this.ctx, this.bufferCtx, rect);
  }

  moveBy(deltaX: number, deltaY: number) {
    this.moveTo(this.posX + deltaX, this.posY + deltaY);
  }
  moveTo(posX: number, posY: number) {
    posX = Math.min(Math.max(posX, this.minPosX), this.maxPosX);
    posY = Math.min(Math.max(posY, this.minPosY), this.maxPosY);
    let deltaX = posX - this.posX;
    let deltaY = posY - this.posY;
    if (!deltaX && !deltaY) return;
    this.posX = posX;
    this.posY = posY;
    if (Math.abs(deltaX) > this.width || Math.abs(deltaY) > this.height)
      return this.paint();
    let sourceRect = new Rect(0, 0, this.width, this.height);
    let targetRect = new Rect(-deltaX, -deltaY, this.width, this.height);
    this.copyRectFrom(this.ctx, this.bufferCtx, targetRect, sourceRect);
    this.copyRectFrom(this.bufferCtx, this.ctx, targetRect);
    if (deltaX) {
      let rect =
        deltaX > 0
          ? new Rect(this.width - deltaX, 0, deltaX, this.height)
          : new Rect(0, 0, -deltaX, this.height);
      this.paint(rect);
    }
    if (deltaY) {
      let rect =
        deltaY > 0
          ? new Rect(0, this.height - deltaY, this.width, deltaY)
          : new Rect(0, 0, this.width, -deltaY);
      this.paint(rect);
    }
  }
  copyRectFrom(
    targetCtx: CanvasRenderingContext2D,
    sourceCtx: CanvasRenderingContext2D,
    targetRect: Rect,
    sourceRect = targetRect
  ) {
    targetCtx.clearRect(
      targetRect.x,
      targetRect.y,
      targetRect.width,
      targetRect.height
    );
    targetCtx.drawImage(
      sourceCtx.canvas,
      sourceRect.x,
      sourceRect.y,
      sourceRect.width,
      sourceRect.height,
      targetRect.x,
      targetRect.y,
      targetRect.width,
      targetRect.height
    );
  }
}
