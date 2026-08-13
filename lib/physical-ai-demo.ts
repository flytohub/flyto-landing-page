export const PHYSICAL_AI_DEMO_ASSET = '/assets/img/demo/flyto2-ai-space-workflows.webp' as const;
export const PHYSICAL_AI_DEMO_SOURCE_SHA256 = '90d0e3a61d7db2646a7d4579acd676352760c4e2d4037298d333e2b80f7c88bb' as const;

export type PhysicalAIDemoLocale = 'en' | 'zh-TW' | 'zh-CN';

type PhysicalAIDemoCopy = {
  eyebrow: string;
  title: string;
  summary: string;
  alt: string;
  caption: string;
  facts: readonly string[];
  statusLabel: string;
  sourceCta: string;
  videosCta: string;
};

const ENGLISH_COPY: PhysicalAIDemoCopy = {
  eyebrow: 'Physical AI exhibit preview',
  title: 'A bounded look at robot and local vision workflows',
  summary: 'Captured 2026-08-12. This is a configuration and exhibit preview, not live commissioning.',
  alt: 'Flyto2 AI Space configuration preview showing Robot Forge E2E workflows and two equipment resources',
  caption: 'Captured 2026-08-12 — configuration preview: Corridor clearance (robot) and Zone overview (camera). Live commissioning remains incomplete.',
  facts: [
    'TurtleBot motion and LiDAR are represented in the exhibit workflow.',
    'The Mac observation path was verified locally and remains a separate UVC loopback-only resource.',
    'Customer pairing and live Raspberry Pi commissioning are incomplete.',
  ],
  statusLabel: 'Preview boundary',
  sourceCta: 'View execution-layer source',
  videosCta: 'Watch workflow demos',
};

const COPY: Record<PhysicalAIDemoLocale, PhysicalAIDemoCopy> = {
  en: ENGLISH_COPY,
  'zh-TW': {
    eyebrow: 'Physical AI 展示預覽', title: '機器人與本機視覺工作流程的有限範圍預覽',
    summary: '畫面擷取於 2026-08-12。這是設定與展示預覽，不是現場啟用或試運轉。',
    alt: 'Flyto2 AI Space 設定預覽，顯示 Robot Forge E2E 工作流程與兩項設備資源',
    caption: '擷取於 2026-08-12 — 設定預覽：Corridor clearance (robot) 與 Zone overview (camera)。即時試運轉仍未完成。',
    facts: ['展示工作流程呈現 TurtleBot 移動與 LiDAR。', 'Mac 觀察路徑已在本機驗證，且仍是獨立的 UVC 僅限 loopback 資源。', '客戶配對與 Raspberry Pi 現場試運轉尚未完成。'],
    statusLabel: '預覽範圍', sourceCta: '查看執行層原始碼', videosCta: '觀看工作流程示範',
  },
  'zh-CN': {
    eyebrow: 'Physical AI 展示预览', title: '机器人与本地视觉工作流的有限范围预览',
    summary: '画面截取于 2026-08-12。这是配置与展示预览，不是现场启用或试运行。',
    alt: 'Flyto2 AI Space 配置预览，显示 Robot Forge E2E 工作流与两项设备资源',
    caption: '截取于 2026-08-12 — 配置预览：Corridor clearance (robot) 与 Zone overview (camera)。实时试运行仍未完成。',
    facts: ['展示工作流呈现 TurtleBot 移动与 LiDAR。', 'Mac 观察路径已在本地验证，且仍是独立的 UVC 仅限 loopback 资源。', '客户配对与 Raspberry Pi 现场试运行尚未完成。'],
    statusLabel: '预览范围', sourceCta: '查看执行层源代码', videosCta: '观看工作流演示',
  },
};

export function physicalAIDemoCopy(locale: string): PhysicalAIDemoCopy {
  const publicLocale = ({ zh: 'zh-TW', cn: 'zh-CN' } as const)[locale as 'zh' | 'cn'] ?? locale;
  return COPY[publicLocale as PhysicalAIDemoLocale] ?? ENGLISH_COPY;
}
