const UINT32_MAX = 0xffffffff;
const ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

function secureRandomUnit(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (UINT32_MAX + 1);
}

export function secureRandomRange(min: number, max: number): number {
  return secureRandomUnit() * (max - min) + min;
}

export function secureRandomCentered(amplitude: number): number {
  return (secureRandomUnit() - 0.5) * amplitude;
}

export function secureChance(probability: number): boolean {
  if (probability <= 0) return false;
  if (probability >= 1) return true;
  return secureRandomUnit() < probability;
}

export function generateSecureId(length = 7): string {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(secureRandomUnit() * ID_ALPHABET.length);
    result += ID_ALPHABET[index];
  }

  return result;
}
