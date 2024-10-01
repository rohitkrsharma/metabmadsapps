import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Initialize i18n with language detection and translation resources
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true, // Enable debug mode for troubleshooting
    fallbackLng: 'en', // Fallback language when detection fails
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    resources: {
      en: {
        translation: {
          search_placeholder: "Start typing to search...",
          wallet: "Wallet",
          notification1: "Notification 1",
          notification2: "Notification 2",
          notification3: "Notification 3",
          profile1: "Profile",
          profile2: "Settings",
          logout: "Logout",
          dashboard: "Dashboard",
          crm: "CRM",
          customer: "Customer",
          bm: "BM/Ads Management",
          bm_approval: "BM/ADS Approval",
          bm_add: "Add BM/ADS",
          wallets_management: "Wallets Management",
          wallet_list: "List of Wallet / TopUp",
          wallet_history: "Top Up Status",
          shared_management: "Shared Management",
          shared_list: "List of Shared BM/Ads",
          master_setting: "Master Setting",
          network: "Network/Token Setting",
          deposit: "Deposit Address",
          setting: "Setting",
        },
      },
      fr: {
        translation: {
          search_placeholder: "Commencez à taper pour rechercher...",
          wallet: "Portefeuille",
          notification1: "Notification 1",
          notification2: "Notification 2",
          notification3: "Notification 3",
          profile1: "Profil",
          profile2: "Paramètres",
          logout: "Déconnexion",
          dashboard: "Tableau de bord",
          crm: "CRM",
          customer: "Client",
          bm: "Gestion des BM/Ads",
          bm_approval: "Approbation des BM/ADS",
          bm_add: "Ajouter BM/ADS",
          wallets_management: "Gestion des portefeuilles",
          wallet_list: "Liste des portefeuilles / Recharger",
          wallet_history: "Liste des portefeuilles BM/Ads",
          shared_management: "Gestion partagée",
          shared_list: "Liste des BM/Ads partagés",
          master_setting: "Paramètre maître",
          network: "Paramètre réseau/jeton",
          deposit: "Adresse de dépôt",
          setting: "Paramètres",
        },
      },
      zh: {
        translation: {
          search_placeholder: "开始输入搜索...",
          wallet: "钱包",
          notification1: "通知 1",
          notification2: "通知 2",
          notification3: "通知 3",
          profile1: "个人资料",
          profile2: "设置",
          logout: "登出",
          dashboard: "仪表盘",
          crm: "客户关系管理",
          customer: "客户",
          bm: "审批/广告管理",
          bm_approval: "审批/广告审批",
          bm_add: "添加 审批/广告",
          wallets_management: "钱包管理",
          wallet_list: "钱包/充值列表",
          wallet_history: "审批/广告钱包列表",
          shared_management: "共享管理",
          shared_list: "共享 审批/广告列表",
          master_setting: "主设置",
          network: "网络/令牌设置",
          deposit: "存款地址",
          setting: "设置",
        },
      },
    },
  });

export default i18n;
