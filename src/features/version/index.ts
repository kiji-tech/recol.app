/**
 * バージョン管理機能のエクスポート
 */
export { isUpdateRequired } from './utils/compareVersion';
export { checkVersion } from './api/checkVersion';
export type { VersionInfo } from './types/VersionTypes';
