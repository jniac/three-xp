/**
 * Byte size of the info:
 * #0:
 * - Lines count (1 byte)
 * - empty (3 bytes)
 * #1:
 * - Text Color (3 bytes)
 * - Text Opacity (1 byte)
 * #2:
 * - Background Color (3 bytes)
 * - Background Opacity (1 byte)
 *
 * Should be a multiple of 4.
 */
export const DATA_INFO_BYTE_SIZE = 3 * 4

export const DATA_TEXTURE_WIDTH = 1024

export enum Orientation {
  Normal,
  Billboard
}

