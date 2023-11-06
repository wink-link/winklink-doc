module.exports = {
  title: 'WINkLink',
  description: 'WINkLink Documentation',
  base: '/v1/doc/',
  locales: {
    '/': {
      lang: 'zh-CN',
      label: '简体中文',
      title: 'WINkLink 开发文档',
      description: 'WINkLink 开发和使用手册'
    },
    '/hk/': {
      lang: 'zh-HK',
      label: '繁體中文',
      title: 'WINkLink 開發文檔',
      description: 'WINkLink 開發和使用手冊'
    },
    '/en/': {
      lang: 'en-US',
      label: 'English',
      title: 'WINkLink Developer Documentation',
      description: 'WINkLink Developer Documentation'
    }
  },
  themeConfig: {
    locales: {
      '/': {
        label: '简体中文',
        // sidebar: {
        //   '/': ['', 'architecture', 'deploy', 'pricing', 'v2', 'proxy', 'glossary', 'vrf'],
        // }
        sidebar: {
          '/': ['', 'architecture', 'pricing', 'v2', 'ocr', 'glossary', 'vrf'],
        }
      },
      '/hk/' : {
      label: '繁體中文',
      sidebar: {
        '/hk': ['/hk/','/hk/architecture','/hk/pricing','/hk/v2','/hk/ocr','/hk/glossary','/hk/vrf'],
        }
      },
      '/en/': {
        label: 'English',
        // sidebar: {
        //   '/en': ['/en/', '/en/architecture', '/en/deploy', '/en/pricing', '/en/v2', '/en/proxy', '/en/glossary', '/en/vrf'],
        // }
        sidebar: {
          '/en': ['/en/', '/en/architecture', '/en/pricing', '/en/v2', '/en/ocr',  '/en/glossary', '/en/vrf'],
        }
      }
    },
    sidebar: 'auto',
    sidebarDepth: 4
  },
  markdown: {
    anchor: {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '#'
    }
  },
  head: [
    ['link', {
      rel: 'icon',
      href: '/favicon.ico'
    }]
  ],
  plugins: [
    'vuepress-plugin-mermaidjs'
  ]
}
