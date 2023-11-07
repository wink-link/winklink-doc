module.exports = {
  title: 'WINkLink',
  description: 'WINkLink Documentation',
  base: '/v1/doc/',
  locales: {
    '/hk/': {
      lang: 'zh-HK',
      label: '繁體中文',
      title: 'WINkLink 開發文檔',
      description: 'WINkLink 開發和使用手冊'
    },
    '/': {
      lang: 'en-US',
      label: 'English',
      title: 'WINkLink Developer Documentation',
      description: 'WINkLink Developer Documentation'
    }
  },
  themeConfig: {
    locales: {
      '/hk/' : {
      selectText: '語言',
      label: '繁體中文',
      sidebar: {
        '/': ['/hk/','/hk/architecture','/hk/pricing','/hk/v2','/hk/ocr','/hk/glossary','/hk/vrf'],
        }
      },
      '/': {
        selectText: 'Languages',
        label: 'English',
        sidebar: {
          '/': ['', 'architecture', 'pricing', 'v2', 'ocr',  'glossary', 'vrf'],
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
