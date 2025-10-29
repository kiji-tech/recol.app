import { isUpdateRequired } from '@/src/features/version';

describe('##### compareVersion Test #####', () => {
  describe('isUpdateRequired', () => {
    describe('major version', () => {
      const MIN_VERSION = '1.0.0';
      test('最低限のバージョン番号と同じ場合 => 更新不要', () => {
        const result = isUpdateRequired('1.0.0', MIN_VERSION);
        expect(result).toBe(false);
      });
      test('最低限のバージョン番号より高い場合 => 更新不要', () => {
        const result = isUpdateRequired('2.0.0', MIN_VERSION);
        expect(result).toBe(false);
      });
      test('最低限のバージョン番号より低い場合 => 更新が必要', () => {
        const result = isUpdateRequired('0.0.0', MIN_VERSION);
        expect(result).toBe(true);
      });
    });
    describe('minor version', () => {
      const MIN_VERSION = '0.1.0';
      test('最低限のバージョン番号と同じ場合 => 更新不要', () => {
        const result = isUpdateRequired('0.1.0', MIN_VERSION);
        expect(result).toBe(false);
      });
      test('最低限のバージョン番号より高い場合 => 更新不要', () => {
        const result = isUpdateRequired('0.2.0', MIN_VERSION);
        expect(result).toBe(false);
      });
      test('最低限のバージョン番号より低い場合 => 更新が必要', () => {
        const result = isUpdateRequired('0.0.0', MIN_VERSION);
        expect(result).toBe(true);
      });
      test('majorバージョンが更新されている場合 => 更新が不要', () => {
        const result = isUpdateRequired('1.0.0', 'MIN_VERSION');
        expect(result).toBe(false);
      });
    });
    describe('patch version', () => {
      const MIN_VERSION = '0.0.1';
      test('最低限のバージョン番号と同じ場合 => 更新不要', () => {
        const result = isUpdateRequired('0.0.1', MIN_VERSION);
        expect(result).toBe(false);
      });
      test('最低限のバージョン番号より高い場合 => 更新不要', () => {
        const result = isUpdateRequired('0.0.2', MIN_VERSION);
        expect(result).toBe(false);
      });
      test('最低限のバージョン番号より低い場合 => 更新が必要', () => {
        const result = isUpdateRequired('0.0.0', MIN_VERSION);
        expect(result).toBe(true);
      });
      test('majorバージョンが更新されている場合 => 更新が不要', () => {
        const result = isUpdateRequired('1.0.0', 'MIN_VERSION');
        expect(result).toBe(false);
      });
      test('minorバージョンが更新されている場合 => 更新が不要', () => {
        const result = isUpdateRequired('0.1.0', 'MIN_VERSION');
        expect(result).toBe(false);
      });
    });
  });
});
