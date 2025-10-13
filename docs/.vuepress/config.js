module.exports = {
  title: 'WINkLink',
  description: 'WINkLink Documentation',
  base: '/v2/doc/',
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
          '/hk/': ['', 'node', 'pricing', 'vrf', 'anyapi', 'automation', 'pipeline', 'glossary'],
        }
      },
      '/cn/': {
        label: '简体中文',
        sidebar: {
          '/cn/': ['', 'node', 'pricing', 'vrf', 'anyapi', 'automation', 'pipeline', 'glossary'],
        }
      },
      '/': {
        label: 'English',
        sidebar: {
          '/': ['', 'node', 'pricing', 'vrf', 'anyapi', 'automation', 'pipeline', 'glossary'],
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
