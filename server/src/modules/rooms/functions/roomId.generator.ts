import { v4 as uuidv4 } from "uuid";

/**
 * Gera um ID de sala no formato bhy-ekyx-fke (3-4-3 caracteres)
 * @returns ID de sala formatado
 */
export function generateRoomId(): string {
  const id = uuidv4().replace(/-/g, "");
  const part1 = id.substring(0, 3);
  const part2 = id.substring(3, 7);
  const part3 = id.substring(7, 10);
  return `${part1}-${part2}-${part3}`.toLowerCase();
}
