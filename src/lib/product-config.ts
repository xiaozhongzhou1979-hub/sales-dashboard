/**
 * 产品配置中心
 * 所有产品分类和产品名称在此集中维护，组件中禁止直接写死
 */

// 产品分类枚举
export const PRODUCT_CATEGORIES = [
  { id: 'knee', name: '膝关节', color: '#d97757' },
  { id: 'hip', name: '髋关节', color: '#6a9bcc' },
  { id: 'trauma', name: '创伤与四肢', color: '#788c5d' },
  { id: 'spine', name: '脊柱', color: '#b0aea5' },
  { id: 'sports', name: '运动医学', color: '#c0392b' },
] as const;

// Stryker 真实产品线
export const PRODUCTS = [
  // 膝关节
  { name: 'Triathlon膝关节系统', category: 'knee', basePrice: 165000 },
  { name: 'GetAround膝关节系统', category: 'knee', basePrice: 158000 },
  { name: 'Mako机器人辅助膝关节置换系统', category: 'knee', basePrice: 280000 },
  { name: 'Stryker PS假体', category: 'knee', basePrice: 135000 },
  { name: 'Stryker CR假体', category: 'knee', basePrice: 142000 },

  // 髋关节
  { name: 'Accolade髋关节系统', category: 'hip', basePrice: 185000 },
  { name: 'Trident髋臼系统', category: 'hip', basePrice: 195000 },
  { name: 'Mako机器人辅助髋关节置换系统', category: 'hip', basePrice: 295000 },
  { name: 'Anato髋关节柄', category: 'hip', basePrice: 175000 },
  { name: 'Tritanium髋臼杯', category: 'hip', basePrice: 165000 },

  // 创伤与四肢
  { name: 'T2髓内钉系统', category: 'trauma', basePrice: 85000 },
  { name: 'Gamma3髓内钉', category: 'trauma', basePrice: 78000 },
  { name: 'VariAx手腕融合系统', category: 'trauma', basePrice: 62000 },
  { name: 'AxSOS锁定钢板', category: 'trauma', basePrice: 55000 },
  { name: 'Stryker足踝系统', category: 'trauma', basePrice: 48000 },

  // 脊柱
  { name: 'MESA脊柱系统', category: 'spine', basePrice: 125000 },
  { name: 'ES2脊柱系统', category: 'spine', basePrice: 135000 },
  { name: 'Stry3D脊柱植入物', category: 'spine', basePrice: 145000 },
  { name: 'CerviFix颈椎系统', category: 'spine', basePrice: 115000 },
  { name: 'Xia椎体成形系统', category: 'spine', basePrice: 95000 },

  // 运动医学
  { name: 'CrossFT关节镜系统', category: 'sports', basePrice: 88000 },
  { name: 'Ideal Anchor缝合锚钉', category: 'sports', basePrice: 35000 },
  { name: 'ReFlex肩关节系统', category: 'sports', basePrice: 75000 },
  { name: 'Opus SmartStitch缝合系统', category: 'sports', basePrice: 42000 },
  { name: 'Stryker半月板修复系统', category: 'sports', basePrice: 58000 },
];

// 三甲医院列表（真实医院名称）
export const HOSPITALS = [
  { name: '北京协和医院', city: '北京', level: '三甲' },
  { name: '中国人民解放军总医院', city: '北京', level: '三甲' },
  { name: '北京大学人民医院', city: '北京', level: '三甲' },
  { name: '首都医科大学宣武医院', city: '北京', level: '三甲' },
  { name: '北京积水潭医院', city: '北京', level: '三甲' },
  { name: '北京大学第三医院', city: '北京', level: '三甲' },

  { name: '上海交通大学医学院附属瑞金医院', city: '上海', level: '三甲' },
  { name: '复旦大学附属中山医院', city: '上海', level: '三甲' },
  { name: '上海交通大学医学院附属仁济医院', city: '上海', level: '三甲' },
  { name: '上海交通大学医学院附属第九人民医院', city: '上海', level: '三甲' },
  { name: '复旦大学附属华山医院', city: '上海', level: '三甲' },

  { name: '中山大学附属第一医院', city: '广州', level: '三甲' },
  { name: '南方医科大学南方医院', city: '广州', level: '三甲' },
  { name: '广东省人民医院', city: '广州', level: '三甲' },
  { name: '中山大学孙逸仙纪念医院', city: '广州', level: '三甲' },

  { name: '四川大学华西医院', city: '成都', level: '三甲' },
  { name: '四川省人民医院', city: '成都', level: '三甲' },

  { name: '华中科技大学同济医学院附属同济医院', city: '武汉', level: '三甲' },
  { name: '华中科技大学同济医学院附属协和医院', city: '武汉', level: '三甲' },

  { name: '中南大学湘雅医院', city: '长沙', level: '三甲' },
  { name: '中南大学湘雅二医院', city: '长沙', level: '三甲' },

  { name: '西京医院', city: '西安', level: '三甲' },
  { name: '西安交通大学第一附属医院', city: '西安', level: '三甲' },

  { name: '中国医科大学附属第一医院', city: '沈阳', level: '三甲' },
  { name: '中国医科大学附属盛京医院', city: '沈阳', level: '三甲' },

  { name: '南京鼓楼医院', city: '南京', level: '三甲' },
  { name: '江苏省人民医院', city: '南京', level: '三甲' },
];

// 订单状态
export const ORDER_STATUS = [
  { value: 'completed', label: '已完成', color: '#788c5d' },
  { value: 'pending', label: '待处理', color: '#d97757' },
  { value: 'cancelled', label: '已取消', color: '#c0392b' },
] as const;

// 时间范围配置
export const TIME_RANGES = [
  { value: 'today', label: '今日', days: 1 },
  { value: '7days', label: '近7天', days: 7 },
  { value: 'month', label: '月度', days: 30 },
  { value: 'quarter', label: '季度', days: 90 },
  { value: 'year', label: '年', days: 365 },
] as const;
