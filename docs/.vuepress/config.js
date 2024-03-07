module.exports = {
  title: 'WINkLink',
  description: 'WINkLink Documentation',
  base: '/v1/doc/',
  locales: {
    '/hk/': {
      lang: 'zh-HK',
      label: '繁体中文',
      title: 'WINkLink 開發文档',
      description: 'WINkLink 開發和使用手冊'
    },
    '/cn/': {
      lang: 'zh-CN',
      label: '简体中文',
      title: 'WINkLink 开发文档',
      description: 'WINkLink 开发和使用手册'
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
      '/hk/': {
        label: '繁体中文',
        sidebar: {
          '/hk/': ['', 'pricing', 'vrf', 'anyapi', 'pipeline', 'glossary'],
        }
      },
      '/cn/': {
        label: '简体中文',
        sidebar: {
          '/cn/': ['', 'pricing', 'vrf', 'anyapi', 'pipeline', 'glossary'],
        }
      },
      '/': {
        label: 'English',

        sidebar: {
          '/': ['', 'pricing', 'vrf', 'anyapi', 'pipeline', 'glossary'],
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
